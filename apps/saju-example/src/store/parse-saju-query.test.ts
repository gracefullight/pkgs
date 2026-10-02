import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseSajuQuery } from "@/store/parse-saju-query";

describe("Saju URL input", () => {
  it("restores valid dates, midnight, and gender", () => {
    assert.deepEqual(
      parseSajuQuery(new URLSearchParams("year=2024&month=2&day=29&hour=0&minute=0&gender=female")),
      { year: 2024, month: 2, day: 29, hour: 0, minute: 0, gender: "female" },
    );
  });

  it("ignores malformed, fractional, and out-of-range fields", () => {
    assert.deepEqual(
      parseSajuQuery(new URLSearchParams("year=nope&month=13&day=2x&hour=25&minute=1.5")),
      {},
    );
  });

  it("rejects dates that would silently roll over to another month", () => {
    assert.deepEqual(parseSajuQuery(new URLSearchParams("year=2023&month=2&day=29&hour=12")), {
      hour: 12,
    });
  });
});
