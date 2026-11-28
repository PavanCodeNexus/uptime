import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uptime_owner_app/app.dart';
import 'package:uptime_owner_app/core/utils/format_utils.dart';
import 'package:uptime_owner_app/features/providers/owner_providers.dart';

void main() {
  group('UPTIME Owner App Unit & Widget Tests', () {
    test('Clean White default theme & default Peenya facility state', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);
      expect(container.read(themeModeProvider), ThemeMode.light);
      expect(container.read(selectedLocationProvider).label, 'Peenya Factory Unit #4');
    });

    test('Formats Indian Rupees (INR) with lakhs/thousands separators', () {
      expect(FormatUtils.formatInr(850), '₹850');
      expect(FormatUtils.formatInr(1240), '₹1,240');
      expect(FormatUtils.formatInr(100000), '₹1,00,000');
    });

    test('Fatigue-restricted technician is absent from matching results', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final ranked = await container.read(rankedTechniciansProvider('INDUSTRIAL').future);
      expect(ranked.isNotEmpty, true);
      expect(ranked.any((t) => t.isFatigueRestricted), false);
      expect(ranked.any((t) => t.fullName.contains('Suresh Kumar')), false);
    });

    testWidgets('Owner login signs in with OTP 123456 and shows production dashboard without wireframe labels',
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
      expect(find.text('44 Screens'), findsNothing);
      expect(find.text('S01'), findsNothing);
    });
  });
}
