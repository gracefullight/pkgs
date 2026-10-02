import type { DateAdapter } from "@/adapters/date-adapter";

export interface ZonedDateFnsDate {
  /** Wall-clock components, interpreted in timeZone rather than the system timezone. */
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
  let formatInTimeZone: typeof import("date-fns-tz").formatInTimeZone;
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
    formatInTimeZone = dateFnsTz.formatInTimeZone;
    fromZonedTime = dateFnsTz.fromZonedTime;
    toZonedTime = dateFnsTz.toZonedTime;
  } catch {
    throw new Error(
      "date-fns or date-fns-tz is not installed. Install with: npm install date-fns date-fns-tz",
    );
  }

  const getInstant = (date: DateFnsDate): Date =>
    isZonedDate(date) ? fromZonedTime(date.date, date.timeZone) : date;
  const fromInstant = (date: Date, zone: string): ZonedDateFnsDate =>
    cloneWithTimeZone(toZonedTime(date, zone), zone);

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
    toUTC: (dateFns) => fromInstant(getInstant(dateFns), "UTC"),
    toISO: (dateFns) =>
      isZonedDate(dateFns)
        ? formatInTimeZone(getInstant(dateFns), dateFns.timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX")
        : formatISO(dateFns),
    toMillis: (dateFns) => getInstant(dateFns).getTime(),
    fromMillis: (millis, zone) => fromInstant(new Date(millis), zone),
    createUTC: (year, month, day, hour, minute, second) =>
      fromInstant(new Date(Date.UTC(year, month - 1, day, hour, minute, second)), "UTC"),
    setZone: (dateFns, zoneName) => fromInstant(getInstant(dateFns), zoneName),
    isGreaterThanOrEqual: (date1, date2) => getInstant(date1) >= getInstant(date2),
  };
}
