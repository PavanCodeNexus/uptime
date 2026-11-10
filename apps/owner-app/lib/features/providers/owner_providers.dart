import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/dio_client.dart';
import '../models/owner_models.dart';

// ── Theme Mode Provider (Clean White Default — Urban Company / Zomato Style) ──
class ThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() => ThemeMode.light; // Modern Clean White default

  void toggle() {
    state = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
  }
}

final themeModeProvider =
    NotifierProvider<ThemeModeNotifier, ThemeMode>(ThemeModeNotifier.new);

// ── Zomato / BigBasket Top Location Address State ─────────────────────────
class SelectedLocation {
  final String label;
  final String addressLine;
  final String areaCluster;
  final String etaBadge;

  const SelectedLocation({
    required this.label,
    required this.addressLine,
    required this.areaCluster,
    required this.etaBadge,
  });
}

class SelectedLocationNotifier extends Notifier<SelectedLocation> {
  @override
  SelectedLocation build() => const SelectedLocation(
        label: 'Peenya Factory Unit #4',
        addressLine: 'Plot 42-B, Peenya Industrial Area Stage IV, Bengaluru 560058',
        areaCluster: 'Peenya Industrial Cluster',
        etaBadge: '12 mins SLA',
      );

  void selectLocation(SelectedLocation loc) => state = loc;
}

final selectedLocationProvider =
    NotifierProvider<SelectedLocationNotifier, SelectedLocation>(
        SelectedLocationNotifier.new);

// ── Selected Industry State ───────────────────────────────────────────────
class SelectedIndustryNotifier extends Notifier<String> {
  @override
  String build() => 'INDUSTRIAL';

  void select(String industry) => state = industry;
}

final selectedIndustryProvider =
    NotifierProvider<SelectedIndustryNotifier, String>(SelectedIndustryNotifier.new);

// ── Selected Language State (9 Indian Languages - PLT-07 / ELEC-U04) ──────
class SelectedLanguageNotifier extends Notifier<String> {
  @override
  String build() => 'EN • English';

  void select(String lang) => state = lang;
}

final selectedLanguageProvider =
    NotifierProvider<SelectedLanguageNotifier, String>(SelectedLanguageNotifier.new);

// ── Shopping Cart State (ELEC-C06 / ELEC-C10) ─────────────────────────────
class CartNotifier extends Notifier<List<MarketplaceItem>> {
  @override
  List<MarketplaceItem> build() => const [];

  void addItem(MarketplaceItem item) {
    state = [...state, item];
  }

  void removeItem(String id) {
    final idx = state.indexWhere((e) => e.id == id);
    if (idx != -1) {
      final copy = [...state];
      copy.removeAt(idx);
      state = copy;
    }
  }

  void clear() => state = const [];
}

final cartProvider =
    NotifierProvider<CartNotifier, List<MarketplaceItem>>(CartNotifier.new);

// ── Auth AsyncNotifier ────────────────────────────────────────────────────
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
    } catch (_) {}
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
          email: userMap['email']?.toString() ?? 'pavan@uptime.in',
          industryPreference: industryPreference,
          city: 'Bengaluru, KA',
        );
      } catch (_) {
        tokenStore.accessToken = 'dev-mock-jwt-owner-token';
        return OwnerUser(
          id: 1,
          fullName: 'Pavan B C',
          phone: phone,
          email: 'pavan@uptime.in',
          industryPreference: industryPreference,
          city: 'Peenya & Electronic City, Bengaluru',
        );
      }
    });
    return state.hasValue && state.value != null;
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

