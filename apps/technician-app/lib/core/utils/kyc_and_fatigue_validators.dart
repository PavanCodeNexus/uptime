import 'dart:math';

class KycAndFatigueValidators {
  static const Set<String> regulatedTrades = {
    'HV_ELECTRICIAN',
    'BOILER_OPERATOR',
    'COMMERCIAL_HVAC_GAS',
  };

  /// DPDP Act 2023 Guard: Prohibits full 12-digit Aadhaar numbers anywhere in payload.
  static bool containsFullAadhaarNumber(String? input) {
    if (input == null || input.isEmpty) return false;
    final digitsOnly = input.replaceAll(RegExp(r'[\s-]'), '');
    return RegExp(r'(?<!\d)\d{12}(?!\d)').hasMatch(digitsOnly);
  }

  /// Regulated trade check: Track B (EXPERIENCED_USTAD) is prohibited for regulated trades.
  static void validateTradeTrackSelection({
    required String tradeCode,
    required String verificationTrack,
  }) {
    final isRegulated = regulatedTrades.contains(tradeCode.toUpperCase());
    if (isRegulated && verificationTrack.toUpperCase() == 'EXPERIENCED_USTAD') {
      throw ArgumentError(
        'Regulated trade $tradeCode requires Track A (CERTIFIED) with mandatory statutory license.',
      );
    }
  }

  /// Skill MCQ test pass rule: >= 70% total score AND 2/2 mandatory safety questions correct.
  static bool evaluateSkillTest({
    required int totalScorePercent,
    required int safetyQuestionsCorrect,
  }) {
    return totalScorePercent >= 70 && safetyQuestionsCorrect >= 2;
  }

  /// 500-meter arrival geofence verification using Haversine formula.
  static bool isWithinArrivalGeofence({
    required double ownerLat,
    required double ownerLng,
    required double techLat,
    required double techLng,
    double maxRadiusMeters = 500.0,
  }) {
    const double earthRadiusMeters = 6371000.0;
    final double dLat = (techLat - ownerLat) * (pi / 180.0);
    final double dLng = (techLng - ownerLng) * (pi / 180.0);
    final double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(ownerLat * (pi / 180.0)) *
            cos(techLat * (pi / 180.0)) *
            sin(dLng / 2) *
            sin(dLng / 2);
    final double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return (earthRadiusMeters * c) <= maxRadiusMeters;
  }
}
