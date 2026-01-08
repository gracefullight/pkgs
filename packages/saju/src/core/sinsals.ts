import type { Label, PillarPosition } from "@/types";

export const SINSALS = [
  "peachBlossom",
  "skyHorse",
  "floweryCanopy",
  "ghostGate",
  "solitaryStar",
  "widowStar",
  "heavenlyVirtue",
  "monthlyVirtue",
  "skyNoble",
  "moonNoble",
  "literaryNoble",
  "academicHall",
  "bloodKnife",
  "sixHarms",
  "whiteCloth",
  "heavenlyDoctor",
  "suspendedNeedle",
  "kuiGang",
  "sheepBlade",
  "redFlame",
  "taijiNoble",
  "goldenCarriage",
  "officialStar",
  "hiddenWealth",
  "officialAcademicHall",
  "whiteTiger",
  "heavenlyGate",
  "heavenlyKitchen",
  "literaryCurve",
  "imperialPardon",
  "lostSpirit",
  "robbery",
  "disaster",
  "generalStar",
  "saddleMount",
  "redPhoenix",
  "heavenlyJoy",
  "gongmang",
  "wonjin",
] as const;

export type SinsalKey = (typeof SINSALS)[number];

export type SinsalType = "auspicious" | "inauspicious" | "neutral";

export interface SinsalLabel extends Label<SinsalKey> {
  meaning: string;
  type: SinsalType;
}

const PEACH_BLOSSOM_MAP: Record<string, string> = {
  寅: "卯",
  午: "卯",
  戌: "卯",
  申: "酉",
  子: "酉",
  辰: "酉",
  巳: "午",
  酉: "午",
  丑: "午",
  亥: "子",
  卯: "子",
  未: "子",
};

const SKY_HORSE_MAP: Record<string, string> = {
  寅: "申",
  午: "申",
  戌: "申",
  申: "寅",
  子: "寅",
  辰: "寅",
  巳: "亥",
  酉: "亥",
  丑: "亥",
  亥: "巳",
  卯: "巳",
  未: "巳",
};

const FLOWERY_CANOPY_MAP: Record<string, string> = {
  寅: "戌",
  午: "戌",
  戌: "戌",
  申: "辰",
  子: "辰",
  辰: "辰",
  巳: "丑",
  酉: "丑",
  丑: "丑",
  亥: "未",
  卯: "未",
  未: "未",
};

const GHOST_GATE_MAP: Record<string, string> = {
  子: "卯",
  丑: "寅",
  寅: "丑",
  卯: "子",
  辰: "亥",
  巳: "戌",
  午: "酉",
  未: "申",
  申: "未",
  酉: "午",
  戌: "巳",
  亥: "辰",
};

const WONJIN_MAP: Record<string, string> = {
  子: "未",
  丑: "午",
  寅: "酉",
  卯: "申",
  辰: "亥",
  巳: "戌",
  午: "丑",
  未: "子",
  申: "卯",
  酉: "寅",
  戌: "巳",
  亥: "辰",
};

const SOLITARY_STAR_MAP: Record<string, string> = {
  子: "寅",
  丑: "寅",
  寅: "巳",
  卯: "巳",
  辰: "巳",
  巳: "申",
  午: "申",
  未: "申",
  申: "亥",
  酉: "亥",
  戌: "亥",
  亥: "寅",
};

const WIDOW_STAR_MAP: Record<string, string> = {
  子: "戌",
  丑: "戌",
  寅: "丑",
  卯: "丑",
  辰: "丑",
  巳: "辰",
  午: "辰",
  未: "辰",
  申: "未",
  酉: "未",
  戌: "未",
  亥: "戌",
};

const HEAVENLY_VIRTUE_MAP: Record<string, string> = {
  寅: "丁",
  卯: "申",
  辰: "壬",
  巳: "辛",
  午: "亥",
  未: "甲",
  申: "癸",
  酉: "寅",
  戌: "丙",
  亥: "乙",
  子: "巳",
  丑: "庚",
};

const MONTHLY_VIRTUE_MAP: Record<string, string> = {
  寅: "丙",
  卯: "甲",
  辰: "壬",
  巳: "庚",
  午: "丙",
  未: "甲",
  申: "壬",
  酉: "庚",
  戌: "丙",
  亥: "甲",
  子: "壬",
  丑: "庚",
};

