import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { aggregateCsv, aggregateToRfCsv, FIELD_MAP, OUTPUT_COLUMNS } from "@/aggregate";

function makeSparseCsv(tmpDir: string, rows: Record<string, string>[]): string {
  const allKeys = new Set<string>();
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      allKeys.add(k);
    }
  }
  const keys = [...allKeys].sort();

  const lines = [keys.join(",")];
  for (const row of rows) {
    lines.push(keys.map((k) => row[k] ?? "").join(","));
  }

  const csvFile = join(tmpDir, "sparse.csv");
  writeFileSync(csvFile, `${lines.join("\n")}\n`);
  return csvFile;
}

describe("aggregateCsv", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "aggregate-test-"));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should group by timestamp", () => {
    const csvFile = makeSparseCsv(tmpDir, [
      { timestamp_raw: "100", "Radio.Lte.ServingCell[8].Rsrp": "-95.0" },
      { timestamp_raw: "100", "Radio.Lte.ServingCell[8].RsSinr": "14.0" },
      { timestamp_raw: "101", "Radio.Lte.ServingCell[8].Rsrp": "-100.0" },
      { timestamp_raw: "101", "Radio.Lte.ServingCell[8].Rsrq": "-9.0" },
    ]);
    const result = aggregateCsv(csvFile);

    expect(result).toHaveLength(2);
    expect(result[0]?.timestamp).toBe("100");
    expect(result[0]?.RSRP).toBe("-95.0");
    expect(result[0]?.SNR).toBe("14.0");
    expect(result[1]?.timestamp).toBe("101");
    expect(result[1]?.RSRP).toBe("-100.0");
    expect(result[1]?.RSRQ).toBe("-9.0");
  });

  it("should map columns correctly", () => {
    const csvFile = makeSparseCsv(tmpDir, [
      {
        timestamp_raw: "100",
        "Radio.Lte.ServingCell[8].Rsrp": "-95.0",
        "Radio.Lte.ServingCell[8].Rsrq": "-9.0",
        "Radio.Lte.ServingCell[8].Rssi": "-74.0",
        "Radio.Lte.ServingCell[8].RsSinr": "14.0",
        "Radio.Lte.ServingCell[8].Pci": "253",
        "Radio.Lte.ServingCell[8].Downlink.Earfcn": "3350",
        "Pocket.Radio.Common.Downlink.Throughput": "500.0",
        "Pocket.Radio.Common.Uplink.Throughput": "100.0",
        "Location.Latitude": "-34.035",
        "Location.Longitude": "151.085",
        "Location.Altitude": "73.7",
      },
    ]);
    const result = aggregateCsv(csvFile, undefined, { minFields: 1 });

    expect(result).toHaveLength(1);
    const r = result[0];
    expect(r.RSRP).toBe("-95.0");
    expect(r.RSRQ).toBe("-9.0");
    expect(r.RSSI).toBe("-74.0");
    expect(r.SNR).toBe("14.0");
    expect(r.PCI).toBe("253");
    expect(r.EARFCN).toBe("3350");
    expect(r.DL).toBe("500.0");
    expect(r.UL).toBe("100.0");
    expect(r.LAT).toBe("-34.035");
    expect(r.LON).toBe("151.085");
    expect(r.ALT).toBe("73.7");
  });

  it("should use fallback field priority (MRDC)", () => {
    const csvFile = makeSparseCsv(tmpDir, [
      {
        timestamp_raw: "100",
        "Radio.Common.Mrdc.Cell[64].Rsrp": "-103.0",
        "Radio.Common.Mrdc.Cell[64].Sinr": "12.0",
      },
    ]);
    const result = aggregateCsv(csvFile, undefined, { minFields: 1 });

    expect(result).toHaveLength(1);
    expect(result[0]?.RSRP).toBe("-103.0");
    expect(result[0]?.SNR).toBe("12.0");
  });

  it("should filter by min_fields", () => {
    const csvFile = makeSparseCsv(tmpDir, [
      { timestamp_raw: "100", "Radio.Lte.ServingCell[8].Rsrp": "-95.0" },
      { timestamp_raw: "101" },
    ]);

    const result2 = aggregateCsv(csvFile, undefined, { minFields: 2 });
    expect(result2).toHaveLength(0);

    const result1 = aggregateCsv(csvFile, undefined, { minFields: 1 });
    expect(result1).toHaveLength(1);
  });

  it("should write output CSV", () => {
    const csvFile = makeSparseCsv(tmpDir, [
      {
        timestamp_raw: "100",
        "Radio.Lte.ServingCell[8].Rsrp": "-95.0",
        "Radio.Lte.ServingCell[8].RsSinr": "14.0",
      },
    ]);
    const output = join(tmpDir, "output.csv");
    const result = aggregateCsv(csvFile, output);

    expect(result).toHaveLength(1);

    // Give the stream time to flush
    const content = readFileSync(output, "utf-8");
    const lines = content.trim().split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(OUTPUT_COLUMNS.join(","));
    expect(lines[1]).toContain("-95.0");
  });

  it("should handle empty input", () => {
    const csvFile = join(tmpDir, "empty.csv");
    writeFileSync(csvFile, "timestamp_raw,Radio.Lte.ServingCell[8].Rsrp\n");
    const result = aggregateCsv(csvFile);
    expect(result).toEqual([]);
  });
});

describe("aggregateToRfCsv", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "aggregate-rf-test-"));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("should write with extra fields", () => {
    const csvFile = join(tmpDir, "sparse.csv");
    writeFileSync(
      csvFile,
      "timestamp_raw,Radio.Lte.ServingCell[8].Rsrp,Radio.Wifi.Cell[64].Rssi\n100,-95.0,-87\n",
    );
    const output = join(tmpDir, "rf.csv");
    const result = aggregateToRfCsv(csvFile, output, {
      extraFields: { WIFI_RSSI: ["Radio.Wifi.Cell[64].Rssi"] },
    });

    expect(result).toBe(output);

    const content = readFileSync(output, "utf-8");
    const lines = content.trim().split("\n");
    expect(lines[0]).toContain("WIFI_RSSI");
    expect(lines[1]).toContain("-87");
    expect(lines[1]).toContain("-95.0");
  });
});

describe("FIELD_MAP consistency", () => {
  it("should have mapping for all output columns except timestamp", () => {
    for (const col of OUTPUT_COLUMNS) {
      if (col === "timestamp") continue;
      expect(FIELD_MAP).toHaveProperty(col);
    }
  });

  it("should have all mapped columns in output columns", () => {
    for (const col of Object.keys(FIELD_MAP)) {
      expect(OUTPUT_COLUMNS).toContain(col);
    }
  });
});
