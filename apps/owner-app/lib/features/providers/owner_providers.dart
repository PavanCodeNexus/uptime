import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../models/owner_models.dart';

// ── Selected Industry State ───────────────────────────────────────────────
class SelectedIndustryNotifier extends Notifier<String> {
  @override
  String build() => 'INDUSTRIAL';

  void select(String industry) => state = industry;
}

final selectedIndustryProvider =
    NotifierProvider<SelectedIndustryNotifier, String>(SelectedIndustryNotifier.new);

// ── Auth AsyncNotifier (Riverpod 2.x without codegen) ──────────────────────
class OwnerAuthNotifier extends AutoDisposeAsyncNotifier<OwnerUser?> {
  @override
  Future<OwnerUser?> build() async => null;

  Future<bool> sendOtp(String phone) async {
    final dio = ref.read(dioClientProvider);
    try {
      await dio.post('/auth/send-otp', data: {
        'phone': phone,
        'purpose': 'LOGIN',
      });
    } catch (_) {
      // Offline / dev fallback uses MockOtpProvider (123456)
    }
    return true;
  }

  Future<bool> verifyOtp({
    required String phone,
    required String otp,
    required String industryPreference,
  }) async {
    if (otp != '123456') {
      state = AsyncError('Invalid OTP. Use 123456 in dev/demo mode.', StackTrace.current);
      return false;
    }
    state = const AsyncLoading();
    final dio = ref.read(dioClientProvider);
    final tokenStore = ref.read(tokenStoreProvider);

    state = await AsyncValue.guard(() async {
      try {
        final res = await dio.post('/auth/verify-otp', data: {
          'phone': phone,
          'otp': otp,
          'userType': 'OWNER',
        });
        final data = res.data['data'] as Map<String, dynamic>;
        tokenStore.accessToken = data['accessToken']?.toString();
        final userMap = data['user'] as Map<String, dynamic>? ?? {};
        return OwnerUser(
          id: (userMap['id'] as num?)?.toInt() ?? 1,
          fullName: userMap['fullName']?.toString() ?? 'Pavan B C',
          phone: phone,
          industryPreference: industryPreference,
        );
      } catch (_) {
        tokenStore.accessToken = 'dev-mock-jwt-token';
        return OwnerUser(
          id: 1,
          fullName: 'Pavan B C',
          phone: phone,
          industryPreference: industryPreference,
        );
      }
    });
    ref.read(selectedIndustryProvider.notifier).select(industryPreference);
    return !state.hasError;
  }

  void logout() {
    ref.read(tokenStoreProvider).accessToken = null;
    state = const AsyncData(null);
  }
}

final ownerAuthProvider =
    AsyncNotifierProvider.autoDispose<OwnerAuthNotifier, OwnerUser?>(
  OwnerAuthNotifier.new,
);

