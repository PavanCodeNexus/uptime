import 'package:flutter/material.dart';
import 'core/config/theme.dart';
import 'features/screens/tech_shell_screen.dart';

class UptimeTechnicianApp extends StatelessWidget {
  const UptimeTechnicianApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UPTIME Technician — Downtime ends here.',
      debugShowCheckedModeBanner: false,
      theme: UptimeTheme.lightTheme,
      home: const TechRootScreen(),
    );
  }
}
