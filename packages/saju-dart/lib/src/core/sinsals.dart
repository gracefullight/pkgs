import '../types/types.dart';

/// Sinsal Key (신살 종류)
enum SinsalKey {
  peachBlossom('peachBlossom', '도화살', '桃花煞'),
  skyHorse('skyHorse', '역마살', '驛馬煞'),
  floweryCanopy('floweryCanopy', '화개살', '華蓋煞'),
  ghostGate('ghostGate', '귀문관살', '鬼門關煞'),
  solitaryStar('solitaryStar', '고진살', '孤辰煞'),
  widowStar('widowStar', '과숙살', '寡宿煞'),
  heavenlyVirtue('heavenlyVirtue', '천덕귀인', '天德貴人'),
  monthlyVirtue('monthlyVirtue', '월덕귀인', '月德貴人'),
  skyNoble('skyNoble', '천을귀인', '天乙貴人'),
  moonNoble('moonNoble', '월을귀인', '月乙貴人'),
  literaryNoble('literaryNoble', '문창귀인', '文昌貴人'),
  academicHall('academicHall', '학당귀인', '學堂貴人'),
  bloodKnife('bloodKnife', '혈인살', '血刃煞'),
  sixHarms('sixHarms', '육해살', '六害煞'),
  whiteCloth('whiteCloth', '백호살', '白虎煞'),
  heavenlyDoctor('heavenlyDoctor', '천의성', '天醫星'),
  suspendedNeedle('suspendedNeedle', '현침살', '懸針殺'),
  kuiGang('kuiGang', '괴강살', '魁罡殺'),
  sheepBlade('sheepBlade', '양인살', '羊刃殺'),
  redFlame('redFlame', '홍염살', '紅艶殺'),
  taijiNoble('taijiNoble', '태극귀인', '太極貴人'),
  goldenCarriage('goldenCarriage', '금여성', '金輿星'),
  officialStar('officialStar', '건록', '建祿'),
  hiddenWealth('hiddenWealth', '암록', '暗祿'),
  officialAcademicHall('officialAcademicHall', '관귀학관', '官貴學館'),
  whiteTiger('whiteTiger', '백호대살', '白虎大殺'),
  heavenlyGate('heavenlyGate', '천문성', '天門星'),
  heavenlyKitchen('heavenlyKitchen', '천주귀인', '天廚貴人'),
  literaryCurve('literaryCurve', '문곡귀인', '文曲貴人'),
  imperialPardon('imperialPardon', '황은대사', '皇恩大赦'),
  lostSpirit('lostSpirit', '망신살', '亡身煞'),
  robbery('robbery', '겁살', '劫煞'),
  disaster('disaster', '재살', '災煞'),
  heavenlyKiller('heavenlyKiller', '천살', '天煞'),
  earthlyKiller('earthlyKiller', '지살', '地煞'),
  yearKiller('yearKiller', '연살', '年煞'),
  monthKiller('monthKiller', '월살', '月煞'),
  generalStar('generalStar', '장성살', '將星煞'),
  saddleMount('saddleMount', '반안살', '攀鞍煞'),
  redPhoenix('redPhoenix', '홍란살', '紅鸞煞'),
  heavenlyJoy('heavenlyJoy', '천희살', '天喜煞'),
  gongmang('gongmang', '공망', '空亡'),
  wonjin('wonjin', '원진살', '元嗔煞');

  const SinsalKey(this.key, this.korean, this.hanja);

  final String key;
  final String korean;
  final String hanja;
}

/// Sinsal label with meaning and type
class SinsalLabel {
  const SinsalLabel({
    required this.key,
    required this.korean,
    required this.hanja,
    required this.meaning,
    required this.type,
  });

  final SinsalKey key;
  final String korean;
  final String hanja;
  final String meaning;
  final SinsalType type;
}

/// Sinsal match result
class SinsalMatch {
  const SinsalMatch({
    required this.sinsal,
    required this.position,
  });

  final SinsalLabel sinsal;
  final PillarPosition position;
}

/// Sinsal analysis result
class SinsalResult {
  const SinsalResult({
    required this.matches,
    required this.summary,
  });

  final List<SinsalMatch> matches;
  final Map<SinsalKey, List<PillarPosition>> summary;
}

// ── Sinsal Info ──

