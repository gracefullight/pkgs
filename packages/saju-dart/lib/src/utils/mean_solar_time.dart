import 'package:timezone/timezone.dart' as tz;

/// Apply mean solar time correction based on longitude
tz.TZDateTime applyMeanSolarTime(
  tz.TZDateTime dtLocal,
  double longitudeDeg, {
  double tzOffsetHours = 9.0,
}) {
  final deltaMicroseconds =
      (4 * (longitudeDeg - 15 * tzOffsetHours) * Duration.microsecondsPerMinute)
          .round();
  return dtLocal.add(Duration(microseconds: deltaMicroseconds));
}

/// Get timezone offset hours from location name
double getTimezoneOffsetHours(tz.Location location, tz.TZDateTime dt) {
  return dt.timeZoneOffset.inMinutes / 60.0;
}
