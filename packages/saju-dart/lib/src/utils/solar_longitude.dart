import 'dart:math' as math;

/// Approximate ΔT (TT - UT) in seconds.
/// Based on polynomial expressions from Meeus / USNO.
double _deltaT(double year) {
  if (year >= 2005 && year < 2050) {
    final t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year >= 1986 && year < 2005) {
    final t = year - 2000;
    return 63.86 +
        0.3345 * t -
        0.060374 * t * t +
        0.0017275 * t * t * t +
        0.000651814 * t * t * t * t +
        0.00002373599 * t * t * t * t * t;
  }
  if (year >= 1900 && year < 1986) {
    final t = year - 1900;
    return -0.02 + 0.000297 * t * t;
  }
  return 0;
}

/// Normalize degree to 0-360 range
double normDeg(double x) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

/// Calculate sun apparent longitude for a given UTC datetime
double sunApparentLongitude(DateTime dtUtc) {
  var y = dtUtc.year;
  var m = dtUtc.month;
  final d = dtUtc.day +
      (dtUtc.hour + (dtUtc.minute + dtUtc.second / 60) / 60) / 24;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  final a = y ~/ 100;
  final b = 2 - a + (a ~/ 4);
  final jd = (365.25 * (y + 4716)).floor() +
      (30.6001 * (m + 1)).floor() +
      d +
      b -
      1524.5;

  // Apply ΔT correction for TT (Terrestrial Time)
  final dtSeconds = _deltaT(y.toDouble());
  final jdTT = jd + dtSeconds / 86400.0;

  final t = (jdTT - 2451545.0) / 36525.0;

  final l0 = normDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  final mAnomaly = normDeg(357.52911 + 35999.05029 * t - 0.0001537 * t * t);

  double deg2rad(double deg) => deg * math.pi / 180;

  final c = (1.914602 - 0.004817 * t - 0.000014 * t * t) *
          math.sin(deg2rad(mAnomaly)) +
      (0.019993 - 0.000101 * t) * math.sin(deg2rad(2 * mAnomaly)) +
      0.000289 * math.sin(deg2rad(3 * mAnomaly));

  final trueLong = l0 + c;
  final omega = 125.04 - 1934.136 * t;
  final lambda = trueLong - 0.00569 - 0.00478 * math.sin(deg2rad(omega));

  return normDeg(lambda);
}

/// Calculate angle difference in degrees
double angleDiffDeg(double a, double b) {
  return ((a - b + 540) % 360) - 180;
}

/// Find UTC datetime when sun reaches target longitude using bisection
DateTime findTermUtc(double targetDeg, DateTime startUtc, DateTime endUtc) {
  var a = startUtc;
  var b = endUtc;

  double f(DateTime dt) => angleDiffDeg(sunApparentLongitude(dt), targetDeg);

  var fa = f(a);
  var fb = f(b);

  var expand = 0;
  while (fa * fb > 0 && expand < 10) {
    a = a.subtract(const Duration(days: 1));
    b = b.add(const Duration(days: 1));
    fa = f(a);
    fb = f(b);
    expand += 1;
  }

  if (fa * fb > 0) {
    throw Exception('Failed to bracket solar term');
  }

  for (var i = 0; i < 80; i++) {
    final midMillis =
        (a.millisecondsSinceEpoch + b.millisecondsSinceEpoch) ~/ 2;
    final mid = DateTime.fromMillisecondsSinceEpoch(midMillis, isUtc: true);

    final fm = f(mid);
    if (fm.abs() < 1e-6) return mid;

    if (fa * fm <= 0) {
      b = mid;
      fb = fm;
    } else {
      a = mid;
      fa = fm;
    }
  }

  final midMillis = (a.millisecondsSinceEpoch + b.millisecondsSinceEpoch) ~/ 2;
  return DateTime.fromMillisecondsSinceEpoch(midMillis, isUtc: true);
}

/// Find Lichun (立春, Start of Spring) UTC datetime for a year
DateTime lichunUtc(int year) {
  final start = DateTime.utc(year, 2, 1);
  final end = DateTime.utc(year, 2, 7);
  return findTermUtc(315.0, start, end);
}