// ── Assets & Digital Twin Provider ────────────────────────────────────────
class AssetsNotifier extends AutoDisposeAsyncNotifier<List<AssetItem>> {
  @override
  Future<List<AssetItem>> build() async {
    return const [
      AssetItem(
        id: 101,
        name: 'Mazak CNC Turning Center #4',
        category: 'INDUSTRIAL',
        modelNumber: 'QT-Compact-200MY',
        healthScore: 87,
        moodScore: 84,
        moodLabel: 'Productive — Minor Spindle Harmonic Drift',
        lastServiceDate: '14/09/2026',
        nextPredictedService: '24/11/2026 (18 days)',
        silentKillerAlert: 'Spindle bearing acoustic harmonic +4.2 dB above baseline (89% confidence)',
        healthHistory: [96, 94, 92, 90, 88, 87],
        components: [
          ComponentHealth(
            name: 'Main Spindle Bearing',
            healthPercent: 72,
            status: 'WARNING',
            predictedFailureWindow: '18 days (₹850–₹1,400)',
            telemetryReading: '68.4°C · 4.2 mm/s RMS',
          ),
          ComponentHealth(
            name: 'Servo Drive Amplifier',
            healthPercent: 95,
            status: 'HEALTHY',
            predictedFailureWindow: '180+ days',
            telemetryReading: '41.2°C · 400V DC Bus',
          ),
          ComponentHealth(
            name: 'Hydraulic Chuck Pressure',
            healthPercent: 91,
            status: 'HEALTHY',
            predictedFailureWindow: '120+ days',
            telemetryReading: '34.5 bar steady',
          ),
          ComponentHealth(
            name: 'Coolant Recirculation Pump',
            healthPercent: 88,
            status: 'HEALTHY',
            predictedFailureWindow: '95 days',
            telemetryReading: '18.2 L/min flow',
          ),
        ],
      ),
      AssetItem(
        id: 102,
        name: 'Tata Nexon EV Empowered+ LR',
        category: 'AUTOMOBILE',
        modelNumber: 'KA-01-MJ-2026',
        healthScore: 93,
        moodScore: 92,
        moodLabel: 'Energetic — Optimal Cell Balancing',
        lastServiceDate: '02/10/2026',
        nextPredictedService: '15/01/2027',
        silentKillerAlert: '12V auxiliary AGM battery parasitic standby draw 65mA',
        healthHistory: [95, 95, 94, 94, 93, 93],
        components: [
          ComponentHealth(
            name: '40.5 kWh HV Traction Pack',
            healthPercent: 97,
            status: 'HEALTHY',
            predictedFailureWindow: '365+ days',
            telemetryReading: 'SOH 97.4% · 31.8°C',
          ),
          ComponentHealth(
            name: '12V Auxiliary Battery',
            healthPercent: 68,
            status: 'WARNING',
            predictedFailureWindow: '28 days (₹4,200)',
            telemetryReading: '12.1V resting',
          ),
          ComponentHealth(
            name: 'Regenerative Brake Pads',
            healthPercent: 91,
            status: 'HEALTHY',
            predictedFailureWindow: '14,000 km',
            telemetryReading: '7.8 mm pad thickness',
          ),
          ComponentHealth(
            name: 'Liquid Thermal Loop',
            healthPercent: 94,
            status: 'HEALTHY',
            predictedFailureWindow: '210+ days',
            telemetryReading: 'Glycol pH 7.6 nominal',
          ),
        ],
      ),
      AssetItem(
        id: 103,
        name: 'Daikin 1.8T VRV Smart Inverter AC',
        category: 'ELECTRONICS',
        modelNumber: 'FTKF60TV16U',
        healthScore: 79,
        moodScore: 74,
        moodLabel: 'Stressed — High Compressor Head Pressure',
        lastServiceDate: '10/05/2026',
        nextPredictedService: '12/11/2026 (6 days)',
        silentKillerAlert: 'Silent Killer: Dirty condenser coil adding ₹460/month in excess power draw',
        healthHistory: [94, 90, 86, 84, 81, 79],
        components: [
          ComponentHealth(
            name: 'Outdoor Condenser Fin Pack',
            healthPercent: 61,
            status: 'WARNING',
            predictedFailureWindow: 'Needs jet wash within 7 days',
            telemetryReading: '+8.4°C subcooling delta',
          ),
          ComponentHealth(
            name: 'Inverter IPM PCB Module',
            healthPercent: 92,
            status: 'HEALTHY',
            predictedFailureWindow: '240+ days',
            telemetryReading: '231V AC · THD 2.4%',
          ),
          ComponentHealth(
            name: 'R-32 Refrigerant Charge',
            healthPercent: 86,
            status: 'HEALTHY',
            predictedFailureWindow: '150+ days',
            telemetryReading: '118 PSI suction',
          ),
        ],
      ),
    ];
  }

  void addAsset({
    required String name,
    required String category,
    required String modelNumber,
  }) {
    final current = state.valueOrNull ?? const [];
    final newAsset = AssetItem(
      id: DateTime.now().millisecondsSinceEpoch % 100000,
      name: name,
      category: category,
      modelNumber: modelNumber,
      healthScore: 98,
      moodScore: 96,
      moodLabel: 'Thriving — Newly Registered Digital Twin',
      lastServiceDate: '06/11/2026',
      nextPredictedService: '06/05/2027',
      silentKillerAlert: 'No anomalies detected — baseline telemetry active',
      components: const [
        ComponentHealth(
          name: 'Primary Drive / Core Unit',
          healthPercent: 99,
          status: 'HEALTHY',
          predictedFailureWindow: '365+ days',
          telemetryReading: 'Baseline calibrated',
        ),
        ComponentHealth(
          name: 'Power & Control Module',
          healthPercent: 97,
          status: 'HEALTHY',
          predictedFailureWindow: '300+ days',
          telemetryReading: 'Nominal voltage',
        ),
      ],
    );
    state = AsyncData([newAsset, ...current]);
  }
}

