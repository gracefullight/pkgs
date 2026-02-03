import { describe, expect, it } from "vitest";
import {
  decodeZigzag,
  iterLengthPrefixedMessages,
  parseAllFields,
  parseField,
  readVarint,
  tryReadVarint,
} from "../extract.js";

describe("readVarint", () => {
  it("should read single-byte varint", () => {
    const data = new Uint8Array([0x01]);
    const { value, newPos } = readVarint(data, 0);
    expect(value).toBe(1);
    expect(newPos).toBe(1);
  });

  it("should read zero varint", () => {
    const data = new Uint8Array([0x00]);
    const { value, newPos } = readVarint(data, 0);
    expect(value).toBe(0);
    expect(newPos).toBe(1);
  });

  it("should read multi-byte varint (300 = 0xAC 0x02)", () => {
    const data = new Uint8Array([0xac, 0x02]);
    const { value, newPos } = readVarint(data, 0);
    expect(value).toBe(300);
    expect(newPos).toBe(2);
  });

  it("should read large varint (150)", () => {
    const data = new Uint8Array([0x96, 0x01]);
    const { value, newPos } = readVarint(data, 0);
    expect(value).toBe(150);
    expect(newPos).toBe(2);
  });

  it("should read varint with offset", () => {
    const data = new Uint8Array([0xff, 0xff, 0x01]);
    const { value, newPos } = readVarint(data, 2);
    expect(value).toBe(1);
    expect(newPos).toBe(3);
  });
});

describe("decodeZigzag", () => {
  it("should decode zero", () => {
    expect(decodeZigzag(0)).toBe(0);
  });

  it("should decode 1 -> -1", () => {
    expect(decodeZigzag(1)).toBe(-1);
  });

  it("should decode 2 -> 1", () => {
    expect(decodeZigzag(2)).toBe(1);
  });

  it("should decode 3 -> -2", () => {
    expect(decodeZigzag(3)).toBe(-2);
  });

  it("should decode large positive (400 -> 200)", () => {
    expect(decodeZigzag(400)).toBe(200);
  });

  it("should decode large negative (199 -> -100)", () => {
    expect(decodeZigzag(199)).toBe(-100);
  });
});

describe("parseField", () => {
  it("should parse varint field (wire type 0)", () => {
    const data = new Uint8Array([0x08, 0x96, 0x01]);
    const result = parseField(data, 0);
    expect(result).not.toBeNull();
    expect(result!.fieldNum).toBe(1);
    expect(result!.wireType).toBe(0);
    expect(result!.value).toBe(150);
    expect(result!.endPos).toBe(3);
  });

  it("should parse length-delimited field (wire type 2)", () => {
    const data = new Uint8Array([0x12, 0x03, 0x61, 0x62, 0x63]);
    const result = parseField(data, 0);
    expect(result).not.toBeNull();
    expect(result!.fieldNum).toBe(2);
    expect(result!.wireType).toBe(2);
    expect(result!.value).toEqual(new Uint8Array([0x61, 0x62, 0x63]));
    expect(result!.endPos).toBe(5);
  });

  it("should parse 64-bit field (wire type 1)", () => {
    const data = new Uint8Array([0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f]);
    const result = parseField(data, 0);
    expect(result).not.toBeNull();
    expect(result!.fieldNum).toBe(1);
    expect(result!.wireType).toBe(1);
    expect((result!.value as Uint8Array).length).toBe(8);
    expect(result!.endPos).toBe(9);
  });

  it("should parse 32-bit field (wire type 5)", () => {
    const data = new Uint8Array([0x0d, 0x00, 0x00, 0x80, 0x3f]);
    const result = parseField(data, 0);
    expect(result).not.toBeNull();
    expect(result!.fieldNum).toBe(1);
    expect(result!.wireType).toBe(5);
    expect((result!.value as Uint8Array).length).toBe(4);
    expect(result!.endPos).toBe(5);
  });

  it("should return null for empty data", () => {
    const result = parseField(new Uint8Array([]), 0);
    expect(result).toBeNull();
  });

  it("should return null for truncated data", () => {
    const data = new Uint8Array([0x12, 0x0a, 0x61, 0x62, 0x63]);
    const result = parseField(data, 0);
    expect(result).toBeNull();
  });
});