// ── Assets List Provider (FutureProvider.autoDispose) ─────────────────────
final ownerAssetsProvider = FutureProvider.autoDispose<List<AssetItem>>((ref) async {
  return const [
    AssetItem(
      id: 101,
      name: 'CNC Haas VF-2 Spindle Unit',
      industry: 'INDUSTRIAL',
      category: 'CNC Milling',
      modelNumber: 'HAAS-VF2-2023',
      healthScore: 84,
      moodScore: 88,
      moodLabel: 'Focused & Stable',
      soundFingerprintStatus: '1,420 Hz — Normal Harmonic Signature',
      silentKillerAlert: 'Minor spindle bearing vibration trend (+4% over 14 days)',
      components: [
        ComponentHealth(name: 'Main Spindle Bearing', healthPercent: 76, predictedDaysLeft: 21),
        ComponentHealth(name: 'Servo Drive Axis X', healthPercent: 94, predictedDaysLeft: 180),
        ComponentHealth(name: 'Coolant Pump Relay', healthPercent: 89, predictedDaysLeft: 120),
      ],
    ),
    AssetItem(
      id: 102,
      name: 'Tata Nexon EV Empowered+',
      industry: 'AUTOMOBILE',
      category: 'Electric SUV',
      modelNumber: 'KA-05-MN-2026',
      healthScore: 92,
      moodScore: 95,
      moodLabel: 'Energetic & Smooth',
      soundFingerprintStatus: 'Inverter whine within OEM tolerance (410 Hz)',
      silentKillerAlert: '12V auxiliary battery voltage dip during cold start (12.1V)',
      components: [
        ComponentHealth(name: 'High-Voltage BMS Contactor', healthPercent: 96, predictedDaysLeft: 320),
        ComponentHealth(name: '12V Auxiliary Battery', healthPercent: 68, predictedDaysLeft: 18),
        ComponentHealth(name: 'Regenerative Brake Sensor', healthPercent: 93, predictedDaysLeft: 240),
      ],
    ),
    AssetItem(
      id: 103,
      name: 'Daikin VRV IV Inverter Chiller',
      industry: 'ELECTRONICS',
      category: 'Commercial HVAC',
      modelNumber: 'RXYQ12T-2024',
      healthScore: 79,
      moodScore: 81,
      moodLabel: 'Working Hard (High Load)',
      soundFingerprintStatus: 'Compressor scroll acoustic match 91%',
      silentKillerAlert: 'Condenser coil delta-T creeping up (+2.3°C)',
      components: [
        ComponentHealth(name: 'Inverter PCB Module', healthPercent: 88, predictedDaysLeft: 150),
        ComponentHealth(name: 'Expansion Valve Solenoid', healthPercent: 72, predictedDaysLeft: 28),
        ComponentHealth(name: 'Blower Capacitor', healthPercent: 84, predictedDaysLeft: 95),
      ],
    ),
  ];
});

// ── Ranked Technicians Provider (40% Skill + 60% Proximity, Fatigue Excluded) ──
final rankedTechniciansProvider = FutureProvider.autoDispose
    .family<List<TechnicianCandidate>, String>((ref, industry) async {
  const allCandidates = [
    TechnicianCandidate(
      id: 201,
      fullName: 'Raju Sharma',
      tradeTitle: 'Master CNC & Industrial Electrician',
      verificationLevel: 3,
      isProvisional: false,
      isFatigueRestricted: false,
      ratingAvg: 4.9,
      jobsCompleted: 312,
      distanceKm: 1.8,
      etaMinutes: 8,
      matchScore: 96.4,
      baseVisitFee: 499,
      skills: ['CNC Spindle', 'PLC & VFD', '3-Phase Relay', 'HV Safety'],
    ),
    TechnicianCandidate(
      id: 202,
      fullName: 'Karthik Gowda',
      tradeTitle: 'EV & Automotive Diagnostic Specialist',
      verificationLevel: 2,
      isProvisional: false,
      isFatigueRestricted: false,
      ratingAvg: 4.8,
      jobsCompleted: 148,
      distanceKm: 2.9,
      etaMinutes: 12,
      matchScore: 91.2,
      baseVisitFee: 399,
      skills: ['OBD-II & CAN Bus', 'EV BMS', 'Alternator & Starter', 'Roadside SOS'],
    ),
    TechnicianCandidate(
      id: 203,
      fullName: 'Mohammed Irfan (Ustad Track B)',
      tradeTitle: 'Experienced HVAC & PCB Technician',
      verificationLevel: 2,
      isProvisional: true, // L2-P Provisional Ustad
      isFatigueRestricted: false,
      ratingAvg: 4.7,
      jobsCompleted: 4,
      distanceKm: 2.1,
      etaMinutes: 9,
      matchScore: 88.5,
      baseVisitFee: 299,
      skills: ['Inverter PCB', 'VRV Chiller', 'Compressor Relay'],
    ),
    TechnicianCandidate(
      id: 204,
      fullName: 'Suresh Kumar (Resting)',
      tradeTitle: 'Senior Industrial Mechanic',
      verificationLevel: 3,
      isProvisional: false,
      isFatigueRestricted: true, // MUST BE EXCLUDED BY FATIGUE RULE!
      ratingAvg: 4.9,
      jobsCompleted: 410,
      distanceKm: 0.9,
      etaMinutes: 5,
      matchScore: 98.0,
      baseVisitFee: 499,
      skills: ['CNC Spindle', 'Hydraulics'],
    ),
  ];

  // Enforce Locked Fatigue Rule: AND is_fatigue_restricted = FALSE
  return allCandidates.where((t) => !t.isFatigueRestricted).toList()
    ..sort((a, b) => b.matchScore.compareTo(a.matchScore));
});

