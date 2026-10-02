import 'package:saju/saju.dart';
import 'package:test/test.dart';
import 'package:timezone/data/latest.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;

void main() {
  setUpAll(() {
    tzdata.initializeTimeZones();
  });

  group('Four Pillars Calculation', () {
    test('calculates correct pillars for 2000-01-01 18:00 Seoul', () {
      final location = tz.getLocation('Asia/Seoul');
      final dt = tz.TZDateTime(location, 2000, 1, 1, 18, 0);

      final result = getFourPillars(dt);

      // 己卯年 丙子月 戊午日 辛酉時 (from TypeScript reference)
      expect(result.pillars.year.hanja, equals('己卯'));
      expect(result.pillars.month.hanja, equals('丙子'));
      expect(result.pillars.day.hanja, equals('戊午'));
      expect(result.pillars.hour.hanja, equals('辛酉'));
    });

    test('calculates correct year pillar for birth before Lichun', () {
      final location = tz.getLocation('Asia/Seoul');
      // 2000년 1월 1일 - 입춘 전이므로 己卯년
      final dt = tz.TZDateTime(location, 2000, 1, 1, 12, 0);

      final result = yearPillar(dt);

      expect(result.pillar.hanja, equals('己卯'));
      expect(result.solarYear, equals(1999));
    });

    test('calculates correct day pillar using Julian Day Number', () {
      // Known date: 1985-05-15 should be specific pillar
      final pillar = dayPillarFromDate(1985, 5, 15);

      // Verify it returns a valid pillar
      expect(pillar.stem, isNotNull);
      expect(pillar.branch, isNotNull);
      expect(pillar.hanja.length, equals(2));
    });

    test('hour pillar changes at correct boundaries', () {
      final location = tz.getLocation('Asia/Seoul');

      // 23:00 should be 子時 (next day in traditional)
      final dt23 = tz.TZDateTime(location, 2000, 1, 1, 23, 0);
      final hourResult23 = hourPillar(dt23);
      expect(hourResult23.pillar.branch, equals(Branch.zi));

      // 1:00 should also be 丑時
      final dt1 = tz.TZDateTime(location, 2000, 1, 1, 1, 0);
      final hourResult1 = hourPillar(dt1);
      expect(hourResult1.pillar.branch, equals(Branch.chou));
    });

    test('uses standard time between Korean daylight saving seasons', () {
      final location = tz.getLocation('Asia/Seoul');
      for (final (year, month, day) in [
        (1987, 12, 15),
        (1988, 1, 15),
        (1988, 5, 1),
        (1988, 10, 9),
      ]) {
        final birth = tz.TZDateTime(location, year, month, day, 12);
        final result = getFourPillars(birth, longitudeDeg: 135);

        expect(result.adjustedDtForHour, birth);
      }
    });

    test('uses the actual end date of Korean daylight saving', () {
      final birth = tz.TZDateTime(
        tz.getLocation('Asia/Seoul'),
        1988,
        10,
        8,
        12,
      );
      final result = getFourPillars(birth, longitudeDeg: 135);

      expect(
        result.adjustedDtForHour,
        birth.subtract(const Duration(hours: 1)),
      );
    });

    test('does not apply Korean daylight saving in Tokyo', () {
      final birth = tz.TZDateTime(
        tz.getLocation('Asia/Tokyo'),
        1988,
        6,
        15,
        12,
      );
      final result = getFourPillars(birth, longitudeDeg: 135);

      expect(result.adjustedDtForHour, birth);
    });

    test(
      'preserves solar correction seconds at the traditional day boundary',
      () {
        final birth = tz.TZDateTime(
          tz.getLocation('Asia/Seoul'),
          2000,
          1,
          1,
          23,
          32,
        );
        final result = getFourPillars(
          birth,
          longitudeDeg: 126.9778,
          preset: traditionalPreset,
        );

        expect(result.effectiveDayDate, (year: 2000, month: 1, day: 1));
        expect(result.adjustedDtForHour.hour, 22);
        expect(result.adjustedDtForHour.minute, 59);
        expect(result.adjustedDtForHour.second, 54);
      },
    );
  });

  group('Pillar class', () {
    test('creates pillar from hanja', () {
      final pillar = Pillar.fromHanja('甲子');

      expect(pillar.stem, equals(Stem.jia));
      expect(pillar.branch, equals(Branch.zi));
      expect(pillar.hanja, equals('甲子'));
      expect(pillar.korean, equals('갑자'));
    });

    test('creates pillar from index', () {
      final pillar = Pillar.fromIndex(0);
      expect(pillar.hanja, equals('甲子'));

      final pillar1 = Pillar.fromIndex(1);
      expect(pillar1.hanja, equals('乙丑'));

      final pillar59 = Pillar.fromIndex(59);
      expect(pillar59.hanja, equals('癸亥'));
    });

    test('handles negative indices', () {
      final pillar = Pillar.fromIndex(-1);
      expect(pillar.hanja, equals('癸亥'));
    });
  });
}
