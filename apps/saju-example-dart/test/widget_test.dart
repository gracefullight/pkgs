import 'package:flutter_test/flutter_test.dart';
import 'package:saju_example_dart/main.dart';
import 'package:timezone/data/latest.dart' as tz;

void main() {
  testWidgets(
    'calculates the fixed Seoul birth time independently of the device timezone',
    (tester) async {
      tz.initializeTimeZones();
      await tester.pumpWidget(const MyApp());
      await tester.pumpAndSettle();

      expect(find.text('유'), findsOneWidget);
      expect(find.text('신'), findsOneWidget);
      expect(tester.takeException(), isNull);

      await tester.tap(find.text('Calculate'));
      await tester.pumpAndSettle();

      expect(find.text('유'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
}
