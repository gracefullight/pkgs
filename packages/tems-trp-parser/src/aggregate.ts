/**
 * Aggregate sparse CDF messages into per-timestamp RF snapshots.
 *
 * The CDF binary extraction produces sparse rows where each message contains
 * only a few fields. This module groups messages by timestamp and merges them
 * into complete snapshots, then maps CDF field names to standard RF column names.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// =============================================================================
// CDF field -> standard RF column mapping
// =============================================================================

// Priority order: first match wins per output column
export const FIELD_MAP: Record<string, string[]> = {
  RSSI: ["LTE.ServingCell.Rssi", "Common.Rssi", "LTE.ServingCell.Rx.Rssi"],
  RSRP: ["LTE.ServingCell.Rsrp", "LTE.ServingCell.Rx.Rsrp", "MRDC.Cell.Rsrp"],
  RSRQ: ["LTE.ServingCell.Rsrq", "LTE.ServingCell.Rx.Rsrq", "MRDC.Cell.Rsrq"],
  SNR: ["LTE.ServingCell.RsSinr", "LTE.ServingCell.Rx.Cinr", "MRDC.Cell.Sinr"],
  PCI: ["LTE.ServingCell.Pci", "MRDC.Cell.Pci"],
  EARFCN: ["LTE.ServingCell.DL.Earfcn", "LTE.CellStats.Earfcn", "MRDC.Cell.Channel"],
  BAND: ["Radio.Lte.ServingCell[8].Band", "MRDC.Cell.Band", "LTE.ServingCell.Band"],
  CQI: [
    "Radio.Lte.ServingCell[8].CqiRank1Codeword0",
    "Radio.Lte.ServingCell[8].CqiCodeword0Average",
    "Radio.Lte.ServingCell[8].Stream[2].Cqi",
  ],
  UL: ["Common.UL.Throughput", "Common.UL.LowLevelThroughput"],
  DL: ["Common.DL.Throughput", "Common.DL.LowLevelThroughput"],
  PATHLOSS: ["Radio.Lte.ServingCell[8].Downlink.Pathloss"],
  RANK: ["Radio.Lte.ServingCell[8].RankIndication"],
  LAT: ["Location.Latitude"],
  LON: ["Location.Longitude"],
  ALT: ["Location.Altitude"],
};

// Output columns in order
export const OUTPUT_COLUMNS = [
  "timestamp",
  "RSSI",
  "RSRP",
  "RSRQ",
  "SNR",
  "CQI",
  "PCI",
  "EARFCN",
  "BAND",
  "UL",
  "DL",
  "PATHLOSS",
  "RANK",
  "LAT",
  "LON",
  "ALT",
] as const;

export type OutputColumn = (typeof OUTPUT_COLUMNS)[number];

export interface AggregateOptions {
  timestampCol?: string;
  minFields?: number;
}

export interface AggregateToRfCsvOptions {
  timestampCol?: string;
  extraFields?: Record<string, string[]>;
}

function resolveField(snapshot: Record<string, string>, candidates: string[]): string {
  for (const field of candidates) {
    const val = snapshot[field]?.trim();
    if (val) return val;
  }
  return "";
}

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function handleQuotedChar(
  line: string,
  i: number,
  current: string,
): { current: string; i: number } {
  const ch = line[i];
  if (ch === '"') {
    if (i + 1 < line.length && line[i + 1] === '"') {
      return { current: `${current}"`, i: i + 1 };
    }
    return { current, i: -(i + 1) }; // negative signals end of quotes
  }
  return { current: current + ch, i };
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    if (inQuotes) {
      const result = handleQuotedChar(line, i, current);
      current = result.current;
      if (result.i < 0) {
        inQuotes = false;
        i = -result.i - 1;
      } else {
        i = result.i;
      }
    } else if (line[i] === '"') {
      inQuotes = true;
    } else if (line[i] === ",") {
      fields.push(current);
      current = "";
    } else {
      current += line[i];
    }
  }
  fields.push(current);
  return fields;
}

function mergeRowIntoSnapshot(
  snapshot: Record<string, string>,
  headers: string[],
  values: string[],
): void {
  for (let j = 0; j < headers.length; j++) {
    const val = values[j]?.trim();
    const header = headers[j];
    if (val && header) {
      snapshot[header] = val;
    }
  }
}

function readSparseCsv(
  inputPath: string,
  timestampCol: string,
): Map<string, Record<string, string>> {
  const content = readFileSync(inputPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return new Map();

  const headerLine = lines[0];
  if (!headerLine) return new Map();
  const headers = parseCsvLine(headerLine);
  const tsIdx = headers.indexOf(timestampCol);
  if (tsIdx === -1) return new Map();

  const snapshots = new Map<string, Record<string, string>>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const values = parseCsvLine(line);

    const ts = values[tsIdx]?.trim();
    if (!ts) continue;

    let snapshot = snapshots.get(ts);
    if (!snapshot) {
      snapshot = {};
      snapshots.set(ts, snapshot);
    }

    mergeRowIntoSnapshot(snapshot, headers, values);
  }

  return snapshots;
}

function mapSnapshotsToRows(
  snapshots: Map<string, Record<string, string>>,
  fieldMap: Record<string, string[]>,
  minFields?: number,
): Record<string, string>[] {
  const result: Record<string, string>[] = [];
  const sortedTimestamps = [...snapshots.keys()].sort();

  for (const ts of sortedTimestamps) {
    const snapshot = snapshots.get(ts);
    if (!snapshot) continue;
    const mapped: Record<string, string> = { timestamp: ts };

    let filled = 0;
    for (const [outCol, candidates] of Object.entries(fieldMap)) {
      const val = resolveField(snapshot, candidates);
      mapped[outCol] = val;
      if (val) filled++;
    }

    if (minFields === undefined || filled >= minFields) {
      result.push(mapped);
    }
  }

  return result;
}

function writeCsvFile(
  outputPath: string,
  columns: readonly string[] | string[],
  rows: Record<string, string>[],
): void {
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const lines = [columns.join(",")];
  for (const row of rows) {
    lines.push([...columns].map((col) => escapeCSVField(row[col] ?? "")).join(","));
  }
  writeFileSync(outputPath, `${lines.join("\n")}\n`);
}

/**
 * Aggregate sparse CDF CSV into per-timestamp RF snapshots.
 */