const _sinsalInfo = <SinsalKey, ({String meaning, SinsalType type})>{
  SinsalKey.peachBlossom: (meaning: '이성 인연, 매력, 색정', type: SinsalType.neutral),
  SinsalKey.skyHorse: (meaning: '이동, 변화, 해외', type: SinsalType.neutral),
  SinsalKey.floweryCanopy: (meaning: '예술, 종교, 고독', type: SinsalType.neutral),
  SinsalKey.ghostGate: (meaning: '귀신, 영적 감각, 불안', type: SinsalType.inauspicious),
  SinsalKey.solitaryStar: (meaning: '고독, 독립, 자립', type: SinsalType.inauspicious),
  SinsalKey.widowStar: (meaning: '외로움, 배우자 인연 약함', type: SinsalType.inauspicious),
  SinsalKey.heavenlyVirtue: (meaning: '하늘의 덕, 재난 해소', type: SinsalType.auspicious),
  SinsalKey.monthlyVirtue: (meaning: '달의 덕, 흉화 해소', type: SinsalType.auspicious),
  SinsalKey.skyNoble: (meaning: '귀인의 도움, 위기 극복', type: SinsalType.auspicious),
  SinsalKey.moonNoble: (meaning: '귀인의 도움', type: SinsalType.auspicious),
  SinsalKey.literaryNoble: (meaning: '학업, 시험, 문서', type: SinsalType.auspicious),
  SinsalKey.academicHall: (meaning: '학문, 교육, 지식', type: SinsalType.auspicious),
  SinsalKey.bloodKnife: (meaning: '수술, 출혈, 부상', type: SinsalType.inauspicious),
  SinsalKey.sixHarms: (meaning: '인관계 해침', type: SinsalType.inauspicious),
  SinsalKey.whiteCloth: (meaning: '상해, 사고, 흉사', type: SinsalType.inauspicious),
  SinsalKey.heavenlyDoctor: (meaning: '치료, 의료, 건강 회복', type: SinsalType.auspicious),
  SinsalKey.suspendedNeedle: (meaning: '날카로운 기질, 성급함, 예리함', type: SinsalType.inauspicious),
  SinsalKey.kuiGang: (meaning: '강한 개성, 리더십, 독선', type: SinsalType.neutral),
  SinsalKey.sheepBlade: (meaning: '극단적 성향, 승부욕, 위험', type: SinsalType.inauspicious),
  SinsalKey.redFlame: (meaning: '이성 문제, 색정, 매력', type: SinsalType.inauspicious),
  SinsalKey.taijiNoble: (meaning: '지혜, 학문, 귀인의 도움', type: SinsalType.auspicious),
  SinsalKey.goldenCarriage: (meaning: '배우자운, 부귀, 명예', type: SinsalType.auspicious),
  SinsalKey.officialStar: (meaning: '관직, 안정, 자립', type: SinsalType.auspicious),
  SinsalKey.hiddenWealth: (meaning: '숨겨진 재물, 은밀한 도움', type: SinsalType.auspicious),
  SinsalKey.officialAcademicHall: (meaning: '공직, 학문, 승진', type: SinsalType.auspicious),
  SinsalKey.whiteTiger: (meaning: '사고, 수술, 혈광', type: SinsalType.inauspicious),
  SinsalKey.heavenlyGate: (meaning: '영적 감각, 종교, 신비', type: SinsalType.neutral),
  SinsalKey.heavenlyKitchen: (meaning: '의식주 풍족, 재물운, 복록', type: SinsalType.auspicious),
  SinsalKey.literaryCurve: (meaning: '예술, 문학, 감성적 학문', type: SinsalType.auspicious),
  SinsalKey.imperialPardon: (meaning: '용서, 구원, 위기 극복, 귀인의 도움', type: SinsalType.auspicious),
  SinsalKey.lostSpirit: (meaning: '망신, 실수, 구설수', type: SinsalType.inauspicious),
  SinsalKey.robbery: (meaning: '강탈, 재물 손실, 압류', type: SinsalType.inauspicious),
  SinsalKey.disaster: (meaning: '재난, 감금, 소송', type: SinsalType.inauspicious),
  SinsalKey.heavenlyKiller: (meaning: '천재지변, 불의의 사고', type: SinsalType.inauspicious),
  SinsalKey.earthlyKiller: (meaning: '이동 중 사고, 지진, 함몰', type: SinsalType.inauspicious),
  SinsalKey.yearKiller: (meaning: '질병, 관재, 구설', type: SinsalType.inauspicious),
  SinsalKey.monthKiller: (meaning: '가정불화, 부부갈등', type: SinsalType.inauspicious),
  SinsalKey.generalStar: (meaning: '권위, 리더십, 승진', type: SinsalType.auspicious),
  SinsalKey.saddleMount: (meaning: '안정, 출세, 승진', type: SinsalType.auspicious),
  SinsalKey.redPhoenix: (meaning: '혼인, 경사, 매력', type: SinsalType.auspicious),
  SinsalKey.heavenlyJoy: (meaning: '기쁨, 출산, 경사', type: SinsalType.auspicious),
  SinsalKey.wonjin: (meaning: '애증, 불화, 원망', type: SinsalType.inauspicious),
  SinsalKey.gongmang: (meaning: '허무, 비움, 무력화', type: SinsalType.inauspicious),
};

