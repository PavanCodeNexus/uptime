class TechnicianProfile {
  final int id;
  final String fullName;
  final String phone;
  final String industryType;
  final int verificationLevel; // 0, 1, 2, 3
  final bool isProvisional; // L2-P
  final int provisionalCompletedJobs; // out of 5 to graduate
  final String verificationStatus; // PENDING, UNDER_REVIEW, PROVISIONAL, VERIFIED, REJECTED
  final bool isOnline;
  final bool isAvailable;
  final bool isFatigueRestricted;
  final int fatigueScore; // 0..100
  final int consecutiveJobsCount;
  final double hoursWorkedToday;
  final String? fatigueResetAt;
  final double ratingAvg;
  final int jobsCompleted;
  final int todayEarningsInr;
  final int weeklyEarningsInr;
  final int walletBalanceInr;
  final String upiId;
  final String? aadhaarLast4;
  final bool livenessVerified;
  final bool upiPennyDropVerified;
  final String selectedTradeCode;
  final String selectedTrack; // CERTIFIED | EXPERIENCED_USTAD
  final bool mcqPassed;
  final bool videoProofUploaded;
  final bool referenceVerified;

  const TechnicianProfile({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.industryType,
    required this.verificationLevel,
    required this.isProvisional,
    this.provisionalCompletedJobs = 3,
    required this.verificationStatus,
    required this.isOnline,
    required this.isAvailable,
    required this.isFatigueRestricted,
    required this.fatigueScore,
    required this.consecutiveJobsCount,
    required this.hoursWorkedToday,
    this.fatigueResetAt,
    required this.ratingAvg,
    required this.jobsCompleted,
    required this.todayEarningsInr,
    required this.weeklyEarningsInr,
    required this.walletBalanceInr,
    required this.upiId,
    this.aadhaarLast4,
    this.livenessVerified = false,
    this.upiPennyDropVerified = false,
    this.selectedTradeCode = 'CNC_SPINDLE_TECH',
    this.selectedTrack = 'EXPERIENCED_USTAD',
    this.mcqPassed = false,
    this.videoProofUploaded = false,
    this.referenceVerified = false,
  });

  String get levelBadge => isProvisional ? 'L2-P (Provisional)' : 'L$verificationLevel';

  TechnicianProfile copyWith({
    int? verificationLevel,
    bool? isProvisional,
    int? provisionalCompletedJobs,
    String? verificationStatus,
    bool? isOnline,
    bool? isAvailable,
    bool? isFatigueRestricted,
    int? fatigueScore,
    int? consecutiveJobsCount,
    double? hoursWorkedToday,
    String? fatigueResetAt,
    int? jobsCompleted,
    int? todayEarningsInr,
    int? weeklyEarningsInr,
    int? walletBalanceInr,
    String? upiId,
    String? aadhaarLast4,
    bool? livenessVerified,
    bool? upiPennyDropVerified,
    String? selectedTradeCode,
    String? selectedTrack,
    bool? mcqPassed,
    bool? videoProofUploaded,
    bool? referenceVerified,
  }) {
    return TechnicianProfile(
      id: id,
      fullName: fullName,
      phone: phone,
      industryType: industryType,
      verificationLevel: verificationLevel ?? this.verificationLevel,
      isProvisional: isProvisional ?? this.isProvisional,
      provisionalCompletedJobs: provisionalCompletedJobs ?? this.provisionalCompletedJobs,
      verificationStatus: verificationStatus ?? this.verificationStatus,
      isOnline: isOnline ?? this.isOnline,
      isAvailable: isAvailable ?? this.isAvailable,
      isFatigueRestricted: isFatigueRestricted ?? this.isFatigueRestricted,
      fatigueScore: fatigueScore ?? this.fatigueScore,
      consecutiveJobsCount: consecutiveJobsCount ?? this.consecutiveJobsCount,
      hoursWorkedToday: hoursWorkedToday ?? this.hoursWorkedToday,
      fatigueResetAt: fatigueResetAt ?? this.fatigueResetAt,
      ratingAvg: ratingAvg,
      jobsCompleted: jobsCompleted ?? this.jobsCompleted,
      todayEarningsInr: todayEarningsInr ?? this.todayEarningsInr,
      weeklyEarningsInr: weeklyEarningsInr ?? this.weeklyEarningsInr,
      walletBalanceInr: walletBalanceInr ?? this.walletBalanceInr,
      upiId: upiId ?? this.upiId,
      aadhaarLast4: aadhaarLast4 ?? this.aadhaarLast4,
      livenessVerified: livenessVerified ?? this.livenessVerified,
      upiPennyDropVerified: upiPennyDropVerified ?? this.upiPennyDropVerified,
      selectedTradeCode: selectedTradeCode ?? this.selectedTradeCode,
      selectedTrack: selectedTrack ?? this.selectedTrack,
      mcqPassed: mcqPassed ?? this.mcqPassed,
      videoProofUploaded: videoProofUploaded ?? this.videoProofUploaded,
      referenceVerified: referenceVerified ?? this.referenceVerified,
    );
  }
}

class AssignedFieldJob {
  final int id;
  final String jobNumber;
  final String ownerName;
  final String ownerAddress;
  final String industry;
  final String equipmentSummary;
  final String aiPreDiagnosis;
  final String urgency;
  final int estimatedPayoutInr;
  final int surgeBonusInr;
  final String status; // REQUESTED, ACCEPTED, EN_ROUTE, ARRIVED, IN_PROGRESS, COMPLETED
  final bool otpVerified;
  final List<String> checklistSteps;
  final Set<int> completedSteps;
  final int partsTotalInr;
  final String? sha256RecordHash;

  const AssignedFieldJob({
    required this.id,
    required this.jobNumber,
    required this.ownerName,
    required this.ownerAddress,
    required this.industry,
    required this.equipmentSummary,
    required this.aiPreDiagnosis,
    required this.urgency,
    required this.estimatedPayoutInr,
    this.surgeBonusInr = 150,
    required this.status,
    this.otpVerified = false,
    required this.checklistSteps,
    this.completedSteps = const {},
    this.partsTotalInr = 0,
    this.sha256RecordHash,
  });

  AssignedFieldJob copyWith({
    String? status,
    bool? otpVerified,
    Set<int>? completedSteps,
    int? partsTotalInr,
    String? sha256RecordHash,
  }) {
    return AssignedFieldJob(
      id: id,
      jobNumber: jobNumber,
      ownerName: ownerName,
      ownerAddress: ownerAddress,
      industry: industry,
      equipmentSummary: equipmentSummary,
      aiPreDiagnosis: aiPreDiagnosis,
      urgency: urgency,
      estimatedPayoutInr: estimatedPayoutInr,
      surgeBonusInr: surgeBonusInr,
      status: status ?? this.status,
      otpVerified: otpVerified ?? this.otpVerified,
      checklistSteps: checklistSteps,
      completedSteps: completedSteps ?? this.completedSteps,
      partsTotalInr: partsTotalInr ?? this.partsTotalInr,
      sha256RecordHash: sha256RecordHash ?? this.sha256RecordHash,
    );
  }
}