describe("parseAllFields", () => {
  it("should parse multiple fields", () => {
    const data = new Uint8Array([0x08, 0x01, 0x10, 0x02]);
    const fields = parseAllFields(data);
    expect(fields.length).toBe(2);
    expect(fields[0]).toEqual([1, 0, 1]);
    expect(fields[1]).toEqual([2, 0, 2]);
  });

  it("should return empty array for empty data", () => {
    const fields = parseAllFields(new Uint8Array([]));
    expect(fields).toEqual([]);
  });
});

describe("tryReadVarint", () => {
  it("should read complete single-byte varint", () => {
    const buf = new Uint8Array([0x01]);
    const result = tryReadVarint(buf);
    expect(result).toEqual({ value: 1, newPos: 1 });
  });

  it("should read complete multi-byte varint (300)", () => {
    const buf = new Uint8Array([0xac, 0x02]);
    const result = tryReadVarint(buf);
    expect(result).toEqual({ value: 300, newPos: 2 });
  });

  it("should return null for incomplete varint", () => {
    const buf = new Uint8Array([0x80]);
    const result = tryReadVarint(buf);
    expect(result).toBeNull();
  });

  it("should return null for incomplete multi-byte varint", () => {
    const buf = new Uint8Array([0xac]);
    const result = tryReadVarint(buf);
    expect(result).toBeNull();
  });

  it("should return null for empty buffer", () => {
    const buf = new Uint8Array([]);
    const result = tryReadVarint(buf);
    expect(result).toBeNull();
  });

  it("should read from non-zero position", () => {
    const buf = new Uint8Array([0xff, 0xff, 0x01]);
    const result = tryReadVarint(buf, 2);
    expect(result).toEqual({ value: 1, newPos: 3 });
  });

  it("should throw for varint > 10 bytes", () => {
    const buf = new Uint8Array(11).fill(0x80);
    expect(() => tryReadVarint(buf)).toThrow("varint too long");
  });
});

describe("iterLengthPrefixedMessages", () => {
  it("should extract single length-prefixed message", () => {
    const chunks = [new Uint8Array([0x03, 0x61, 0x62, 0x63])];
    const messages = [...iterLengthPrefixedMessages(chunks)];
    expect(messages).toEqual([new Uint8Array([0x61, 0x62, 0x63])]);
  });

  it("should extract multiple messages", () => {
    const chunks = [new Uint8Array([0x02, 0x61, 0x62, 0x02, 0x63, 0x64])];
    const messages = [...iterLengthPrefixedMessages(chunks)];
    expect(messages).toEqual([new Uint8Array([0x61, 0x62]), new Uint8Array([0x63, 0x64])]);
  });

  it("should handle message split across chunks", () => {
    const chunk1 = new Uint8Array([0x04, 0x61, 0x62]);
    const chunk2 = new Uint8Array([0x63, 0x64]);
    const messages = [...iterLengthPrefixedMessages([chunk1, chunk2])];
    expect(messages).toEqual([new Uint8Array([0x61, 0x62, 0x63, 0x64])]);
  });

  it("should handle length split across chunks", () => {
    const chunk1 = new Uint8Array([0xac]);
    const data = new Uint8Array(300).fill(0x78);
    const chunk2 = new Uint8Array(1 + 300);
    chunk2[0] = 0x02;
    chunk2.set(data, 1);
    const messages = [...iterLengthPrefixedMessages([chunk1, chunk2])];
    expect(messages.length).toBe(1);
    expect(messages[0]?.length).toBe(300);
  });

  it("should stop at zero length", () => {
    const chunks = [new Uint8Array([0x02, 0x61, 0x62, 0x00, 0x02, 0x63, 0x64])];
    const messages = [...iterLengthPrefixedMessages(chunks)];
    expect(messages).toEqual([new Uint8Array([0x61, 0x62])]);
  });

  it("should return empty for empty chunks", () => {
    const messages = [...iterLengthPrefixedMessages([])];
    expect(messages).toEqual([]);
  });

  it("should throw for message too large", () => {
    const chunks = [new Uint8Array([0xe8, 0x07])];
    expect(() => [...iterLengthPrefixedMessages(chunks, 100)]).toThrow("message too large");
  });
});