SinsalLabel getSinsalLabel(SinsalKey key) {
  final info = _sinsalInfo[key]!;
  return SinsalLabel(
    key: key,
    korean: key.korean,
    hanja: key.hanja,
    meaning: info.meaning,
    type: info.type,
  );
}

// ── Branch-based maps ──

const _peachBlossomMap = <Branch, Branch>{
  Branch.yin: Branch.mao, Branch.wu: Branch.mao, Branch.xu: Branch.mao,
  Branch.shen: Branch.you, Branch.zi: Branch.you, Branch.chen: Branch.you,
  Branch.si: Branch.wu, Branch.you: Branch.wu, Branch.chou: Branch.wu,
  Branch.hai: Branch.zi, Branch.mao: Branch.zi, Branch.wei: Branch.zi,
};

const _skyHorseMap = <Branch, Branch>{
  Branch.yin: Branch.shen, Branch.wu: Branch.shen, Branch.xu: Branch.shen,
  Branch.shen: Branch.yin, Branch.zi: Branch.yin, Branch.chen: Branch.yin,
  Branch.si: Branch.hai, Branch.you: Branch.hai, Branch.chou: Branch.hai,
  Branch.hai: Branch.si, Branch.mao: Branch.si, Branch.wei: Branch.si,
};

const _floweryCanopyMap = <Branch, Branch>{
  Branch.yin: Branch.xu, Branch.wu: Branch.xu, Branch.xu: Branch.xu,
  Branch.shen: Branch.chen, Branch.zi: Branch.chen, Branch.chen: Branch.chen,
  Branch.si: Branch.chou, Branch.you: Branch.chou, Branch.chou: Branch.chou,
  Branch.hai: Branch.wei, Branch.mao: Branch.wei, Branch.wei: Branch.wei,
};

const _ghostGateMap = <Branch, Branch>{
  Branch.zi: Branch.mao, Branch.chou: Branch.yin, Branch.yin: Branch.chou,
  Branch.mao: Branch.zi, Branch.chen: Branch.hai, Branch.si: Branch.xu,
  Branch.wu: Branch.you, Branch.wei: Branch.shen, Branch.shen: Branch.wei,
  Branch.you: Branch.wu, Branch.xu: Branch.si, Branch.hai: Branch.chen,
};

const _wonjinMap = <Branch, Branch>{
  Branch.zi: Branch.wei, Branch.chou: Branch.wu, Branch.yin: Branch.you,
  Branch.mao: Branch.shen, Branch.chen: Branch.hai, Branch.si: Branch.xu,
  Branch.wu: Branch.chou, Branch.wei: Branch.zi, Branch.shen: Branch.mao,
  Branch.you: Branch.yin, Branch.xu: Branch.si, Branch.hai: Branch.chen,
};

const _solitaryStarMap = <Branch, Branch>{
  Branch.zi: Branch.yin, Branch.chou: Branch.yin, Branch.yin: Branch.si,
  Branch.mao: Branch.si, Branch.chen: Branch.si, Branch.si: Branch.shen,
  Branch.wu: Branch.shen, Branch.wei: Branch.shen, Branch.shen: Branch.hai,
  Branch.you: Branch.hai, Branch.xu: Branch.hai, Branch.hai: Branch.yin,
};

const _widowStarMap = <Branch, Branch>{
  Branch.zi: Branch.xu, Branch.chou: Branch.xu, Branch.yin: Branch.chou,
  Branch.mao: Branch.chou, Branch.chen: Branch.chou, Branch.si: Branch.chen,
  Branch.wu: Branch.chen, Branch.wei: Branch.chen, Branch.shen: Branch.wei,
  Branch.you: Branch.wei, Branch.xu: Branch.wei, Branch.hai: Branch.xu,
};

const _bloodKnifeMap = <Branch, Branch>{
  Branch.zi: Branch.you, Branch.chou: Branch.xu, Branch.yin: Branch.hai,
  Branch.mao: Branch.zi, Branch.chen: Branch.chou, Branch.si: Branch.yin,
  Branch.wu: Branch.mao, Branch.wei: Branch.chen, Branch.shen: Branch.si,
  Branch.you: Branch.wu, Branch.xu: Branch.wei, Branch.hai: Branch.shen,
};

const _heavenlyDoctorMap = <Branch, Branch>{
  Branch.zi: Branch.hai, Branch.chou: Branch.zi, Branch.yin: Branch.chou,
  Branch.mao: Branch.yin, Branch.chen: Branch.mao, Branch.si: Branch.chen,
  Branch.wu: Branch.si, Branch.wei: Branch.wu, Branch.shen: Branch.wei,
  Branch.you: Branch.shen, Branch.xu: Branch.you, Branch.hai: Branch.xu,
};

