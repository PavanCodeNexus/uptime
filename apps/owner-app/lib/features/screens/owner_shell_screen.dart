import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/app_config.dart';
import '../../core/config/theme.dart';
import '../../core/utils/format_utils.dart';
import '../../shared/widgets/common_widgets.dart';
import '../models/owner_models.dart';
import '../providers/owner_providers.dart';

class OwnerRootScreen extends ConsumerStatefulWidget {
  const OwnerRootScreen({super.key});

  @override
  ConsumerState<OwnerRootScreen> createState() => _OwnerRootScreenState();
}

class _OwnerRootScreenState extends ConsumerState<OwnerRootScreen> {
  final _phoneCtrl = TextEditingController(text: '9876543210');
  final _otpCtrl = TextEditingController(text: '123456');
  String _selectedIndustry = 'INDUSTRIAL';
  bool _otpSent = false;
  int _navIndex = 0;

  static const _navItems = [
    (Icons.space_dashboard_rounded, Icons.space_dashboard_outlined, 'Command Hub'),
    (Icons.radar_rounded, Icons.location_searching_outlined, 'Live Track & Jobs'),
    (Icons.donut_large_rounded, Icons.memory_outlined, 'Digital Twin'),
    (Icons.auto_awesome_mosaic_rounded, Icons.hub_outlined, 'Industry Lab'),
    (Icons.storefront_rounded, Icons.storefront_outlined, 'Marketplace'),
    (Icons.verified_user_rounded, Icons.shield_outlined, 'Shield & Wiki'),
  ];

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _otpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(ownerAuthProvider);
    final user = authState.valueOrNull;

    if (user == null) {
      return _buildProLoginScreen(context, authState.isLoading);
    }

