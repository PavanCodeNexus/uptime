import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/config/app_config.dart';
import 'core/config/theme.dart';
import 'features/providers/owner_providers.dart';
import 'features/screens/owner_shell_screen.dart';

class UptimeOwnerApp extends ConsumerWidget {
  const UptimeOwnerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    return MaterialApp(
      title: '${AppConfig.appName} — ${AppConfig.tagline}',
      debugShowCheckedModeBanner: false,
      theme: UptimeTheme.lightTheme,
      darkTheme: UptimeTheme.darkTheme,
      themeMode: themeMode,
      home: const OwnerRootScreen(),
    );
  }
}