const _heavenlyGateMap = <Branch, Branch>{
  Branch.yin: Branch.xu, Branch.mao: Branch.hai, Branch.chen: Branch.zi,
  Branch.si: Branch.chou, Branch.wu: Branch.yin, Branch.wei: Branch.mao,
  Branch.shen: Branch.chen, Branch.you: Branch.si, Branch.xu: Branch.wu,
  Branch.hai: Branch.wei, Branch.zi: Branch.shen, Branch.chou: Branch.you,
};

const _imperialPardonMap = <Branch, Branch>{
  Branch.zi: Branch.shen, Branch.chou: Branch.wei, Branch.yin: Branch.xu,
  Branch.mao: Branch.chou, Branch.chen: Branch.yin, Branch.si: Branch.si,
  Branch.wu: Branch.you, Branch.wei: Branch.mao, Branch.shen: Branch.zi,
  Branch.you: Branch.wu, Branch.xu: Branch.hai, Branch.hai: Branch.chen,
};

const _lostSpiritMap = <Branch, Branch>{
  Branch.yin: Branch.si, Branch.wu: Branch.si, Branch.xu: Branch.si,
  Branch.si: Branch.shen, Branch.you: Branch.shen, Branch.chou: Branch.shen,
  Branch.shen: Branch.hai, Branch.zi: Branch.hai, Branch.chen: Branch.hai,
  Branch.hai: Branch.yin, Branch.mao: Branch.yin, Branch.wei: Branch.yin,
};

const _robberyMap = <Branch, Branch>{
  Branch.yin: Branch.hai, Branch.wu: Branch.hai, Branch.xu: Branch.hai,
  Branch.si: Branch.yin, Branch.you: Branch.yin, Branch.chou: Branch.yin,
  Branch.shen: Branch.si, Branch.zi: Branch.si, Branch.chen: Branch.si,
  Branch.hai: Branch.shen, Branch.mao: Branch.shen, Branch.wei: Branch.shen,
};

const _disasterMap = <Branch, Branch>{
  Branch.yin: Branch.zi, Branch.wu: Branch.zi, Branch.xu: Branch.zi,
  Branch.si: Branch.mao, Branch.you: Branch.mao, Branch.chou: Branch.mao,
  Branch.shen: Branch.wu, Branch.zi: Branch.wu, Branch.chen: Branch.wu,
  Branch.hai: Branch.you, Branch.mao: Branch.you, Branch.wei: Branch.you,
};

const _heavenlyKillerMap = <Branch, Branch>{
  Branch.yin: Branch.chou, Branch.wu: Branch.chou, Branch.xu: Branch.chou,
  Branch.si: Branch.chen, Branch.you: Branch.chen, Branch.chou: Branch.chen,
  Branch.shen: Branch.wei, Branch.zi: Branch.wei, Branch.chen: Branch.wei,
  Branch.hai: Branch.xu, Branch.mao: Branch.xu, Branch.wei: Branch.xu,
};

const _earthlyKillerMap = <Branch, Branch>{
  Branch.yin: Branch.yin, Branch.wu: Branch.yin, Branch.xu: Branch.yin,
  Branch.si: Branch.si, Branch.you: Branch.si, Branch.chou: Branch.si,
  Branch.shen: Branch.shen, Branch.zi: Branch.shen, Branch.chen: Branch.shen,
  Branch.hai: Branch.hai, Branch.mao: Branch.hai, Branch.wei: Branch.hai,
};

const _yearKillerMap = <Branch, Branch>{
  Branch.yin: Branch.mao, Branch.wu: Branch.mao, Branch.xu: Branch.mao,
  Branch.si: Branch.wu, Branch.you: Branch.wu, Branch.chou: Branch.wu,
  Branch.shen: Branch.you, Branch.zi: Branch.you, Branch.chen: Branch.you,
  Branch.hai: Branch.zi, Branch.mao: Branch.zi, Branch.wei: Branch.zi,
};

const _monthKillerMap = <Branch, Branch>{
  Branch.yin: Branch.chen, Branch.wu: Branch.chen, Branch.xu: Branch.chen,
  Branch.si: Branch.wei, Branch.you: Branch.wei, Branch.chou: Branch.wei,
  Branch.shen: Branch.xu, Branch.zi: Branch.xu, Branch.chen: Branch.xu,
  Branch.hai: Branch.chou, Branch.mao: Branch.chou, Branch.wei: Branch.chou,
};