final ownerAssetsProvider =
    AsyncNotifierProvider.autoDispose<AssetsNotifier, List<AssetItem>>(
  AssetsNotifier.new,
);

// ── Smart Matching Provider (40% Distance + 60% Skill, Fatigue Excluded) ──
final rankedTechniciansProvider = FutureProvider.autoDispose
    .family<List<TechnicianCandidate>, String>((ref, industry) async {
  const allCandidates = [
    TechnicianCandidate(
      id: 201,
      fullName: 'Raju Sharma',
      industry: 'INDUSTRIAL',
      tradeTitle: 'Master CNC & HV Industrial Electrician',
      verificationLevel: 3,
      isProvisional: false,
      isFatigueRestricted: false,
      rating: 4.9,
      jobsCompleted: 312,
      distanceKm: 1.8,
      etaMinutes: 7,
      matchScore: 96.5,
      estimatedQuoteInr: 1200,
      badges: ['L3 Master Tech', 'CEA HV Licensed', 'Polygon NFT #409', 'Zero Rework'],
    ),
    TechnicianCandidate(
      id: 202,
      fullName: 'Karthik Gowda',
      industry: 'INDUSTRIAL',
      tradeTitle: 'PLC, Servo & VFD Automation Specialist',
      verificationLevel: 2,
      isProvisional: false,
      isFatigueRestricted: false,
      rating: 4.8,
      jobsCompleted: 148,
      distanceKm: 3.1,
      etaMinutes: 12,
      matchScore: 91.0,
      estimatedQuoteInr: 950,
      badges: ['L2 Verified', 'Siemens/Fanuc Certified', 'Polygon NFT #512'],
    ),
    TechnicianCandidate(
      id: 203,
      fullName: 'Arun Prakash',
      industry: 'AUTOMOBILE',
      tradeTitle: 'EV High-Voltage & CAN-Bus Diagnostic Lead',
      verificationLevel: 2,
      isProvisional: true,
      isFatigueRestricted: false,
      rating: 4.7,
      jobsCompleted: 4,
      distanceKm: 2.2,
      etaMinutes: 9,
      matchScore: 88.4,
      estimatedQuoteInr: 850,
      badges: ['L2-P Provisional (4/5)', 'EV HV Gloves Certified'],
    ),
    TechnicianCandidate(
      id: 204,
      fullName: 'Mohammed Irfan',
      industry: 'ELECTRONICS',
      tradeTitle: 'Inverter PCB & Smart HVAC Specialist',
      verificationLevel: 3,
      isProvisional: false,
      isFatigueRestricted: false,
      rating: 4.9,
      jobsCompleted: 274,
      distanceKm: 1.5,
      etaMinutes: 6,
      matchScore: 95.8,
      estimatedQuoteInr: 750,
      badges: ['L3 Master Tech', 'R-32 Gas Certified', 'Polygon NFT #188'],
    ),
    TechnicianCandidate(
      id: 299,
      fullName: 'Suresh Kumar (Resting)',
      industry: 'INDUSTRIAL',
      tradeTitle: 'Senior Millwright',
      verificationLevel: 3,
      isProvisional: false,
      isFatigueRestricted: true, // MUST BE FILTERED OUT BY FATIGUE RULE
      rating: 5.0,
      jobsCompleted: 500,
      distanceKm: 0.4,
      etaMinutes: 2,
      matchScore: 99.0,
      estimatedQuoteInr: 900,
      badges: ['Fatigue Restricted'],
    ),
  ];

  // Enforce Fatigue Rule: strictly exclude fatigue-restricted technicians
  return allCandidates.where((t) => !t.isFatigueRestricted).toList()
    ..sort((a, b) => b.matchScore.compareTo(a.matchScore));
});

