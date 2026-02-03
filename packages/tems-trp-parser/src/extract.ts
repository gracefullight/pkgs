import { createWriteStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname } from "node:path";
import { inflateSync } from "node:zlib";
import AdmZip from "adm-zip";
import { RF_FIELD_IDS, SIGNED_FIELD_IDS, SIGNED_KEYWORDS } from "@/constants";
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
      const hdr = tryReadVarint(buf, consumed);
      if (hdr === null) break;

      const msgLen = hdr.value;
      const afterLen = hdr.newPos;

      if (msgLen <= 0) return;
      if (msgLen > maxMsgLen) {
        throw new Error(`message too large: ${msgLen}`);
      }

      if (buf.length < afterLen - consumed + msgLen + consumed) break;

      const msgBytes = buf.slice(afterLen, afterLen + msgLen);
      consumed = afterLen + msgLen;
      yield msgBytes;
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

function extractFieldDefinitionsFromBytes(data: Uint8Array): {
  fieldNames: Map<number, string>;
  fieldLookups: Map<number, string>;
} {
  const fieldNames = new Map<number, string>();
  const fieldLookups = new Map<number, string>();

  let pos = 0;
  while (pos < data.length) {
    const { value: msgLen, newPos: afterLen } = readVarint(data, pos);
    pos = afterLen;

    if (msgLen === 0 || pos + msgLen > data.length) break;

    const msgData = data.slice(pos, pos + msgLen);
    pos += msgLen;
    const fields = parseAllFields(msgData);

    let name: string | null = null;
    let fieldId: number | null = null;
    let lookupTable: string | null = null;

    for (const [fnum, wtype, val] of fields) {
      if (fnum === 1 && wtype === 2 && val instanceof Uint8Array) {
        name = decodeUtf8(val);
      } else if (fnum === 2 && wtype === 0 && typeof val === "number") {
        fieldId = val;
      } else if (fnum === 5 && wtype === 2 && val instanceof Uint8Array) {
        const metaFields = parseAllFields(val);
        for (const [mfnum, , mval] of metaFields) {
          if (mfnum === 6 && mval instanceof Uint8Array) {
            lookupTable = decodeUtf8(mval);
          }
        }
      }
    }

    if (name && fieldId !== null) {
      fieldNames.set(fieldId, name);
      if (lookupTable) {
        fieldLookups.set(fieldId, lookupTable);
      }
    }
  }

  return { fieldNames, fieldLookups };
}

