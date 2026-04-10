import type { DateAdapter } from "@/adapters/date-adapter";

export interface ZonedDateFnsDate {
  date: Date;
  timeZone: string;
}

export type DateFnsDate = Date | ZonedDateFnsDate;

function isZonedDate(date: DateFnsDate): date is ZonedDateFnsDate {
  return (
    typeof date === "object" &&
    date !== null &&
    "date" in date &&
    date.date instanceof Date &&
    typeof date.timeZone === "string"
  );
}

function getNativeDate(date: DateFnsDate): Date {
  return isZonedDate(date) ? date.date : date;
}

function getSystemTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function getTimeZone(date: DateFnsDate): string {
  return isZonedDate(date) ? date.timeZone : getSystemTimeZone();
}

function cloneWithTimeZone(date: Date, timeZone: string): ZonedDateFnsDate {
  return { date, timeZone };
}

function preserveInputShape(input: DateFnsDate, date: Date): DateFnsDate {
  return isZonedDate(input) ? cloneWithTimeZone(date, input.timeZone) : date;
}

export async function createDateFnsAdapter(): Promise<DateAdapter<DateFnsDate>> {
  let addMinutes: typeof import("date-fns").addMinutes;
  let addDays: typeof import("date-fns").addDays;
  let subDays: typeof import("date-fns").subDays;
  let getYear: typeof import("date-fns").getYear;
  let getMonth: typeof import("date-fns").getMonth;
  let getDate: typeof import("date-fns").getDate;
  let getHours: typeof import("date-fns").getHours;
  let getMinutes: typeof import("date-fns").getMinutes;
  let getSeconds: typeof import("date-fns").getSeconds;
  let formatISO: typeof import("date-fns").formatISO;
  let fromZonedTime: typeof import("date-fns-tz").fromZonedTime;
  let toZonedTime: typeof import("date-fns-tz").toZonedTime;

  try {
    const dateFns = await import("date-fns");
    const dateFnsTz = await import("date-fns-tz");

    addMinutes = dateFns.addMinutes;
    addDays = dateFns.addDays;
    subDays = dateFns.subDays;
    getYear = dateFns.getYear;
    getMonth = dateFns.getMonth;
    getDate = dateFns.getDate;
    getHours = dateFns.getHours;
    getMinutes = dateFns.getMinutes;
    getSeconds = dateFns.getSeconds;
    formatISO = dateFns.formatISO;
    fromZonedTime = dateFnsTz.fromZonedTime;
    toZonedTime = dateFnsTz.toZonedTime;
  } catch {
    throw new Error(
      "date-fns or date-fns-tz is not installed. Install with: npm install date-fns date-fns-tz",
    );
  }

  return {
    getYear: (dateFns) => getYear(getNativeDate(dateFns)),
    getMonth: (dateFns) => getMonth(getNativeDate(dateFns)) + 1,
    getDay: (dateFns) => getDate(getNativeDate(dateFns)),
    getHour: (dateFns) => getHours(getNativeDate(dateFns)),
    getMinute: (dateFns) => getMinutes(getNativeDate(dateFns)),
    getSecond: (dateFns) => getSeconds(getNativeDate(dateFns)),
    getZoneName: (dateFns) => getTimeZone(dateFns),
    plusMinutes: (dateFns, minutes) =>
      preserveInputShape(dateFns, addMinutes(getNativeDate(dateFns), minutes)),
    plusDays: (dateFns, days) => preserveInputShape(dateFns, addDays(getNativeDate(dateFns), days)),
    minusDays: (dateFns, days) =>
      preserveInputShape(dateFns, subDays(getNativeDate(dateFns), days)),
    toUTC: (dateFns) =>
      cloneWithTimeZone(fromZonedTime(getNativeDate(dateFns), getTimeZone(dateFns)), "UTC"),
    toISO: (dateFns) => formatISO(getNativeDate(dateFns)),
    toMillis: (dateFns) => getNativeDate(dateFns).getTime(),
    fromMillis: (millis, zone) => cloneWithTimeZone(new Date(millis), zone),
    createUTC: (year, month, day, hour, minute, second) =>
      cloneWithTimeZone(new Date(Date.UTC(year, month - 1, day, hour, minute, second)), "UTC"),
    setZone: (dateFns, zoneName) =>
      cloneWithTimeZone(toZonedTime(getNativeDate(dateFns), zoneName), zoneName),
    isGreaterThanOrEqual: (date1, date2) => getNativeDate(date1) >= getNativeDate(date2),
  };
}
