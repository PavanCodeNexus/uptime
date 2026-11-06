class AppConfig {
  static const String appName = 'UPTIME Technician';
  static const String tagline = 'Downtime ends here.';
  static const String _flavor = String.fromEnvironment(
    'FLAVOR',
    defaultValue: 'development',
  );

  static bool get isDev => _flavor == 'development';
  static bool get isStaging => _flavor == 'staging';
  static bool get isProd => _flavor == 'production';

  static String get apiUrl {
    const override = String.fromEnvironment('API_URL');
    if (override.isNotEmpty) return override;
    return switch (_flavor) {
      'production' => 'https://api.uptime.in/api/v1',
      'staging' => 'https://staging-api.uptime.in/api/v1',
      _ => 'http://localhost:8080/api/v1',
    };
  }

  static String get wsUrl {
    const override = String.fromEnvironment('WS_URL');
    if (override.isNotEmpty) return override;
    return switch (_flavor) {
      'production' => 'wss://api.uptime.in/ws',
      'staging' => 'wss://staging-api.uptime.in/ws',
      _ => 'ws://localhost:8080/ws',
    };
  }
}
