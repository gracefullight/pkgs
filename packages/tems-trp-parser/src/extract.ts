import { createWriteStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname } from "node:path";
import { inflateSync } from "node:zlib";
import AdmZip from "adm-zip";
import { SIGNED_KEYWORDS } from "@/constants";
import type { ExtractOptions, OutputFormat, ParsedField, RFRecord, WireType } from "@/types";

const MAX_MESSAGE_LENGTH = 64 * 1024 * 1024;

export function readVarint(data: Uint8Array, pos: number): { value: number; newPos: number } {
  let result = 0;
  let shift = 0;
  let currentPos = pos;

  while (currentPos < data.length) {
    const byte = data[currentPos];
    if (byte === undefined) break;
    result |= (byte & 0x7f) << shift;
    currentPos++;
    shift += 7;
    if (!(byte & 0x80)) {
      break;
    }
  }
  return { value: result, newPos: currentPos };
}

export function decodeZigzag(n: number): number {
  return (n >>> 1) ^ -(n & 1);
}

export function parseField(data: Uint8Array, pos: number): ParsedField | null {
  if (pos >= data.length) return null;

  try {
    const { value: tag, newPos: afterTag } = readVarint(data, pos);
    const fieldNum = tag >>> 3;
    const wireType = (tag & 0x07) as WireType;

    if (wireType === 0) {
      const { value, newPos } = readVarint(data, afterTag);
      return { fieldNum, wireType, value, endPos: newPos };
    }

    if (wireType === 1) {
      if (afterTag + 8 > data.length) return null;
      return {
        fieldNum,
        wireType,
        value: data.slice(afterTag, afterTag + 8),
        endPos: afterTag + 8,
      };
    }

    if (wireType === 2) {
      const { value: length, newPos: afterLen } = readVarint(data, afterTag);
      if (afterLen + length > data.length) return null;
      return {
        fieldNum,
        wireType,
        value: data.slice(afterLen, afterLen + length),
        endPos: afterLen + length,
      };
    }

    if (wireType === 5) {
      if (afterTag + 4 > data.length) return null;
      return {
        fieldNum,
        wireType,
        value: data.slice(afterTag, afterTag + 4),
        endPos: afterTag + 4,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function parseAllFields(data: Uint8Array): Array<[number, WireType, number | Uint8Array]> {
  let pos = 0;
  const fields: Array<[number, WireType, number | Uint8Array]> = [];

  while (pos < data.length) {
    const result = parseField(data, pos);
    if (result === null) break;
    fields.push([result.fieldNum, result.wireType, result.value]);
    pos = result.endPos;
  }

  return fields;
}

export function tryReadVarint(buf: Uint8Array, pos = 0): { value: number; newPos: number } | null {
  let result = 0;
  let shift = 0;
  let i = pos;

  while (i < buf.length) {
    const byte = buf[i];
    if (byte === undefined) return null;
    result |= (byte & 0x7f) << shift;
    i++;
    if (!(byte & 0x80)) {
      return { value: result, newPos: i };
    }
    shift += 7;
    if (shift > 70) {
      throw new Error("varint too long / corrupt stream");
    }
  }
  return null;
}

export function* iterLengthPrefixedMessages(
  chunks: Iterable<Uint8Array>,
  maxMsgLen = MAX_MESSAGE_LENGTH,
): Generator<Uint8Array> {
  const bufferChunks: Uint8Array[] = [];
  let totalLen = 0;

  for (const chunk of chunks) {
    bufferChunks.push(chunk);
    totalLen += chunk.length;

    const buf = concatUint8Arrays(bufferChunks, totalLen);
    let consumed = 0;

    while (true) {
      const parsed = parseLengthPrefixedMessage(buf, consumed, maxMsgLen);
      if (parsed.type === "stop") return;
      if (parsed.type === "incomplete") break;

      consumed = parsed.nextPos;
      yield parsed.message;
    }

    if (consumed > 0) {
      const remaining = buf.slice(consumed);
      bufferChunks.length = 0;
      if (remaining.length > 0) {
        bufferChunks.push(remaining);
      }
      totalLen = remaining.length;
    }
  }
}

type LengthPrefixedParseResult =
  | { type: "message"; message: Uint8Array; nextPos: number }
  | { type: "incomplete" }
  | { type: "stop" };

function parseLengthPrefixedMessage(
  data: Uint8Array,
  pos: number,
  maxMsgLen: number,
): LengthPrefixedParseResult {
  const header = tryReadVarint(data, pos);
  if (header === null) {
    return { type: "incomplete" };
  }

  if (header.value <= 0) {
    return { type: "stop" };
  }

  if (header.value > maxMsgLen) {
    throw new Error(`message too large: ${header.value}`);
  }

  const messageEnd = header.newPos + header.value;
  if (messageEnd > data.length) {
    return { type: "incomplete" };
  }

  return {
    type: "message",
    message: data.slice(header.newPos, messageEnd),
    nextPos: messageEnd,
  };
}

function concatUint8Arrays(arrays: Uint8Array[], totalLength: number): Uint8Array {
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function decompressCdfBuffer(buffer: Buffer): Uint8Array {
  const compressed = buffer.subarray(8);
  return new Uint8Array(inflateSync(compressed));
}

function decodeUtf8(data: Uint8Array): string | null {
  try {
    return new TextDecoder("utf-8").decode(data);
  } catch {
    return null;
  }
}

type FieldDefinitionMessage = {
  name: string | null;
  fieldId: number | null;
  lookupTable: string | null;
};

function extractLookupTableName(metaBytes: Uint8Array): string | null {
  for (const [fieldNum, , value] of parseAllFields(metaBytes)) {
    if (fieldNum === 6 && value instanceof Uint8Array) {
      return decodeUtf8(value);
    }
  }
  return null;
}

function parseFieldDefinitionMessage(
  fields: Array<[number, WireType, number | Uint8Array]>,
): FieldDefinitionMessage {
  const result: FieldDefinitionMessage = {
    name: null,
    fieldId: null,
    lookupTable: null,
  };

  for (const [fieldNum, wireType, value] of fields) {
    if (fieldNum === 1 && wireType === 2 && value instanceof Uint8Array) {
      result.name = decodeUtf8(value);
      continue;
    }

    if (fieldNum === 2 && wireType === 0 && typeof value === "number") {
      result.fieldId = value;
      continue;
    }

    if (fieldNum === 5 && wireType === 2 && value instanceof Uint8Array) {
      result.lookupTable = extractLookupTableName(value);
    }
  }

  return result;
}

function extractFieldDefinitionsFromBytes(data: Uint8Array): {
  fieldNames: Map<number, string>;
  fieldLookups: Map<number, string>;
} {
  const fieldNames = new Map<number, string>();
  const fieldLookups = new Map<number, string>();

  for (const msgData of iterLengthPrefixedMessages([data])) {
    const parsed = parseFieldDefinitionMessage(parseAllFields(msgData));
    if (parsed.name && parsed.fieldId !== null) {
      fieldNames.set(parsed.fieldId, parsed.name);
      if (parsed.lookupTable) {
        fieldLookups.set(parsed.fieldId, parsed.lookupTable);
      }
    }
  }

  return { fieldNames, fieldLookups };
}

function parseLookupTableEntryName(entryBytes: Uint8Array): string | null {
  for (const [fieldNum, , value] of parseAllFields(entryBytes)) {
    if (fieldNum === 1 && value instanceof Uint8Array) {
      return decodeUtf8(value);
    }
  }
  return null;
}

function parseLookupTableMessage(fields: Array<[number, WireType, number | Uint8Array]>): {
  tableName: string | null;
  entries: string[];
} {
  const entries: string[] = [];
  let tableName: string | null = null;

  for (const [fieldNum, wireType, value] of fields) {
    if (fieldNum === 1 && wireType === 2 && value instanceof Uint8Array) {
      tableName = decodeUtf8(value);
      continue;
    }

    if (fieldNum !== 2 || wireType !== 2 || !(value instanceof Uint8Array)) {
      continue;
    }

    const entryName = parseLookupTableEntryName(value);
    if (entryName) {
      entries.push(entryName);
    }
  }

  return { tableName, entries };
}

function extractLookuptablesFromBytes(data: Uint8Array): Map<string, Map<number, string>> {
  const tables = new Map<string, Map<number, string>>();

  for (const msgData of iterLengthPrefixedMessages([data])) {
    const { tableName, entries } = parseLookupTableMessage(parseAllFields(msgData));
    if (tableName && entries.length > 0) {
      const entryMap = new Map<number, string>();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry !== undefined) {
          entryMap.set(i, entry);
        }
      }
      tables.set(tableName, entryMap);
    }
  }

  return tables;
}

function extractValue(
  wireType: WireType,
  rawValue: number | Uint8Array,
  signed = false,
): number | string | null {
  switch (wireType) {
    case 0:
      return extractVarintValue(rawValue, signed);
    case 1:
      return extractFloat64Value(rawValue);
    case 2:
      return extractLengthDelimitedValue(rawValue);
    case 5:
      return extractFloat32Value(rawValue);
    default:
      return null;
  }
}

function extractVarintValue(rawValue: number | Uint8Array, signed: boolean): number | null {
  if (typeof rawValue !== "number") {
    return null;
  }

  return signed ? decodeZigzag(rawValue) : rawValue;
}

function extractFloat64Value(rawValue: number | Uint8Array): number | null {
  if (!(rawValue instanceof Uint8Array)) {
    return null;
  }

  try {
    const view = new DataView(rawValue.buffer, rawValue.byteOffset, 8);
    return view.getFloat64(0, true);
  } catch {
    return null;
  }
}

function extractFloat32Value(rawValue: number | Uint8Array): number | null {
  if (!(rawValue instanceof Uint8Array)) {
    return null;
  }

  try {
    const view = new DataView(rawValue.buffer, rawValue.byteOffset, 4);
    return view.getFloat32(0, true);
  } catch {
    return null;
  }
}

function extractLengthDelimitedValue(rawValue: number | Uint8Array): string | null {
  if (!(rawValue instanceof Uint8Array)) {
    return null;
  }

  try {
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(rawValue);
    return unwrapByteLiteral(decoded);
  } catch {
    return `0x${Buffer.from(rawValue).toString("hex")}`;
  }
}

function unwrapByteLiteral(decoded: string): string {
  if (decoded.startsWith("b'") && decoded.endsWith("'")) {
    return decoded.slice(2, -1);
  }

  if (decoded.startsWith('b"') && decoded.endsWith('"')) {
    return decoded.slice(2, -1);
  }

  return decoded;
}

function parseDataRecord(
  msgData: Uint8Array,
  fieldNames: Map<number, string>,
  fieldLookups: Map<number, string> | null,
  lookupTables: Map<string, Map<number, string>> | null,
): RFRecord {
  const record: RFRecord = {};
  const fields = parseAllFields(msgData);

  for (const [fnum, wtype, val] of fields) {
    if (fnum === 1 && wtype === 2 && val instanceof Uint8Array) {
      parseTimestampRecord(val, record);
      continue;
    }

    if (fnum === 3 && wtype === 2 && val instanceof Uint8Array) {
      parseRfFieldRecord(val, record, fieldNames, fieldLookups, lookupTables);
    }
  }

  return record;
}

function parseTimestampRecord(data: Uint8Array, record: RFRecord): void {
  for (const [fieldNum, wireType, value] of parseAllFields(data)) {
    if (wireType !== 0 || typeof value !== "number") {
      continue;
    }

    if (fieldNum === 1) {
      record.timestamp_raw = value;
      continue;
    }

    if (fieldNum === 2) {
      record.timestamp_us = value;
    }
  }
}

function resolveFieldInfo(
  fieldId: number,
  fieldNames: Map<number, string>,
): { fieldName: string | null; isSigned: boolean } {
  const fieldName = fieldNames.get(fieldId);
  if (!fieldName) {
    return { fieldName: null, isSigned: false };
  }

  return {
    fieldName,
    isSigned: SIGNED_KEYWORDS.some((kw) => fieldName.toLowerCase().includes(kw)),
  };
}

function applyLookupValue(
  value: number | string,
  fieldId: number,
  fieldLookups: Map<number, string> | null,
  lookupTables: Map<string, Map<number, string>> | null,
): number | string {
  if (typeof value !== "number" || !fieldLookups || !lookupTables) {
    return value;
  }

  const tableName = fieldLookups.get(fieldId);
  if (!tableName) {
    return value;
  }

  const table = lookupTables.get(tableName);
  if (!table?.has(value)) {
    return value;
  }

  return table.get(value) ?? value;
}

function parseRfFieldRecord(
  data: Uint8Array,
  record: RFRecord,
  fieldNames: Map<number, string>,
  fieldLookups: Map<number, string> | null,
  lookupTables: Map<string, Map<number, string>> | null,
): void {
  let fieldId: number | null = null;

  for (const [fieldNum, wireType, value] of parseAllFields(data)) {
    if (fieldNum === 1 && wireType === 0 && typeof value === "number") {
      fieldId = value;
      continue;
    }

    if (fieldId === null) {
      continue;
    }

    const { fieldName, isSigned } = resolveFieldInfo(fieldId, fieldNames);
    if (!fieldName) {
      continue;
    }

    const extracted = extractValue(wireType as WireType, value, isSigned);
    if (extracted === null) {
      continue;
    }

    record[fieldName] = applyLookupValue(extracted, fieldId, fieldLookups, lookupTables);
  }
}

function findCdfPaths(zip: AdmZip): {
  dataPath: string;
  declPath: string;
  lookupPath: string | null;
} {
  let dataPath: string | null = null;
  let declPath: string | null = null;
  let lookupPath: string | null = null;

  for (const entry of zip.getEntries()) {
    if (entry.entryName.endsWith("/cdf/data.cdf")) {
      dataPath = entry.entryName;
    } else if (entry.entryName.endsWith("/cdf/declarations.cdf")) {
      declPath = entry.entryName;
    } else if (entry.entryName.endsWith("/cdf/lookuptables.cdf")) {
      lookupPath = entry.entryName;
    }
  }

  if (!dataPath) throw new Error("Could not find data.cdf in TRP file");
  if (!declPath) throw new Error("Could not find declarations.cdf in TRP file");

  return { dataPath, declPath, lookupPath };
}

export function* iterRecordsFromZip(zip: AdmZip): Generator<RFRecord> {
  const { dataPath, declPath, lookupPath } = findCdfPaths(zip);

  const declBuffer = zip.readFile(declPath);
  if (!declBuffer) throw new Error("Failed to read declarations.cdf");
  const declData = decompressCdfBuffer(declBuffer);
  const { fieldNames, fieldLookups } = extractFieldDefinitionsFromBytes(declData);

  let lookupTables: Map<string, Map<number, string>> | null = null;
  if (lookupPath) {
    const lookupBuffer = zip.readFile(lookupPath);
    if (lookupBuffer) {
      const lookupData = decompressCdfBuffer(lookupBuffer);
      lookupTables = extractLookuptablesFromBytes(lookupData);
    }
  }

  const dataBuffer = zip.readFile(dataPath);
  if (!dataBuffer) throw new Error("Failed to read data.cdf");
  const dataData = decompressCdfBuffer(dataBuffer);

  let msgNum = 0;
  for (const msgData of iterLengthPrefixedMessages([dataData])) {
    msgNum++;
    const record = parseDataRecord(msgData, fieldNames, fieldLookups, lookupTables);

    const rfFields = Object.keys(record).filter(
      (k) => k !== "timestamp_raw" && k !== "timestamp_us",
    );
    if (rfFields.length > 0) {
      record._msg_num = msgNum;
      yield record;
    }
  }
}

function computeFieldnamesFromZip(zip: AdmZip): string[] {
  const { declPath } = findCdfPaths(zip);
  const declBuffer = zip.readFile(declPath);
  if (!declBuffer) throw new Error("Failed to read declarations.cdf");
  const declData = decompressCdfBuffer(declBuffer);
  const { fieldNames } = extractFieldDefinitionsFromBytes(declData);

  const base = ["_msg_num", "timestamp_raw", "timestamp_us"];
  const seen = new Set(base);
  const rest: string[] = [];

  for (const f of Array.from(fieldNames.values()).sort()) {
    if (!seen.has(f)) {
      seen.add(f);
      rest.push(f);
    }
  }

  return [...base, ...rest];
}

function escapeCSVField(field: string | number): string {
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function inferFormatFromOutputExtension(outputPath: string): OutputFormat | null {
  const ext = extname(outputPath).slice(1);
  if (!ext) return null;
  if (!["csv", "json", "jsonl", "ndjson"].includes(ext)) return null;
  return ext === "ndjson" ? "jsonl" : (ext as OutputFormat);
}

function buildOutputPathFromDirectory(
  trpPath: string,
  outputDir: string,
  format: OutputFormat,
): string {
  const basename = trpPath
    .split("/")
    .pop()
    ?.replace(/\.trp$/i, "");
  return `${outputDir}/${basename}.${format}`;
}

function resolveOutputTarget(
  trpPath: string,
  options: ExtractOptions,
): { outputPath: string; format: OutputFormat } {
  const { output, format } = options;

  if (output === undefined) {
    const resolvedFormat = format ?? "csv";
    return {
      outputPath: trpPath.replace(/\.trp$/i, `.${resolvedFormat}`),
      format: resolvedFormat,
    };
  }

  if (existsSync(output) && statSync(output).isDirectory()) {
    const resolvedFormat = format ?? "csv";
    return {
      outputPath: buildOutputPathFromDirectory(trpPath, output, resolvedFormat),
      format: resolvedFormat,
    };
  }

  const inferredFormat = inferFormatFromOutputExtension(output);
  if (inferredFormat && !format) {
    return { outputPath: output, format: inferredFormat };
  }

  const resolvedFormat = format ?? "csv";
  return {
    outputPath: trpPath.replace(/\.trp$/i, `.${resolvedFormat}`),
    format: resolvedFormat,
  };
}

function ensureParentDirectory(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function writeCsvFromZip(zip: AdmZip, outputPath: string): number {
  const fieldnames = computeFieldnamesFromZip(zip);
  const stream = createWriteStream(outputPath);
  stream.write(`${fieldnames.join(",")}\n`);

  let count = 0;
  for (const record of iterRecordsFromZip(zip)) {
    const row = fieldnames.map((f) => {
      const val = record[f];
      return val !== undefined ? escapeCSVField(val) : "";
    });
    stream.write(`${row.join(",")}\n`);
    count++;
  }
  stream.end();

  return count;
}

function writeJsonFromZip(zip: AdmZip, outputPath: string): number {
  const records: RFRecord[] = [];
  for (const record of iterRecordsFromZip(zip)) {
    records.push(record);
  }
  writeFileSync(outputPath, JSON.stringify(records, null, 2));
  return records.length;
}

function writeJsonlFromZip(zip: AdmZip, outputPath: string): number {
  const stream = createWriteStream(outputPath);
  let count = 0;

  for (const record of iterRecordsFromZip(zip)) {
    stream.write(`${JSON.stringify(record)}\n`);
    count++;
  }
  stream.end();

  return count;
}

function writeRecordsFromZip(zip: AdmZip, outputPath: string, format: OutputFormat): number {
  if (format === "csv") {
    return writeCsvFromZip(zip, outputPath);
  }
  if (format === "json") {
    return writeJsonFromZip(zip, outputPath);
  }
  return writeJsonlFromZip(zip, outputPath);
}

export function extract(trpPath: string, options: ExtractOptions = {}): string {
  const target = resolveOutputTarget(trpPath, options);
  const { outputPath, format } = target;

  ensureParentDirectory(outputPath);

  const zip = new AdmZip(trpPath);
  const count = writeRecordsFromZip(zip, outputPath, format);

  console.log(`Exported ${count} records to ${outputPath}`);
  return outputPath;
}
