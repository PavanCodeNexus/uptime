import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/app_config.dart';
import '../../core/config/theme.dart';
import '../../core/utils/format_utils.dart';
import '../../shared/widgets/common_widgets.dart';
import '../models/owner_models.dart';
import '../providers/owner_providers.dart';

class OwnerRootScreen extends ConsumerStatefulWidget {
  const OwnerRootScreen();

  @override
  ConsumerState<OwnerRootScreen> createState() => _OwnerRootScreenState();
}

class _OwnerRootScreenState extends ConsumerState<OwnerRootScreen> {
  final _phoneCtrl = TextEditingController(text: '9876543210');
  final _otpCtrl = TextEditingController(text: '123456');
  String _selectedIndustry = 'INDUSTRIAL';
  bool _otpSent = false;
  int _navIndex = 0;

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
      return _buildLoginScreen(authState.isLoading);
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: UptimeTheme.teal500,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'U↑',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  color: UptimeTheme.dark,
                  fontSize: 15,
                ),
              ),
            ),
            const SizedBox(width: 8),
            const Text('UPTIME'),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(999),
              ),
              child: const Text(
                AppConfig.tagline,
                style: TextStyle(fontSize: 11, color: Colors.white70),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Report Fault Now',
            icon: const Icon(Icons.add_alert),
            onPressed: () => _openFaultTriageFlow(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _navIndex,
        children: [
          _HomeTab(onReportFault: () => _openFaultTriageFlow(context)),
          const _AssetsAndTwinTab(),
          const _JobsAndTrackingTab(),
          const _MarketplaceAndInsuranceTab(),
          _ProfileTab(user: user),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _navIndex,
        onTap: (idx) => setState(() => _navIndex = idx),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.memory), label: 'Assets & Twin'),
          BottomNavigationBarItem(icon: Icon(Icons.build_circle_outlined), label: 'Jobs & Track'),
          BottomNavigationBarItem(icon: Icon(Icons.storefront_outlined), label: 'Spares & AMC'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildLoginScreen(bool isLoading) {
    return Scaffold(
      backgroundColor: UptimeTheme.blue700,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
                            color: UptimeTheme.blue700,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'U↑',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: UptimeTheme.teal500,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'U P T I M E',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 2,
                                color: UptimeTheme.blue700,
                              ),
                            ),
                            Text(
                              AppConfig.tagline,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: UptimeTheme.teal600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Owner Sign In (India-First OTP)',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: '10-Digit Mobile Number',
                        prefixText: '+91 ',
                        prefixIcon: Icon(Icons.phone_android),
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Primary Industry',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
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
                              onTap: () => setState(() => _selectedIndustry = ind),
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
                          prefixIcon: Icon(Icons.lock_outline),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                    ElevatedButton(
                      onPressed: isLoading
                          ? null
                          : () async {
                              if (!_otpSent) {
                                await ref
                                    .read(ownerAuthProvider.notifier)
                                    .sendOtp(_phoneCtrl.text.trim());
                                setState(() => _otpSent = true);
                              } else {
                                await ref.read(ownerAuthProvider.notifier).verifyOtp(
                                      phone: _phoneCtrl.text.trim(),
                                      otp: _otpCtrl.text.trim(),
                                      industryPreference: _selectedIndustry,
                                    );
                              }
                            },
                      child: Text(_otpSent ? 'Verify OTP & Continue' : 'Send OTP (123456)'),
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

  void _openFaultTriageFlow(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => _FaultReportAndThreePathScreen(
          onJobBooked: () => setState(() => _navIndex = 2),
        ),
      ),
    );
  }
}

// ── TAB 1: HOME DASHBOARD ─────────────────────────────────────────────────
class _HomeTab extends ConsumerWidget {
  final VoidCallback onReportFault;
  const _HomeTab({required this.onReportFault});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndustry = ref.watch(selectedIndustryProvider);
    final jobs = ref.watch(ownerJobsProvider).valueOrNull ?? const [];
    final assets = ref.watch(ownerAssetsProvider).valueOrNull ?? const [];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Industry Selector Row
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: ['INDUSTRIAL', 'AUTOMOBILE', 'ELECTRONICS']
                .map(
                  (ind) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: IndustryChip(
                      industry: ind,
                      selected: selectedIndustry == ind,
                      onTap: () => ref.read(selectedIndustryProvider.notifier).select(ind),
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        const SizedBox(height: 16),

        // Hero Emergency / Report Fault CTA (< 3 taps principle)
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [UptimeTheme.blue700, UptimeTheme.blue600],
            ),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.bolt, color: UptimeTheme.teal500),
                  SizedBox(width: 6),
                  Text(
                    'Machine, Vehicle or Device Down?',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'AI Fault Triage → Choose Free AI Copilot, Video Consult, or Instant Technician Dispatch.',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: UptimeTheme.teal500,
                  foregroundColor: UptimeTheme.dark,
                ),
                onPressed: onReportFault,
                icon: const Icon(Icons.smart_toy_outlined),
                label: const Text('Report Fault & Diagnose Now'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Active Job Banner
        if (jobs.isNotEmpty) ...[
          const Text(
            'Recent / Active Dispatch',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: UptimeTheme.blue50,
                child: Icon(
                  Icons.build,
                  color: UptimeTheme.industryColor(jobs.first.industry),
                ),
              ),
              title: Text(
                '${jobs.first.jobNumber} · ${jobs.first.equipmentSummary}',
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
              ),
              subtitle: Text(
                'Path: ${jobs.first.resolutionPath} · Arrival OTP: ${jobs.first.arrivalOtp}',
              ),
              trailing: StatusBadge(status: jobs.first.status),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // World-First Innovations Quick Grid
        const Text(
          'AI & World-First Diagnostic Tools ⭐',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 1.55,
          children: [
            _QuickFeatureCard(
              icon: Icons.graphic_eq,
              title: 'Sound Fingerprint ⭐',
              subtitle: '1,420 Hz bearing / engine acoustic check',
              color: UptimeTheme.industrial,
              onTap: onReportFault,
            ),
            _QuickFeatureCard(
              icon: Icons.mood,
              title: 'Vehicle Mood Score ⭐',
              subtitle: '95/100 Energetic & Smooth telemetry',
              color: UptimeTheme.automobile,
              onTap: () {},
            ),
            _QuickFeatureCard(
              icon: Icons.qr_code_scanner,
              title: 'Pre-Purchase Scan ⭐',
              subtitle: 'Used vehicle/machine 40-point AI audit',
              color: UptimeTheme.teal600,
              onTap: () {},
            ),
            _QuickFeatureCard(
              icon: Icons.warning_amber_rounded,
              title: 'Silent Killer Alert ⭐',
              subtitle: 'Early voltage / thermal drift detection',
              color: UptimeTheme.warning,
              onTap: () {},
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Asset Health Snapshot
        const Text(
          'Monitored Assets Health',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        ...assets.map(
          (a) => Card(
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              title: Text(a.name, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text('Mood: ${a.moodScore}/100 (${a.moodLabel})\n⚠️ ${a.silentKillerAlert}'),
              isThreeLine: true,
              trailing: CircleAvatar(
                backgroundColor: UptimeTheme.teal50,
                child: Text(
                  '${a.healthScore}%',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: UptimeTheme.teal600,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _QuickFeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _QuickFeatureCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: UptimeTheme.gray300),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 6),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: UptimeTheme.gray500),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ── 3-PATH FAULT REPORT + AI DIAGNOSIS + COPILOT / VIDEO / BOOKING FLOW ───
class _FaultReportAndThreePathScreen extends ConsumerStatefulWidget {
  final VoidCallback onJobBooked;
  const _FaultReportAndThreePathScreen({required this.onJobBooked});

  @override
  ConsumerState<_FaultReportAndThreePathScreen> createState() =>
      _FaultReportAndThreePathScreenState();
}

class _FaultReportAndThreePathScreenState
    extends ConsumerState<_FaultReportAndThreePathScreen> {
  final _equipCtrl = TextEditingController(text: 'CNC Haas VF-2 Spindle Unit');
  final _descCtrl = TextEditingController(
    text: 'High-pitched bearing whine at 4,000 RPM and main contactor trip',
  );
  String _industry = 'INDUSTRIAL';
  String _urgency = 'HIGH';
  bool _soundCaptured = false;
  bool _loadingAi = false;
  AIDiagnosisResult? _diagnosis;
  int _copilotStep = 0; // 0 = not started, 1..3 = active steps
  bool _showVideoComingSoon = false;

  @override
  void dispose() {
    _equipCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final techCandidates =
        ref.watch(rankedTechniciansProvider(_industry)).valueOrNull ?? const [];

    return Scaffold(
      appBar: AppBar(title: const Text('AI Fault Triage & 3-Path Resolution')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (_diagnosis == null) ...[
            const Text(
              '1. Select Industry & Describe Fault',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              children: ['INDUSTRIAL', 'AUTOMOBILE', 'ELECTRONICS']
                  .map(
                    (ind) => IndustryChip(
                      industry: ind,
                      selected: _industry == ind,
                      onTap: () => setState(() => _industry = ind),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: _equipCtrl,
              decoration: const InputDecoration(
                labelText: 'Machine / Vehicle / Device Name',
                prefixIcon: Icon(Icons.precision_manufacturing),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _descCtrl,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Problem Description (Voice / Hindi / English)',
                suffixIcon: IconButton(
                  tooltip: 'Voice Input (Hindi / English)',
                  icon: const Icon(Icons.mic, color: UptimeTheme.teal600),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('🎙️ Voice transcribed: Bearing noise and relay trip'),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () => setState(() => _soundCaptured = true),
              icon: Icon(
                _soundCaptured ? Icons.check_circle : Icons.graphic_eq,
                color: _soundCaptured ? UptimeTheme.success : UptimeTheme.blue700,
              ),
              label: Text(
                _soundCaptured
                    ? 'Acoustic Fingerprint Captured (1,420 Hz Bearing Signature)'
                    : 'Record 10s Engine / Machine Sound Fingerprint ⭐',
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: ['NORMAL', 'HIGH', 'EMERGENCY']
                  .map(
                    (u) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(u),
                        selected: _urgency == u,
                        onSelected: (_) => setState(() => _urgency = u),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 18),
            ElevatedButton.icon(
              onPressed: _loadingAi
                  ? null
                  : () async {
                      setState(() => _loadingAi = true);
                      final res = await ref.read(ownerJobsProvider.notifier).runAiTriage(
                            industry: _industry,
                            equipment: _equipCtrl.text.trim(),
                            description: _descCtrl.text.trim(),
                            urgency: _urgency,
                          );
                      setState(() {
                        _loadingAi = false;
                        _diagnosis = res;
                      });
                    },
              icon: const Icon(Icons.auto_awesome),
              label: Text(_loadingAi ? 'Running Gemini 1.5 Flash Triage...' : 'Run AI Diagnosis'),
            ),
          ] else ...[
            // AI Diagnosis Result Card (per DESIGN.md Addendum v1.1)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: UptimeTheme.blue700, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'AI Diagnosis Result',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                      ),
                      StatusBadge(status: _diagnosis!.severity),
                    ],
                  ),
                  const Divider(height: 20),
                  Text(
                    'Fault: ${_diagnosis!.predictedCause}',
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Confidence: ${_diagnosis!.confidenceScore.toStringAsFixed(0)}% · Est. Cost: ${FormatUtils.formatInr(_diagnosis!.estimatedCostMin)} – ${FormatUtils.formatInr(_diagnosis!.estimatedCostMax)}',
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _diagnosis!.safeToRun
                        ? '✅ Safe for limited operation'
                        : '❌ Stop machine/vehicle now — Isolate power before inspection',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: _diagnosis!.safeToRun ? UptimeTheme.success : UptimeTheme.danger,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            const Text(
              'What would you like to do? (Choose Any Path)',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 12),

            // PATH A — AI COPILOT (FREE)
            PathCard(
              icon: Icons.smart_toy,
              title: 'Try AI Copilot',
              subtitle: 'Let AI guide you step by step with safety checks',
              badge: 'FREE',
              badgeColor: UptimeTheme.success,
              color: UptimeTheme.blue50,
              borderColor: UptimeTheme.blue700,
              onTap: () => setState(() {
                _copilotStep = 1;
                _showVideoComingSoon = false;
              }),
            ),
            const SizedBox(height: 12),

            // PATH B — VIDEO CONSULTATION ([Coming Soon] in Wave 3 per Decision D14)
            PathCard(
              icon: Icons.video_call,
              title: 'Video Consultation',
              subtitle: 'Talk to a remote specialist (₹149 credited if escalated)',
              badge: 'Coming Soon',
              badgeColor: UptimeTheme.teal600,
              color: UptimeTheme.teal50,
              borderColor: UptimeTheme.teal500,
              subText: 'Wave 3 Feature — ₹149 fee auto-credited toward on-site visit',
              onTap: () => setState(() => _showVideoComingSoon = true),
            ),
            const SizedBox(height: 12),

            // PATH C — BOOK TECHNICIAN
            PathCard(
              icon: Icons.build,
              title: 'Book Technician',
              subtitle: 'Dispatch a verified specialist to your location now',
              badge: '${FormatUtils.formatInr(_diagnosis!.estimatedCostMin)}+',
              badgeColor: UptimeTheme.gray700,
              color: Colors.white,
              borderColor: UptimeTheme.gray300,
              subText:
                  '${techCandidates.length} verified techs available — ${techCandidates.isNotEmpty ? techCandidates.first.etaMinutes : 8} mins away',
              onTap: () => _bookTopTechnician(context, techCandidates, creditVideoFee: false),
            ),

            // Interactive AI Copilot Stepper + Escalation Banner
            if (_copilotStep > 0) ...[
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: UptimeTheme.blue700),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '🤖 AI Copilot — Step $_copilotStep of 3',
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      switch (_copilotStep) {
                        1 =>
                          'Step 1 (Safety Isolation): Switch OFF main breaker / ignition. Wait 60 seconds for capacitor discharge.',
                        2 =>
                          'Step 2 (Terminal & Relay Check): Inspect primary relay contacts for carbon pitting or loose lug torque.',
                        _ =>
                          'Step 3 (Load Reset Test): Re-seat relay module. If bearing noise exceeds 85 dB, stop immediately and escalate.',
                      },
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        if (_copilotStep < 3)
                          ElevatedButton(
                            onPressed: () => setState(() => _copilotStep++),
                            child: const Text('Next Step →'),
                          ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('🎉 Resolved via Free AI Copilot! Saved ₹800+'),
                              ),
                            );
                            Navigator.of(context).pop();
                          },
                          child: const Text('Issue Resolved ✓'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (_copilotStep >= 3) ...[
                const SizedBox(height: 12),
                // Escalation Banner per DESIGN.md Addendum
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: UptimeTheme.warning, width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '💡 Need more help? This repair may need an on-site specialist.',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton.icon(
                        onPressed: () =>
                            _bookTopTechnician(context, techCandidates, creditVideoFee: false),
                        icon: const Icon(Icons.engineering),
                        label: const Text('Escalate & Book Verified Technician Now'),
                      ),
                    ],
                  ),
                ),
              ],
            ],

            if (_showVideoComingSoon) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: UptimeTheme.success),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '📹 Live Video Consultation is Coming Soon (Wave 3 — VID_001)',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'When a ₹149 video consult escalates to a physical visit, ₹149 is automatically credited off your job invoice!',
                      style: TextStyle(fontSize: 13),
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () =>
                          _bookTopTechnician(context, techCandidates, creditVideoFee: true),
                      child: const Text('Simulate Escalation with ₹149 Fee Credit →'),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ],
      ),
    );
  }

  Future<void> _bookTopTechnician(
    BuildContext context,
    List<TechnicianCandidate> candidates, {
    required bool creditVideoFee,
  }) async {
    final chosen = candidates.isNotEmpty ? candidates.first : null;
    await ref.read(ownerJobsProvider.notifier).createJobWithPath(
          industry: _industry,
          equipmentSummary: _equipCtrl.text.trim(),
          problemDescription: _descCtrl.text.trim(),
          urgency: _urgency,
          resolutionPath: 'DIRECT_BOOKING',
          tech: chosen,
          creditVideoFee: creditVideoFee,
        );
    if (!context.mounted) return;
    widget.onJobBooked();
    Navigator.of(context).pop();
  }
}

// ── TAB 2: ASSETS & DIGITAL TWIN ──────────────────────────────────────────
class _AssetsAndTwinTab extends ConsumerWidget {
  const _AssetsAndTwinTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assets = ref.watch(ownerAssetsProvider).valueOrNull ?? const [];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Digital Twin & Predictive Component Health',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),
        ...assets.map(
          (asset) => Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          '${asset.name} (${asset.modelNumber})',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                        ),
                      ),
                      StatusBadge(status: asset.industry),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('🎵 Sound Fingerprint: ${asset.soundFingerprintStatus}'),
                  Text('😊 Mood Score: ${asset.moodScore}/100 — ${asset.moodLabel}'),
                  Text(
                    '⚠️ Silent Killer Check: ${asset.silentKillerAlert}',
                    style: const TextStyle(color: UptimeTheme.warning, fontWeight: FontWeight.w600),
                  ),
                  const Divider(height: 20),
                  const Text(
                    'Digital Twin Sub-Components:',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  ...asset.components.map(
                    (c) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(c.name, style: const TextStyle(fontSize: 13)),
                              Text(
                                '${c.healthPercent}% · ~${c.predictedDaysLeft}d remaining',
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          LinearProgressIndicator(
                            value: c.healthPercent / 100.0,
                            color: c.healthPercent > 80
                                ? UptimeTheme.teal500
                                : UptimeTheme.warning,
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
}

// ── TAB 3: JOBS, LIVE GPS TRACKING, ARRIVAL OTP & SHA-256 INVOICE ─────────
class _JobsAndTrackingTab extends ConsumerWidget {
  const _JobsAndTrackingTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jobs = ref.watch(ownerJobsProvider).valueOrNull ?? const [];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Live Dispatch Tracking & Tamper-Proof Invoices',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),
        ...jobs.map(
          (job) => Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        job.jobNumber,
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: UptimeTheme.blue700,
                        ),
                      ),
                      StatusBadge(status: job.status),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    job.equipmentSummary,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                  ),
                  Text(job.problemDescription, style: const TextStyle(fontSize: 13)),
                  const SizedBox(height: 10),
                  if (job.assignedTech != null)
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: UptimeTheme.blue50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.verified_user, color: UptimeTheme.blue700),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              '${job.assignedTech!.fullName} (${job.assignedTech!.badgeLabel}) · ⭐ ${job.assignedTech!.ratingAvg} · ETA ${job.assignedTech!.etaMinutes}m',
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 10),
                  // 6-Digit Arrival OTP Box
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: UptimeTheme.teal50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: UptimeTheme.teal500),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          '🔐 500m Geofence Arrival OTP:',
                          style: TextStyle(fontWeight: FontWeight.w700),
                        ),
                        Text(
                          job.arrivalOtp,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 3,
                            color: UptimeTheme.blue700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  // GST 18% Invoice Summary
                  Text(
                    'Labor: ${FormatUtils.formatInr(job.laborCharge)} + Parts: ${FormatUtils.formatInr(job.partsCharge)}'
                    '${job.videoConsultFeeCredited ? " − Video Credit: ₹149" : ""}\n'
                    'CGST (9%): ${FormatUtils.formatInr(job.cgst)} + SGST (9%): ${FormatUtils.formatInr(job.sgst)} '
                    '→ Total: ${FormatUtils.formatInr(job.totalAmount)}',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                  if (job.isLocked && job.recordHash != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      '🛡️ SHA-256 Locked Certificate: ${job.recordHash!.substring(0, 24)}...',
                      style: const TextStyle(
                        fontSize: 11,
                        fontFamily: 'monospace',
                        color: UptimeTheme.success,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                  const SizedBox(height: 10),
                  if (job.status != 'COMPLETED')
                    ElevatedButton.icon(
                      onPressed: () => ref
                          .read(ownerJobsProvider.notifier)
                          .advanceJobStatus(job.id, 'COMPLETED'),
                      icon: const Icon(Icons.payment),
                      label: Text(
                        'Approve Escrow Release (${FormatUtils.formatInr(job.totalAmount)})',
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
}

// ── TAB 4: MARKETPLACE, MICRO-INSURANCE & END-OF-LIFE RITUAL ──────────────
class _MarketplaceAndInsuranceTab extends StatelessWidget {
  const _MarketplaceAndInsuranceTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'OEM Spare Parts, Micro-Insurance & Sustainability',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const Icon(Icons.shield_outlined, color: UptimeTheme.blue700, size: 32),
            title: const Text(
              'Per-Job Micro-Insurance Protection',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            subtitle: const Text('Covers up to ₹50,000 post-repair component protection for ₹49/job'),
            trailing: TextButton(onPressed: () {}, child: const Text('Active')),
          ),
        ),
        const SizedBox(height: 10),
        Card(
          child: ListTile(
            leading: const Icon(Icons.recycling, color: UptimeTheme.success, size: 32),
            title: const Text(
              'End-of-Life Machine Ritual & Carbon Credits ⭐',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            subtitle: const Text(
              'Retire unrepairable machines responsibly with certified e-waste / scrap partners & earn Green Points.',
            ),
            trailing: const Text(
              '+250 GP',
              style: TextStyle(fontWeight: FontWeight.w800, color: UptimeTheme.success),
            ),
          ),
        ),
      ],
    );
  }
}

// ── TAB 5: OWNER PROFILE ──────────────────────────────────────────────────
class _ProfileTab extends ConsumerWidget {
  final OwnerUser user;
  const _ProfileTab({required this.user});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            leading: const CircleAvatar(
              backgroundColor: UptimeTheme.blue700,
              child: Icon(Icons.person, color: Colors.white),
            ),
            title: Text(user.fullName, style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('+91 ${user.phone} · Industry: ${user.industryPreference}'),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const Icon(Icons.eco, color: UptimeTheme.success),
            title: Text('Green Points Balance: ${user.greenPointsBalance} GP'),
            subtitle: Text('CO₂ Saved via Repair-Over-Replace: ${user.carbonCreditsKg} kg'),
          ),
        ),
        const SizedBox(height: 18),
        OutlinedButton.icon(
          onPressed: () => ref.read(ownerAuthProvider.notifier).logout(),
          icon: const Icon(Icons.logout),
          label: const Text('Sign Out'),
        ),
      ],
    );
  }
}
