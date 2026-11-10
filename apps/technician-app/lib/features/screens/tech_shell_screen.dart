import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app.dart';
import '../../core/config/app_config.dart';
import '../../core/config/theme.dart';
import '../../core/utils/kyc_and_fatigue_validators.dart';
import '../models/tech_models.dart';
import '../providers/tech_providers.dart';
import 'tech_40_screens_catalog.dart';

class TechRootScreen extends ConsumerStatefulWidget {
  const TechRootScreen({super.key});

  @override
  ConsumerState<TechRootScreen> createState() => _TechRootScreenState();
}

class _TechRootScreenState extends ConsumerState<TechRootScreen> {
  int _tabIndex = 0;
  final _phoneCtrl = TextEditingController(text: '9845012345');
  final _otpCtrl = TextEditingController(text: '123456');

  static const _navItems = [
    (Icons.space_dashboard_outlined, 'Field Radar'),
    (Icons.navigation_outlined, 'Active Job & Copilot'),
    (Icons.verified_user_outlined, 'KYC L0-L3 & MCQ'),
    (Icons.account_balance_wallet_outlined, 'Earnings & UPI'),
    (Icons.workspace_premium_outlined, 'Polygon NFTs'),
    (Icons.calendar_month_outlined, 'Schedule & Wiki'),
  ];

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _otpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tech = ref.watch(technicianStateProvider).valueOrNull;
    final baseZone = ref.watch(techBaseZoneProvider);
    final themeMode = ref.watch(techThemeModeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (tech == null) {
      return _buildProTechLoginScreen(context, isDark);
    }

    final pages = [
      TechHomeScreen(
        tech: tech,
        onOpenActiveJob: () => setState(() => _tabIndex = 1),
        onJumpToTab: (idx) => setState(() => _tabIndex = idx),
      ),
      _ActiveFieldJobAndCopilotScreen(tech: tech),
      _KycVerificationAndMcqWizardScreen(tech: tech),
      _EarningsGstTdsAndUpiScreen(tech: tech),
      const _PolygonNftBadgesScreen(),
      const _AvailabilityRadiusAndWikiScreen(),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 960;

        return Scaffold(
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(72),
            child: Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF081022) : Colors.white,
                border: Border(
                  bottom: BorderSide(
                    color: tech.isFatigueRestricted
                        ? UptimeTheme.danger
                        : (isDark
                            ? UptimeTheme.teal500.withValues(alpha: 0.45)
                            : const Color(0xFFE2E8F0)),
                    width: 1.5,
                  ),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SafeArea(
                child: Row(
                  children: [
                    // Zomato / Urban Company Partner Style Base-Zone Location Selector
                    Expanded(
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () => showTechBaseZonePickerSheet(context, ref),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: UptimeTheme.blue500.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.location_on_rounded,
                                  color: UptimeTheme.blue500,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            baseZone.label,
                                            style: TextStyle(
                                              color: isDark ? Colors.white : UptimeTheme.dark,
                                              fontSize: 14.5,
                                              fontWeight: FontWeight.w900,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Icon(
                                          Icons.keyboard_arrow_down_rounded,
                                          size: 18,
                                          color: isDark ? Colors.white70 : UptimeTheme.dark,
                                        ),
                                      ],
                                    ),
                                    Text(
                                      '${baseZone.addressLine} • ${baseZone.radarBadge}',
                                      style: TextStyle(
                                        color: isDark ? Colors.white70 : UptimeTheme.gray500,
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w600,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // 40 Screens Directory Button
                    OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        minimumSize: const Size(0, 36),
                      ),
                      onPressed: () => showTechAll40ScreensSheet(
                        context,
                        onJumpToTab: (idx) => setState(() => _tabIndex = idx),
                      ),
                      icon: const Icon(Icons.grid_view_rounded, size: 15),
                      label: const Text(
                        '40 Screens',
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: (tech.isFatigueRestricted
                                ? UptimeTheme.danger
                                : (tech.isOnline ? UptimeTheme.teal500 : UptimeTheme.gray500))
                            .withValues(alpha: 0.16),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(
                          color: tech.isFatigueRestricted
                              ? UptimeTheme.danger
                              : UptimeTheme.teal600,
                        ),
                      ),
                      child: Text(
                        tech.isFatigueRestricted
                            ? 'MANDATORY REST'
                            : (tech.isOnline ? 'DUTY ONLINE' : 'OFFLINE'),
                        style: TextStyle(
                          color: tech.isFatigueRestricted
                              ? UptimeTheme.danger
                              : UptimeTheme.teal600,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    IconButton(
                      tooltip: 'Toggle Clean White / Industrial Field Dark Mode',
                      icon: Icon(
                        themeMode == ThemeMode.dark
                            ? Icons.light_mode_outlined
                            : Icons.dark_mode_outlined,
                        color: isDark ? Colors.amberAccent : UptimeTheme.blue700,
                      ),
                      onPressed: () => ref.read(techThemeModeProvider.notifier).toggle(),
                    ),
                  ],
                ),
              ),
            ),
          ),
          body: Row(
            children: [
              if (isDesktop)
                Container(
                  width: 250,
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0B1326) : Colors.white,
                    border: Border(
                      right: BorderSide(
                        color: isDark ? const Color(0xFF1E293B) : UptimeTheme.gray300,
                      ),
                    ),
                  ),
                  child: Column(
                    children: [
                      Container(
                        margin: const EdgeInsets.all(16),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [UptimeTheme.blue900, UptimeTheme.industrial],
                          ),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tech.fullName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${tech.ratingAvg}★ • ${tech.jobsCompleted} Jobs • Fatigue ${tech.fatigueScore}/100',
                              style: const TextStyle(color: Colors.white70, fontSize: 11.5),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'UPI: ${tech.upiId}',
                              style: const TextStyle(
                                color: UptimeTheme.teal500,
                                fontSize: 11.5,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          itemCount: _navItems.length,
                          itemBuilder: (_, idx) {
                            final item = _navItems[idx];
                            final selected = _tabIndex == idx;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: ListTile(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                tileColor: selected
                                    ? UptimeTheme.teal500.withValues(alpha: 0.16)
                                    : Colors.transparent,
                                leading: Icon(
                                  item.$1,
                                  color: selected ? UptimeTheme.teal500 : UptimeTheme.gray500,
                                ),
                                title: Text(
                                  item.$2,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
                                    color: selected
                                        ? (isDark ? Colors.white : UptimeTheme.blue700)
                                        : UptimeTheme.gray500,
                                  ),
                                ),
                                onTap: () => setState(() => _tabIndex = idx),
                              ),
                            );
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: OutlinedButton.icon(
                          onPressed: () => ref.read(technicianStateProvider.notifier).logout(),
                          icon: const Icon(Icons.logout_rounded, size: 16),
                          label: const Text('Sign Out'),
                        ),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: IndexedStack(
                  index: _tabIndex,
                  children: pages,
                ),
              ),
            ],
          ),
          bottomNavigationBar: isDesktop
              ? null
              : NavigationBar(
                  selectedIndex: _tabIndex,
                  onDestinationSelected: (idx) => setState(() => _tabIndex = idx),
                  destinations: _navItems
                      .map(
                        (e) => NavigationDestination(
                          icon: Icon(e.$1),
                          label: e.$2.split(' ').first,
                        ),
                      )
                      .toList(),
                ),
        );
      },
    );
  }

