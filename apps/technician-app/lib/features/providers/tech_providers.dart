import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/kyc_and_fatigue_validators.dart';
import '../models/tech_models.dart';

// ── Matching Pool Filter Function (Enforces Locked Fatigue Rule) ──────────
List<TechnicianProfile> filterEligibleTechniciansForDispatch(
  List<TechnicianProfile> pool, {
  required String jobUrgency,
  required int estimatedJobCostInr,
}) {
  return pool.where((tech) {
    // 1. FATIGUE RULE: Restricted technician is strictly excluded, never scored!
    if (tech.isFatigueRestricted) return false;
    if (!tech.isOnline || !tech.isAvailable) return false;
    if (tech.verificationLevel < 2) return false;

    // 2. PROVISIONAL L2-P GATING: Capped at <= ₹3,000 and non-emergency
    if (tech.isProvisional) {
      if (jobUrgency == 'EMERGENCY' || jobUrgency == 'CRITICAL') return false;
      if (estimatedJobCostInr > 3000) return false;
    }
    return true;
  }).toList();
}

// ── Technician Profile & KYC AsyncNotifier (Riverpod 2.x without codegen) ──
class TechnicianStateNotifier extends AutoDisposeAsyncNotifier<TechnicianProfile?> {
  @override
  Future<TechnicianProfile?> build() async => null;

  Future<void> loginWithOtp(String phone, String otp) async {
    if (otp != '123456') {
      throw ArgumentError('Invalid OTP. Use 123456 in dev/demo mode.');
    }
    state = AsyncData(
      TechnicianProfile(
        id: 201,
        fullName: 'Raju Sharma',
        phone: phone,
        industryType: 'INDUSTRIAL',
        verificationLevel: 2,
        isProvisional: true,
        provisionalCompletedJobs: 4,
        verificationStatus: 'PROVISIONAL',
        isOnline: true,
        isAvailable: true,
        isFatigueRestricted: false,
        fatigueScore: 30,
        consecutiveJobsCount: 3,
        hoursWorkedToday: 4.5,
        ratingAvg: 4.9,
        jobsCompleted: 14,
        todayEarningsInr: 1240,
        weeklyEarningsInr: 8230,
        walletBalanceInr: 4650,
        upiId: 'raju.tech@okaxis',
        aadhaarLast4: '4829',
        livenessVerified: true,
        upiPennyDropVerified: true,
        selectedTradeCode: 'CNC_SPINDLE_TECH',
        selectedTrack: 'EXPERIENCED_USTAD',
        mcqPassed: true,
        videoProofUploaded: true,
        referenceVerified: true,
      ),
    );
  }

  void toggleAvailability(bool online, bool available) {
    final current = state.valueOrNull;
    if (current == null) return;
    if (current.isFatigueRestricted && available) {
      throw StateError(
        'Mandatory rest period active until ${current.fatigueResetAt}. Cannot go available.',
      );
    }
    state = AsyncData(current.copyWith(isOnline: online, isAvailable: available));
  }

  void simulateFatigueLockout({required bool restricted}) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(
      current.copyWith(
        isFatigueRestricted: restricted,
        isAvailable: restricted ? false : true,
        fatigueScore: restricted ? 95 : 25,
        consecutiveJobsCount: restricted ? 6 : 2,
        hoursWorkedToday: restricted ? 10.5 : 3.5,
        fatigueResetAt: restricted ? 'Today + 8h Mandatory Rest' : null,
      ),
    );
  }

  void completeL1Identity({
    required String aadhaarMaskedInput,
    required String upiId,
  }) {
    if (KycAndFatigueValidators.containsFullAadhaarNumber(aadhaarMaskedInput)) {
      throw ArgumentError(
        'Full 12-digit Aadhaar numbers are prohibited under DPDP Act 2023. Provide only last 4 digits.',
      );
    }
    final current = state.valueOrNull;
    if (current == null) return;
    final digits = aadhaarMaskedInput.replaceAll(RegExp(r'[^0-9]'), '');
    final last4 = digits.length >= 4 ? digits.substring(digits.length - 4) : '4829';
    state = AsyncData(
      current.copyWith(
        aadhaarLast4: last4,
        livenessVerified: true,
        upiPennyDropVerified: true,
        upiId: upiId,
        verificationLevel: current.verificationLevel < 1 ? 1 : current.verificationLevel,
      ),
    );
  }

  void selectTradeAndTrack({
    required String tradeCode,
    required String track,
  }) {
    KycAndFatigueValidators.validateTradeTrackSelection(
      tradeCode: tradeCode,
      verificationTrack: track,
    );
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(
      current.copyWith(
        selectedTradeCode: tradeCode,
        selectedTrack: track,
      ),
    );
  }

  void submitSkillProofAndActivateL2P({
    required int totalScore,
    required int safetyCorrect,
  }) {
    final passed = KycAndFatigueValidators.evaluateSkillTest(
      totalScorePercent: totalScore,
      safetyQuestionsCorrect: safetyCorrect,
    );
    if (!passed) {
      throw ArgumentError(
        'Skill test requires >= 70% total score and 2/2 mandatory safety questions.',
      );
    }
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData(
      current.copyWith(
        mcqPassed: true,
        videoProofUploaded: true,
        referenceVerified: true,
        verificationLevel: 2,
        isProvisional: current.selectedTrack == 'EXPERIENCED_USTAD',
        verificationStatus:
            current.selectedTrack == 'EXPERIENCED_USTAD' ? 'PROVISIONAL' : 'VERIFIED',
      ),
    );
  }

  void recordJobCompletedPayout(int payoutInr) {
    final current = state.valueOrNull;
    if (current == null) return;
    final nextProvJobs = current.provisionalCompletedJobs + 1;
    final graduated = current.isProvisional && nextProvJobs >= 5 && current.ratingAvg >= 4.2;
    state = AsyncData(
      current.copyWith(
        jobsCompleted: current.jobsCompleted + 1,
        provisionalCompletedJobs: nextProvJobs,
        isProvisional: graduated ? false : current.isProvisional,
        verificationStatus: graduated ? 'VERIFIED' : current.verificationStatus,
        todayEarningsInr: current.todayEarningsInr + payoutInr,
        weeklyEarningsInr: current.weeklyEarningsInr + payoutInr,
        walletBalanceInr: current.walletBalanceInr + payoutInr,
      ),
    );
  }

  void logout() => state = const AsyncData(null);
}

