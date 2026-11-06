import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uptime_owner_app/app.dart';
import 'package:uptime_owner_app/core/utils/format_utils.dart';
import 'package:uptime_owner_app/features/providers/owner_providers.dart';

void main() {
  group('UPTIME Owner App Unit & Widget Tests', () {
    test('Formats Indian Rupees (INR) with lakhs/thousands separators', () {
      expect(FormatUtils.formatInr(850), '₹850');
      expect(FormatUtils.formatInr(1240), '₹1,240');
      expect(FormatUtils.formatInr(100000), '₹1,00,000');
    });

    test('Restricted technician is absent from matching results', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final ranked = await container.read(rankedTechniciansProvider('INDUSTRIAL').future);
      expect(ranked.isNotEmpty, true);
      expect(ranked.any((t) => t.isFatigueRestricted), false);
      expect(ranked.any((t) => t.fullName.contains('Suresh Kumar')), false);
    });

    testWidgets('Owner login screen displays UPTIME tagline and signs in with OTP 123456',
        (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: UptimeOwnerApp(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Downtime ends here.'), findsOneWidget);
      expect(find.text('Send OTP (123456)'), findsOneWidget);

      await tester.tap(find.text('Send OTP (123456)'));
      await tester.pumpAndSettle();

      expect(find.text('Verify OTP & Continue'), findsOneWidget);
      await tester.tap(find.text('Verify OTP & Continue'));
      await tester.pumpAndSettle();

      expect(find.text('Machine, Vehicle or Device Down?'), findsOneWidget);
    });
  });
}