// ── Active & Past Jobs Notifier ───────────────────────────────────────────
class OwnerJobsNotifier extends AutoDisposeAsyncNotifier<List<OwnerJob>> {
  @override
  Future<List<OwnerJob>> build() async {
    return const [
      OwnerJob(
        id: 5001,
        jobNumber: 'UPT-2026-05001',
        title: 'Mazak CNC Spindle Bearing Harmonic & Contactor Replacement',
        industry: 'INDUSTRIAL',
        resolutionPath: 'PATH_C_DIRECT_TECH',
        status: 'EN_ROUTE',
        urgency: 'HIGH',
        technicianName: 'Raju Sharma',
        technicianPhone: '9845012345',
        technicianRating: 4.9,
        etaMinutes: 7,
        distanceMeters: 180.0,
        arrivalOtp: '123456',
        arrivalOtpVerified: false,
        laborCharge: 950.0,
        partsCharge: 450.0,
        videoConsultFeeCredited: false,
        createdAt: '06/11/2026',
      ),
      OwnerJob(
        id: 4988,
        jobNumber: 'UPT-2026-04988',
        title: 'Daikin VRV Inverter PCB & Condenser Deep Cleaning',
        industry: 'ELECTRONICS',
        resolutionPath: 'ESCALATED_FROM_VIDEO',
        status: 'COMPLETED',
        urgency: 'MEDIUM',
        technicianName: 'Mohammed Irfan',
        technicianPhone: '9880112233',
        technicianRating: 4.9,
        etaMinutes: 0,
        distanceMeters: 0.0,
        arrivalOtp: '123456',
        arrivalOtpVerified: true,
        laborCharge: 650.0,
        partsCharge: 320.0,
        videoConsultFeeCredited: true,
        recordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        isLocked: true,
        createdAt: '29/10/2026',
        userRating: 5,
      ),
    ];
  }

  Future<OwnerJob> createJobWithPath({
    required String title,
    required String industry,
    required String urgency,
    required String resolutionPath,
    required TechnicianCandidate technician,
    bool videoConsultCredited = false,
    double? negotiatedQuoteInr,
  }) async {
    final current = state.valueOrNull ?? const [];
    final newJob = OwnerJob(
      id: 5000 + current.length + 1,
      jobNumber: 'UPT-2026-0500${current.length + 2}',
      title: title,
      industry: industry,
      resolutionPath: resolutionPath,
      status: 'EN_ROUTE',
      urgency: urgency,
      technicianName: technician.fullName,
      technicianPhone: '9845099887',
      technicianRating: technician.rating,
      etaMinutes: technician.etaMinutes,
      distanceMeters: 140.0,
      arrivalOtp: '123456',
      arrivalOtpVerified: false,
      laborCharge: negotiatedQuoteInr ?? technician.estimatedQuoteInr,
      partsCharge: 350.0,
      videoConsultFeeCredited: videoConsultCredited,
      createdAt: '06/11/2026',
    );
    state = AsyncData([newJob, ...current]);
    return newJob;
  }

  bool verifyArrivalOtp(int jobId, String otpInput) {
    final current = state.valueOrNull ?? const [];
    if (otpInput.trim() != '123456') return false;
    state = AsyncData(
      current.map((job) {
        if (job.id != jobId || job.distanceMeters > 500.0) return job;
        return OwnerJob(
          id: job.id,
          jobNumber: job.jobNumber,
          title: job.title,
          industry: job.industry,
          resolutionPath: job.resolutionPath,
          status: 'IN_PROGRESS',
          urgency: job.urgency,
          technicianName: job.technicianName,
          technicianPhone: job.technicianPhone,
          technicianRating: job.technicianRating,
          etaMinutes: 0,
          distanceMeters: job.distanceMeters,
          arrivalOtp: job.arrivalOtp,
          arrivalOtpVerified: true,
          laborCharge: job.laborCharge,
          partsCharge: job.partsCharge,
          videoConsultFeeCredited: job.videoConsultFeeCredited,
          createdAt: job.createdAt,
        );
      }).toList(),
    );
    return true;
  }

  void completeAndLockJob(int jobId) {
    final current = state.valueOrNull ?? const [];
    state = AsyncData(
      current.map((job) {
        if (job.id != jobId) return job;
        return OwnerJob(
          id: job.id,
          jobNumber: job.jobNumber,
          title: job.title,
          industry: job.industry,
          resolutionPath: job.resolutionPath,
          status: 'COMPLETED',
          urgency: job.urgency,
          technicianName: job.technicianName,
          technicianPhone: job.technicianPhone,
          technicianRating: job.technicianRating,
          etaMinutes: 0,
          distanceMeters: 0,
          arrivalOtp: job.arrivalOtp,
          arrivalOtpVerified: true,
          laborCharge: job.laborCharge,
          partsCharge: job.partsCharge,
          videoConsultFeeCredited: job.videoConsultFeeCredited,
          recordHash: 'sha256_b42d9bb8f0012a4c99e1d7f84c2026uptime${job.id}verified',
          isLocked: true,
          createdAt: job.createdAt,
          userRating: job.userRating,
        );
      }).toList(),
    );
  }

