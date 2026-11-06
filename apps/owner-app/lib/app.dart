import 'package:flutter/material.dart';
import 'core/config/theme.dart';
import 'features/screens/owner_shell_screen.dart';

class UptimeOwnerApp extends StatelessWidget {
  const UptimeOwnerApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UPTIME Owner — Downtime ends here.',
      debugShowCheckedModeBanner: false,
      theme: UptimeTheme.lightTheme,
      darkTheme: UptimeTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: const OwnerRootScreen(),
    );
  }
}