const SKY_NOBLE_MAP: Record<string, string[]> = {
  甲: ["丑", "未"],
  戊: ["丑", "未"],
  庚: ["丑", "未"],
  乙: ["子", "申"],
  己: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  壬: ["卯", "巳"],
  癸: ["卯", "巳"],
  辛: ["午", "寅"],
};

const LITERARY_NOBLE_MAP: Record<string, string> = {
  甲: "巳",
  乙: "午",
  丙: "申",
  丁: "酉",
  戊: "申",
  己: "酉",
  庚: "亥",
  辛: "子",
  壬: "寅",
  癸: "卯",
};

const ACADEMIC_HALL_MAP: Record<string, string> = {
  甲: "亥",
  乙: "午",
  丙: "寅",
  丁: "酉",
  戊: "寅",
  己: "酉",
  庚: "巳",
  辛: "子",
  壬: "申",
  癸: "卯",
};

const BLOOD_KNIFE_MAP: Record<string, string> = {
  子: "酉",
  丑: "戌",
  寅: "亥",
  卯: "子",
  辰: "丑",
  巳: "寅",
  午: "卯",
  未: "辰",
  申: "巳",
  酉: "午",
  戌: "未",
  亥: "申",
};

const HEAVENLY_DOCTOR_MAP: Record<string, string> = {
  子: "亥",
  丑: "子",
  寅: "丑",
  卯: "寅",
  辰: "卯",
  巳: "辰",
  午: "巳",
  未: "午",
  申: "未",
  酉: "申",
  戌: "酉",
  亥: "戌",
};

const SUSPENDED_NEEDLE_STEMS = new Set(["甲", "申", "戊", "辛", "壬"]);

const KUI_GANG_PILLARS = new Set(["戊戌", "庚辰", "庚戌", "壬辰"]);

const SHEEP_BLADE_MAP: Record<string, string> = {
  甲: "卯",
  乙: "辰",
  丙: "午",
  丁: "未",
  戊: "午",
  己: "未",
  庚: "酉",
  辛: "戌",
  壬: "子",
  癸: "丑",
};

const RED_FLAME_MAP: Record<string, string> = {
  甲: "午",
  乙: "午",
  丙: "寅",
  丁: "未",
  戊: "辰",
  己: "辰",
  庚: "戌",
  辛: "酉",
  壬: "子",
  癸: "申",
};

const TAIJI_NOBLE_MAP: Record<string, string[]> = {
  甲: ["子", "午"],
  乙: ["子", "午"],
  丙: ["卯", "酉"],
  丁: ["卯", "酉"],
  戊: ["辰", "戌", "丑", "未"],
  己: ["辰", "戌", "丑", "未"],
  庚: ["寅", "亥"],
  辛: ["寅", "亥"],
  壬: ["巳", "申"],
  癸: ["巳", "申"],
};

const GOLDEN_CARRIAGE_MAP: Record<string, string> = {
  甲: "辰",
  乙: "巳",
  丙: "未",
  丁: "申",
  戊: "未",
  己: "申",
  庚: "戌",
  辛: "亥",
  壬: "丑",
  癸: "寅",
};

const OFFICIAL_STAR_MAP: Record<string, string> = {
  甲: "寅",
  乙: "卯",
  丙: "巳",
  丁: "午",
  戊: "巳",
  己: "午",
  庚: "申",
  辛: "酉",
  壬: "亥",
  癸: "子",
};

// 암록 (일간 기준 → 지지에서 체크)
const HIDDEN_WEALTH_MAP: Record<string, string> = {
  甲: "亥",
  乙: "戌",
  丙: "申",
  丁: "未",
  戊: "巳",
  己: "辰",
  庚: "卯",
  辛: "寅",
  壬: "丑",
  癸: "子",
};

// 관귀학관 (일간 기준 → 지지에서 체크)
const OFFICIAL_ACADEMIC_HALL_MAP: Record<string, string> = {
  甲: "巳",
  乙: "巳",
  丙: "申",
  丁: "申",
  戊: "亥",
  己: "亥",
  庚: "寅",
  辛: "寅",
  壬: "寅",
  癸: "寅",
};

// 백호대살 (특정 주가 있으면 성립)
const WHITE_TIGER_PILLARS = new Set(["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"]);

