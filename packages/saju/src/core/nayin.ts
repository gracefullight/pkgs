import type { Element } from "@/types";
import { getPillarIndex } from "@/utils";

const NAYIN_TABLE: Record<number, { element: Element; korean: string; hanja: string }> = {
  0:  { element: "metal", korean: "해중금", hanja: "海中金" },
  1:  { element: "metal", korean: "해중금", hanja: "海中金" },
  2:  { element: "fire",  korean: "노중화", hanja: "爐中火" },
  3:  { element: "fire",  korean: "노중화", hanja: "爐中火" },
  4:  { element: "wood",  korean: "대림목", hanja: "大林木" },
  5:  { element: "wood",  korean: "대림목", hanja: "大林木" },
  6:  { element: "earth", korean: "노방토", hanja: "路傍土" },
  7:  { element: "earth", korean: "노방토", hanja: "路傍土" },
  8:  { element: "metal", korean: "검봉금", hanja: "劍鋒金" },
  9:  { element: "metal", korean: "검봉금", hanja: "劍鋒金" },
  10: { element: "fire",  korean: "산두화", hanja: "山頭火" },
  11: { element: "fire",  korean: "산두화", hanja: "山頭火" },
  12: { element: "water", korean: "간하수", hanja: "澗下水" },
  13: { element: "water", korean: "간하수", hanja: "澗下水" },
  14: { element: "earth", korean: "성두토", hanja: "城頭土" },
  15: { element: "earth", korean: "성두토", hanja: "城頭土" },
  16: { element: "metal", korean: "백랍금", hanja: "白蠟金" },
  17: { element: "metal", korean: "백랍금", hanja: "白蠟金" },
  18: { element: "wood",  korean: "양류목", hanja: "楊柳木" },
  19: { element: "wood",  korean: "양류목", hanja: "楊柳木" },
  20: { element: "water", korean: "천천수", hanja: "泉中水" },
  21: { element: "water", korean: "천천수", hanja: "泉中水" },
  22: { element: "earth", korean: "옥상토", hanja: "屋上土" },
  23: { element: "earth", korean: "옥상토", hanja: "屋上土" },
  24: { element: "fire",  korean: "벽력화", hanja: "霹靂火" },
  25: { element: "fire",  korean: "벽력화", hanja: "霹靂火" },
  26: { element: "wood",  korean: "송백목", hanja: "松柏木" },
  27: { element: "wood",  korean: "송백목", hanja: "松柏木" },
  28: { element: "water", korean: "장류수", hanja: "長流水" },
  29: { element: "water", korean: "장류수", hanja: "長流水" },
  30: { element: "metal", korean: "사중금", hanja: "砂中金" },
  31: { element: "metal", korean: "사중금", hanja: "砂中金" },
  32: { element: "fire",  korean: "산하화", hanja: "山下火" },
  33: { element: "fire",  korean: "산하화", hanja: "山下火" },
  34: { element: "wood",  korean: "평지목", hanja: "平地木" },
  35: { element: "wood",  korean: "평지목", hanja: "平地木" },
  36: { element: "earth", korean: "벽상토", hanja: "壁上土" },
  37: { element: "earth", korean: "벽상토", hanja: "壁上土" },
  38: { element: "metal", korean: "금박금", hanja: "金箔金" },
  39: { element: "metal", korean: "금박금", hanja: "金箔金" },
  40: { element: "fire",  korean: "복등화", hanja: "覆燈火" },
  41: { element: "fire",  korean: "복등화", hanja: "覆燈火" },
  42: { element: "water", korean: "천하수", hanja: "天河水" },
  43: { element: "water", korean: "천하수", hanja: "天河水" },
  44: { element: "earth", korean: "대역토", hanja: "大驛土" },
  45: { element: "earth", korean: "대역토", hanja: "大驛土" },
  46: { element: "metal", korean: "채광금", hanja: "釵釧金" },
  47: { element: "metal", korean: "채광금", hanja: "釵釧金" },
  48: { element: "wood",  korean: "상자목", hanja: "桑柘木" },
  49: { element: "wood",  korean: "상자목", hanja: "桑柘木" },
  50: { element: "water", korean: "대계수", hanja: "大溪水" },
  51: { element: "water", korean: "대계수", hanja: "大溪水" },
  52: { element: "earth", korean: "사중토", hanja: "砂中土" },
  53: { element: "earth", korean: "사중토", hanja: "砂中土" },
  54: { element: "fire",  korean: "천상화", hanja: "天上火" },
  55: { element: "fire",  korean: "천상화", hanja: "天上火" },
  56: { element: "wood",  korean: "석류목", hanja: "石榴木" },
  57: { element: "wood",  korean: "석류목", hanja: "石榴木" },
  58: { element: "water", korean: "대해수", hanja: "大海水" },
  59: { element: "water", korean: "대해수", hanja: "大海水" },
};

export interface NayinResult {
  element: Element;
  korean: string;
  hanja: string;
}

export function getNayin(pillarIdx60: number): NayinResult {
  const normalized = ((pillarIdx60 % 60) + 60) % 60;
  const pairIdx = Math.floor(normalized / 2) * 2;
  const entry = NAYIN_TABLE[pairIdx];
  if (!entry) throw new Error(`Invalid pillar index: ${pillarIdx60}`);
  return { element: entry.element, korean: entry.korean, hanja: entry.hanja };
}

export function getNayinFromPillar(pillar: string): NayinResult {
  const idx = getPillarIndex(pillar);
  return getNayin(idx);
}

export interface FourPillarsNayin {
  year: NayinResult;
  month: NayinResult;
  day: NayinResult;
  hour: NayinResult;
}

export function analyzeFourPillarsNayin(
  yearPillar: string,
  monthPillar: string,
  dayPillar: string,
  hourPillar: string,
): FourPillarsNayin {
  return {
    year: getNayin(getPillarIndex(yearPillar)),
    month: getNayin(getPillarIndex(monthPillar)),
    day: getNayin(getPillarIndex(dayPillar)),
    hour: getNayin(getPillarIndex(hourPillar)),
  };
}