final technicianStateProvider =
    AsyncNotifierProvider.autoDispose<TechnicianStateNotifier, TechnicianProfile?>(
  TechnicianStateNotifier.new,
);

// ── Active Field Job AsyncNotifier ────────────────────────────────────────
class FieldJobNotifier extends AutoDisposeAsyncNotifier<AssignedFieldJob> {
  @override
  Future<AssignedFieldJob> build() async {
    return const AssignedFieldJob(
      id: 901,
      jobNumber: 'UPT-2026-00891',
      ownerName: 'Pavan Machinery Works',
      ownerAddress: 'Peenya Industrial Area Phase 2, Bengaluru (1.8 km)',
      industry: 'INDUSTRIAL',
      equipmentSummary: 'CNC Haas VF-2 Spindle Unit',
      aiPreDiagnosis: 'Primary Relay / Spindle Bearing Harmonic Wear (87% confidence)',
      urgency: 'HIGH',
      estimatedPayoutInr: 1150,
      surgeBonusInr: 150,
      status: 'REQUESTED',
      checklistSteps: [
        '1. Lockout/Tagout (LOTO) 415V main breaker & verify 0V with multimeter',
        '2. Inspect primary contactor & spindle drive relay terminals',
        '3. Replace worn relay / lubricate bearing & verify < 72 dB at 4,000 RPM',
      ],
    );
  }

  void acceptJob(TechnicianProfile tech) {
    if (tech.isFatigueRestricted) {
      throw StateError('Fatigue-restricted technician cannot accept jobs.');
    }
    if (tech.verificationLevel < 2) {
      throw StateError('Technician must be at least Level 2 verified to accept jobs.');
    }
    final cur = state.valueOrNull!;
    state = AsyncData(cur.copyWith(status: 'EN_ROUTE'));
  }

  void verifyArrivalOtp(String otpInput, {double distanceMeters = 120.0}) {
    if (distanceMeters > 500.0) {
      throw StateError('Outside 500m arrival geofence.');
    }
    if (otpInput != '123456') {
      throw ArgumentError('Invalid 6-digit Arrival OTP.');
    }
    final cur = state.valueOrNull!;
    state = AsyncData(cur.copyWith(status: 'IN_PROGRESS', otpVerified: true));
  }

  void toggleChecklistStep(int index) {
    final cur = state.valueOrNull!;
    final updated = Set<int>.from(cur.completedSteps);
    if (updated.contains(index)) {
      updated.remove(index);
    } else {
      updated.add(index);
    }
    state = AsyncData(cur.copyWith(completedSteps: updated));
  }

  void addSparePart(int priceInr) {
    final cur = state.valueOrNull!;
    state = AsyncData(cur.copyWith(partsTotalInr: cur.partsTotalInr + priceInr));
  }

  void completeJobWithSha256Lock() {
    final cur = state.valueOrNull!;
    state = AsyncData(
      cur.copyWith(
        status: 'COMPLETED',
        sha256RecordHash:
            '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      ),
    );
    ref
        .read(technicianStateProvider.notifier)
        .recordJobCompletedPayout(cur.estimatedPayoutInr + cur.surgeBonusInr);
  }
}

final fieldJobProvider =
    AsyncNotifierProvider.autoDispose<FieldJobNotifier, AssignedFieldJob>(
  FieldJobNotifier.new,
);
