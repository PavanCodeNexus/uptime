import 'package:flutter/material.dart';

class UptimeTheme {
  static const Color blue700 = Color(0xFF1A3C6E);
  static const Color blue600 = Color(0xFF1E5799);
  static const Color blue50 = Color(0xFFEFF6FF);
  static const Color teal500 = Color(0xFF00D4AA);
  static const Color teal600 = Color(0xFF00B894);
  static const Color teal50 = Color(0xFFF0FDFB);
  static const Color dark = Color(0xFF0F172A);
  static const Color gray700 = Color(0xFF334155);
  static const Color gray500 = Color(0xFF64748B);
  static const Color gray300 = Color(0xFFCBD5E1);
  static const Color gray100 = Color(0xFFF1F5F9);
  static const Color gray50 = Color(0xFFF8FAFC);
  static const Color white = Color(0xFFFFFFFF);
  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFD97706);
  static const Color danger = Color(0xFFDC2626);
  static const Color industrial = Color(0xFF7C3AED);
  static const Color automobile = Color(0xFF2563EB);
  static const Color electronics = Color(0xFF0891B2);

  static ThemeData get lightTheme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: gray50,
        colorScheme: const ColorScheme.light(
          primary: blue700,
          secondary: teal500,
          surface: white,
          error: danger,
          onPrimary: white,
          onSecondary: white,
          onSurface: dark,
          outline: gray300,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: blue700,
          foregroundColor: white,
          elevation: 0,
          centerTitle: false,
          titleTextStyle: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: white,
          ),
          iconTheme: IconThemeData(color: white),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: white,
          selectedItemColor: blue700,
          unselectedItemColor: gray500,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: blue700,
            foregroundColor: white,
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            minimumSize: const Size(48, 48),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            textStyle: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      );
}
