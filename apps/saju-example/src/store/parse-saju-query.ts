import type { SajuFormData } from "@/store/saju-form";

export function parseSajuQuery(searchParams: URLSearchParams): Partial<SajuFormData> {
  const result: Partial<SajuFormData> = {};
  const ranges = {
    year: [1920, new Date().getFullYear()],
    month: [1, 12],
    day: [1, 31],
    hour: [0, 23],
    minute: [0, 59],
  } as const;

  for (const key of Object.keys(ranges) as Array<keyof typeof ranges>) {
    const raw = searchParams.get(key);
    if (!raw || !/^\d+$/.test(raw)) continue;
    const value = Number(raw);
    const [minimum, maximum] = ranges[key];
    if (Number.isInteger(value) && value >= minimum && value <= maximum) {
      result[key] = value;
    }
  }

  const year = result.year ?? 1990;
  const month = result.month ?? 1;
  const day = result.day ?? 1;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    delete result.year;
    delete result.month;
    delete result.day;
  }

  const gender = searchParams.get("gender");
  if (gender === "male" || gender === "female") result.gender = gender;

  return result;
}
