import { existsSync, mkdtempSync, readFileSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deflateSync } from "node:zlib";
import AdmZip from "adm-zip";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { extract } from "@/extract";

function varint(input: number): Buffer {
  let value = BigInt(input);
  const bytes: number[] = [];
  while (value >= 128n) {
    bytes.push(Number(value & 127n) | 128);
    value >>= 7n;
  }
  bytes.push(Number(value));
  return Buffer.from(bytes);
}

function bytesField(tag: number, value: Buffer): Buffer {
  return Buffer.concat([Buffer.from([tag]), varint(value.length), value]);
}

function cdf(message: Buffer): Buffer {
  return Buffer.concat([
    Buffer.alloc(8),
    deflateSync(Buffer.concat([varint(message.length), message])),
  ]);
}

describe("synchronous TRP exports", () => {
  let root: string;
  let input: string;
  const timestamp = 1_700_000_000_000;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "trp-export-"));
    input = join(root, "recording.trp");
    const zip = new AdmZip();
    const declaration = Buffer.concat([
      bytesField(0x0a, Buffer.from("Radio.Test")),
      Buffer.from([0x10, 0x01]),
    ]);
    const message = Buffer.concat([
      bytesField(0x0a, Buffer.concat([Buffer.from([0x08]), varint(timestamp)])),
      bytesField(0x1a, Buffer.from([0x08, 0x01, 0x10, 0x2a])),
    ]);
    zip.addFile("trp/cdf/declarations.cdf", cdf(declaration));
    zip.addFile("trp/cdf/data.cdf", cdf(message));
    zip.writeZip(input);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(async () => {
    // Allow asynchronous writers in a regression run against the old implementation to settle.
    await new Promise((resolve) => setTimeout(resolve, 20));
    vi.restoreAllMocks();
    rmSync(root, { recursive: true, force: true });
  });

  it.each(["csv", "jsonl"] as const)("finishes writing %s before returning", (format) => {
    const output = join(root, `output.${format}`);
    expect(extract(input, { output })).toBe(output);
    expect(existsSync(output)).toBe(true);
    const content = readFileSync(output, "utf-8");
    expect(content).toContain(String(timestamp));
    expect(content).toContain("42");
  });

  it("honors the supplied output filename with an explicit format", () => {
    const output = join(root, "custom-output.data");
    expect(extract(input, { output, format: "json" })).toBe(output);
    expect(JSON.parse(readFileSync(output, "utf-8"))).toEqual([
      { timestamp_raw: timestamp, "Radio.Test": 42, _msg_num: 1 },
    ]);
  });

  it("preserves archives that do not have a .trp extension", () => {
    const archive = join(root, "recording.zip");
    renameSync(input, archive);
    const original = readFileSync(archive);

    expect(extract(archive, { format: "json" })).toBe(`${archive}.json`);
    expect(readFileSync(archive)).toEqual(original);
  });

  it("rejects an output path that would overwrite the input archive", () => {
    const original = readFileSync(input);

    expect(() => extract(input, { output: input, format: "json" })).toThrow(
      "Output path must differ",
    );
    expect(readFileSync(input)).toEqual(original);
  });
});