  Widget _buildProTechLoginScreen(BuildContext context, bool isDark) {
    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF060C1A) : Colors.white,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Official T01 Pitch-Black Splash Screen Lockup (Matches User Uploaded Image)
                  UptimeTechSplashLockup(
                    onContinue: () => showTechAll40ScreensSheet(
                      context,
                      onJumpToTab: (idx) => setState(() => _tabIndex = idx),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Card(
                    color: isDark ? const Color(0xFF13203B) : Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                      side: BorderSide(
                        color: UptimeTheme.teal500.withValues(alpha: 0.45),
                        width: 1.5,
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.engineering_rounded,
                                color: UptimeTheme.blue700,
                                size: 28,
                              ),
                              SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'UPTIME Technician Portal',
                                      style: TextStyle(fontSize: 19, fontWeight: FontWeight.w900),
                                    ),
                                    Text(
                                      AppConfig.tagline,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: UptimeTheme.teal600,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: UptimeTheme.teal500.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text(
                              '7-Step KYC L0–L3 • DPDP Act 2023 Masked Aadhaar • Mandatory Fatigue Safety • Instant UPI Payouts',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700),
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _phoneCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Registered Technician Mobile',
                              prefixText: '+91 ',
                              prefixIcon: Icon(Icons.phone_android_rounded),
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _otpCtrl,
                            decoration: const InputDecoration(
                              labelText: '6-Digit OTP (Dev/Demo: 123456)',
                              prefixIcon: Icon(Icons.lock_outline_rounded),
                            ),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: UptimeTheme.teal500,
                              foregroundColor: UptimeTheme.dark,
                              minimumSize: const Size.fromHeight(50),
                            ),
                            onPressed: () async {
                              await ref
                                  .read(technicianStateProvider.notifier)
                                  .loginWithOtp(_phoneCtrl.text.trim(), _otpCtrl.text.trim());
                            },
                            child: const Text(
                              'Verify OTP & Enter Field App',
                              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1: TECH HOME SCREEN (Greeting, Fatigue Banner, 60s Radar & Bento Stats)
// ═══════════════════════════════════════════════════════════════════════════
class TechHomeScreen extends ConsumerWidget {
  final TechnicianProfile tech;
  final VoidCallback onOpenActiveJob;
  final ValueChanged<int>? onJumpToTab;

  const TechHomeScreen({
    super.key,
    required this.tech,
    required this.onOpenActiveJob,
    this.onJumpToTab,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeJob = ref.watch(fieldJobProvider).valueOrNull;

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // 0. Quick-Jump Bar for All 40 Screens & Audited Compliance Screens (T35–T40)
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.verified_user_outlined, color: UptimeTheme.blue700, size: 18),
                    const SizedBox(width: 8),
                    const Expanded(
                      child: Text(
                        'Complete 40-Screen Field Suite & Regulatory Modules (T01–T40)',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900),
                      ),
                    ),
                    TextButton(
                      onPressed: () => showTechAll40ScreensSheet(
                        context,
                        onJumpToTab: (idx) => onJumpToTab?.call(idx),
                      ),
                      child: const Text('Browse All 40 →'),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: kTech40Screens
                      .where((s) => const {'T01', 'T35', 'T36', 'T37', 'T38', 'T39', 'T40'}
                          .contains(s.code))
                      .map((spec) {
                    return ActionChip(
                      avatar: Icon(spec.icon, size: 15, color: spec.accent),
                      label: Text(
                        '${spec.code}: ${spec.title.split(" ").take(3).join(" ")}',
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800),
                      ),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => TechDedicatedScreenViewer(
                              initialSpec: spec,
                              onJumpToTab: onJumpToTab,
                            ),
                          ),
                        );
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // 1. Greeting Header + Verification Badge
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Wrap(
              spacing: 14,
              runSpacing: 10,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: UptimeTheme.teal500.withValues(alpha: 0.2),
                  child: const Icon(Icons.engineering_rounded, color: UptimeTheme.teal500, size: 28),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Good morning, ${tech.fullName}!',
                      style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${tech.industryType} Specialist • Rating ${tech.ratingAvg}★ (${tech.jobsCompleted} jobs)',
                      style: const TextStyle(fontSize: 13, color: UptimeTheme.gray500),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: UptimeTheme.teal500.withValues(alpha: 0.16),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: UptimeTheme.teal500),
                  ),
                  child: Text(
                    tech.isProvisional
                        ? 'L${tech.verificationLevel}-P PROVISIONAL'
                        : 'L${tech.verificationLevel} ${tech.verificationStatus}',
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w900,
                      color: UptimeTheme.teal500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // 2. Online / Offline Toggle Card + Fatigue Simulator Switch
        Card(
          child: Column(
            children: [
              SwitchListTile(
                title: Text(
                  tech.isOnline && tech.isAvailable
                      ? 'Status: ONLINE & AVAILABLE'
                      : 'Status: OFFLINE / PAUSED',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    color: tech.isOnline && tech.isAvailable
                        ? UptimeTheme.teal500
                        : UptimeTheme.gray500,
                  ),
                ),
                subtitle: Text(
                  tech.isFatigueRestricted
                      ? 'Dispatch paused: Mandatory rest period active (${tech.fatigueResetAt})'
                      : 'PostGIS 5-second live GPS telemetry active • Consecutive Jobs: ${tech.consecutiveJobsCount}/5',
                ),
                value: tech.isOnline && tech.isAvailable,
                activeThumbColor: UptimeTheme.teal500,
                onChanged: tech.isFatigueRestricted
                    ? null
                    : (val) => ref
                        .read(technicianStateProvider.notifier)
                        .toggleAvailability(val, val),
              ),
              const Divider(height: 1),
              SwitchListTile(
                dense: true,
                title: const Text(
                  'Simulate Fatigue Alert (Test Mandatory Rest Banner & Exclusion Rule)',
                  style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
                ),
                subtitle: const Text(
                  'Triggers when consecutive_jobs >= 5 OR hours_worked_today >= 10.0h (SB-00)',
                  style: TextStyle(fontSize: 11.5),
                ),
                value: tech.isFatigueRestricted,
                activeThumbColor: UptimeTheme.danger,
                onChanged: (val) => ref
                    .read(technicianStateProvider.notifier)
                    .simulateFatigueLockout(restricted: val),
              ),
            ],
          ),
        ),

        // 3. Mandatory Fatigue Rest-Period Banner (RULES.md SB-00)
        if (tech.isFatigueRestricted) ...[
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: UptimeTheme.danger.withValues(alpha: 0.14),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: UptimeTheme.danger, width: 2),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.bedtime_rounded, color: UptimeTheme.danger, size: 24),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Mandatory Rest Period Active — Fatigue Safety Guard (SB-00)',
                        style: TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                          color: UptimeTheme.danger,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'You have worked ${tech.hoursWorkedToday} hrs today (${tech.consecutiveJobsCount} consecutive jobs • Fatigue Score ${tech.fatigueScore}/100).\n'
                  'Rest until: ${tech.fatigueResetAt ?? "Tomorrow 08:00 IST"}\n'
                  'Your profile is excluded from matching queries (AND is_fatigue_restricted = FALSE) with zero rating penalty.',
                  style: const TextStyle(fontSize: 13, height: 1.45),
                ),
              ],
            ),
          ),
        ],

        // 4. Provisional L2-P Graduation Progress Tracker
        if (tech.isProvisional) ...[
          const SizedBox(height: 14),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Provisional L2-P Graduation Progress (${tech.provisionalCompletedJobs} of 5 Supervised Jobs)',
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Current Cap: Non-emergency jobs <= ₹3,000 • Maintain >= 4.0★ across 5 jobs for automatic Full L2 upgrade.',
                    style: TextStyle(fontSize: 12, color: UptimeTheme.gray500),
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(999),
                    child: LinearProgressIndicator(
                      value: (tech.provisionalCompletedJobs / 5.0).clamp(0.0, 1.0),
                      minHeight: 8,
                      color: UptimeTheme.teal500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],

        const SizedBox(height: 16),

        // 5. Today's Bento Stats Row
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _TechStatTile(
              label: "Today's Earnings",
              value: '₹${tech.todayEarningsInr}',
              sub: '+18% vs yesterday',
              color: UptimeTheme.teal500,
              icon: Icons.currency_rupee_rounded,
            ),
            _TechStatTile(
              label: 'This Week Net',
              value: '₹${tech.weeklyEarningsInr}',
              sub: '90% payout ratio',
              color: UptimeTheme.blue500,
              icon: Icons.show_chart_rounded,
            ),
            _TechStatTile(
              label: 'Fatigue Telemetry',
              value: '${tech.fatigueScore}/100',
              sub: '${tech.hoursWorkedToday}h / 10h max',
              color: tech.isFatigueRestricted ? UptimeTheme.danger : UptimeTheme.warning,
              icon: Icons.monitor_heart_outlined,
            ),
            const _TechStatTile(
              label: 'Acceptance SLA',
              value: '96.4%',
              sub: 'Avg response 18s',
              color: UptimeTheme.industrial,
              icon: Icons.bolt_rounded,
            ),
          ],
        ),
        const SizedBox(height: 18),

        // 6. Incoming 60s Countdown Job Request Radar Card (Screen 15)
        if (activeJob != null)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0D2347), Color(0xFF1A3C6E), Color(0xFF311068)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: UptimeTheme.teal500, width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 10,
                  runSpacing: 6,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: UptimeTheme.teal500,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        '⚡ ${activeJob.urgency} DISPATCH • ${activeJob.status}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          color: UptimeTheme.dark,
                        ),
                      ),
                    ),
                    Text(
                      'Est. ₹${activeJob.estimatedPayoutInr} + ₹${activeJob.surgeBonusInr} Surge',
                      style: const TextStyle(
                        color: UptimeTheme.teal500,
                        fontWeight: FontWeight.w900,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  '${activeJob.jobNumber}: ${activeJob.equipmentSummary}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'AI Triage: ${activeJob.aiPreDiagnosis}\n📍 ${activeJob.ownerAddress}',
                  style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: UptimeTheme.teal500,
                      foregroundColor: UptimeTheme.dark,
                    ),
                    onPressed: tech.isFatigueRestricted
                        ? null
                        : () {
                            ref.read(fieldJobProvider.notifier).acceptJob(tech);
                            onOpenActiveJob();
                          },
                    icon: const Icon(Icons.check_circle_outline_rounded),
                    label: Text(
                      activeJob.status == 'REQUESTED'
                          ? 'Accept Job (00:47 Remaining) & Navigate'
                          : 'Open Active Field Copilot →',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _TechStatTile extends StatelessWidget {
  final String label;
  final String value;
  final String sub;
  final Color color;
  final IconData icon;

  const _TechStatTile({
    required this.label,
    required this.value,
    required this.sub,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(height: 10),
              Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
              const SizedBox(height: 2),
              Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              Text(sub, style: const TextStyle(fontSize: 11, color: UptimeTheme.gray500)),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2: ACTIVE JOB NAVIGATION, 500m GEOFENCE OTP, AI COPILOT & SIGNATURE PAD
// ═══════════════════════════════════════════════════════════════════════════
class _ActiveFieldJobAndCopilotScreen extends ConsumerStatefulWidget {
  final TechnicianProfile tech;
  const _ActiveFieldJobAndCopilotScreen({required this.tech});

  @override
  ConsumerState<_ActiveFieldJobAndCopilotScreen> createState() =>
      _ActiveFieldJobAndCopilotScreenState();
}

class _ActiveFieldJobAndCopilotScreenState
    extends ConsumerState<_ActiveFieldJobAndCopilotScreen> {
  final _otpCtrl = TextEditingController(text: '123456');
  final _partNameCtrl = TextEditingController(text: 'Schneider M65 Contactor Coil');
  final _partPriceCtrl = TextEditingController(text: '420');
  bool _ownerSigned = true;
  bool _liveStreamOn = false;
  String? _statusMsg;

  @override
  void dispose() {
    _otpCtrl.dispose();
    _partNameCtrl.dispose();
    _partPriceCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final job = ref.watch(fieldJobProvider).valueOrNull;
    if (job == null) {
      return const Center(child: Text('No active field job.'));
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 10,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Text(
                      '${job.jobNumber} • Status: ${job.status}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        color: UptimeTheme.teal500,
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: () => setState(() => _liveStreamOn = !_liveStreamOn),
                      icon: Icon(
                        _liveStreamOn ? Icons.videocam : Icons.videocam_off_outlined,
                        size: 16,
                      ),
                      label: Text(_liveStreamOn ? 'Owner Live Stream ON' : 'Stream Repair to Owner'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  job.equipmentSummary,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                Text(
                  'Client: ${job.ownerName} • ${job.ownerAddress} • PostGIS Distance: 120m (<= 500m Geofence PASS)',
                  style: const TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _otpCtrl,
                        enabled: !job.otpVerified,
                        decoration: const InputDecoration(
                          labelText: 'Enter Owner 6-Digit Arrival OTP (123456)',
                          prefixIcon: Icon(Icons.pin_outlined),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: job.otpVerified
                          ? null
                          : () {
                              try {
                                ref
                                    .read(fieldJobProvider.notifier)
                                    .verifyArrivalOtp(_otpCtrl.text.trim());
                                setState(() {
                                  _statusMsg =
                                      '✅ Arrival OTP + 500m Geofence Verified! Job IN_PROGRESS.';
                                });
                              } catch (e) {
                                setState(() => _statusMsg = '❌ $e');
                              }
                            },
                      child: Text(job.otpVerified ? 'Verified ✓' : 'Verify OTP'),
                    ),
                  ],
                ),
                if (_statusMsg != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    _statusMsg!,
                    style: const TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w800,
                      color: UptimeTheme.teal500,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Step 2: AI Field Copilot & LOTO Safety Checklist
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.smart_toy_outlined, color: UptimeTheme.teal500),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Field AI Repair Copilot & Safety Checklist (CORE-06)',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  job.aiPreDiagnosis,
                  style: const TextStyle(fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 10),
                ...List.generate(job.checklistSteps.length, (idx) {
                  final step = job.checklistSteps[idx];
                  final checked = job.completedSteps.contains(idx);
                  return CheckboxListTile(
                    value: checked,
                    onChanged: (_) =>
                        ref.read(fieldJobProvider.notifier).toggleChecklistStep(idx),
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    title: Text(
                      step,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  );
                }),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Step 3: Spare Parts Logger & Digital Owner Signature Pad
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Spare Parts Logged (Total: ₹${job.partsTotalInr}) & Digital Signature',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        controller: _partNameCtrl,
                        decoration: const InputDecoration(labelText: 'Part Name'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _partPriceCtrl,
                        decoration: const InputDecoration(labelText: 'Cost (₹)'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        final cost = int.tryParse(_partPriceCtrl.text.trim()) ?? 0;
                        if (cost > 0) {
                          ref.read(fieldJobProvider.notifier).addSparePart(cost);
                        }
                      },
                      child: const Text('Log Part'),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  value: _ownerSigned,
                  onChanged: (v) => setState(() => _ownerSigned = v ?? true),
                  title: const Text(
                    'Owner Digital Touch Signature Captured & Before/After Photos Verified',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: UptimeTheme.teal500,
                      foregroundColor: UptimeTheme.dark,
                    ),
                    onPressed: job.status == 'COMPLETED'
                        ? null
                        : () => ref.read(fieldJobProvider.notifier).completeJobWithSha256Lock(),
                    icon: const Icon(Icons.lock_outline_rounded),
                    label: Text(
                      job.status == 'COMPLETED'
                          ? 'Job Completed & Locked (SHA-256)'
                          : 'Complete Job & Generate SHA-256 Certificate',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                  ),
                ),
                if (job.sha256RecordHash != null) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: UptimeTheme.success.withValues(alpha: 0.14),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: UptimeTheme.success),
                    ),
                    child: Text(
                      '✅ Job Completed & Cryptographically Locked!\nSHA-256: ${job.sha256RecordHash}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: UptimeTheme.success,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3: 7-STEP KYC L0-L3 WIZARD & 10-QUESTION SAFETY MCQ SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════
class _KycVerificationAndMcqWizardScreen extends StatefulWidget {
  final TechnicianProfile tech;
  const _KycVerificationAndMcqWizardScreen({required this.tech});

  @override
  State<_KycVerificationAndMcqWizardScreen> createState() =>
      _KycVerificationAndMcqWizardScreenState();
}

class _KycVerificationAndMcqWizardScreenState
    extends State<_KycVerificationAndMcqWizardScreen> {
  String _selectedTrade = 'HV_ELECTRICIAN';
  String _selectedTrack = 'CERTIFIED';
  final int _mcqTotalScorePercent = 90;
  final int _mcqSafetyScore = 2;

  @override
  Widget build(BuildContext context) {
    final isRegulated =
        KycAndFatigueValidators.regulatedTrades.contains(_selectedTrade.toUpperCase());
    final passedMcq = KycAndFatigueValidators.evaluateSkillTest(
      totalScorePercent: _mcqTotalScorePercent,
      safetyQuestionsCorrect: _mcqSafetyScore,
    );

    final steps = [
      ('Step 1 (L0)', 'Phone OTP + Trade Selection', 'Selected: $_selectedTrade'),
      (
        'Step 2 (Track)',
        'Track A (Certified Pro) vs Track B (Experienced Ustad)',
        isRegulated
            ? 'Regulated Trade ($_selectedTrade): Strictly locked to Track A (Government License Mandatory)'
            : 'Selected Track: $_selectedTrack',
      ),
      (
        'Step 3 (L1 — DPDP Act 2023)',
        'DigiLocker Masked Aadhaar + Selfie Liveness',
        'Stored Masked Format: XXXX-XXXX-4829 (12-digit storage strictly prohibited)',
      ),
      (
        'Step 4',
        'Magic-Bytes Trade Document Upload',
        'CEA Wireman Permit PDF + NCVT ITI Certificate Verified (PDF/JPEG magic bytes)',
      ),
      (
        'Step 5',
        '10-Question Trade & LOTO Safety MCQ Exam',
        'Score: $_mcqTotalScorePercent% • Safety Questions: $_mcqSafetyScore/2 (${passedMcq ? "PASSED ✓" : "FAILED"})',
      ),
      (
        'Step 6 (L2-P → L2)',
        'Provisional L2-P Graduation Rules',
        'First 5 non-emergency jobs <= ₹3,000 with >= 4.0★ average auto-graduates to Full L2',
      ),
      (
        'Step 7 (L3 Master)',
        'Master Technician & Polygon NFT Credential',
        'Unlocked at 50+ completed jobs, >= 4.7★ rating & OEM assessment',
      ),
    ];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          '7-Step Technician KYC & Regulated Trade Verification (L0 → L3)',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Interactive Trade & Track Validator',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    'HV_ELECTRICIAN',
                    'BOILER_OPERATOR',
                    'COMMERCIAL_HVAC_GAS',
                    'CNC_MILLWRIGHT',
                    'EV_DIAGNOSTIC_TECH',
                  ].map((trade) {
                    return ChoiceChip(
                      label: Text(trade),
                      selected: _selectedTrade == trade,
                      onSelected: (_) => setState(() {
                        _selectedTrade = trade;
                        if (KycAndFatigueValidators.regulatedTrades.contains(trade)) {
                          _selectedTrack = 'CERTIFIED';
                        }
                      }),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),
        ...steps.map(
          (s) => Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: UptimeTheme.teal500,
                child: Icon(Icons.check, color: UptimeTheme.dark, size: 18),
              ),
              title: Text(
                '${s.$1}: ${s.$2}',
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
              ),
              subtitle: Text(s.$3, style: const TextStyle(fontSize: 12.5)),
            ),
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4: EARNINGS, 10% PLATFORM FEE, 1% TDS LEDGER & INSTANT UPI PAYOUTS
// ═══════════════════════════════════════════════════════════════════════════
class _EarningsGstTdsAndUpiScreen extends ConsumerWidget {
  final TechnicianProfile tech;
  const _EarningsGstTdsAndUpiScreen({required this.tech});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const grossMonth = 38450.0;
    const platformFee = grossMonth * 0.10;
    const tds194c = grossMonth * 0.01;
    const netPayout = grossMonth - platformFee - tds194c;

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [UptimeTheme.blue900, UptimeTheme.blue700, Color(0xFF0E7490)],
            ),
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'AVAILABLE ESCROW WALLET BALANCE',
                style: TextStyle(
                  color: UptimeTheme.teal500,
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '₹${tech.walletBalanceInr}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Linked Instant UPI VPA: ${tech.upiId} • Zero IMPS/UPI Withdrawal Fee',
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: UptimeTheme.teal500,
                  foregroundColor: UptimeTheme.dark,
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Instant UPI Payout sent to ${tech.upiId} ✓')),
                  );
                },
                icon: const Icon(Icons.bolt_rounded),
                label: const Text(
                  'Withdraw Full Balance to UPI Now',
                  style: TextStyle(fontWeight: FontWeight.w900),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Monthly Financial Statement & Section 194C TDS Breakdown',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 12),
                Text('Gross Job Value (30 Days): ₹${grossMonth.toStringAsFixed(0)}'),
                Text('UPTIME Platform Fee (10%): −₹${platformFee.toStringAsFixed(0)}'),
                Text('Income Tax TDS u/s 194C (1%): −₹${tds194c.toStringAsFixed(0)}'),
                const Divider(height: 20),
                Text(
                  'Net Specialist Take-Home (89%): ₹${netPayout.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: UptimeTheme.teal500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5: POLYGON BLOCKCHAIN NFT SKILL BADGES (IND-U09)
// ═══════════════════════════════════════════════════════════════════════════
class _PolygonNftBadgesScreen extends StatelessWidget {
  const _PolygonNftBadgesScreen();

  @override
  Widget build(BuildContext context) {
    final badges = [
      (
        'CEA High-Voltage & Arc-Flash Master',
        'Polygon ERC-721 Token #409',
        '0x71c...98a4f2',
        'EARNED • ON-CHAIN VERIFIED',
        UptimeTheme.teal500,
      ),
      (
        'Zero-Rework 100 CNC Spindle Repairs',
        'Polygon ERC-721 Token #812',
        '0x94b...31e0d9',
        'EARNED • ON-CHAIN VERIFIED',
        Colors.amberAccent,
      ),
      (
        'EV 400V/800V Battery Pack Isolation Specialist',
        'Polygon ERC-721 Token #954',
        '0x38f...11c8a0',
        'EARNED • ON-CHAIN VERIFIED',
        UptimeTheme.industrial,
      ),
    ];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          'On-Chain Polygon NFT Skill Badges ⭐ (IND-U09)',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 4),
        const Text(
          'Portable, tamper-proof blockchain credentials owned permanently by the technician',
          style: TextStyle(fontSize: 13, color: UptimeTheme.gray500),
        ),
        const SizedBox(height: 16),
        ...badges.map(
          (b) => Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: ListTile(
              contentPadding: const EdgeInsets.all(18),
              leading: CircleAvatar(
                radius: 24,
                backgroundColor: b.$5.withValues(alpha: 0.2),
                child: Icon(Icons.workspace_premium_rounded, color: b.$5, size: 28),
              ),
              title: Text(
                b.$1,
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(
                  '${b.$2} • Tx: ${b.$3}\nStatus: ${b.$4}',
                  style: const TextStyle(height: 1.4, fontSize: 12.5),
                ),
              ),
              isThreeLine: true,
            ),
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 6: AVAILABILITY CALENDAR, SERVICE RADIUS SLIDER & FIELD WIKI
// ═══════════════════════════════════════════════════════════════════════════
class _AvailabilityRadiusAndWikiScreen extends StatefulWidget {
  const _AvailabilityRadiusAndWikiScreen();

  @override
  State<_AvailabilityRadiusAndWikiScreen> createState() =>
      _AvailabilityRadiusAndWikiScreenState();
}

class _AvailabilityRadiusAndWikiScreenState
    extends State<_AvailabilityRadiusAndWikiScreen> {
  double _radiusKm = 12.0;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          'Service Area Radius, Shift Schedule & Field Wiki',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 14),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'PostGIS Dispatch Radius: ${_radiusKm.toStringAsFixed(0)} km around Peenya / Yeshwanthpur',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                ),
                Slider(
                  value: _radiusKm,
                  min: 2,
                  max: 25,
                  divisions: 23,
                  label: '${_radiusKm.toStringAsFixed(0)} km',
                  onChanged: (v) => setState(() => _radiusKm = v),
                ),
                const Text(
                  'Shift Hours: Mon–Sat 08:00 IST – 18:00 IST (Auto-locks after 10.0h active work per Fatigue Rule SB-00)',
                  style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
