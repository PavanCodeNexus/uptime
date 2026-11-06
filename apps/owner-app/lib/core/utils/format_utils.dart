import 'dart:math';

class FormatUtils {
  /// Formats amount in Indian Rupee numbering system (e.g. ₹1,00,000)
  static String formatInr(num amount) {
    final bool negative = amount < 0;
    final int rounded = amount.abs().round();
    final String s = rounded.toString();
    if (s.length <= 3) {
      return '${negative ? "-" : ""}₹$s';
    }
    final String lastThree = s.substring(s.length - 3);
    final String remaining = s.substring(0, s.length - 3);
    final RegExp reg = RegExp(r'\B(?=(\d{2})+(?!\d))');
    final String formattedRemaining = remaining.replaceAllMapped(reg, (m) => ',');
    return '${negative ? "-" : ""}₹$formattedRemaining,$lastThree';
  }

  /// Formats DateTime as DD/MM/YYYY
  static String formatDate(DateTime date) {
    final d = date.day.toString().padLeft(2, '0');
    final m = date.month.toString().padLeft(2, '0');
    final y = date.year.toString();
    return '$d/$m/$y';
  }

  /// Validates 10-digit Indian mobile number (starts with 6-9)
  static bool isValidIndianPhone(String input) {
    final digits = input.replaceAll(RegExp(r'[^0-9]'), '');
    final normalized = digits.length == 12 && digits.startsWith('91')
        ? digits.substring(2)
        : digits;
    return RegExp(r'^[6-9]\d{9}$').hasMatch(normalized);
  }

  /// Calculates Haversine distance in kilometers
  static double calculateDistanceKm(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    const double r = 6371.0;
    final double dLat = _deg2rad(lat2 - lat1);
    final double dLon = _deg2rad(lon2 - lon1);
    final double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_deg2rad(lat1)) * cos(_deg2rad(lat2)) * sin(dLon / 2) * sin(dLon / 2);
    final double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return r * c;
  }

  static double _deg2rad(double deg) => deg * (pi / 180.0);
}
