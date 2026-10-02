import 'package:saju/saju.dart';
import 'package:test/test.dart';

void main() {
  group('Daily luck', () {
    test(
      'agrees with the day pillar calculation across leap and year boundaries',
      () {
        for (final (year, month, day) in [
          (1985, 5, 15),
          (1999, 12, 31),
          (2000, 1, 1),
          (2000, 2, 29),
          (2024, 3, 1),
        ]) {
          final result = calculateDailyLuck(year, month, day, day).single;

          expect(result.pillar, dayPillarFromDate(year, month, day));
        }
      },
    );

    test('returns the known 2000-01-01 pillar', () {
      expect(calculateDailyLuck(2000, 1, 1, 1).single.pillar.hanja, '戊午');
    });
  });
}
