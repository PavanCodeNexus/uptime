class OwnerUser {
  final int id;
  final String fullName;
  final String phone;
  final String email;
  final String industryPreference;
  final String city;
  final double walletBalance;
  final double carbonCreditsKg;
  final String subscriptionTier;

  const OwnerUser({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.email,
    required this.industryPreference,
    required this.city,
    this.walletBalance = 14500.0,
    this.carbonCreditsKg = 48.6,
    this.subscriptionTier = 'GOLD_AMC',
  });
}

class ComponentHealth {
  final String name;
  final int healthPercent;
  final String status; // HEALTHY, WARNING, CRITICAL
  final String predictedFailureWindow;
  final String telemetryReading;

  const ComponentHealth({
    required this.name,
    required this.healthPercent,
    required this.status,
    required this.predictedFailureWindow,
    this.telemetryReading = 'Nominal',
  });
}

class AssetItem {
  final int id;
  final String name;
  final String category; // INDUSTRIAL, AUTOMOBILE, ELECTRONICS
  final String modelNumber;
  final int healthScore;
  final int moodScore; // 0-100 Mood Score (AUTO-U02)
  final String moodLabel;
  final String lastServiceDate;
  final String nextPredictedService;
  final String silentKillerAlert; // ELEC-U02 / IND-U05
  final List<ComponentHealth> components;
  final List<int> healthHistory;

  const AssetItem({
    required this.id,
    required this.name,
    required this.category,
    required this.modelNumber,
    required this.healthScore,
    required this.moodScore,
    required this.moodLabel,
    required this.lastServiceDate,
    required this.nextPredictedService,
    required this.silentKillerAlert,
    required this.components,
    this.healthHistory = const [96, 94, 91, 89, 86, 87],
  });
}

class AIDiagnosisResult {
  final String faultCategory;
  final String severity; // LOW, MEDIUM, HIGH, CRITICAL
  final double confidence;
  final double estimatedMinInr;
  final double estimatedMaxInr;
  final String probableRootCause;
  final String soundFingerprintMatch;
  final bool diyRecommended;
  final List<String> copilotSteps;
  final List<String> requiredTools;
  final List<String> safetyWarnings;
  final List<String> skillTags;

  const AIDiagnosisResult({
    required this.faultCategory,
    required this.severity,
    required this.confidence,
    required this.estimatedMinInr,
    required this.estimatedMaxInr,
    required this.probableRootCause,
    required this.soundFingerprintMatch,
    required this.diyRecommended,
    required this.copilotSteps,
    required this.requiredTools,
    required this.safetyWarnings,
    this.skillTags = const ['Spindle Repair', 'VFD Diagnostics', 'Laser Alignment'],
  });
}

class TechnicianCandidate {
  final int id;
  final String fullName;
  final String industry;
  final String tradeTitle;
  final int verificationLevel; // L0..L3
  final bool isProvisional;
  final bool isFatigueRestricted; // Fatigue rule: MUST be false to appear in dispatch
  final double rating;
  final int jobsCompleted;
  final double distanceKm;
  final int etaMinutes;
  final double matchScore; // 40% distance + 60% skill + modifiers
  final double estimatedQuoteInr;
  final List<String> badges;

  const TechnicianCandidate({
    required this.id,
    required this.fullName,
    required this.industry,
    required this.tradeTitle,
    required this.verificationLevel,
    required this.isProvisional,
    required this.isFatigueRestricted,
    required this.rating,
    required this.jobsCompleted,
    required this.distanceKm,
    required this.etaMinutes,
    required this.matchScore,
    required this.estimatedQuoteInr,
    required this.badges,
  });
}

class OwnerJob {
  final int id;
  final String jobNumber;
  final String title;
  final String industry;
  final String resolutionPath; // PATH_A_COPILOT, PATH_B_VIDEO, PATH_C_DIRECT_TECH
  final String status; // POSTED, MATCHED, EN_ROUTE, ARRIVED, IN_PROGRESS, COMPLETED
  final String urgency;
  final String technicianName;
  final String technicianPhone;
  final double technicianRating;
  final int etaMinutes;
  final double distanceMeters;
  final String arrivalOtp;
  final bool arrivalOtpVerified;
  final double laborCharge;
  final double partsCharge;
  final bool videoConsultFeeCredited;
  final String? recordHash;
  final bool isLocked;
  final String createdAt;
  final int? userRating;

  const OwnerJob({
    required this.id,
    required this.jobNumber,
    required this.title,
    required this.industry,
    required this.resolutionPath,
    required this.status,
    required this.urgency,
    required this.technicianName,
    required this.technicianPhone,
    required this.technicianRating,
    required this.etaMinutes,
    required this.distanceMeters,
    required this.arrivalOtp,
    required this.arrivalOtpVerified,
    required this.laborCharge,
    required this.partsCharge,
    this.videoConsultFeeCredited = false,
    this.recordHash,
    this.isLocked = false,
    required this.createdAt,
    this.userRating,
  });

  double get subtotal {
    final raw = laborCharge + partsCharge - (videoConsultFeeCredited ? 149.0 : 0.0);
    return raw < 0 ? 0 : raw;
  }

  double get cgst => subtotal * 0.09;
  double get sgst => subtotal * 0.09;
  double get totalAmount => subtotal + cgst + sgst;
}

class MarketplaceItem {
  final String id;
  final String name;
  final String category; // SPARE_PART, TOOL, REFURBISHED
  final String industry;
  final String qualityBadge; // OEM Genuine, Grade A+ Refurbished, ISO Certified
  final String compatibility;
  final double priceInr;
  final double mrpInr;
  final int warrantyMonths;
  final bool inStock;

  const MarketplaceItem({
    required this.id,
    required this.name,
    required this.category,
    required this.industry,
    required this.qualityBadge,
    required this.compatibility,
    required this.priceInr,
    required this.mrpInr,
    required this.warrantyMonths,
    this.inStock = true,
  });
}

class WikiArticleItem {
  final String id;
  final String title;
  final String industry;
  final String authorTech;
  final int helpfulCount;
  final String readTime;
  final String summary;
  final List<String> steps;

  const WikiArticleItem({
    required this.id,
    required this.title,
    required this.industry,
    required this.authorTech,
    required this.helpfulCount,
    required this.readTime,
    required this.summary,
    required this.steps,
  });
}
