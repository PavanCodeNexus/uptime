import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:uptime_technician_app/app.dart';
import 'package:uptime_technician_app/core/utils/kyc_and_fatigue_validators.dart';
import 'package:uptime_technician_app/features/models/tech_models.dart';
import 'package:uptime_technician_app/features/providers/tech_providers.dart';
import 'package:uptime_technician_app/features/screens/tech_40_screens_catalog.dart';

void main() {
  group('UPTIME Technician App — Fatigue Rule & KYC L0-L3 Tests', () {
    test('Restricted technician is absent from matching results', () {
      const activeTech = TechnicianProfile(
        id: 1,
        fullName: 'Raju Active',
        phone: '9880011111',
        industryType: 'INDUSTRIAL',
        verificationLevel: 2,
        isProvisional: false,
        verificationStatus: 'VERIFIED',
        isOnline: true,
        isAvailable: true,
        isFatigueRestricted: false,
        fatigueScore: 20,
        consecutiveJobsCount: 2,
        hoursWorkedToday: 3.0,
        ratingAvg: 4.9,
        jobsCompleted: 50,
        todayEarningsInr: 1200,
        weeklyEarningsInr: 8000,
        walletBalanceInr: 3000,
        upiId: 'raju@okaxis',
      );

      const fatiguedTech = TechnicianProfile(
        id: 2,
        fullName: 'Suresh Fatigued',
        phone: '9880022222',
        industryType: 'INDUSTRIAL',
        verificationLevel: 3,
        isProvisional: false,
        verificationStatus: 'VERIFIED',
        isOnline: true,
        isAvailable: true,
        isFatigueRestricted: true, // Restricted by fatigue rule
        fatigueScore: 95,
        consecutiveJobsCount: 6,
        hoursWorkedToday: 10.5,
        fatigueResetAt: '2026-11-06T23:00:00Z',
        ratingAvg: 5.0,
        jobsCompleted: 200,
        todayEarningsInr: 3400,
        weeklyEarningsInr: 15000,
        walletBalanceInr: 9000,
        upiId: 'suresh@okaxis',
      );

      final results = filterEligibleTechniciansForDispatch(
        [activeTech, fatiguedTech],
        jobUrgency: 'NORMAL',
        estimatedJobCostInr: 1500,
      );

      expect(results.length, 1);
      expect(results.first.id, 1);
      expect(results.any((t) => t.id == 2), false);
    });

    test('DPDP Act 2023 guard rejects full 12-digit Aadhaar numbers', () {
      expect(KycAndFatigueValidators.containsFullAadhaarNumber('1234 5678 9012'), true);
      expect(KycAndFatigueValidators.containsFullAadhaarNumber('XXXX-XXXX-4829'), false);
    });

    test('Regulated trade HV_ELECTRICIAN rejects Track B (EXPERIENCED_USTAD)', () {
      expect(
        () => KycAndFatigueValidators.validateTradeTrackSelection(
          tradeCode: 'HV_ELECTRICIAN',
          verificationTrack: 'EXPERIENCED_USTAD',
        ),
        throwsArgumentError,
      );
    });

    testWidgets('Technician login & dashboard displays earnings and fatigue test toggle',
        (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: UptimeTechnicianApp(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('UPTIME Technician Portal'), findsOneWidget);
      await tester.tap(find.text('Verify OTP & Enter Field App'));
      await tester.pumpAndSettle();

      expect(find.textContaining('Good morning, Raju Sharma!'), findsOneWidget);
      expect(find.textContaining('ONLINE & AVAILABLE'), findsOneWidget);
      expect(find.text('Peenya Industrial Cluster #4'), findsOneWidget);
      expect(find.text('40 Screens'), findsOneWidget);
    });

    test('Complete 40-screen catalog (T01..T40), Clean White default theme & Base Zone', () {
      expect(kTech40Screens.length, 40);
      expect(kTech40Screens.first.code, 'T01');
      expect(kTech40Screens.last.code, 'T40');

      final codes = kTech40Screens.map((s) => s.code).toSet();
      for (var i = 1; i <= 40; i++) {
        final expectedCode = 'T${i.toString().padLeft(2, '0')}';
        expect(codes.contains(expectedCode), true, reason: 'Missing $expectedCode');
      }

      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(techThemeModeProvider), ThemeMode.light);
      expect(
        container.read(techBaseZoneProvider).label,
        'Peenya Industrial Cluster #4',
      );
    });
  });
}