const _generalStarMap = <Branch, Branch>{
  Branch.yin: Branch.wu, Branch.wu: Branch.wu, Branch.xu: Branch.wu,
  Branch.si: Branch.you, Branch.you: Branch.you, Branch.chou: Branch.you,
  Branch.shen: Branch.zi, Branch.zi: Branch.zi, Branch.chen: Branch.zi,
  Branch.hai: Branch.mao, Branch.mao: Branch.mao, Branch.wei: Branch.mao,
};

const _saddleMountMap = <Branch, Branch>{
  Branch.yin: Branch.wei, Branch.wu: Branch.wei, Branch.xu: Branch.wei,
  Branch.si: Branch.xu, Branch.you: Branch.xu, Branch.chou: Branch.xu,
  Branch.shen: Branch.chou, Branch.zi: Branch.chou, Branch.chen: Branch.chou,
  Branch.hai: Branch.chen, Branch.mao: Branch.chen, Branch.wei: Branch.chen,
};

const _redPhoenixMap = <Branch, Branch>{
  Branch.zi: Branch.mao, Branch.chou: Branch.yin, Branch.yin: Branch.chou,
  Branch.mao: Branch.zi, Branch.chen: Branch.hai, Branch.si: Branch.xu,
  Branch.wu: Branch.you, Branch.wei: Branch.shen, Branch.shen: Branch.wei,
  Branch.you: Branch.wu, Branch.xu: Branch.si, Branch.hai: Branch.chen,
};

const _heavenlyJoyMap = <Branch, Branch>{
  Branch.zi: Branch.you, Branch.chou: Branch.shen, Branch.yin: Branch.wei,
  Branch.mao: Branch.wu, Branch.chen: Branch.si, Branch.si: Branch.chen,
  Branch.wu: Branch.mao, Branch.wei: Branch.yin, Branch.shen: Branch.chou,
  Branch.you: Branch.zi, Branch.xu: Branch.hai, Branch.hai: Branch.xu,
};

// ── Heavenly Virtue (천덕귀인) - values can be stem hanja or branch hanja ──

const _heavenlyVirtueMap = <Branch, String>{
  Branch.yin: '丁', Branch.mao: '申', Branch.chen: '壬',
  Branch.si: '辛', Branch.wu: '亥', Branch.wei: '甲',
  Branch.shen: '癸', Branch.you: '寅', Branch.xu: '丙',
  Branch.hai: '乙', Branch.zi: '巳', Branch.chou: '庚',
};

// ── Monthly Virtue (월덕귀인) - values are stem hanja ──

const _monthlyVirtueMap = <Branch, String>{
  Branch.yin: '丙', Branch.mao: '甲', Branch.chen: '壬',
  Branch.si: '庚', Branch.wu: '丙', Branch.wei: '甲',
  Branch.shen: '壬', Branch.you: '庚', Branch.xu: '丙',
  Branch.hai: '甲', Branch.zi: '壬', Branch.chou: '庚',
};

// ── Stem-based maps ──

const _skyNobleMap = <Stem, List<Branch>>{
  Stem.jia: [Branch.chou, Branch.wei],
  Stem.wu: [Branch.chou, Branch.wei],
  Stem.geng: [Branch.chou, Branch.wei],
  Stem.yi: [Branch.zi, Branch.shen],
  Stem.ji: [Branch.zi, Branch.shen],
  Stem.bing: [Branch.hai, Branch.you],
  Stem.ding: [Branch.hai, Branch.you],
  Stem.ren: [Branch.mao, Branch.si],
  Stem.gui: [Branch.mao, Branch.si],
  Stem.xin: [Branch.wu, Branch.yin],
};

const _literaryNobleMap = <Stem, Branch>{
  Stem.jia: Branch.si, Stem.yi: Branch.wu, Stem.bing: Branch.shen,
  Stem.ding: Branch.you, Stem.wu: Branch.shen, Stem.ji: Branch.you,
  Stem.geng: Branch.hai, Stem.xin: Branch.zi, Stem.ren: Branch.yin,
  Stem.gui: Branch.mao,
};

const _academicHallMap = <Stem, Branch>{
  Stem.jia: Branch.hai, Stem.yi: Branch.wu, Stem.bing: Branch.yin,
  Stem.ding: Branch.you, Stem.wu: Branch.yin, Stem.ji: Branch.you,
  Stem.geng: Branch.si, Stem.xin: Branch.zi, Stem.ren: Branch.shen,
  Stem.gui: Branch.mao,
};

const _sheepBladeMap = <Stem, Branch>{
  Stem.jia: Branch.mao, Stem.yi: Branch.chen, Stem.bing: Branch.wu,
  Stem.ding: Branch.wei, Stem.wu: Branch.wu, Stem.ji: Branch.wei,
  Stem.geng: Branch.you, Stem.xin: Branch.xu, Stem.ren: Branch.zi,
  Stem.gui: Branch.chou,
};

