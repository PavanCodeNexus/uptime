class AppConfig {
  static const String tagline = 'Downtime ends here.';
  static const String _flavor = String.fromEnvironment(
    'FLAVOR',
    defaultValue: 'development',
  );

  static String get apiUrl {
    const override = String.fromEnvironment('API_URL');
    if (override.isNotEmpty) return override;
    return switch (_flavor) {
      'production' => 'https://api.uptime.in/api/v1',
      'staging' => 'https://staging-api.uptime.in/api/v1',
      _ => 'http://localhost:8080/api/v1',
    };
  }
}