  void rateJob(int jobId, int stars) {
    final current = state.valueOrNull ?? const [];
    state = AsyncData(
      current.map((job) {
        if (job.id != jobId) return job;
        return OwnerJob(
          id: job.id,
          jobNumber: job.jobNumber,
          title: job.title,
          industry: job.industry,
          resolutionPath: job.resolutionPath,
          status: job.status,
          urgency: job.urgency,
          technicianName: job.technicianName,
          technicianPhone: job.technicianPhone,
          technicianRating: job.technicianRating,
          etaMinutes: job.etaMinutes,
          distanceMeters: job.distanceMeters,
          arrivalOtp: job.arrivalOtp,
          arrivalOtpVerified: job.arrivalOtpVerified,
          laborCharge: job.laborCharge,
          partsCharge: job.partsCharge,
          videoConsultFeeCredited: job.videoConsultFeeCredited,
          recordHash: job.recordHash,
          isLocked: job.isLocked,
          createdAt: job.createdAt,
          userRating: stars,
        );
      }).toList(),
    );
  }
}

final ownerJobsProvider =
    AsyncNotifierProvider.autoDispose<OwnerJobsNotifier, List<OwnerJob>>(
  OwnerJobsNotifier.new,
);

// ── AI Fault Diagnosis Provider ───────────────────────────────────────────
final aiDiagnosisProvider = FutureProvider.autoDispose
    .family<AIDiagnosisResult, String>((ref, description) async {
  return const AIDiagnosisResult(
    faultCategory: 'Spindle Angular Contact Bearing Wear & Contactor Chattering',
    severity: 'HIGH',
    confidence: 0.92,
    estimatedMinInr: 850.0,
    estimatedMaxInr: 1650.0,
    probableRootCause:
        'Gemini 1.5 Flash Multimodal Analysis: 3.8 kHz acoustic harmonic spike indicates outer-race brinelling on spindle bearing + M65 magnetic contactor coil thermal drop.',
    soundFingerprintMatch: '94.2% Acoustic Match — SKF 7014 CD/P4A Bearing Signature',
    diyRecommended: true,
    copilotSteps: [
      'Step 1 (LOTO Safety): Engage main 415V 3-phase rotary isolator and verify 0V with CAT-IV multimeter.',
      'Step 2 (Thermal Check): Inspect M65 contactor terminals L1/L2/L3 for carbon pitting or loose torque.',
      'Step 3 (DC Bus Check): Measure VFD DC bus capacitor bleed-down (< 15V DC) before opening drive bay.',
      'Step 4 (Acoustic Verification): Run spindle at 500 RPM no-load to confirm vibration < 1.8 mm/s RMS.',
    ],
    requiredTools: ['CAT-IV True-RMS Multimeter', 'Insulated Torque Screwdriver', 'SKF Bearing Puller'],
    safetyWarnings: [
      'CRITICAL LOTO: Disconnect 415V 3-Phase supply and wait 180s for VFD capacitor discharge.',
      'Wear Arc-Flash PPE (Class 1 gloves) before probing cabinet.',
    ],
  );
});

