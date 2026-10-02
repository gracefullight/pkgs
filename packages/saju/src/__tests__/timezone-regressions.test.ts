import { DateTime } from "luxon";
import { beforeAll, describe, expect, it } from "vitest";
import type { DateAdapter } from "@/adapters/date-adapter";
import { createDateFnsAdapter, type DateFnsDate } from "@/adapters/date-fns";
import { createLuxonAdapter } from "@/adapters/luxon";
import { getFourPillars } from "@/core/four-pillars";
import { getSaju, TRADITIONAL_PRESET } from "@/index";

describe("timezone regressions", () => {
  let dateFns: DateAdapter<DateFnsDate>;
  let luxon: DateAdapter<DateTime>;

  beforeAll(async () => {
    [dateFns, luxon] = await Promise.all([createDateFnsAdapter(), createLuxonAdapter()]);
  }, 15_000);

  it("preserves the instant when converting a wall-clock date to UTC and another zone", () => {
    const seoul = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
    const expectedMillis = Date.UTC(2000, 0, 1, 9, 0);
    const utc = dateFns.toUTC(seoul);
    const newYork = dateFns.setZone(seoul, "America/New_York");

    expect(dateFns.getHour(utc)).toBe(9);
    expect(dateFns.getHour(newYork)).toBe(4);
    expect(dateFns.toMillis(seoul)).toBe(expectedMillis);
    expect(dateFns.toMillis(utc)).toBe(expectedMillis);
    expect(dateFns.toMillis(newYork)).toBe(expectedMillis);
    expect(dateFns.isGreaterThanOrEqual(seoul, utc)).toBe(true);
    expect(dateFns.isGreaterThanOrEqual(utc, seoul)).toBe(true);
    expect(dateFns.toISO(seoul)).toBe("2000-01-01T18:00:00+09:00");
  });

  it("uses UTC components and restores the requested timezone from an epoch", () => {
    const millis = Date.UTC(2000, 0, 1, 9, 30, 45);
    const utc = dateFns.createUTC(2000, 1, 1, 9, 30, 45);
    const seoul = dateFns.fromMillis(millis, "Asia/Seoul");

    expect(dateFns.getHour(utc)).toBe(9);
    expect(dateFns.toMillis(utc)).toBe(millis);
    expect(dateFns.getHour(seoul)).toBe(18);
    expect(dateFns.getMinute(seoul)).toBe(30);
    expect(dateFns.toMillis(seoul)).toBe(millis);
  });

  it("agrees with Luxon on pillars, solar terms and major luck for the same birth time", () => {
    const options = { gender: "male" as const, currentYear: 2024, longitudeDeg: 126.9778 };
    const dateFnsResult = getSaju(
      { date: new Date(1990, 1, 1, 12, 10), timeZone: "Asia/Seoul" },
      { ...options, adapter: dateFns },
    );
    const luxonResult = getSaju(DateTime.fromISO("1990-02-01T12:10", { zone: "Asia/Seoul" }), {
      ...options,
      adapter: luxon,
    });

    expect(dateFnsResult.pillars).toEqual(luxonResult.pillars);
    expect(dateFnsResult.solarTerms.currentDate).toEqual(luxonResult.solarTerms.currentDate);
    expect(dateFnsResult.solarTerms.nextDate).toEqual(luxonResult.solarTerms.nextDate);
    expect(dateFnsResult.majorLuck).toEqual(luxonResult.majorLuck);
  });

  it.each(["1987-12-15", "1988-01-15", "1988-05-01", "1988-10-09", "1988-10-10"])(
    "keeps Korean standard time outside the daylight saving season on %s",
    (date) => {
      const birth = DateTime.fromISO(`${date}T12:00`, { zone: "Asia/Seoul" });
      const result = getFourPillars(birth, { adapter: luxon, longitudeDeg: 135 });

      expect(DateTime.fromISO(result.meta.adjustedDtForHour).toMillis()).toBe(birth.toMillis());
    },
  );

  it.each(["1987-06-15", "1988-06-15", "1988-10-08"])(
    "accounts for Korean daylight saving on %s",
    (date) => {
      const birth = DateTime.fromISO(`${date}T12:00`, { zone: "Asia/Seoul" });
      const result = getFourPillars(birth, { adapter: luxon, longitudeDeg: 135 });

      expect(DateTime.fromISO(result.meta.adjustedDtForHour).toMillis()).toBe(
        birth.minus({ hours: 1 }).toMillis(),
      );
    },
  );

  it("does not apply Korean daylight saving to a different UTC+9 timezone", () => {
    const birth = DateTime.fromISO("1988-06-15T12:00", { zone: "Asia/Tokyo" });
    const result = getFourPillars(birth, { adapter: luxon, longitudeDeg: 135 });

    expect(DateTime.fromISO(result.meta.adjustedDtForHour).toMillis()).toBe(birth.toMillis());
  });

  it("accepts the traditional preset and custom switches through getSaju", () => {
    const birth = DateTime.fromISO("2000-01-01T23:30", { zone: "Asia/Seoul" });
    const traditional = getSaju(birth, {
      adapter: luxon,
      gender: "male",
      preset: TRADITIONAL_PRESET,
    });
    const custom = getSaju(birth, {
      adapter: luxon,
      gender: "male",
      preset: {
        dayBoundary: "midnight",
        useMeanSolarTimeForHour: false,
        useMeanSolarTimeForBoundary: false,
      },
    });

    expect(traditional.meta.effectiveDayDate.day).toBe(2);
    expect(custom.meta.effectiveDayDate.day).toBe(1);
  });
});