    final selectedIndustry = ref.watch(selectedIndustryProvider);
    final selectedLang = ref.watch(selectedLanguageProvider);
    final themeMode = ref.watch(themeModeProvider);
    final cartItems = ref.watch(cartProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accent = UptimeTheme.industryColor(selectedIndustry);

    final pages = [
      _CommandHubTab(
        user: user,
        onReportFault: () => _openFaultTriageStudio(context),
        onNavigateTab: (idx) => setState(() => _navIndex = idx),
      ),
      _JobsAndLiveTrackingTab(onReportFault: () => _openFaultTriageStudio(context)),
      const _DigitalTwinAndFleetTab(),
      const _IndustryPowerLabTab(),
      const _MarketplaceAndRefurbishedTab(),
      _InsuranceWikiAndProfileTab(user: user),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 960;

        return Scaffold(
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(68),
            child: Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF0A1224) : UptimeTheme.blue900,
                border: Border(
                  bottom: BorderSide(
                    color: accent.withValues(alpha: 0.45),
                    width: 1.5,
                  ),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SafeArea(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [UptimeTheme.teal500, UptimeTheme.blue500],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'U↑',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          color: UptimeTheme.dark,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'U P T I M E',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2.2,
                          ),
                        ),
                        Text(
                          AppConfig.tagline,
                          style: const TextStyle(
                            color: UptimeTheme.teal500,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    if (isDesktop) ...[
                      IndustryChip(
                        industry: 'INDUSTRIAL',
                        selected: selectedIndustry == 'INDUSTRIAL',
                        onTap: () => ref.read(selectedIndustryProvider.notifier).select('INDUSTRIAL'),
                      ),
                      const SizedBox(width: 8),
                      IndustryChip(
                        industry: 'AUTOMOBILE',
                        selected: selectedIndustry == 'AUTOMOBILE',
                        onTap: () => ref.read(selectedIndustryProvider.notifier).select('AUTOMOBILE'),
                      ),
                      const SizedBox(width: 8),
                      IndustryChip(
                        industry: 'ELECTRONICS',
                        selected: selectedIndustry == 'ELECTRONICS',
                        onTap: () => ref.read(selectedIndustryProvider.notifier).select('ELECTRONICS'),
                      ),
                      const SizedBox(width: 16),
                    ],
                    // 9-Language Selector (PLT-07 / ELEC-U04)
                    PopupMenuButton<String>(
                      tooltip: 'Universal Language Switcher (9 Indian Languages)',
                      onSelected: (lang) => ref.read(selectedLanguageProvider.notifier).select(lang),
                      itemBuilder: (_) => const [
                        PopupMenuItem(value: 'EN • English', child: Text('English (EN)')),
                        PopupMenuItem(value: 'HI • हिन्दी', child: Text('हिन्दी (Hindi)')),
                        PopupMenuItem(value: 'KN • ಕನ್ನಡ', child: Text('ಕನ್ನಡ (Kannada)')),
                        PopupMenuItem(value: 'TA • தமிழ்', child: Text('தமிழ் (Tamil)')),
                        PopupMenuItem(value: 'TE • తెలుగు', child: Text('తెలుగు (Telugu)')),
                        PopupMenuItem(value: 'ML • മലയാളം', child: Text('മലയാളം (Malayalam)')),
                        PopupMenuItem(value: 'MR • मराठी', child: Text('मराठी (Marathi)')),
                        PopupMenuItem(value: 'GU • ગુજરાતી', child: Text('ગુજરાતી (Gujarati)')),
                        PopupMenuItem(value: 'BN • বাংলা', child: Text('বাংলা (Bengali)')),
                      ],
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: Colors.white24),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.translate_rounded, color: UptimeTheme.teal500, size: 15),
                            const SizedBox(width: 6),
                            Text(
                              selectedLang.split(' ').first,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // AI Chatbot Assistant Button (PLT-04)
                    IconButton(
                      tooltip: 'UPTIME Gemini AI Assistant',
                      icon: const Icon(Icons.smart_toy_outlined, color: UptimeTheme.teal500),
                      onPressed: () => _openAiAssistantSheet(context),
                    ),
                    // Shopping Cart Button
                    Stack(
                      children: [
                        IconButton(
                          tooltip: 'Spare Parts Cart',
                          icon: const Icon(Icons.shopping_bag_outlined, color: Colors.white),
                          onPressed: () => setState(() => _navIndex = 4),
                        ),
                        if (cartItems.isNotEmpty)
                          Positioned(
                            right: 6,
                            top: 6,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: UptimeTheme.teal500,
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                '${cartItems.length}',
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: UptimeTheme.dark,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                    // Dark / Light Mode Toggle
                    IconButton(
                      tooltip: 'Switch Dark / Light Theme',
                      icon: Icon(
                        themeMode == ThemeMode.dark
                            ? Icons.light_mode_outlined
                            : Icons.dark_mode_outlined,
                        color: Colors.amberAccent,
                      ),
                      onPressed: () => ref.read(themeModeProvider.notifier).toggle(),
                    ),
                    const SizedBox(width: 4),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: UptimeTheme.teal500,
                        foregroundColor: UptimeTheme.dark,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      ),
                      onPressed: () => _openFaultTriageStudio(context),
                      icon: const Icon(Icons.bolt_rounded, size: 18),
                      label: const Text('Report Fault'),
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
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(
                        margin: const EdgeInsets.all(16),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          gradient: UptimeTheme.industryGradient(selectedIndustry),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const CircleAvatar(
                                  radius: 18,
                                  backgroundColor: Colors.white24,
                                  child: Icon(Icons.person, color: Colors.white),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        user.fullName,
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w800,
                                          fontSize: 14,
                                        ),
                                      ),
                                      Text(
                                        user.subscriptionTier.replaceAll('_', ' '),
                                        style: const TextStyle(
                                          color: UptimeTheme.teal100,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'CO₂ Saved: ${user.carbonCreditsKg} kg • Wallet: ${FormatUtils.formatInr(user.walletBalance)}',
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
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
                            final selected = _navIndex == idx;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: ListTile(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                tileColor: selected
                                    ? accent.withValues(alpha: 0.16)
                                    : Colors.transparent,
                                leading: Icon(
                                  item.$2,
                                  color: selected ? UptimeTheme.teal500 : UptimeTheme.gray500,
                                ),
                                title: Text(
                                  item.$3,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
                                    color: selected
                                        ? (isDark ? Colors.white : UptimeTheme.blue700)
                                        : UptimeTheme.gray500,
                                  ),
                                ),
                                onTap: () => setState(() => _navIndex = idx),
                              ),
                            );
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: OutlinedButton.icon(
                          onPressed: () => _triggerEmergencySosModal(context),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: UptimeTheme.danger,
                            side: const BorderSide(color: UptimeTheme.danger, width: 1.5),
                          ),
                          icon: const Icon(Icons.sos_rounded),
                          label: const Text('60s Emergency SOS'),
                        ),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: IndexedStack(
                  index: _navIndex,
                  children: pages,
                ),
              ),
            ],
          ),
          floatingActionButton: selectedIndustry == 'AUTOMOBILE' && !isDesktop
              ? FloatingActionButton.extended(
                  backgroundColor: UptimeTheme.danger,
                  foregroundColor: Colors.white,
                  onPressed: () => _triggerEmergencySosModal(context),
                  icon: const Icon(Icons.sos_rounded),
                  label: const Text(
                    'SOS 60s AUCTION',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                )
              : null,
          bottomNavigationBar: isDesktop
              ? null
              : NavigationBar(
                  selectedIndex: _navIndex,
                  onDestinationSelected: (idx) => setState(() => _navIndex = idx),
                  destinations: _navItems
                      .map(
                        (e) => NavigationDestination(
                          icon: Icon(e.$2),
                          label: e.$3.split(' ').first,
                        ),
                      )
                      .toList(),
                ),
        );
      },
    );
  }

  // ── PRO MAX GLASSMORPHIC LOGIN SCREEN ────────────────────────────────────
  Widget _buildProLoginScreen(BuildContext context, bool isLoading) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF060C1A), Color(0xFF0D2347), Color(0xFF132B52)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 480),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Card(
                      color: isDark ? const Color(0xFF13203B) : Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                        side: BorderSide(
                          color: UptimeTheme.teal500.withValues(alpha: 0.4),
                          width: 1.5,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [UptimeTheme.teal500, UptimeTheme.blue500],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Text(
                                    'U↑',
                                    style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w900,
                                      color: UptimeTheme.dark,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'U P T I M E',
                                        style: TextStyle(
                                          fontSize: 22,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 2.5,
                                        ),
                                      ),
                                      Text(
                                        AppConfig.tagline,
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w700,
                                          color: UptimeTheme.teal500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Owner Command Sign In (India-First OTP)',
                              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _phoneCtrl,
                              keyboardType: TextInputType.phone,
                              decoration: const InputDecoration(
                                labelText: '10-Digit Mobile Number',
                                prefixText: '+91 ',
                                prefixIcon: Icon(Icons.phone_android_rounded),
                              ),
                            ),
                            const SizedBox(height: 14),
                            const Text(
                              'Select Primary Industry Vertical',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: ['INDUSTRIAL', 'AUTOMOBILE', 'ELECTRONICS']
                                  .map(
                                    (ind) => IndustryChip(
                                      industry: ind,
                                      selected: _selectedIndustry == ind,
                                      onTap: () {
                                        setState(() => _selectedIndustry = ind);
                                        ref.read(selectedIndustryProvider.notifier).select(ind);
                                      },
                                    ),
                                  )
                                  .toList(),
                            ),
                            const SizedBox(height: 16),
                            if (_otpSent) ...[
                              TextField(
                                controller: _otpCtrl,
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(
                                  labelText: '6-Digit OTP (Dev/Demo: 123456)',
                                  prefixIcon: Icon(Icons.lock_outline_rounded),
                                ),
                              ),
                              const SizedBox(height: 14),
                            ],
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: UptimeTheme.teal500,
                                foregroundColor: UptimeTheme.dark,
                                minimumSize: const Size.fromHeight(50),
                              ),
                              onPressed: isLoading
                                  ? null
                                  : () async {
                                      if (!_otpSent) {
                                        setState(() => _otpSent = true);
                                        await ref
                                            .read(ownerAuthProvider.notifier)
                                            .sendOtp(_phoneCtrl.text.trim());
                                      } else {
                                        await ref.read(ownerAuthProvider.notifier).verifyOtp(
                                              phone: _phoneCtrl.text.trim(),
                                              otp: _otpCtrl.text.trim(),
                                              industryPreference: _selectedIndustry,
                                            );
                                      }
                                    },
                              child: Text(
                                _otpSent ? 'Verify OTP & Continue' : 'Send OTP (123456)',
                                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      alignment: WrapAlignment.center,
                      children: const [
                        _HeroPill(icon: Icons.graphic_eq, text: 'Sound Fingerprinting'),
                        _HeroPill(icon: Icons.alt_route, text: '3-Path Owner Choice'),
                        _HeroPill(icon: Icons.verified_user_outlined, text: 'SHA-256 Tamper-Proof'),
                        _HeroPill(icon: Icons.gps_fixed, text: '500m PostGIS Geofence'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _openFaultTriageStudio(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => _FaultReportAndThreePathScreen(
          onJobBooked: () => setState(() => _navIndex = 1),
        ),
      ),
    );
  }

  void _triggerEmergencySosModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.sos_rounded, color: UptimeTheme.danger, size: 28),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                '60-Second Emergency SOS Auction (CORE-12)',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 17),
              ),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Broadcasting CRITICAL breakdown alert to all verified L2/L3 technicians within 10 km (Provisional L2-P & Fatigue-Restricted excluded).',
              style: TextStyle(fontSize: 13, height: 1.4),
            ),
            SizedBox(height: 14),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: UptimeTheme.teal500,
                child: Text('1', style: TextStyle(fontWeight: FontWeight.w900, color: UptimeTheme.dark)),
              ),
              title: Text('Raju Sharma • Bid ₹1,150 • ETA 6 mins', style: TextStyle(fontWeight: FontWeight.w800)),
              subtitle: Text('4.9★ • 312 jobs • CEA HV Licensed'),
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: UptimeTheme.blue500,
                child: Text('2', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
              ),
              title: Text('Karthik Gowda • Bid ₹1,080 • ETA 11 mins', style: TextStyle(fontWeight: FontWeight.w800)),
              subtitle: Text('4.8★ • 148 jobs • PLC/VFD Certified'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: UptimeTheme.danger,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              final techs = await ref.read(rankedTechniciansProvider('INDUSTRIAL').future);
              if (techs.isNotEmpty) {
                await ref.read(ownerJobsProvider.notifier).createJobWithPath(
                      title: 'EMERGENCY SOS AUCTION: Critical Breakdown Dispatch',
                      industry: ref.read(selectedIndustryProvider),
                      urgency: 'CRITICAL',
                      resolutionPath: 'EMERGENCY_AUCTION_60S',
                      technician: techs.first,
                    );
              }
              if (ctx.mounted) Navigator.pop(ctx);
              setState(() => _navIndex = 1);
            },
            icon: const Icon(Icons.flash_on_rounded),
            label: const Text('Accept Winning Bid & Dispatch'),
          ),
        ],
      ),
    );
  }

  void _openAiAssistantSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.smart_toy_rounded, color: UptimeTheme.teal500, size: 28),
                SizedBox(width: 10),
                Text(
                  'UPTIME Gemini 1.5 Flash Assistant (PLT-04)',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: UptimeTheme.teal500.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                '🤖 "Namaste Pavan! Your Mazak CNC #4 spindle bearing harmonic rose by +4.2 dB today. Scheduling preventive bearing replacement now saves ₹14,200 in unplanned shaft seizure downtime."',
                style: TextStyle(fontSize: 13, height: 1.45),
              ),
            ),
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _openFaultTriageStudio(context);
                },
                child: const Text('Launch AI Fault Triage Studio →'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroPill extends StatelessWidget {
  final IconData icon;
  final String text;
  const _HeroPill({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: UptimeTheme.teal500, size: 16),
          const SizedBox(width: 7),
          Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1: COMMAND HUB DASHBOARD (Bento Grid + Industry Switcher + KPIs)
// ═══════════════════════════════════════════════════════════════════════════
class _CommandHubTab extends ConsumerWidget {
  final OwnerUser user;
  final VoidCallback onReportFault;
  final ValueChanged<int> onNavigateTab;

  const _CommandHubTab({
    required this.user,
    required this.onReportFault,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndustry = ref.watch(selectedIndustryProvider);
    final jobs = ref.watch(ownerJobsProvider).valueOrNull ?? const [];
    final assets = ref.watch(ownerAssetsProvider).valueOrNull ?? const [];
    final accent = UptimeTheme.industryColor(selectedIndustry);

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // Industry Switcher Bar (Mobile/Tablet visible)
        Wrap(
          spacing: 10,
          runSpacing: 10,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            const Text(
              'Active Vertical:',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
            ),
            ...['INDUSTRIAL', 'AUTOMOBILE', 'ELECTRONICS'].map(
              (ind) => IndustryChip(
                industry: ind,
                selected: selectedIndustry == ind,
                onTap: () => ref.read(selectedIndustryProvider.notifier).select(ind),
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),

        // Hero Banner (keeps exact test string 'Machine, Vehicle or Device Down?')
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: UptimeTheme.industryGradient(selectedIndustry),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: accent.withValues(alpha: 0.35),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
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
                      color: Colors.black.withValues(alpha: 0.28),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '$selectedIndustry AI COMMAND CENTER',
                      style: const TextStyle(
                        color: UptimeTheme.teal500,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                  const Icon(Icons.verified_outlined, color: UptimeTheme.teal500, size: 18),
                  const Text(
                    'PostGIS + Gemini 1.5 Flash Live',
                    style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                'Machine, Vehicle or Device Down?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.4,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Record 10s machine sound or upload photos → Gemini AI diagnoses root cause in 30s → You choose Path A (Free AI Copilot), Path B (Live Video Consult ₹149 credit), or Path C (Verified Specialist).',
                style: TextStyle(color: Colors.white70, fontSize: 13.5, height: 1.45),
              ),
              const SizedBox(height: 18),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: UptimeTheme.teal500,
                      foregroundColor: UptimeTheme.dark,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    ),
                    onPressed: onReportFault,
                    icon: const Icon(Icons.bolt_rounded),
                    label: const Text(
                      'Report a Fault — Get AI Diagnosis in 30s',
                      style: TextStyle(fontWeight: FontWeight.w900),
                    ),
                  ),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white54),
                    ),
                    onPressed: () => onNavigateTab(3),
                    icon: const Icon(Icons.science_outlined),
                    label: const Text('Explore 19 World-First Tools'),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Bento KPI Grid (4 Metrics)
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _BentoMetricCard(
              title: 'Preventive Savings',
              value: FormatUtils.formatInr(12400),
              subtitle: 'Saved via Digital Twin alerts',
              icon: Icons.trending_up_rounded,
              color: UptimeTheme.teal500,
            ),
            _BentoMetricCard(
              title: 'Downtime Prevented',
              value: '42.5 hrs',
              subtitle: '99.4% SLA adherence',
              icon: Icons.timer_outlined,
              color: UptimeTheme.blue500,
            ),
            _BentoMetricCard(
              title: 'Carbon Credits (PLT-06)',
              value: '${user.carbonCreditsKg} kg CO₂',
              subtitle: 'Earned by repairing vs replacing',
              icon: Icons.eco_outlined,
              color: UptimeTheme.success,
            ),
            _BentoMetricCard(
              title: 'Fatigue Safety Filter',
              value: '100% Active',
              subtitle: '0 fatigued techs dispatched',
              icon: Icons.health_and_safety_outlined,
              color: UptimeTheme.industrial,
            ),
          ],
        ),
        const SizedBox(height: 22),

        // Active Dispatch Banner
        if (jobs.isNotEmpty) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Live Active Dispatch & Telemetry',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
              ),
              TextButton.icon(
                onPressed: () => onNavigateTab(1),
                icon: const Icon(Icons.map_outlined, size: 16),
                label: const Text('Open Full Live Map →'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${jobs.first.jobNumber} • ${jobs.first.resolutionPath}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: UptimeTheme.teal500,
                        ),
                      ),
                      StatusBadge(status: jobs.first.status),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    jobs.first.title,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Specialist: ${jobs.first.technicianName} (${jobs.first.technicianRating}★) • ETA ${jobs.first.etaMinutes} mins • Arrival OTP: ${jobs.first.arrivalOtp}',
                    style: const TextStyle(fontSize: 13, color: UptimeTheme.gray500),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 22),
        ],

        // Digital Twin & Mood Score Summary Cards
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Digital Twin, Mood Score ⭐ & Silent Killer Alerts',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
            ),
            TextButton(
              onPressed: () => onNavigateTab(2),
              child: const Text('Inspect Components →'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...assets.map(
          (a) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
              leading: CircularHealthGauge(
                score: a.healthScore,
                label: 'HEALTH',
                size: 58,
              ),
              title: Row(
                children: [
                  Expanded(
                    child: Text(
                      a.name,
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: UptimeTheme.industryColor(a.category).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      'Mood ${a.moodScore}/100',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: UptimeTheme.industryColor(a.category),
                      ),
                    ),
                  ),
                ],
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(
                  '${a.moodLabel}\n⚠️ ${a.silentKillerAlert}',
                  style: const TextStyle(fontSize: 12.5, height: 1.4),
                ),
              ),
              isThreeLine: true,
              trailing: IconButton(
                icon: const Icon(Icons.chevron_right_rounded),
                onPressed: () => onNavigateTab(2),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _BentoMetricCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _BentoMetricCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 235,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(icon, color: color, size: 20),
                  ),
                  const Spacer(),
                  Icon(Icons.north_east_rounded, color: color, size: 16),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                value,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 11, color: UptimeTheme.gray500),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2: UBER-STYLE LIVE TRACKING, 500m GEOFENCE OTP & SHA-256 CERTIFICATES
// ═══════════════════════════════════════════════════════════════════════════
class _JobsAndLiveTrackingTab extends ConsumerStatefulWidget {
  final VoidCallback onReportFault;
  const _JobsAndLiveTrackingTab({required this.onReportFault});

  @override
  ConsumerState<_JobsAndLiveTrackingTab> createState() => _JobsAndLiveTrackingTabState();
}

class _JobsAndLiveTrackingTabState extends ConsumerState<_JobsAndLiveTrackingTab> {
  final _otpVerifyCtrl = TextEditingController(text: '123456');

  @override
  void dispose() {
    _otpVerifyCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final jobs = ref.watch(ownerJobsProvider).valueOrNull ?? const [];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Live Dispatch Radar & Tamper-Proof Ledger',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                ),
                Text(
                  'Real-time WebSocket GPS + 500m PostGIS Geofence OTP + 18% GST Invoices',
                  style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                ),
              ],
            ),
            ElevatedButton.icon(
              onPressed: widget.onReportFault,
              icon: const Icon(Icons.add_circle_outline, size: 18),
              label: const Text('New Fault Report'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        if (jobs.isNotEmpty)
          SimulatedLiveMapCard(
            technicianName: jobs.first.technicianName,
            etaMinutes: jobs.first.etaMinutes,
            distanceMeters: jobs.first.distanceMeters,
            destinationLabel: 'Peenya Industrial Area Stage IV, Bengaluru',
          ),
        const SizedBox(height: 18),
        ...jobs.map(
          (job) => Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${job.jobNumber} • ${job.resolutionPath}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w900,
                          color: UptimeTheme.teal500,
                          fontSize: 12.5,
                        ),
                      ),
                      StatusBadge(status: job.status),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    job.title,
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Assigned Specialist: ${job.technicianName} (${job.technicianRating}★) • Contact: +91 ${job.technicianPhone}',
                    style: const TextStyle(fontSize: 13, color: UptimeTheme.gray500),
                  ),
                  const SizedBox(height: 14),
                  // 5-Step Status Stepper
                  _JobStatusStepper(status: job.status),
                  const SizedBox(height: 14),
                  // Dual-Layer Arrival Verification (CORE-05 / IND-U07)
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: UptimeTheme.teal500.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: UptimeTheme.teal500.withValues(alpha: 0.4)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.verified_user_rounded, color: UptimeTheme.teal500, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                job.arrivalOtpVerified
                                    ? 'Arrival OTP Verified ✓ • PostGIS 500m Geofence Passed (${job.distanceMeters.toInt()}m)'
                                    : 'Share Arrival OTP: ${job.arrivalOtp} • Tech Distance: ${job.distanceMeters.toInt()}m (<= 500m Required)',
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                              ),
                            ),
                          ],
                        ),
                        if (!job.arrivalOtpVerified) ...[
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _otpVerifyCtrl,
                                  decoration: const InputDecoration(
                                    labelText: 'Confirm 6-Digit Arrival OTP (123456)',
                                    isDense: true,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              ElevatedButton(
                                onPressed: () {
                                  ref
                                      .read(ownerJobsProvider.notifier)
                                      .verifyArrivalOtp(job.id, _otpVerifyCtrl.text);
                                },
                                child: const Text('Verify Arrival'),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  // 18% GST Invoice Breakdown
                  Text(
                    'Labor: ${FormatUtils.formatInr(job.laborCharge)} + Parts: ${FormatUtils.formatInr(job.partsCharge)}'
                    '${job.videoConsultFeeCredited ? " − Video Credit: ₹149" : ""}\n'
                    'CGST (9%): ${FormatUtils.formatInr(job.cgst)} + SGST (9%): ${FormatUtils.formatInr(job.sgst)} '
                    '→ Total: ${FormatUtils.formatInr(job.totalAmount)}',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, height: 1.45),
                  ),
                  if (job.isLocked && job.recordHash != null) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: UptimeTheme.success.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.lock_rounded, color: UptimeTheme.success, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'SHA-256 Tamper-Proof Certificate (IND-U06): ${job.recordHash}',
                              style: const TextStyle(
                                fontSize: 11.5,
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.w700,
                                color: UptimeTheme.success,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 14),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      if (!job.isLocked)
                        ElevatedButton.icon(
                          onPressed: () {
                            ref.read(ownerJobsProvider.notifier).completeAndLockJob(job.id);
                          },
                          icon: const Icon(Icons.verified_outlined, size: 18),
                          label: const Text('Mark Complete & Lock SHA-256'),
                        ),
                      OutlinedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                'Razorpay Escrow Released (${FormatUtils.formatInr(job.totalAmount)}) for ${job.jobNumber} ✓',
                              ),
                            ),
                          );
                        },
                        icon: const Icon(Icons.account_balance_wallet_outlined, size: 18),
                        label: const Text('Approve & Release Escrow'),
                      ),
                      OutlinedButton.icon(
                        onPressed: () {
                          ref.read(ownerJobsProvider.notifier).rateJob(job.id, 5);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('5★ Trust Score submitted for specialist!')),
                          );
                        },
                        icon: const Icon(Icons.star_rounded, color: Colors.amber, size: 18),
                        label: Text(job.userRating != null ? 'Rated ${job.userRating}★' : 'Rate 5★ (CORE-07)'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _JobStatusStepper extends StatelessWidget {
  final String status;
  const _JobStatusStepper({required this.status});

  @override
  Widget build(BuildContext context) {
    const stages = ['POSTED', 'MATCHED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'];
    final currentIdx = stages.indexOf(status.toUpperCase()).clamp(0, stages.length - 1);

    return Row(
      children: List.generate(stages.length, (i) {
        final active = i <= currentIdx;
        return Expanded(
          child: Container(
            margin: const EdgeInsets.only(right: 4),
            padding: const EdgeInsets.symmetric(vertical: 6),
            decoration: BoxDecoration(
              color: active
                  ? UptimeTheme.teal500.withValues(alpha: 0.2)
                  : Colors.grey.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(
                color: active ? UptimeTheme.teal500 : Colors.transparent,
              ),
            ),
            child: Text(
              stages[i],
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: FontWeight.w800,
                color: active ? UptimeTheme.teal500 : UptimeTheme.gray500,
              ),
            ),
          ),
        );
      }),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3: DIGITAL TWIN, CIRCULAR HEALTH GAUGE, MOOD SCORE & FLEET CONSOLE
// ═══════════════════════════════════════════════════════════════════════════
class _DigitalTwinAndFleetTab extends ConsumerWidget {
  const _DigitalTwinAndFleetTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assets = ref.watch(ownerAssetsProvider).valueOrNull ?? const [];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Digital Twin, Component Health & Mood Score ⭐',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                  ),
                  Text(
                    'IND-U03 ·IND-U05 Predictive Failure Windows · AUTO-U02 Vehicle Mood · ELEC-U02 Silent Killer',
                    style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                  ),
                ],
              ),
            ),
            ElevatedButton.icon(
              onPressed: () => _showAddAssetDialog(context, ref),
              icon: const Icon(Icons.add_box_outlined, size: 18),
              label: const Text('Add Asset Twin'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ...assets.map(
          (asset) => Card(
            margin: const EdgeInsets.only(bottom: 18),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      CircularHealthGauge(
                        score: asset.healthScore,
                        label: 'TWIN SCORE',
                        size: 96,
                      ),
                      const SizedBox(width: 18),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Wrap(
                              spacing: 8,
                              runSpacing: 6,
                              children: [
                                StatusBadge(status: asset.category),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: UptimeTheme.teal500.withValues(alpha: 0.16),
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Text(
                                    'Mood Score: ${asset.moodScore}/100',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w800,
                                      color: UptimeTheme.teal500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              asset.name,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                            ),
                            Text(
                              'Model: ${asset.modelNumber} • Last Service: ${asset.lastServiceDate} • Next Predicted: ${asset.nextPredictedService}',
                              style: const TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Mood Telemetry: ${asset.moodLabel}',
                              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
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
                      color: UptimeTheme.warning.withValues(alpha: 0.14),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: UptimeTheme.warning.withValues(alpha: 0.5)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.warning_amber_rounded, color: UptimeTheme.warning),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            asset.silentKillerAlert,
                            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Sub-Assembly Telemetry & Predictive Failure Windows',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 10),
                  ...asset.components.map(
                    (c) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${c.name} (${c.telemetryReading})',
                                style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
                              ),
                              Text(
                                '${c.healthPercent}% • Window: ${c.predictedFailureWindow}',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: c.healthPercent < 75
                                      ? UptimeTheme.warning
                                      : UptimeTheme.teal500,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 5),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(999),
                            child: LinearProgressIndicator(
                              value: c.healthPercent / 100.0,
                              minHeight: 8,
                              backgroundColor: Colors.grey.withValues(alpha: 0.2),
                              color: c.healthPercent < 75
                                  ? UptimeTheme.warning
                                  : UptimeTheme.teal500,
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
      ],
    );
  }

  void _showAddAssetDialog(BuildContext context, WidgetRef ref) {
    final nameCtrl = TextEditingController();
    final modelCtrl = TextEditingController();
    String category = ref.read(selectedIndustryProvider);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Register New Digital Twin Asset'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Machine / Vehicle / Device Name'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: modelCtrl,
              decoration: const InputDecoration(labelText: 'Serial / Registration / Model #'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.trim().isNotEmpty) {
                ref.read(ownerAssetsProvider.notifier).addAsset(
                      name: nameCtrl.text.trim(),
                      category: category,
                      modelNumber: modelCtrl.text.trim().isEmpty ? 'STD-2026' : modelCtrl.text.trim(),
                    );
              }
              Navigator.pop(ctx);
            },
            child: const Text('Create Digital Twin'),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4: INDUSTRY POWER LAB (ALL 19 WORLD-FIRST & INDUSTRY-SPECIFIC TOOLS)
// ═══════════════════════════════════════════════════════════════════════════
class _IndustryPowerLabTab extends StatefulWidget {
  const _IndustryPowerLabTab();

  @override
  State<_IndustryPowerLabTab> createState() => _IndustryPowerLabTabState();
}

class _IndustryPowerLabTabState extends State<_IndustryPowerLabTab> {
  double _deviceAgeYears = 3.5;
  double _repairCostInr = 3200;
  double _replaceCostInr = 28000;
  String _selectedToolResult =
      'Select any World-First or Industry-Specific module below to run interactive diagnostics.';

  @override
  Widget build(BuildContext context) {
    final ratio = (_repairCostInr / _replaceCostInr) * 100;
    final recommendRepair = ratio < 45 && _deviceAgeYears < 6;

    final powerTools = [
      (
        'AUTO-U03',
        'Pre-Purchase 50-Point Used Vehicle AI Scan ⭐',
        'AUTOMOBILE',
        Icons.car_repair_rounded,
        'Acoustic engine knock + OBD-II odometer rollback + chassis weld scan → Generates buyer negotiation report (Est. ₹18,500 leverage).',
      ),
      (
        'AUTO-C02',
        'Dashboard Warning Light Vision Reader',
        'AUTOMOBILE',
        Icons.warning_rounded,
        'Point camera at instrument cluster → Gemini Vision identifies MIL / DPF / HV Battery Isolation icon and safe-to-drive distance.',
      ),
      (
        'AUTO-C06 / C12',
        'EV High-Voltage SOS, Tyre/Fuel & Challan Hub',
        'AUTOMOBILE',
        Icons.ev_station_rounded,
        'Mobile 7.2kW EV emergency charge van dispatch + e-Challan lookup (0 pending challans on KA-01-MJ-2026).',
      ),
      (
        'ELEC-U01',
        'Epidemic Batch Defect Monitor ⭐',
        'ELECTRONICS',
        Icons.coronavirus_outlined,
        'ALERT: 142 reports of firmware capacitor surge on Model X-420 PCB across Bengaluru this week → Free OEM recall claim unlocked.',
      ),
      (
        'ELEC-U02',
        'Silent Killer Vampire Power Auditor ⭐',
        'ELECTRONICS',
        Icons.bolt_rounded,
        'Detected +1.8 kWh/day excess draw on Daikin 1.8T AC due to clogged condenser fins (Costing ₹460/month extra on BESCOM bill).',
      ),
      (
        'ELEC-C05 / U05',
        'Privacy Data Lockbox & End-of-Life Memory Reel ⭐',
        'ELECTRONICS',
        Icons.enhanced_encryption_outlined,
        'Cryptographic NVMe/SSD folder lock before technician handover + CPCB Certified E-Waste recycling certificate & ₹1,800 salvage credit.',
      ),
      (
        'IND-U04 / U05',
        'MSME Price Negotiation & Downtime Predictor ⭐',
        'INDUSTRIAL',
        Icons.precision_manufacturing_rounded,
        'Counter-offer bidding with SLA penalty protection + 30-day spindle/VFD failure probability curves.',
      ),
      (
        'AUTO-C10 / PLT-05',
        'Enterprise Fleet & Multi-Factory Console',
        'INDUSTRIAL',
        Icons.domain_rounded,
        'Manage 24 CNC machines & 12 commercial EV vans under one GSTIN with consolidated monthly tax invoicing.',
      ),
    ];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          'Industry Power Lab — 19 World-First Modules',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 4),
        const Text(
          'Interactive Industrial, Automobile & Electronics specialized diagnostic engines',
          style: TextStyle(fontSize: 13, color: UptimeTheme.gray500),
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: UptimeTheme.teal500.withValues(alpha: 0.14),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: UptimeTheme.teal500),
          ),
          child: Row(
            children: [
              const Icon(Icons.auto_awesome, color: UptimeTheme.teal500),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  _selectedToolResult,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, height: 1.4),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Interactive ELEC-C02 Repair vs Replace AI Advisor Card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.calculate_outlined, color: UptimeTheme.teal500),
                    SizedBox(width: 8),
                    Text(
                      'ELEC-C02: Interactive Repair vs Replace AI Advisor',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Equipment Age: ${_deviceAgeYears.toStringAsFixed(1)} yrs • Est. Repair: ${FormatUtils.formatInr(_repairCostInr)} • New Replacement: ${FormatUtils.formatInr(_replaceCostInr)}',
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
                Slider(
                  value: _repairCostInr,
                  min: 500,
                  max: 15000,
                  divisions: 29,
                  label: FormatUtils.formatInr(_repairCostInr),
                  onChanged: (v) => setState(() => _repairCostInr = v),
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: (recommendRepair ? UptimeTheme.success : UptimeTheme.warning)
                        .withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    recommendRepair
                        ? '✅ AI VERDICT: REPAIR RECOMMENDED (${ratio.toStringAsFixed(0)}% of replacement cost). Saves ${FormatUtils.formatInr(_replaceCostInr - _repairCostInr)} + 14.2 kg CO₂!'
                        : '⚠️ AI VERDICT: CONSIDER CERTIFIED GRADE A+ UPGRADE (${ratio.toStringAsFixed(0)}% cost ratio). Claim ₹2,400 End-of-Life Salvage Credit!',
                    style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Grid of 8 Specialized Industry Tools
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: powerTools.map((tool) {
            final color = UptimeTheme.industryColor(tool.$3);
            return SizedBox(
              width: 340,
              child: Card(
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () => setState(() => _selectedToolResult = '[${tool.$1}] ${tool.$5}'),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: color.withValues(alpha: 0.16),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '${tool.$1} • ${tool.$3}',
                                style: TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w900,
                                  color: color,
                                ),
                              ),
                            ),
                            Icon(tool.$4, color: color, size: 22),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          tool.$2,
                          style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          tool.$5,
                          style: const TextStyle(fontSize: 12, color: UptimeTheme.gray500, height: 1.4),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Run Diagnostic →',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: color,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5: SPARE PARTS MARKETPLACE, GRADE A+ REFURBISHED & SHOPPING CART
// ═══════════════════════════════════════════════════════════════════════════
class _MarketplaceAndRefurbishedTab extends ConsumerStatefulWidget {
  const _MarketplaceAndRefurbishedTab();

  @override
  ConsumerState<_MarketplaceAndRefurbishedTab> createState() =>
      _MarketplaceAndRefurbishedTabState();
}

class _MarketplaceAndRefurbishedTabState extends ConsumerState<_MarketplaceAndRefurbishedTab> {
  String _filter = 'ALL';

  @override
  Widget build(BuildContext context) {
    final catalog = ref.watch(marketplaceCatalogProvider);
    final cart = ref.watch(cartProvider);
    final filtered = _filter == 'ALL'
        ? catalog
        : catalog.where((e) => e.category == _filter).toList();
    final cartTotal = cart.fold<double>(0, (sum, e) => sum + e.priceInr);

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'OEM Spare Parts, Pro Tools & Grade A+ Refurbished Store',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                  ),
                  Text(
                    'ELEC-C06 QR-Verified Spares • ELEC-C10 Certified Refurbished with 6-Month Shield',
                    style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                  ),
                ],
              ),
            ),
            if (cart.isNotEmpty)
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: UptimeTheme.teal500,
                  foregroundColor: UptimeTheme.dark,
                ),
                onPressed: () {
                  ref.read(cartProvider.notifier).clear();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Order placed for ${FormatUtils.formatInr(cartTotal)}! Direct technician delivery scheduled.',
                      ),
                    ),
                  );
                },
                icon: const Icon(Icons.shopping_cart_checkout_rounded),
                label: Text('Checkout (${FormatUtils.formatInr(cartTotal)})'),
              ),
          ],
        ),
        const SizedBox(height: 14),
        Wrap(
          spacing: 8,
          children: [
            ChoiceChip(
              label: const Text('All Items'),
              selected: _filter == 'ALL',
              onSelected: (_) => setState(() => _filter = 'ALL'),
            ),
            ChoiceChip(
              label: const Text('OEM Spare Parts'),
              selected: _filter == 'SPARE_PART',
              onSelected: (_) => setState(() => _filter = 'SPARE_PART'),
            ),
            ChoiceChip(
              label: const Text('Diagnostic Tools'),
              selected: _filter == 'TOOL',
              onSelected: (_) => setState(() => _filter = 'TOOL'),
            ),
            ChoiceChip(
              label: const Text('Grade A+ Refurbished'),
              selected: _filter == 'REFURBISHED',
              onSelected: (_) => setState(() => _filter = 'REFURBISHED'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 14,
          runSpacing: 14,
          children: filtered.map((item) {
            final color = UptimeTheme.industryColor(item.industry);
            return SizedBox(
              width: 330,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item.qualityBadge,
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w800,
                                color: color,
                              ),
                            ),
                          ),
                          Text(
                            '${item.warrantyMonths}M Warranty',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: UptimeTheme.teal500,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        item.name,
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Compatible: ${item.compatibility}',
                        style: const TextStyle(fontSize: 12, color: UptimeTheme.gray500),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                FormatUtils.formatInr(item.priceInr),
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: UptimeTheme.teal500,
                                ),
                              ),
                              Text(
                                'MRP ${FormatUtils.formatInr(item.mrpInr)}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: UptimeTheme.gray500,
                                  decoration: TextDecoration.lineThrough,
                                ),
                              ),
                            ],
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              ref.read(cartProvider.notifier).addItem(item);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Added ${item.name} to cart')),
                              );
                            },
                            icon: const Icon(Icons.add_shopping_cart_rounded, size: 16),
                            label: const Text('Add'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 6: MICRO-INSURANCE, OCR WARRANTY VAULT, REPAIR WIKI & PROFILE
// ═══════════════════════════════════════════════════════════════════════════
class _InsuranceWikiAndProfileTab extends ConsumerWidget {
  final OwnerUser user;
  const _InsuranceWikiAndProfileTab({required this.user});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wikiList = ref.watch(wikiArticlesProvider);

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // Owner Profile & Subscription Header
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: UptimeTheme.teal500,
                  child: Icon(Icons.person_rounded, size: 30, color: UptimeTheme.dark),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.fullName,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                      ),
                      Text(
                        '+91 ${user.phone} • ${user.email} • ${user.city}',
                        style: const TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                      ),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 8,
                        children: [
                          const StatusBadge(status: 'COMPLETED'),
                          Text(
                            'Plan: ${user.subscriptionTier} (Zero Dispatch Fee) • Carbon Saved: ${user.carbonCreditsKg} kg CO₂',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                OutlinedButton.icon(
                  onPressed: () => ref.read(ownerAuthProvider.notifier).logout(),
                  icon: const Icon(Icons.logout_rounded, size: 16),
                  label: const Text('Sign Out'),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 18),

        // Insurance, OCR Warranty & AMC Cards (Screen 12)
        const Text(
          'Micro-Insurance, OCR Warranty Vault & AMC Subscriptions',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 10),
        Card(
          child: ListTile(
            leading: const Icon(Icons.shield_rounded, color: UptimeTheme.teal500, size: 32),
            title: const Text(
              'UPTIME Per-Job Micro-Insurance Shield (IND-U08 / ELEC-C09)',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
            subtitle: const Text(
              'Active Coverage up to ₹50,000 per repair • 30-Day Rework Guarantee • Instant AI Claim Assessment',
            ),
            trailing: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('OCR Warranty Scanner ready — Invoice uploaded & verified!')),
                );
              },
              child: const Text('Scan Warranty OCR'),
            ),
          ),
        ),
        const SizedBox(height: 18),

        // Crowdsourced Repair Wiki (IND-U10 / ELEC-U03)
        const Text(
          'Crowdsourced Master Technician Repair Wiki (IND-U10 / ELEC-U03)',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 10),
        ...wikiList.map(
          (w) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ExpansionTile(
              leading: Icon(
                Icons.menu_book_rounded,
                color: UptimeTheme.industryColor(w.industry),
              ),
              title: Text(
                w.title,
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5),
              ),
              subtitle: Text(
                '${w.industry} • By ${w.authorTech} • ${w.helpfulCount} upvotes • ${w.readTime}',
                style: const TextStyle(fontSize: 12, color: UptimeTheme.gray500),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(18, 0, 18, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(w.summary, style: const TextStyle(fontSize: 13)),
                      const SizedBox(height: 8),
                      ...w.steps.map(
                        (s) => Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text('• $s', style: const TextStyle(fontSize: 12.5)),
                        ),
                      ),
                    ],
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
// FULL-SCREEN FAULT STUDIO + ACOUSTIC FFT + PAVAN'S 3-PATH RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════
class _FaultReportAndThreePathScreen extends ConsumerStatefulWidget {
  final VoidCallback onJobBooked;
  const _FaultReportAndThreePathScreen({required this.onJobBooked});

  @override
  ConsumerState<_FaultReportAndThreePathScreen> createState() =>
      _FaultReportAndThreePathScreenState();
}

class _FaultReportAndThreePathScreenState extends ConsumerState<_FaultReportAndThreePathScreen> {
  final _descCtrl = TextEditingController(
    text: 'Mazak CNC spindle making high-pitched 3.8 kHz metallic noise and M65 magnetic contactor chattering under load.',
  );
  String _urgency = 'HIGH';
  bool _soundFingerprinted = false;
  bool _voiceInputAdded = false;
  bool _diagnosed = false;
  String? _activePath; // 'A', 'B', or 'C'
  int _copilotStepIndex = 0;
  bool _videoConsultCredited = false;
  bool _inLiveVideoCall = false;
  double _negotiatedDiscount = 0;

  @override
  void dispose() {
    _descCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndustry = ref.watch(selectedIndustryProvider);
    final diagnosisAsync = ref.watch(aiDiagnosisProvider(_descCtrl.text));
    final rankedTechsAsync = ref.watch(rankedTechniciansProvider(selectedIndustry));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Multimodal AI Fault Studio & 3-Path Choice'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Step 1: Multimodal Fault Input Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        '1. Multimodal Fault Input (Text + Voice + Acoustic FFT)',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                      ),
                      StatusBadge(status: selectedIndustry),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _descCtrl,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Describe Symptoms (or use Regional Voice Input)',
                    ),
                  ),
                  const SizedBox(height: 14),
                  AcousticSpectrogramBar(active: _soundFingerprinted),
                  const SizedBox(height: 14),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      OutlinedButton.icon(
                        onPressed: () => setState(() => _soundFingerprinted = !_soundFingerprinted),
                        icon: Icon(
                          _soundFingerprinted ? Icons.check_circle : Icons.graphic_eq,
                          color: UptimeTheme.teal500,
                        ),
                        label: Text(
                          _soundFingerprinted
                              ? 'Sound Fingerprint Captured (3.8 kHz Peak)'
                              : 'Record 10s Machine Audio ⭐',
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => setState(() => _voiceInputAdded = !_voiceInputAdded),
                        icon: Icon(
                          _voiceInputAdded ? Icons.mic : Icons.mic_none_rounded,
                          color: UptimeTheme.blue500,
                        ),
                        label: Text(
                          _voiceInputAdded ? 'Voice Input Transcribed (KN/HI/EN)' : 'Speak in Kannada / Hindi / English',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Wrap(
                    spacing: 8,
                    children: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((u) {
                      return ChoiceChip(
                        label: Text(u),
                        selected: _urgency == u,
                        onSelected: (_) => setState(() => _urgency = u),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: UptimeTheme.teal500,
                        foregroundColor: UptimeTheme.dark,
                      ),
                      onPressed: () => setState(() {
                        _diagnosed = true;
                        _soundFingerprinted = true;
                      }),
                      icon: const Icon(Icons.auto_awesome),
                      label: const Text(
                        'Run Gemini 1.5 Flash Multimodal Diagnosis',
                        style: TextStyle(fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          if (_diagnosed) ...[
            const SizedBox(height: 18),
            diagnosisAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Text('Error: $err'),
              data: (diag) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Gemini AI Diagnosis Result Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0D2347), Color(0xFF1A3C6E)],
                      ),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: UptimeTheme.teal500, width: 1.5),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'GEMINI 1.5 FLASH DIAGNOSIS',
                              style: TextStyle(
                                color: UptimeTheme.teal500,
                                fontSize: 12,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1,
                              ),
                            ),
                            Text(
                              '${(diag.confidence * 100).toStringAsFixed(0)}% Confidence • ${diag.severity}',
                              style: const TextStyle(
                                color: Colors.amberAccent,
                                fontWeight: FontWeight.w900,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          diag.faultCategory,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          diag.probableRootCause,
                          style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Estimated Cost: ${FormatUtils.formatInr(diag.estimatedMinInr)} – ${FormatUtils.formatInr(diag.estimatedMaxInr)}',
                          style: const TextStyle(
                            color: UptimeTheme.teal500,
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Step 2: Owner-Controlled 3-Path Resolution Choice (Addendum v1.1)
                  const Text(
                    '2. Choose Your Resolution Path (Owner-Controlled 3-Path Flow)',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),
                  PathCard(
                    badgeText: 'PATH A • FREE AI COPILOT',
                    title: 'Fix It Yourself with Step-by-Step AI Copilot',
                    subtitle:
                        'Interactive LOTO safety & multimeter probes. Auto-escalates at Step 3 if unresolved.',
                    priceTag: '₹0 FREE',
                    icon: Icons.smart_toy_outlined,
                    accentColor: UptimeTheme.teal500,
                    onSelect: () => setState(() {
                      _activePath = 'A';
                      _copilotStepIndex = 0;
                    }),
                  ),
                  PathCard(
                    badgeText: 'PATH B • LIVE VIDEO CONSULTATION',
                    title: '30-Min Live Specialist Video Call + AI Camera Overlay',
                    subtitle:
                        '100% of ₹149 consult fee is credited toward physical visit if on-site repair is needed.',
                    priceTag: '₹149',
                    icon: Icons.videocam_outlined,
                    accentColor: UptimeTheme.blue500,
                    isComingSoon: true,
                    onSelect: () => setState(() {
                      _activePath = 'B';
                      _videoConsultCredited = true;
                    }),
                  ),
                  PathCard(
                    badgeText: 'PATH C • DIRECT SPECIALIST DISPATCH',
                    title: 'Book Top-Ranked Verified Specialist Now',
                    subtitle:
                        '40% Distance + 60% Skill match. Fatigue-restricted technicians automatically excluded.',
                    priceTag: 'Est. ${FormatUtils.formatInr(diag.estimatedMinInr)}+',
                    icon: Icons.engineering_outlined,
                    accentColor: UptimeTheme.industrial,
                    onSelect: () => setState(() => _activePath = 'C'),
                  ),

                  // Active Path A Panel
                  if (_activePath == 'A') ...[
                    const SizedBox(height: 14),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Path A — AI Copilot Step ${_copilotStepIndex + 1} of ${diag.copilotSteps.length}',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              diag.copilotSteps[_copilotStepIndex],
                              style: const TextStyle(fontSize: 14, height: 1.45),
                            ),
                            const SizedBox(height: 14),
                            if (_copilotStepIndex >= 2)
                              Container(
                                padding: const EdgeInsets.all(14),
                                margin: const EdgeInsets.only(bottom: 12),
                                decoration: BoxDecoration(
                                  color: UptimeTheme.warning.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: UptimeTheme.warning),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      '⚠️ Step 3 Auto-Escalation Prompt: High-Voltage Cabinet Detected',
                                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5),
                                    ),
                                    const SizedBox(height: 8),
                                    Wrap(
                                      spacing: 10,
                                      children: [
                                        OutlinedButton(
                                          onPressed: () => setState(() {
                                            _activePath = 'B';
                                            _videoConsultCredited = true;
                                          }),
                                          child: const Text('Escalate to Video Call (₹149)'),
                                        ),
                                        ElevatedButton(
                                          onPressed: () => setState(() => _activePath = 'C'),
                                          child: const Text('Escalate to Direct Technician →'),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            Row(
                              children: [
                                ElevatedButton(
                                  onPressed: _copilotStepIndex < diag.copilotSteps.length - 1
                                      ? () => setState(() => _copilotStepIndex++)
                                      : null,
                                  child: const Text('Advance to Next Step →'),
                                ),
                                const SizedBox(width: 12),
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Issue Resolved via DIY ✓'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],

                  // Active Path B Panel (Simulated Live Video Call with AI Overlay)
                  if (_activePath == 'B') ...[
                    const SizedBox(height: 14),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Path B — Live Virtual Repair Consultation (VIRT-01)',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                            ),
                            const SizedBox(height: 10),
                            if (_inLiveVideoCall)
                              Container(
                                height: 190,
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF091224),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: UptimeTheme.teal500),
                                ),
                                child: const Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          '🔴 LIVE CALL • Raju Sharma (L3 Master) • 04:18',
                                          style: TextStyle(
                                            color: Colors.redAccent,
                                            fontWeight: FontWeight.w900,
                                            fontSize: 12,
                                          ),
                                        ),
                                        Text(
                                          'Agora WebRTC HD',
                                          style: TextStyle(color: Colors.white70, fontSize: 11),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      '🤖 GEMINI FRAME OVERLAY: "Thermal hotspot (78°C) identified on Contactor L2 terminal + bearing race scoring."',
                                      style: TextStyle(
                                        color: UptimeTheme.teal500,
                                        fontWeight: FontWeight.w800,
                                        fontSize: 13,
                                      ),
                                    ),
                                    Text(
                                      'Specialist Verdict: Physical bearing puller required on-site. ₹149 fee credited!',
                                      style: TextStyle(color: Colors.white70, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 10,
                              runSpacing: 10,
                              children: [
                                OutlinedButton.icon(
                                  onPressed: () => setState(() => _inLiveVideoCall = !_inLiveVideoCall),
                                  icon: const Icon(Icons.videocam),
                                  label: Text(
                                    _inLiveVideoCall ? 'End Video Preview' : 'Start Live Video Call Preview',
                                  ),
                                ),
                                ElevatedButton.icon(
                                  onPressed: () => setState(() {
                                    _videoConsultCredited = true;
                                    _activePath = 'C';
                                  }),
                                  icon: const Icon(Icons.engineering),
                                  label: const Text('Escalate to Physical Visit (Apply ₹149 Credit) →'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],

                  // Active Path C Panel (Ranked Technicians + Price Negotiation IND-U04)
                  if (_activePath == 'C') ...[
                    const SizedBox(height: 14),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'IND-U04: Interactive Counter-Offer Negotiation Discount: −${FormatUtils.formatInr(_negotiatedDiscount)}',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                            ),
                            Slider(
                              value: _negotiatedDiscount,
                              min: 0,
                              max: 250,
                              divisions: 5,
                              label: '−₹${_negotiatedDiscount.toInt()}',
                              onChanged: (v) => setState(() => _negotiatedDiscount = v),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    rankedTechsAsync.when(
                      loading: () => const CircularProgressIndicator(),
                      error: (err, _) => Text('Error: $err'),
                      data: (techs) => Column(
                        children: techs.map((t) {
                          final netQuote = (t.estimatedQuoteInr - _negotiatedDiscount).clamp(400.0, 99999.0);
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: ListTile(
                              contentPadding: const EdgeInsets.all(16),
                              title: Text(
                                '${t.fullName} (L${t.verificationLevel}${t.isProvisional ? "-P" : ""}) • ${t.matchScore}% Match',
                                style: const TextStyle(fontWeight: FontWeight.w900),
                              ),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 6),
                                child: Text(
                                  '${t.tradeTitle}\n${t.rating}★ (${t.jobsCompleted} jobs) • ${t.distanceKm} km away • ETA ${t.etaMinutes} mins\nBadges: ${t.badges.join(" · ")}',
                                  style: const TextStyle(height: 1.4, fontSize: 12.5),
                                ),
                              ),
                              isThreeLine: true,
                              trailing: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: UptimeTheme.teal500,
                                  foregroundColor: UptimeTheme.dark,
                                ),
                                onPressed: () async {
                                  await ref.read(ownerJobsProvider.notifier).createJobWithPath(
                                        title: diag.faultCategory,
                                        industry: selectedIndustry,
                                        urgency: _urgency,
                                        resolutionPath: _videoConsultCredited
                                            ? 'ESCALATED_FROM_VIDEO'
                                            : 'PATH_C_DIRECT_TECH',
                                        technician: t,
                                        videoConsultCredited: _videoConsultCredited,
                                        negotiatedQuoteInr: netQuote,
                                      );
                                  widget.onJobBooked();
                                  if (context.mounted) Navigator.pop(context);
                                },
                                child: Text(
                                  'Book ${FormatUtils.formatInr(netQuote)}',
                                  style: const TextStyle(fontWeight: FontWeight.w900),
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
