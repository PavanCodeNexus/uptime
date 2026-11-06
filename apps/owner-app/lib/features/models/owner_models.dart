class OwnerUser {
  final int id;
  final String fullName;
  final String phone;
  final String industryPreference;
  final int greenPointsBalance;
  final double carbonCreditsKg;

  const OwnerUser({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.industryPreference,
    this.greenPointsBalance = 420,
    this.carbonCreditsKg = 18.5,
  });
}

class AssetItem {
  final int id;
  final String name;
  final String industry; // INDUSTRIAL | AUTOMOBILE | ELECTRONICS
  final String category;
  final String modelNumber;
  final int healthScore; // 0-100
  final int moodScore; // Vehicle/Machine Mood Score ⭐
  final String moodLabel;
  final String soundFingerprintStatus; // Engine Sound Fingerprint ⭐
  final String silentKillerAlert; // Silent Killer Detection ⭐
  final List<ComponentHealth> components;

  const AssetItem({
    required this.id,
    required this.name,
    required this.industry,
    required this.category,
    required this.modelNumber,
    required this.healthScore,
    required this.moodScore,
    required this.moodLabel,
    required this.soundFingerprintStatus,
    required this.silentKillerAlert,
    required this.components,
  });
}

class ComponentHealth {
  final String name;
  final int healthPercent;
  final int predictedDaysLeft;

  const ComponentHealth({
    required this.name,
    required this.healthPercent,
    required this.predictedDaysLeft,
  });
}

class AIDiagnosisResult {
  final String industry;
  final String predictedCause;
  final double confidenceScore;
  final String severity;
  final bool diyPossible;
  final int estimatedDurationMin;
  final int estimatedCostMin;
  final int estimatedCostMax;
  final String recommendedPath; // AI_COPILOT | VIDEO_CONSULT | DIRECT_BOOKING
  final List<String> safetyWarnings;
  final bool safeToRun;

  const AIDiagnosisResult({
    required this.industry,
    required this.predictedCause,
    required this.confidenceScore,
    required this.severity,
    required this.diyPossible,
    required this.estimatedDurationMin,
    required this.estimatedCostMin,
    required this.estimatedCostMax,
    required this.recommendedPath,
    required this.safetyWarnings,
    this.safeToRun = false,
  });

  factory AIDiagnosisResult.fromJson(Map<String, dynamic> json) {
    return AIDiagnosisResult(
      industry: (json['industry'] ?? 'INDUSTRIAL').toString(),
      predictedCause: (json['predictedCause'] ?? 'Primary Relay / Bearing Fault').toString(),
      confidenceScore: ((json['confidenceScore'] ?? 87.0) as num).toDouble(),
      severity: (json['severity'] ?? 'HIGH').toString(),
      diyPossible: json['diyPossible'] == true,
      estimatedDurationMin: ((json['estimatedDurationMin'] ?? 45) as num).toInt(),
      estimatedCostMin: ((json['estimatedCostMin'] ?? 800) as num).toInt(),
      estimatedCostMax: ((json['estimatedCostMax'] ?? 1500) as num).toInt(),
      recommendedPath: (json['recommendedPath'] ?? 'AI_COPILOT').toString(),
      safetyWarnings: (json['safetyWarnings'] as List?)
              ?.map((e) => e.toString())
              .toList() ??
          const ['Isolate main breaker / disconnect battery before touching terminals.'],
      safeToRun: json['safeToRun'] == true,
    );
  }
}

class TechnicianCandidate {
  final int id;
  final String fullName;
  final String tradeTitle;
  final int verificationLevel; // 2 or 3
  final bool isProvisional; // L2-P
  final bool isFatigueRestricted;
  final double ratingAvg;
  final int jobsCompleted;
  final double distanceKm;
  final int etaMinutes;
  final double matchScore; // 40% skill + 60% proximity
  final int baseVisitFee;
  final List<String> skills;

  const TechnicianCandidate({
    required this.id,
    required this.fullName,
    required this.tradeTitle,
    required this.verificationLevel,
    required this.isProvisional,
    this.isFatigueRestricted = false,
    required this.ratingAvg,
    required this.jobsCompleted,
    required this.distanceKm,
    required this.etaMinutes,
    required this.matchScore,
    required this.baseVisitFee,
    required this.skills,
  });

  String get badgeLabel => isProvisional ? 'L2-P Provisional' : 'L$verificationLevel Verified';
}

class OwnerJob {
  final int id;
  final String jobNumber;
  final String industry;
  final String equipmentSummary;
  final String problemDescription;
  final String urgency;
  final String status; // CREATED, COPILOT_ACTIVE, MATCHING, ACCEPTED, EN_ROUTE, ARRIVED, IN_PROGRESS, COMPLETED
  final String resolutionPath; // AI_COPILOT, VIDEO_CONSULT, DIRECT_BOOKING
  final String arrivalOtp;
  final TechnicianCandidate? assignedTech;
  final int laborCharge;
  final int partsCharge;
  final int discountAmount;
  final bool videoConsultFeeCredited;
  final String? recordHash;
  final bool isLocked;
  final int? userRating;
  final DateTime createdAt;

  const OwnerJob({
    required this.id,
    required this.jobNumber,
    required this.industry,
    required this.equipmentSummary,
    required this.problemDescription,
    required this.urgency,
    required this.status,
    required this.resolutionPath,
    required this.arrivalOtp,
    this.assignedTech,
    this.laborCharge = 850,
    this.partsCharge = 450,
    this.discountAmount = 0,
    this.videoConsultFeeCredited = false,
    this.recordHash,
    this.isLocked = false,
    this.userRating,
    required this.createdAt,
  });

  int get subtotal => (laborCharge + partsCharge - discountAmount).clamp(0, 10000000);
  int get cgst => (subtotal * 0.09).round();
  int get sgst => (subtotal * 0.09).round();
  int get totalAmount => subtotal + cgst + sgst;

  OwnerJob copyWith({
    String? status,
    String? resolutionPath,
    TechnicianCandidate? assignedTech,
    int? discountAmount,
    bool? videoConsultFeeCredited,
    String? recordHash,
    bool? isLocked,
    int? userRating,
  }) {
    return OwnerJob(
      id: id,
      jobNumber: jobNumber,
      industry: industry,
      equipmentSummary: equipmentSummary,
      problemDescription: problemDescription,
      urgency: urgency,
      status: status ?? this.status,
      resolutionPath: resolutionPath ?? this.resolutionPath,
      arrivalOtp: arrivalOtp,
      assignedTech: assignedTech ?? this.assignedTech,
      laborCharge: laborCharge,
      partsCharge: partsCharge,
      discountAmount: discountAmount ?? this.discountAmount,
      videoConsultFeeCredited: videoConsultFeeCredited ?? this.videoConsultFeeCredited,
      recordHash: recordHash ?? this.recordHash,
      isLocked: isLocked ?? this.isLocked,
      userRating: userRating ?? this.userRating,
      createdAt: createdAt,
    );
  }
}