// 현침살 지지 (천간은 기존 SUSPENDED_NEEDLE_STEMS 사용)
const SUSPENDED_NEEDLE_BRANCHES = new Set(["申", "卯", "午"]);

// 천문성 (월지 기준 → 천간/지지에서 체크)
const HEAVENLY_GATE_MAP: Record<string, string> = {
  寅: "戌",
  卯: "亥",
  辰: "子",
  巳: "丑",
  午: "寅",
  未: "卯",
  申: "辰",
  酉: "巳",
  戌: "午",
  亥: "未",
  子: "申",
  丑: "酉",
};

// 천주귀인 (일간 기준 → 지지에서 체크, 甲乙은 해당 없음)
const HEAVENLY_KITCHEN_MAP: Record<string, string> = {
  丙: "巳",
  丁: "午",
  戊: "申",
  己: "酉",
  庚: "亥",
  辛: "子",
  壬: "寅",
  癸: "卯",
};

// 문곡귀인 (일간 기준 → 지지에서 체크)
const LITERARY_CURVE_MAP: Record<string, string> = {
  甲: "亥",
  乙: "子",
  丙: "寅",
  丁: "卯",
  戊: "寅",
  己: "卯",
  庚: "巳",
  辛: "午",
  壬: "申",
  癸: "酉",
};

// 황은대사 (월지 기준 → 일지/시지에서 체크)
const IMPERIAL_PARDON_MAP: Record<string, string> = {
  子: "申",
  丑: "未",
  寅: "戌",
  卯: "丑",
  辰: "寅",
  巳: "巳",
  午: "酉",
  未: "卯",
  申: "子",
  酉: "午",
  戌: "亥",
  亥: "辰",
};

// 망신살 (년지/일지 기준 삼합 → 지지에서 체크)
const LOST_SPIRIT_MAP: Record<string, string> = {
  寅: "巳",
  午: "巳",
  戌: "巳",
  巳: "申",
  酉: "申",
  丑: "申",
  申: "亥",
  子: "亥",
  辰: "亥",
  亥: "寅",
  卯: "寅",
  未: "寅",
};

// 겁살 (년지/일지 기준 삼합 → 지지에서 체크)
const ROBBERY_MAP: Record<string, string> = {
  寅: "亥",
  午: "亥",
  戌: "亥",
  巳: "寅",
  酉: "寅",
  丑: "寅",
  申: "巳",
  子: "巳",
  辰: "巳",
  亥: "申",
  卯: "申",
  未: "申",
};

// 재살 (년지/일지 기준 삼합 → 지지에서 체크)
const DISASTER_MAP: Record<string, string> = {
  寅: "子",
  午: "子",
  戌: "子",
  巳: "卯",
  酉: "卯",
  丑: "卯",
  申: "午",
  子: "午",
  辰: "午",
  亥: "酉",
  卯: "酉",
  未: "酉",
};

// 장성 (년지/일지 기준 삼합의 왕지)
const GENERAL_STAR_MAP: Record<string, string> = {
  寅: "午",
  午: "午",
  戌: "午",
  巳: "酉",
  酉: "酉",
  丑: "酉",
  申: "子",
  子: "子",
  辰: "子",
  亥: "卯",
  卯: "卯",
  未: "卯",
};

// 반안살 (년지/일지 기준 삼합 → 왕지 다음 지지)
const SADDLE_MOUNT_MAP: Record<string, string> = {
  寅: "未",
  午: "未",
  戌: "未",
  巳: "戌",
  酉: "戌",
  丑: "戌",
  申: "丑",
  子: "丑",
  辰: "丑",
  亥: "辰",
  卯: "辰",
  未: "辰",
};

// 홍란살 (년지 기준 → 다른 지지에서 체크)
const RED_PHOENIX_MAP: Record<string, string> = {
  子: "卯",
  丑: "寅",
  寅: "丑",
  卯: "子",
  辰: "亥",
  巳: "戌",
  午: "酉",
  未: "申",
  申: "未",
  酉: "午",
  戌: "巳",
  亥: "辰",
};

// 천희살 (년지/일지 기준 → 다른 지지에서 체크)
const HEAVENLY_JOY_MAP: Record<string, string> = {
  子: "酉",
  丑: "申",
  寅: "未",
  卯: "午",
  辰: "巳",
  巳: "辰",
  午: "卯",
  未: "寅",
  申: "丑",
  酉: "子",
  戌: "亥",
  亥: "戌",
};

