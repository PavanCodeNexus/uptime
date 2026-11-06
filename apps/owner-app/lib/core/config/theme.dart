import 'package:flutter/material.dart';

class UptimeTheme {
  UptimeTheme._();

  // Brand Primary Palette (DESIGN.md + UI/UX Pro Max)
  static const Color blue950 = Color(0xFF070E1E);
  static const Color blue900 = Color(0xFF0D2347);
  static const Color blue800 = Color(0xFF132B52);
  static const Color blue700 = Color(0xFF1A3C6E); // Brand Deep Blue
  static const Color blue600 = Color(0xFF1E5799);
  static const Color blue500 = Color(0xFF2563EB);
  static const Color blue100 = Color(0xFFDBEAFE);
  static const Color blue50 = Color(0xFFEFF6FF);

  // Brand Accent Palette
  static const Color teal500 = Color(0xFF00D4AA); // Brand Electric Teal
  static const Color teal600 = Color(0xFF00B894);
  static const Color teal100 = Color(0xFFCCFBF1);
  static const Color teal50 = Color(0xFFF0FDFB);

  // Industry Semantic Accents
  static const Color industrial = Color(0xFF7C3AED); // Royal Purple
  static const Color automobile = Color(0xFF2563EB); // Electric Blue
  static const Color electronics = Color(0xFF0891B2); // Cyber Cyan

  // Status & Semantic Tokens
  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFD97706);
  static const Color danger = Color(0xFFDC2626);
  static const Color orange = Color(0xFFEA580C);

  // Neutral Surfaces
  static const Color dark = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF162038);
  static const Color darkCard = Color(0xFF1E293B);
  static const Color gray700 = Color(0xFF334155);
  static const Color gray500 = Color(0xFF64748B);
  static const Color gray300 = Color(0xFFCBD5E1);
  static const Color gray100 = Color(0xFFF1F5F9);
  static const Color gray50 = Color(0xFFF8FAFC);

  static Color industryColor(String industry) {
    switch (industry.toUpperCase()) {
      case 'INDUSTRIAL':
        return industrial;
      case 'AUTOMOBILE':
        return automobile;
      case 'ELECTRONICS':
        return electronics;
      default:
        return blue700;
    }
  }

  static LinearGradient industryGradient(String industry) {
    switch (industry.toUpperCase()) {
      case 'INDUSTRIAL':
        return const LinearGradient(
          colors: [Color(0xFF1A3C6E), Color(0xFF5B21B6), Color(0xFF7C3AED)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case 'AUTOMOBILE':
        return const LinearGradient(
          colors: [Color(0xFF0D2347), Color(0xFF1D4ED8), Color(0xFF00D4AA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case 'ELECTRONICS':
        return const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF0E7490), Color(0xFF00D4AA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      default:
        return const LinearGradient(
          colors: [blue900, blue700, teal600],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
    }
  }

  static Color statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return success;
      case 'EN_ROUTE':
      case 'ARRIVED':
        return warning;
      case 'IN_PROGRESS':
        return industrial;
      case 'MATCHED':
        return blue500;
      case 'CANCELLED':
        return danger;
      case 'DISPUTED':
        return orange;
      default:
        return gray500;
    }
  }

  static ThemeData get lightTheme {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: blue700,
        secondary: teal500,
        surface: Colors.white,
        error: danger,
        onPrimary: Colors.white,
        onSecondary: dark,
        onSurface: dark,
      ),
      scaffoldBackgroundColor: gray50,
    );
    return base.copyWith(
      appBarTheme: const AppBarTheme(
        backgroundColor: blue900,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: blue700,
          foregroundColor: Colors.white,
          minimumSize: const Size(88, 48),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.2,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: blue700,
          minimumSize: const Size(88, 48),
          side: const BorderSide(color: blue700, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: gray300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: teal500, width: 2),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: teal500,
        secondary: blue500,
        surface: darkCard,
        error: danger,
        onPrimary: dark,
        onSecondary: Colors.white,
        onSurface: gray50,
      ),
      scaffoldBackgroundColor: blue950,
    );
    return base.copyWith(
      appBarTheme: const AppBarTheme(
        backgroundColor: blue950,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF334155)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: teal500,
          foregroundColor: dark,
          minimumSize: const Size(88, 48),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.2,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: teal500,
          minimumSize: const Size(88, 48),
          side: const BorderSide(color: teal500, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkSurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF334155)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF334155)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: teal500, width: 2),
        ),
      ),
    );
  }
}