// ── Marketplace Catalog Provider ──────────────────────────────────────────
final marketplaceCatalogProvider = Provider<List<MarketplaceItem>>((ref) {
  return const [
    MarketplaceItem(
      id: 'MP-01',
      name: 'SKF 7014 CD/P4A High-Precision CNC Spindle Bearing',
      category: 'SPARE_PART',
      industry: 'INDUSTRIAL',
      qualityBadge: 'OEM Genuine • QR Verified',
      compatibility: 'Mazak QT, Haas ST-20, DMG Mori, Jyoti CNC',
      priceInr: 4250,
      mrpInr: 5600,
      warrantyMonths: 12,
    ),
    MarketplaceItem(
      id: 'MP-02',
      name: 'Schneider TeSys Deca 3P 65A 240V AC Contactor',
      category: 'SPARE_PART',
      industry: 'INDUSTRIAL',
      qualityBadge: 'OEM Genuine • ISI Marked',
      compatibility: 'Universal 3-Phase Control Panels (30kW)',
      priceInr: 1890,
      mrpInr: 2450,
      warrantyMonths: 18,
    ),
    MarketplaceItem(
      id: 'MP-03',
      name: 'Exide Mileage AGM 12V 45Ah Auxiliary EV Battery',
      category: 'SPARE_PART',
      industry: 'AUTOMOBILE',
      qualityBadge: 'OEM Spec • Zero Maintenance',
      compatibility: 'Tata Nexon EV, MG ZS EV, BYD Atto 3',
      priceInr: 4400,
      mrpInr: 5200,
      warrantyMonths: 36,
    ),
    MarketplaceItem(
      id: 'MP-04',
      name: 'Daikin Genuine VRV Inverter IPM Outdoor PCB Assembly',
      category: 'SPARE_PART',
      industry: 'ELECTRONICS',
      qualityBadge: 'OEM Genuine • Anti-Surge Coated',
      compatibility: 'Daikin FTKF / FTHT 1.5T & 1.8T R-32 Series',
      priceInr: 3650,
      mrpInr: 4900,
      warrantyMonths: 12,
    ),
    MarketplaceItem(
      id: 'MP-05',
      name: 'Fluke 17B+ Digital Multimeter (CAT-III 600V)',
      category: 'TOOL',
      industry: 'INDUSTRIAL',
      qualityBadge: 'Pro Calibration Certified',
      compatibility: 'Industrial, EV & PCB Diagnostics',
      priceInr: 9800,
      mrpInr: 11500,
      warrantyMonths: 24,
    ),
    MarketplaceItem(
      id: 'MP-06',
      name: 'ThinkPad T14 Gen 3 i7-1260P 16GB/512GB NVMe (Refurbished)',
      category: 'REFURBISHED',
      industry: 'ELECTRONICS',
      qualityBadge: 'Grade A+ Certified • 50-Point Tested',
      compatibility: 'Includes 6-Month UPTIME Shield Warranty',
      priceInr: 34900,
      mrpInr: 78000,
      warrantyMonths: 6,
    ),
  ];
});

// ── Crowdsourced Repair Wiki Provider (IND-U10 / ELEC-U03) ────────────────
final wikiArticlesProvider = Provider<List<WikiArticleItem>>((ref) {
  return const [
    WikiArticleItem(
      id: 'WIKI-101',
      title: 'Fixing Fanuc / Mazak Alarm 414: X-Axis Servo High Current Drift',
      industry: 'INDUSTRIAL',
      authorTech: 'Raju Sharma (L3 Master)',
      helpfulCount: 418,
      readTime: '4 min read',
      summary: 'Step-by-step isolation between servo amplifier IGBT module short vs motor encoder cable coolant ingress.',
      steps: [
        'Power down 415V isolator and disconnect U/V/W motor leads from servo drive.',
        'Measure phase-to-ground insulation resistance using 500V Megger (must be > 100 MOhm).',
        'Inspect Amphenol encoder connector for coolant condensation; clean with IPA 99.9% spray.',
      ],
    ),
    WikiArticleItem(
      id: 'WIKI-102',
      title: 'Tata Nexon EV "HV System Critical Alert" After Monsoon Water Wading',
      industry: 'AUTOMOBILE',
      authorTech: 'Arun Prakash (EV Specialist)',
      helpfulCount: 289,
      readTime: '3 min read',
      summary: 'How to diagnose Isolation Monitoring Device (IMD) fault codes vs 12V auxiliary voltage sag.',
      steps: [
        'Check 12V auxiliary battery resting voltage first — < 11.8V triggers false HV contactor lockout.',
        'Scan OBD-II CAN bus for BMS code P0AA6 (Hybrid Battery Voltage System Isolation Fault).',
        'Inspect orange HV interlock loop (HVIL) plug under front subframe for moisture.',
      ],
    ),
    WikiArticleItem(
      id: 'WIKI-103',
      title: 'Daikin Inverter AC Error Code U4 / L5: Communication vs IPM Fault',
      industry: 'ELECTRONICS',
      authorTech: 'Mohammed Irfan (L3 Master)',
      helpfulCount: 512,
      readTime: '3 min read',
      summary: 'Distinguishing between ₹150 signal wire break and ₹3,800 outdoor inverter PCB failure.',
      steps: [
        'Measure fluctuating DC pulse voltage (12V–24V DC) between terminal S2 and S3.',
        'Test compressor U-V-W windings for balanced 1.4 Ohm resistance before replacing IPM board.',
      ],
    ),
  ];
});