export interface SinsalMatch {
  sinsal: SinsalLabel;
  position: PillarPosition;
}

export interface SinsalResult {
  matches: SinsalMatch[];
  summary: Partial<Record<SinsalKey, PillarPosition[]>>;
}

function checkBranchBasedSinsal(
  baseBranch: string,
  targetBranches: string[],
  positions: PillarPosition[],
  map: Record<string, string>,
  sinsalKey: SinsalKey,
): SinsalMatch[] {
  const matches: SinsalMatch[] = [];
  const targetSinsal = map[baseBranch];

  if (targetSinsal) {
    targetBranches.forEach((branch, idx) => {
      if (branch === targetSinsal) {
        matches.push({ sinsal: getSinsalLabel(sinsalKey), position: positions[idx] });
      }
    });
  }

  return matches;
}

function checkStemBasedSinsal(
  baseStem: string,
  targetBranches: string[],
  positions: PillarPosition[],
  map: Record<string, string | string[]>,
  sinsalKey: SinsalKey,
): SinsalMatch[] {
  const matches: SinsalMatch[] = [];
  const targetSinsal = map[baseStem];

  if (targetSinsal) {
    const targets = Array.isArray(targetSinsal) ? targetSinsal : [targetSinsal];
    targetBranches.forEach((branch, idx) => {
      if (targets.includes(branch)) {
        matches.push({ sinsal: getSinsalLabel(sinsalKey), position: positions[idx] });
      }
    });
  }

  return matches;
}