const _redFlameMap = <Stem, Branch>{
  Stem.jia: Branch.wu, Stem.yi: Branch.wu, Stem.bing: Branch.yin,
  Stem.ding: Branch.wei, Stem.wu: Branch.chen, Stem.ji: Branch.chen,
  Stem.geng: Branch.xu, Stem.xin: Branch.you, Stem.ren: Branch.zi,
  Stem.gui: Branch.shen,
};

const _taijiNobleMap = <Stem, List<Branch>>{
  Stem.jia: [Branch.zi, Branch.wu],
  Stem.yi: [Branch.zi, Branch.wu],
  Stem.bing: [Branch.mao, Branch.you],
  Stem.ding: [Branch.mao, Branch.you],
  Stem.wu: [Branch.chen, Branch.xu, Branch.chou, Branch.wei],
  Stem.ji: [Branch.chen, Branch.xu, Branch.chou, Branch.wei],
  Stem.geng: [Branch.yin, Branch.hai],
  Stem.xin: [Branch.yin, Branch.hai],
  Stem.ren: [Branch.si, Branch.shen],
  Stem.gui: [Branch.si, Branch.shen],
};

const _goldenCarriageMap = <Stem, Branch>{
  Stem.jia: Branch.chen, Stem.yi: Branch.si, Stem.bing: Branch.wei,
  Stem.ding: Branch.shen, Stem.wu: Branch.wei, Stem.ji: Branch.shen,
  Stem.geng: Branch.xu, Stem.xin: Branch.hai, Stem.ren: Branch.chou,
  Stem.gui: Branch.yin,
};

const _officialStarMap = <Stem, Branch>{
  Stem.jia: Branch.yin, Stem.yi: Branch.mao, Stem.bing: Branch.si,
  Stem.ding: Branch.wu, Stem.wu: Branch.si, Stem.ji: Branch.wu,
  Stem.geng: Branch.shen, Stem.xin: Branch.you, Stem.ren: Branch.hai,
  Stem.gui: Branch.zi,
};

const _hiddenWealthMap = <Stem, Branch>{
  Stem.jia: Branch.hai, Stem.yi: Branch.xu, Stem.bing: Branch.shen,
  Stem.ding: Branch.wei, Stem.wu: Branch.si, Stem.ji: Branch.chen,
  Stem.geng: Branch.mao, Stem.xin: Branch.yin, Stem.ren: Branch.chou,
  Stem.gui: Branch.zi,
};

const _officialAcademicHallMap = <Stem, Branch>{
  Stem.jia: Branch.si, Stem.yi: Branch.si, Stem.bing: Branch.shen,
  Stem.ding: Branch.shen, Stem.wu: Branch.hai, Stem.ji: Branch.hai,
  Stem.geng: Branch.yin, Stem.xin: Branch.yin, Stem.ren: Branch.yin,
  Stem.gui: Branch.yin,
};

const _heavenlyKitchenMap = <Stem, Branch>{
  Stem.bing: Branch.si, Stem.ding: Branch.wu, Stem.wu: Branch.shen,
  Stem.ji: Branch.you, Stem.geng: Branch.hai, Stem.xin: Branch.zi,
  Stem.ren: Branch.yin, Stem.gui: Branch.mao,
};

const _literaryCurveMap = <Stem, Branch>{
  Stem.jia: Branch.hai, Stem.yi: Branch.zi, Stem.bing: Branch.yin,
  Stem.ding: Branch.mao, Stem.wu: Branch.yin, Stem.ji: Branch.mao,
  Stem.geng: Branch.si, Stem.xin: Branch.wu, Stem.ren: Branch.shen,
  Stem.gui: Branch.you,
};

// ── Special sets ──

const _suspendedNeedleStems = {Stem.jia, Stem.wu, Stem.geng, Stem.xin, Stem.ren};
const _suspendedNeedleBranches = {Branch.shen, Branch.mao, Branch.wu};

final _kuiGangPillars = {
  const Pillar(stem: Stem.wu, branch: Branch.xu),
  const Pillar(stem: Stem.geng, branch: Branch.chen),
  const Pillar(stem: Stem.geng, branch: Branch.xu),
  const Pillar(stem: Stem.ren, branch: Branch.chen),
};

final _whiteTigerPillars = {
  const Pillar(stem: Stem.jia, branch: Branch.chen),
  const Pillar(stem: Stem.yi, branch: Branch.wei),
  const Pillar(stem: Stem.bing, branch: Branch.xu),
  const Pillar(stem: Stem.ding, branch: Branch.chou),
  const Pillar(stem: Stem.wu, branch: Branch.chen),
  const Pillar(stem: Stem.ren, branch: Branch.xu),
  const Pillar(stem: Stem.gui, branch: Branch.chou),
};

