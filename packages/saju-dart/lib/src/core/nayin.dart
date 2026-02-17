import '../types/types.dart';

/// Nayin (납음오행) result
class NayinResult {
  const NayinResult({
    required this.element,
    required this.korean,
    required this.hanja,
  });

  final Element element;
  final String korean;
  final String hanja;
}

/// Four pillars nayin result
class FourPillarsNayin {
  const FourPillarsNayin({
    required this.year,
    required this.month,
    required this.day,
    required this.hour,
  });

  final NayinResult year;
  final NayinResult month;
  final NayinResult day;
  final NayinResult hour;
}

const _nayinData = <int, ({Element element, String korean, String hanja})>{
  0: (element: Element.metal, korean: '해중금', hanja: '海中金'),
  2: (element: Element.fire, korean: '노중화', hanja: '爐中火'),
  4: (element: Element.wood, korean: '대림목', hanja: '大林木'),
  6: (element: Element.earth, korean: '노방토', hanja: '路傍土'),
  8: (element: Element.metal, korean: '검봉금', hanja: '劍鋒金'),
  10: (element: Element.fire, korean: '산두화', hanja: '山頭火'),
  12: (element: Element.water, korean: '간하수', hanja: '澗下水'),
  14: (element: Element.earth, korean: '성두토', hanja: '城頭土'),
  16: (element: Element.metal, korean: '백랍금', hanja: '白蠟金'),
  18: (element: Element.wood, korean: '양류목', hanja: '楊柳木'),
  20: (element: Element.water, korean: '천천수', hanja: '泉中水'),
  22: (element: Element.earth, korean: '옥상토', hanja: '屋上土'),
  24: (element: Element.fire, korean: '벽력화', hanja: '霹靂火'),
  26: (element: Element.wood, korean: '송백목', hanja: '松柏木'),
  28: (element: Element.water, korean: '장류수', hanja: '長流水'),
  30: (element: Element.metal, korean: '사중금', hanja: '砂中金'),
  32: (element: Element.fire, korean: '산하화', hanja: '山下火'),
  34: (element: Element.wood, korean: '평지목', hanja: '平地木'),
  36: (element: Element.earth, korean: '벽상토', hanja: '壁上土'),
  38: (element: Element.metal, korean: '금박금', hanja: '金箔金'),
  40: (element: Element.fire, korean: '복등화', hanja: '覆燈火'),
  42: (element: Element.water, korean: '천하수', hanja: '天河水'),
  44: (element: Element.earth, korean: '대역토', hanja: '大驛土'),
  46: (element: Element.metal, korean: '채천금', hanja: '釵釧金'),
  48: (element: Element.wood, korean: '상자목', hanja: '桑柘木'),
  50: (element: Element.water, korean: '대계수', hanja: '大溪水'),
  52: (element: Element.earth, korean: '사중토', hanja: '砂中土'),
  54: (element: Element.fire, korean: '천상화', hanja: '天上火'),
  56: (element: Element.wood, korean: '석류목', hanja: '石榴木'),
  58: (element: Element.water, korean: '대해수', hanja: '大海水'),
};

/// Get nayin from pillar index (0-59)
NayinResult getNayin(int pillarIdx60) {
  final normalized = ((pillarIdx60 % 60) + 60) % 60;
  final pairIdx = (normalized ~/ 2) * 2;
  final entry = _nayinData[pairIdx];
  if (entry == null) throw ArgumentError('Invalid pillar index: $pillarIdx60');
  return NayinResult(
    element: entry.element,
    korean: entry.korean,
    hanja: entry.hanja,
  );
}

/// Get nayin from a pillar
NayinResult getNayinFromPillar(Pillar pillar) {
  return getNayin(pillar.index);
}

/// Analyze nayin for all four pillars
FourPillarsNayin analyzeFourPillarsNayin(FourPillars pillars) {
  return FourPillarsNayin(
    year: getNayinFromPillar(pillars.year),
    month: getNayinFromPillar(pillars.month),
    day: getNayinFromPillar(pillars.day),
    hour: getNayinFromPillar(pillars.hour),
  );
}