function extractLookuptablesFromBytes(data: Uint8Array): Map<string, Map<number, string>> {
  const tables = new Map<string, Map<number, string>>();

  let pos = 0;
  while (pos < data.length) {
    const { value: msgLen, newPos: afterLen } = readVarint(data, pos);
    pos = afterLen;

    if (msgLen === 0 || pos + msgLen > data.length) break;

    const msgData = data.slice(pos, pos + msgLen);
    pos += msgLen;
    const fields = parseAllFields(msgData);

    let tableName: string | null = null;
    const entries: string[] = [];

    for (const [fnum, wtype, val] of fields) {
      if (fnum === 1 && wtype === 2 && val instanceof Uint8Array) {
        tableName = decodeUtf8(val);
      } else if (fnum === 2 && wtype === 2 && val instanceof Uint8Array) {
        const entryFields = parseAllFields(val);
        for (const [efnum, , eval_] of entryFields) {
          if (efnum === 1 && eval_ instanceof Uint8Array) {
            const decoded = decodeUtf8(eval_);
            if (decoded) entries.push(decoded);
          }
        }
      }
    }

    if (tableName && entries.length > 0) {
      const entryMap = new Map<number, string>();
      for (let i = 0; i < entries.length; i++) {
        entryMap.set(i, entries[i]!);
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
  if (wireType === 0) {
    if (typeof rawValue === "number") {
      return signed ? decodeZigzag(rawValue) : rawValue;
    }
    return null;
  }

  if (wireType === 1) {
    if (rawValue instanceof Uint8Array) {
      try {
        const view = new DataView(rawValue.buffer, rawValue.byteOffset, 8);
        return view.getFloat64(0, true);
      } catch {
        return null;
      }
    }
    return null;
  }

  if (wireType === 5) {
    if (rawValue instanceof Uint8Array) {
      try {
        const view = new DataView(rawValue.buffer, rawValue.byteOffset, 4);
        return view.getFloat32(0, true);
      } catch {
        return null;
      }
    }
    return null;
  }

  if (wireType === 2) {
    if (rawValue instanceof Uint8Array) {
      try {
        const decoded = new TextDecoder("utf-8", { fatal: true }).decode(rawValue);
        if (decoded.startsWith("b'") && decoded.endsWith("'")) {
          return decoded.slice(2, -1);
        }
        if (decoded.startsWith('b"') && decoded.endsWith('"')) {
          return decoded.slice(2, -1);
        }
        return decoded;
      } catch {
        return `0x${Buffer.from(rawValue).toString("hex")}`;
      }
    }
    return null;
  }

  return null;
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
      const nested = parseAllFields(val);
      for (const [nfnum, nwtype, nval] of nested) {
        if (nfnum === 1 && nwtype === 0 && typeof nval === "number") {
          record.timestamp_raw = nval;
        } else if (nfnum === 2 && nwtype === 0 && typeof nval === "number") {
          record.timestamp_us = nval;
        }
      }
    } else if (fnum === 3 && wtype === 2 && val instanceof Uint8Array) {
      const nested = parseAllFields(val);
      let fieldId: number | null = null;

      for (const [nfnum, nwtype, nval] of nested) {
        if (nfnum === 1 && nwtype === 0 && typeof nval === "number") {
          fieldId = nval;
        } else if (fieldId !== null) {
          let fieldName: string | null = null;
          let isSigned = false;

          const rfFieldName = RF_FIELD_IDS[fieldId];
          if (rfFieldName !== undefined) {
            fieldName = rfFieldName;
            isSigned = SIGNED_FIELD_IDS.has(fieldId);
          } else if (fieldNames.has(fieldId)) {
            fieldName = fieldNames.get(fieldId) ?? null;
            isSigned = SIGNED_KEYWORDS.some((kw) => fieldName?.toLowerCase().includes(kw) ?? false);
          }

          if (fieldName) {
            let value = extractValue(nwtype as WireType, nval, isSigned);
            if (value !== null) {
              if (
                typeof value === "number" &&
                fieldLookups &&
                lookupTables &&
                fieldLookups.has(fieldId)
              ) {
                const tblName = fieldLookups.get(fieldId);
                if (tblName) {
                  const table = lookupTables.get(tblName);
                  if (table?.has(value)) {
                    value = table.get(value) ?? value;
                  }
                }
              }
              record[fieldName] = value;
            }
          }
        }
      }
    }
  }

  return record;
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
  const known = Object.values(RF_FIELD_IDS);

  const generic = Array.from(fieldNames.values()).sort();
  const rest: string[] = [];
  const seen = new Set(base);

  for (const f of [...known, ...generic]) {
    if (!seen.has(f)) {
      seen.add(f);
      rest.push(f);
    }
  }

  return [...base, ...rest.sort()];
}

function escapeCSVField(field: string | number): string {
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function extract(trpPath: string, options: ExtractOptions = {}): string {
  const { output, format } = options;

  let outputPath: string;
  let fmt: OutputFormat;

  if (output === undefined) {
    fmt = format ?? "csv";
    outputPath = trpPath.replace(/\.trp$/i, `.${fmt}`);
  } else if (existsSync(output) && statSync(output).isDirectory()) {
    fmt = format ?? "csv";
    const basename = trpPath
      .split("/")
      .pop()
      ?.replace(/\.trp$/i, "");
    outputPath = `${output}/${basename}.${fmt}`;
  } else {
    const ext = extname(output).slice(1);
    if (["csv", "json", "jsonl", "ndjson"].includes(ext) && !format) {
      fmt = (ext === "ndjson" ? "jsonl" : ext) as OutputFormat;
      outputPath = output;
    } else {
      fmt = format ?? "csv";
      outputPath = trpPath.replace(/\.trp$/i, `.${fmt}`);
    }
  }

  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const zip = new AdmZip(trpPath);
  let count = 0;

  if (fmt === "csv") {
    const fieldnames = computeFieldnamesFromZip(zip);
    const stream = createWriteStream(outputPath);
    stream.write(`${fieldnames.join(",")}\n`);

    for (const record of iterRecordsFromZip(zip)) {
      const row = fieldnames.map((f) => {
        const val = record[f];
        return val !== undefined ? escapeCSVField(val) : "";
      });
      stream.write(`${row.join(",")}\n`);
      count++;
    }
    stream.end();
  } else if (fmt === "json") {
    const records: RFRecord[] = [];
    for (const record of iterRecordsFromZip(zip)) {
      records.push(record);
      count++;
    }
    writeFileSync(outputPath, JSON.stringify(records, null, 2));
  } else if (fmt === "jsonl") {
    const stream = createWriteStream(outputPath);
    for (const record of iterRecordsFromZip(zip)) {
      stream.write(`${JSON.stringify(record)}\n`);
      count++;
    }
    stream.end();
  }

  console.log(`Exported ${count} records to ${outputPath}`);
  return outputPath;
}