// ── Helper functions ──

List<SinsalMatch> _checkBranchBasedSinsal(
  Branch baseBranch,
  List<Branch> targetBranches,
  List<PillarPosition> positions,
  Map<Branch, Branch> map,
  SinsalKey sinsalKey,
) {
  final matches = <SinsalMatch>[];
  final target = map[baseBranch];
  if (target != null) {
    for (var i = 0; i < targetBranches.length; i++) {
      if (targetBranches[i] == target) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(sinsalKey), position: positions[i]));
      }
    }
  }
  return matches;
}

List<SinsalMatch> _checkStemBasedSinsal(
  Stem baseStem,
  List<Branch> targetBranches,
  List<PillarPosition> positions,
  Map<Stem, dynamic> map,
  SinsalKey sinsalKey,
) {
  final matches = <SinsalMatch>[];
  final target = map[baseStem];
  if (target != null) {
    final targets = target is List<Branch> ? target : <Branch>[target as Branch];
    for (var i = 0; i < targetBranches.length; i++) {
      if (targets.contains(targetBranches[i])) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(sinsalKey), position: positions[i]));
      }
    }
  }
  return matches;
}

/// Analyze sinsals for four pillars
SinsalResult analyzeSinsals(FourPillars pillars) {
  final yearBranch = pillars.year.branch;
  final monthBranch = pillars.month.branch;
  final dayBranch = pillars.day.branch;
  final hourBranch = pillars.hour.branch;

  final dayStem = pillars.day.stem;
  final yearStem = pillars.year.stem;

  final allBranches = [yearBranch, monthBranch, dayBranch, hourBranch];
  const positions = PillarPosition.values;

  final matches = <SinsalMatch>[];

  // 도화살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _peachBlossomMap, SinsalKey.peachBlossom));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _peachBlossomMap, SinsalKey.peachBlossom));

  // 역마살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _skyHorseMap, SinsalKey.skyHorse));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _skyHorseMap, SinsalKey.skyHorse));

  // 화개살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _floweryCanopyMap, SinsalKey.floweryCanopy));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _floweryCanopyMap, SinsalKey.floweryCanopy));

  // 귀문관살 (일지 기준)
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _ghostGateMap, SinsalKey.ghostGate));

  // 고진살 (년지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _solitaryStarMap, SinsalKey.solitaryStar));

  // 과숙살 (년지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _widowStarMap, SinsalKey.widowStar));

  // 천덕귀인 (월지 기준 → 천간과 지지 모두에서 체크)
  {
    final allStems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
    final targetHanja = _heavenlyVirtueMap[monthBranch];
    if (targetHanja != null) {
      final allStemsAndBranches = [...allStems.map((s) => s.hanja), ...allBranches.map((b) => b.hanja)];
      final expandedPositions = [...positions, ...positions];
      for (var i = 0; i < allStemsAndBranches.length; i++) {
        if (allStemsAndBranches[i] == targetHanja) {
          matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.heavenlyVirtue), position: expandedPositions[i]));
        }
      }
    }
  }

  // 월덕귀인 (월지 기준 → 천간에서 체크)
  {
    final allStems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
    final targetHanja = _monthlyVirtueMap[monthBranch];
    if (targetHanja != null) {
      for (var i = 0; i < allStems.length; i++) {
        if (allStems[i].hanja == targetHanja) {
          matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.monthlyVirtue), position: positions[i]));
        }
      }
    }
  }

  // 천을귀인 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _skyNobleMap, SinsalKey.skyNoble));

  // 월을귀인 (년간 기준)
  matches.addAll(_checkStemBasedSinsal(yearStem, allBranches, positions, _skyNobleMap, SinsalKey.moonNoble));

  // 문창귀인 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _literaryNobleMap, SinsalKey.literaryNoble));

  // 학당귀인 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _academicHallMap, SinsalKey.academicHall));

  // 혈인살 (일지 기준)
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _bloodKnifeMap, SinsalKey.bloodKnife));

  // 천의성 (월지 기준)
  matches.addAll(_checkBranchBasedSinsal(monthBranch, allBranches, positions, _heavenlyDoctorMap, SinsalKey.heavenlyDoctor));

  // 현침살 (천간/지지 체크)
  {
    final allStems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
    for (var i = 0; i < allStems.length; i++) {
      if (_suspendedNeedleStems.contains(allStems[i])) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.suspendedNeedle), position: positions[i]));
      }
    }
    for (var i = 0; i < allBranches.length; i++) {
      if (_suspendedNeedleBranches.contains(allBranches[i])) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.suspendedNeedle), position: positions[i]));
      }
    }
  }

  // 괴강살 (특정 주가 있으면 성립)
  {
    final allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];
    for (var i = 0; i < allPillars.length; i++) {
      if (_kuiGangPillars.contains(allPillars[i])) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.kuiGang), position: positions[i]));
      }
    }
  }

  // 양인살 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _sheepBladeMap, SinsalKey.sheepBlade));

  // 홍염살 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _redFlameMap, SinsalKey.redFlame));

  // 태극귀인 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _taijiNobleMap, SinsalKey.taijiNoble));

  // 금여성 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _goldenCarriageMap, SinsalKey.goldenCarriage));

  // 건록 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _officialStarMap, SinsalKey.officialStar));

  // 암록 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _hiddenWealthMap, SinsalKey.hiddenWealth));

  // 관귀학관 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _officialAcademicHallMap, SinsalKey.officialAcademicHall));

  // 백호대살 (특정 주가 있으면 성립)
  {
    final allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];
    for (var i = 0; i < allPillars.length; i++) {
      if (_whiteTigerPillars.contains(allPillars[i])) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.whiteTiger), position: positions[i]));
      }
    }
  }

  // 천문성 (월지 기준)
  matches.addAll(_checkBranchBasedSinsal(monthBranch, allBranches, positions, _heavenlyGateMap, SinsalKey.heavenlyGate));

  // 천주귀인 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _heavenlyKitchenMap, SinsalKey.heavenlyKitchen));

  // 문곡귀인 (일간 기준)
  matches.addAll(_checkStemBasedSinsal(dayStem, allBranches, positions, _literaryCurveMap, SinsalKey.literaryCurve));

  // 황은대사 (월지 기준 → 일지/시지에서만 체크)
  {
    final dayHourBranches = [dayBranch, hourBranch];
    const dayHourPositions = [PillarPosition.day, PillarPosition.hour];
    matches.addAll(_checkBranchBasedSinsal(monthBranch, dayHourBranches, dayHourPositions, _imperialPardonMap, SinsalKey.imperialPardon));
  }

  // 망신살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _lostSpiritMap, SinsalKey.lostSpirit));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _lostSpiritMap, SinsalKey.lostSpirit));

  // 겁살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _robberyMap, SinsalKey.robbery));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _robberyMap, SinsalKey.robbery));

  // 재살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _disasterMap, SinsalKey.disaster));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _disasterMap, SinsalKey.disaster));

  // 천살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _heavenlyKillerMap, SinsalKey.heavenlyKiller));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _heavenlyKillerMap, SinsalKey.heavenlyKiller));

  // 지살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _earthlyKillerMap, SinsalKey.earthlyKiller));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _earthlyKillerMap, SinsalKey.earthlyKiller));

  // 연살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _yearKillerMap, SinsalKey.yearKiller));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _yearKillerMap, SinsalKey.yearKiller));

  // 월살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _monthKillerMap, SinsalKey.monthKiller));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _monthKillerMap, SinsalKey.monthKiller));

  // 장성살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _generalStarMap, SinsalKey.generalStar));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _generalStarMap, SinsalKey.generalStar));

  // 반안살 (년지/일지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _saddleMountMap, SinsalKey.saddleMount));
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _saddleMountMap, SinsalKey.saddleMount));

  // 홍란살 (년지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _redPhoenixMap, SinsalKey.redPhoenix));

  // 천희살 (년지 기준)
  matches.addAll(_checkBranchBasedSinsal(yearBranch, allBranches, positions, _heavenlyJoyMap, SinsalKey.heavenlyJoy));

  // 원진살 (일지 기준)
  matches.addAll(_checkBranchBasedSinsal(dayBranch, allBranches, positions, _wonjinMap, SinsalKey.wonjin));

  // 공망 (일주 기준)
  {
    final sIdx = dayStem.index;
    final bIdx = dayBranch.index;
    final diff = (bIdx - sIdx + 12) % 12;
    final empty1 = Branch.values[(diff + 10) % 12];
    final empty2 = Branch.values[(diff + 11) % 12];

    for (var i = 0; i < allBranches.length; i++) {
      if (allBranches[i] == empty1 || allBranches[i] == empty2) {
        matches.add(SinsalMatch(sinsal: getSinsalLabel(SinsalKey.gongmang), position: positions[i]));
      }
    }
  }

  // Deduplicate
  final seen = <(SinsalKey, PillarPosition)>{};
  final uniqueMatches = <SinsalMatch>[];
  for (final match in matches) {
    final key = (match.sinsal.key, match.position);
    if (seen.add(key)) {
      uniqueMatches.add(match);
    }
  }

  // Build summary
  final summary = <SinsalKey, List<PillarPosition>>{};
  for (final match in uniqueMatches) {
    summary.putIfAbsent(match.sinsal.key, () => []).add(match.position);
  }

  return SinsalResult(matches: uniqueMatches, summary: summary);
}