export function aggregateCsv(
  inputPath: string,
  outputPath?: string,
  options: AggregateOptions = {},
): Record<string, string>[] {
  const { timestampCol = "timestamp_raw", minFields = 2 } = options;

  const snapshots = readSparseCsv(inputPath, timestampCol);
  const result = mapSnapshotsToRows(snapshots, FIELD_MAP, minFields);

  if (outputPath) {
    writeCsvFile(outputPath, OUTPUT_COLUMNS, result);
  }

  return result;
}

/**
 * Aggregate and write RF CSV with optional extra field mappings.
 */
export function aggregateToRfCsv(
  inputPath: string,
  outputPath: string,
  options: AggregateToRfCsvOptions = {},
): string {
  const { timestampCol = "timestamp_raw", extraFields } = options;

  const fieldMap = { ...FIELD_MAP };
  const columns = [...OUTPUT_COLUMNS] as string[];

  if (extraFields) {
    Object.assign(fieldMap, extraFields);
    for (const col of Object.keys(extraFields)) {
      if (!columns.includes(col)) {
        columns.push(col);
      }
    }
  }

  const snapshots = readSparseCsv(inputPath, timestampCol);
  const rows = mapSnapshotsToRows(snapshots, fieldMap);

  writeCsvFile(outputPath, columns, rows);

  console.log(
    `Aggregated ${snapshots.size} timestamps -> ${rows.length} RF snapshots -> ${outputPath}`,
  );
  return outputPath;
}
