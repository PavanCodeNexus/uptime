import 'package:flutter/material.dart';

class UptimeTheme {
  UptimeTheme._();

  static const Color blue950 = Color(0xFF060C1A);
  static const Color blue900 = Color(0xFF0D2347);
  static const Color blue800 = Color(0xFF132B52);
  static const Color blue700 = Color(0xFF1A3C6E);
  static const Color blue500 = Color(0xFF2563EB);
  static const Color blue50 = Color(0xFFEFF6FF);

  static const Color teal500 = Color(0xFF00D4AA);
  static const Color teal600 = Color(0xFF00B894);
  static const Color teal50 = Color(0xFFF0FDFB);

  static const Color industrial = Color(0xFF7C3AED);
  static const Color automobile = Color(0xFF2563EB);
  static const Color electronics = Color(0xFF0891B2);

  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFD97706);
  static const Color danger = Color(0xFFDC2626);

  static const Color dark = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF152036);
  static const Color darkCard = Color(0xFF1E293B);
  static const Color gray700 = Color(0xFF334155);
  static const Color gray500 = Color(0xFF64748B);
  static const Color gray300 = Color(0xFFCBD5E1);
  static const Color gray100 = Color(0xFFF1F5F9);
  static const Color gray50 = Color(0xFFF8FAFC);

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
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
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
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
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
