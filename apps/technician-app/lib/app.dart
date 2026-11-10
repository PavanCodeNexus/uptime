import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/config/app_config.dart';
import 'core/config/theme.dart';
import 'features/screens/tech_shell_screen.dart';

class TechThemeModeNotifier extends Notifier<ThemeMode> {
  @override
  ThemeMode build() => ThemeMode.light;

  void toggle() {
    state = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
  }
}

final techThemeModeProvider =
    NotifierProvider<TechThemeModeNotifier, ThemeMode>(TechThemeModeNotifier.new);

class UptimeTechnicianApp extends ConsumerWidget {
  const UptimeTechnicianApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(techThemeModeProvider);
    return MaterialApp(
      title: '${AppConfig.appName} — ${AppConfig.tagline}',
      debugShowCheckedModeBanner: false,
      theme: UptimeTheme.lightTheme,
      darkTheme: UptimeTheme.darkTheme,
      themeMode: themeMode,
      home: const TechRootScreen(),
    );
  }
}