export function analyzeSinsals(
  yearPillar: string,
  monthPillar: string,
  dayPillar: string,
  hourPillar: string,
): SinsalResult {
  const yearBranch = yearPillar[1];
  const monthBranch = monthPillar[1];
  const dayBranch = dayPillar[1];
  const hourBranch = hourPillar[1];

  const dayStem = dayPillar[0];
  const yearStem = yearPillar[0];

  const allBranches = [yearBranch, monthBranch, dayBranch, hourBranch];
  const positions: PillarPosition[] = ["year", "month", "day", "hour"];

  const matches: SinsalMatch[] = [];

  matches.push(
    ...checkBranchBasedSinsal(
      yearBranch,
      allBranches,
      positions,
      PEACH_BLOSSOM_MAP,
      "peachBlossom",
    ),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, PEACH_BLOSSOM_MAP, "peachBlossom"),
  );

  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, SKY_HORSE_MAP, "skyHorse"),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, SKY_HORSE_MAP, "skyHorse"),
  );

  matches.push(
    ...checkBranchBasedSinsal(
      yearBranch,
      allBranches,
      positions,
      FLOWERY_CANOPY_MAP,
      "floweryCanopy",
    ),
  );
  matches.push(
    ...checkBranchBasedSinsal(
      dayBranch,
      allBranches,
      positions,
      FLOWERY_CANOPY_MAP,
      "floweryCanopy",
    ),
  );

  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, GHOST_GATE_MAP, "ghostGate"),
  );

  matches.push(
    ...checkBranchBasedSinsal(
      yearBranch,
      allBranches,
      positions,
      SOLITARY_STAR_MAP,
      "solitaryStar",
    ),
  );

  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, WIDOW_STAR_MAP, "widowStar"),
  );

  // 천덕귀인 - 천간과 지지 모두에서 체크 (일부 값이 천간, 일부 값이 지지이므로)
  const allStemsArr = [yearPillar[0], monthPillar[0], dayPillar[0], hourPillar[0]];
  const allStemsAndBranches = [...allStemsArr, ...allBranches];
  matches.push(
    ...checkBranchBasedSinsal(
      monthBranch,
      allStemsAndBranches,
      [...positions, ...positions],
      HEAVENLY_VIRTUE_MAP,
      "heavenlyVirtue",
    ),
  );

  // 월덕귀인 - 천간에서 체크
  matches.push(
    ...checkBranchBasedSinsal(
      monthBranch,
      allStemsArr,
      positions,
      MONTHLY_VIRTUE_MAP,
      "monthlyVirtue",
    ),
  );

  matches.push(...checkStemBasedSinsal(dayStem, allBranches, positions, SKY_NOBLE_MAP, "skyNoble"));
  matches.push(
    ...checkStemBasedSinsal(yearStem, allBranches, positions, SKY_NOBLE_MAP, "moonNoble"),
  );

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, LITERARY_NOBLE_MAP, "literaryNoble"),
  );

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, ACADEMIC_HALL_MAP, "academicHall"),
  );

  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, BLOOD_KNIFE_MAP, "bloodKnife"),
  );

  matches.push(
    ...checkBranchBasedSinsal(
      monthBranch,
      allBranches,
      positions,
      HEAVENLY_DOCTOR_MAP,
      "heavenlyDoctor",
    ),
  );

  const allStems = [yearPillar[0], monthPillar[0], dayPillar[0], hourPillar[0]];
  allStems.forEach((stem, idx) => {
    if (SUSPENDED_NEEDLE_STEMS.has(stem)) {
      matches.push({ sinsal: getSinsalLabel("suspendedNeedle"), position: positions[idx] });
    }
  });
  allBranches.forEach((branch, idx) => {
    if (SUSPENDED_NEEDLE_BRANCHES.has(branch)) {
      matches.push({ sinsal: getSinsalLabel("suspendedNeedle"), position: positions[idx] });
    }
  });

  const allPillarsForKuiGang = [yearPillar, monthPillar, dayPillar, hourPillar];
  allPillarsForKuiGang.forEach((pillar, idx) => {
    if (KUI_GANG_PILLARS.has(pillar)) {
      matches.push({ sinsal: getSinsalLabel("kuiGang"), position: positions[idx] });
    }
  });

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, SHEEP_BLADE_MAP, "sheepBlade"),
  );

  matches.push(...checkStemBasedSinsal(dayStem, allBranches, positions, RED_FLAME_MAP, "redFlame"));

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, TAIJI_NOBLE_MAP, "taijiNoble"),
  );

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, GOLDEN_CARRIAGE_MAP, "goldenCarriage"),
  );

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, OFFICIAL_STAR_MAP, "officialStar"),
  );

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, HIDDEN_WEALTH_MAP, "hiddenWealth"),
  );

  matches.push(
    ...checkStemBasedSinsal(
      dayStem,
      allBranches,
      positions,
      OFFICIAL_ACADEMIC_HALL_MAP,
      "officialAcademicHall",
    ),
  );

  const allPillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  allPillars.forEach((pillar, idx) => {
    if (WHITE_TIGER_PILLARS.has(pillar)) {
      matches.push({ sinsal: getSinsalLabel("whiteTiger"), position: positions[idx] });
    }
  });

  matches.push(
    ...checkBranchBasedSinsal(
      monthBranch,
      allBranches,
      positions,
      HEAVENLY_GATE_MAP,
      "heavenlyGate",
    ),
  );

  matches.push(
    ...checkStemBasedSinsal(
      dayStem,
      allBranches,
      positions,
      HEAVENLY_KITCHEN_MAP,
      "heavenlyKitchen",
    ),
  );

  matches.push(
    ...checkStemBasedSinsal(dayStem, allBranches, positions, LITERARY_CURVE_MAP, "literaryCurve"),
  );

  // 황은대사 (월지 기준 → 일지/시지에서만 체크)
  const dayHourBranches = [dayBranch, hourBranch];
  const dayHourPositions: PillarPosition[] = ["day", "hour"];
  matches.push(
    ...checkBranchBasedSinsal(
      monthBranch,
      dayHourBranches,
      dayHourPositions,
      IMPERIAL_PARDON_MAP,
      "imperialPardon",
    ),
  );

  // 망신살 (년지/일지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, LOST_SPIRIT_MAP, "lostSpirit"),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, LOST_SPIRIT_MAP, "lostSpirit"),
  );

  // 겁살 (년지/일지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, ROBBERY_MAP, "robbery"),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, ROBBERY_MAP, "robbery"),
  );

  // 재살 (년지/일지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, DISASTER_MAP, "disaster"),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, DISASTER_MAP, "disaster"),
  );

  // 장성살 (년지/일지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, GENERAL_STAR_MAP, "generalStar"),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, GENERAL_STAR_MAP, "generalStar"),
  );

  // 반안살 (년지/일지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, SADDLE_MOUNT_MAP, "saddleMount"),
  );
  matches.push(
    ...checkBranchBasedSinsal(dayBranch, allBranches, positions, SADDLE_MOUNT_MAP, "saddleMount"),
  );

  // 홍란살 (년지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, RED_PHOENIX_MAP, "redPhoenix"),
  );

  // 천희살 (년지 기준)
  matches.push(
    ...checkBranchBasedSinsal(yearBranch, allBranches, positions, HEAVENLY_JOY_MAP, "heavenlyJoy"),
  );

  // 원진살 (일지 기준)
  matches.push(...checkBranchBasedSinsal(dayBranch, allBranches, positions, WONJIN_MAP, "wonjin"));

  // 공망 (일주 기준)
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const sIdx = stems.indexOf(dayStem);
  const bIdx = branches.indexOf(dayBranch);

  if (sIdx !== -1 && bIdx !== -1) {
    const diff = (bIdx - sIdx + 12) % 12;
    const empty1 = branches[(diff + 10) % 12];
    const empty2 = branches[(diff + 11) % 12];

    allBranches.forEach((branch, idx) => {
      if (branch === empty1 || branch === empty2) {
        matches.push({ sinsal: getSinsalLabel("gongmang"), position: positions[idx] });
      }
    });
  }

  const uniqueMatches = matches.filter(
    (match, index, self) =>
      index ===
      self.findIndex((m) => m.sinsal.key === match.sinsal.key && m.position === match.position),
  );

  const summary: Partial<Record<SinsalKey, PillarPosition[]>> = {};
  for (const match of uniqueMatches) {
    if (!summary[match.sinsal.key]) {
      summary[match.sinsal.key] = [];
    }
    summary[match.sinsal.key]?.push(match.position);
  }

  return { matches: uniqueMatches, summary };
}