// ── Active & Past Jobs AsyncNotifier (Riverpod 2.x without codegen) ───────
class OwnerJobsNotifier extends AutoDisposeAsyncNotifier<List<OwnerJob>> {
  @override
  Future<List<OwnerJob>> build() async {
    return [
      OwnerJob(
        id: 5001,
        jobNumber: 'UPT-2026-00891',
        industry: 'INDUSTRIAL',
        equipmentSummary: 'CNC Haas VF-2 Spindle Unit',
        problemDescription: 'Spindle bearing high-frequency noise & relay trip under load',
        urgency: 'HIGH',
        status: 'COMPLETED',
        resolutionPath: 'DIRECT_BOOKING',
        arrivalOtp: '123456',
        laborCharge: 900,
        partsCharge: 600,
        discountAmount: 0,
        recordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        isLocked: true,
        userRating: 5,
        createdAt: DateTime(2026, 10, 29, 14, 30),
      ),
    ];
  }

  Future<AIDiagnosisResult> runAiTriage({
    required String industry,
    required String equipment,
    required String description,
    required String urgency,
  }) async {
    final dio = ref.read(dioClientProvider);
    try {
      final res = await dio.post('/ai/diagnose', data: {
        'industry': industry,
        'equipment': equipment,
        'description': description,
        'urgency': urgency,
      });
      return AIDiagnosisResult.fromJson(res.data['data'] as Map<String, dynamic>);
    } catch (_) {
      return AIDiagnosisResult(
        industry: industry,
        predictedCause: 'Primary Relay / Bearing Wear ($equipment)',
        confidenceScore: 87.5,
        severity: urgency,
        diyPossible: urgency != 'EMERGENCY',
        estimatedDurationMin: 45,
        estimatedCostMin: 800,
        estimatedCostMax: 1500,
        recommendedPath: 'AI_COPILOT',
        safetyWarnings: const [
          'Isolate 415V main breaker / disconnect battery negative terminal before inspection.',
          'Verify zero voltage with calibrated multimeter before touching relay contacts.',
        ],
        safeToRun: false,
      );
    }
  }

  Future<OwnerJob> createJobWithPath({
    required String industry,
    required String equipmentSummary,
    required String problemDescription,
    required String urgency,
    required String resolutionPath,
    TechnicianCandidate? tech,
    bool creditVideoFee = false,
  }) async {
    final current = state.valueOrNull ?? const [];
    final newJob = OwnerJob(
      id: 5002 + current.length,
      jobNumber: 'UPT-2026-00${892 + current.length}',
      industry: industry,
      equipmentSummary: equipmentSummary,
      problemDescription: problemDescription,
      urgency: urgency,
      status: resolutionPath == 'AI_COPILOT'
          ? 'COPILOT_ACTIVE'
          : (tech != null ? 'EN_ROUTE' : 'MATCHING'),
      resolutionPath: resolutionPath,
      arrivalOtp: '123456',
      assignedTech: tech,
      discountAmount: creditVideoFee ? 149 : 0,
      videoConsultFeeCredited: creditVideoFee,
      createdAt: DateTime.now(),
    );
    state = AsyncData([newJob, ...current]);
    return newJob;
  }

  void advanceJobStatus(int jobId, String nextStatus) {
    final current = state.valueOrNull ?? const [];
    state = AsyncData(
      current.map((j) {
        if (j.id != jobId) return j;
        if (nextStatus == 'COMPLETED') {
          return j.copyWith(
            status: 'COMPLETED',
            isLocked: true,
            recordHash:
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          );
        }
        return j.copyWith(status: nextStatus);
      }).toList(),
    );
  }

  void rateJob(int jobId, int stars) {
    final current = state.valueOrNull ?? const [];
    state = AsyncData(
      current.map((j) => j.id == jobId ? j.copyWith(userRating: stars) : j).toList(),
    );
  }
}

final ownerJobsProvider =
    AsyncNotifierProvider.autoDispose<OwnerJobsNotifier, List<OwnerJob>>(
  OwnerJobsNotifier.new,
);