export const SINSAL_INFO: Record<
  SinsalKey,
  {
    korean: string;
    hanja: string;
    meaning: string;
    type: SinsalType;
  }
> = {
  peachBlossom: {
    korean: "도화살",
    hanja: "桃花煞",
    meaning: "이성 인연, 매력, 색정",
    type: "neutral",
  },
  skyHorse: { korean: "역마살", hanja: "驛馬煞", meaning: "이동, 변화, 해외", type: "neutral" },
  floweryCanopy: {
    korean: "화개살",
    hanja: "華蓋煞",
    meaning: "예술, 종교, 고독",
    type: "neutral",
  },
  ghostGate: {
    korean: "귀문관살",
    hanja: "鬼門關煞",
    meaning: "귀신, 영적 감각, 불안",
    type: "inauspicious",
  },
  solitaryStar: {
    korean: "고진살",
    hanja: "孤辰煞",
    meaning: "고독, 독립, 자립",
    type: "inauspicious",
  },
  widowStar: {
    korean: "과숙살",
    hanja: "寡宿煞",
    meaning: "외로움, 배우자 인연 약함",
    type: "inauspicious",
  },
  heavenlyVirtue: {
    korean: "천덕귀인",
    hanja: "天德貴人",
    meaning: "하늘의 덕, 재난 해소",
    type: "auspicious",
  },
  monthlyVirtue: {
    korean: "월덕귀인",
    hanja: "月德貴人",
    meaning: "달의 덕, 흉화 해소",
    type: "auspicious",
  },
  skyNoble: {
    korean: "천을귀인",
    hanja: "天乙貴人",
    meaning: "귀인의 도움, 위기 극복",
    type: "auspicious",
  },
  moonNoble: { korean: "월을귀인", hanja: "月乙貴人", meaning: "귀인의 도움", type: "auspicious" },
  literaryNoble: {
    korean: "문창귀인",
    hanja: "文昌貴人",
    meaning: "학업, 시험, 문서",
    type: "auspicious",
  },
  academicHall: {
    korean: "학당귀인",
    hanja: "學堂貴人",
    meaning: "학문, 교육, 지식",
    type: "auspicious",
  },
  bloodKnife: {
    korean: "혈인살",
    hanja: "血刃煞",
    meaning: "수술, 출혈, 부상",
    type: "inauspicious",
  },
  sixHarms: { korean: "육해살", hanja: "六害煞", meaning: "인관계 해침", type: "inauspicious" },
  whiteCloth: {
    korean: "백호살",
    hanja: "白虎煞",
    meaning: "상해, 사고, 흉사",
    type: "inauspicious",
  },
  heavenlyDoctor: {
    korean: "천의성",
    hanja: "天醫星",
    meaning: "치료, 의료, 건강 회복",
    type: "auspicious",
  },
  suspendedNeedle: {
    korean: "현침살",
    hanja: "懸針殺",
    meaning: "날카로운 기질, 성급함, 예리함",
    type: "inauspicious",
  },
  kuiGang: {
    korean: "괴강살",
    hanja: "魁罡殺",
    meaning: "강한 개성, 리더십, 독선",
    type: "neutral",
  },
  sheepBlade: {
    korean: "양인살",
    hanja: "羊刃殺",
    meaning: "극단적 성향, 승부욕, 위험",
    type: "inauspicious",
  },
  redFlame: {
    korean: "홍염살",
    hanja: "紅艶殺",
    meaning: "이성 문제, 색정, 매력",
    type: "inauspicious",
  },
  taijiNoble: {
    korean: "태극귀인",
    hanja: "太極貴人",
    meaning: "지혜, 학문, 귀인의 도움",
    type: "auspicious",
  },
  goldenCarriage: {
    korean: "금여성",
    hanja: "金輿星",
    meaning: "배우자운, 부귀, 명예",
    type: "auspicious",
  },
  officialStar: {
    korean: "건록",
    hanja: "建祿",
    meaning: "관직, 안정, 자립",
    type: "auspicious",
  },
  hiddenWealth: {
    korean: "암록",
    hanja: "暗祿",
    meaning: "숨겨진 재물, 은밀한 도움",
    type: "auspicious",
  },
  officialAcademicHall: {
    korean: "관귀학관",
    hanja: "官貴學館",
    meaning: "공직, 학문, 승진",
    type: "auspicious",
  },
  whiteTiger: {
    korean: "백호대살",
    hanja: "白虎大殺",
    meaning: "사고, 수술, 혈광",
    type: "inauspicious",
  },
  heavenlyGate: {
    korean: "천문성",
    hanja: "天門星",
    meaning: "영적 감각, 종교, 신비",
    type: "neutral",
  },
  heavenlyKitchen: {
    korean: "천주귀인",
    hanja: "天廚貴人",
    meaning: "의식주 풍족, 재물운, 복록",
    type: "auspicious",
  },
  literaryCurve: {
    korean: "문곡귀인",
    hanja: "文曲貴人",
    meaning: "예술, 문학, 감성적 학문",
    type: "auspicious",
  },
  imperialPardon: {
    korean: "황은대사",
    hanja: "皇恩大赦",
    meaning: "용서, 구원, 위기 극복, 귀인의 도움",
    type: "auspicious",
  },
  lostSpirit: {
    korean: "망신살",
    hanja: "亡身煞",
    meaning: "망신, 실수, 구설수",
    type: "inauspicious",
  },
  robbery: {
    korean: "겁살",
    hanja: "劫煞",
    meaning: "강탈, 재물 손실, 압류",
    type: "inauspicious",
  },
  disaster: {
    korean: "재살",
    hanja: "災煞",
    meaning: "재난, 감금, 소송",
    type: "inauspicious",
  },
  generalStar: {
    korean: "장성살",
    hanja: "將星煞",
    meaning: "권위, 리더십, 승진",
    type: "auspicious",
  },
  saddleMount: {
    korean: "반안살",
    hanja: "攀鞍煞",
    meaning: "안정, 출세, 승진",
    type: "auspicious",
  },
  redPhoenix: {
    korean: "홍란살",
    hanja: "紅鸞煞",
    meaning: "혼인, 경사, 매력",
    type: "auspicious",
  },
  heavenlyJoy: {
    korean: "천희살",
    hanja: "天喜煞",
    meaning: "기쁨, 출산, 경사",
    type: "auspicious",
  },
  wonjin: {
    korean: "원진살",
    hanja: "元嗔煞",
    meaning: "애증, 불화, 원망",
    type: "inauspicious",
  },
  gongmang: {
    korean: "공망",
    hanja: "空亡",
    meaning: "허무, 비움, 무력화",
    type: "inauspicious",
  },
};

export function getSinsalLabel(key: SinsalKey): SinsalLabel {
  const info = SINSAL_INFO[key];
  return {
    key,
    korean: info.korean,
    hanja: info.hanja,
    meaning: info.meaning,
    type: info.type,
  };
}
