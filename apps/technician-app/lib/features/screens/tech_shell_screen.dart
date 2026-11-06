import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/app_config.dart';
import '../../core/config/theme.dart';
import '../models/tech_models.dart';
import '../providers/tech_providers.dart';

class TechRootScreen extends ConsumerStatefulWidget {
  const TechRootScreen();

  @override
  ConsumerState<TechRootScreen> createState() => _TechRootScreenState();
}

class _TechRootScreenState extends ConsumerState<TechRootScreen> {
  final _phoneCtrl = TextEditingController(text: '9880012345');
  final _otpCtrl = TextEditingController(text: '123456');
  int _tabIndex = 0;

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _otpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final techState = ref.watch(technicianStateProvider);
    final tech = techState.valueOrNull;

    if (tech == null) {
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
                      const Text(
                        'UPTIME Technician Portal',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: UptimeTheme.blue700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        AppConfig.tagline,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: UptimeTheme.teal600,
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _phoneCtrl,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(
                          labelText: 'Technician Mobile (+91)',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _otpCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: '6-Digit OTP (Dev/Demo: 123456)',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => ref
                            .read(technicianStateProvider.notifier)
                            .loginWithOtp(_phoneCtrl.text.trim(), _otpCtrl.text.trim()),
                        child: const Text('Verify OTP & Enter Field App'),
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

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(
              Icons.circle,
              size: 12,
              color: tech.isAvailable ? UptimeTheme.teal500 : UptimeTheme.warning,
            ),
            const SizedBox(width: 8),
            const Text('UPTIME Tech'),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.18),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                tech.levelBadge,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
        actions: [
          TextButton.icon(
            onPressed: () => ref
                .read(technicianStateProvider.notifier)
                .simulateFatigueLockout(restricted: !tech.isFatigueRestricted),
            icon: Icon(
              tech.isFatigueRestricted ? Icons.bedtime : Icons.bolt,
              color: Colors.white,
              size: 18,
            ),
            label: Text(
              tech.isFatigueRestricted ? 'End Rest' : 'Test Fatigue',
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
          ),
        ],
      ),
      body: IndexedStack(
        index: _tabIndex,
        children: [
          _TechHomeTab(
            tech: tech,
            onOpenJobExecution: () => setState(() => _tabIndex = 1),
          ),
          _JobExecutionAndCopilotTab(tech: tech),
          _KycVerificationWizardTab(tech: tech),
          _EarningsAndBadgesTab(tech: tech),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _tabIndex,
        onTap: (idx) => setState(() => _tabIndex = idx),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.handyman_outlined), label: 'Active Job'),
          BottomNavigationBarItem(icon: Icon(Icons.verified_user_outlined), label: 'KYC L0-L3'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), label: 'Earnings'),
        ],
      ),
    );
  }
}

// ── TAB 1: TECH HOME SCREEN (Per DESIGN.md Appendix) ─────────────────────
class _TechHomeTab extends ConsumerWidget {
  final TechnicianProfile tech;
  final VoidCallback onOpenJobExecution;

  const _TechHomeTab({
    required this.tech,
    required this.onOpenJobExecution,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final job = ref.watch(fieldJobProvider).valueOrNull;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Good morning, ${tech.fullName}! ₹${tech.todayEarningsInr} today',
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 12),

        // MANDATORY FATIGUE REST-PERIOD BANNER (CORE-03 / RULES.md SB-00)
        if (tech.isFatigueRestricted)
          Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: UptimeTheme.danger, width: 2),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.bedtime, color: UptimeTheme.danger),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Mandatory Rest Period Active (Fatigue Protection)',
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          color: UptimeTheme.danger,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'You have worked ${tech.hoursWorkedToday} hrs (${tech.consecutiveJobsCount} consecutive jobs). '
                  'Per safety policy, you are excluded from dispatch queries until: ${tech.fatigueResetAt}.',
                  style: const TextStyle(fontSize: 13),
                ),
              ],
            ),
          ),

        // Big Online / Offline Availability Card
        Card(
          child: SwitchListTile(
            title: Text(
              tech.isAvailable ? '🟢 ONLINE & AVAILABLE' : '⚪ OFFLINE / RESTING',
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            subtitle: Text(
              tech.isFatigueRestricted
                  ? 'Locked during mandatory rest period'
                  : (tech.isAvailable
                      ? 'You are visible to machine/vehicle owners nearby'
                      : 'Switch online to receive live job dispatches'),
            ),
            value: tech.isAvailable,
            onChanged: tech.isFatigueRestricted
                ? null
                : (val) => ref
                    .read(technicianStateProvider.notifier)
                    .toggleAvailability(true, val),
          ),
        ),
        const SizedBox(height: 14),

        // Provisional L2-P Graduation Progress Banner
        if (tech.isProvisional)
          Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: UptimeTheme.blue50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: UptimeTheme.blue700),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '🌟 Track B Provisional Ustad (L2-P): ${tech.provisionalCompletedJobs}/5 Jobs to Full L2',
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    color: UptimeTheme.blue700,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Eligible for non-emergency jobs ≤ ₹3,000. Complete 1 more job with ≥ 4.2⭐ rating to graduate automatically to full L2 Verified!',
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),

        // Active / Incoming Job Banner
        if (job != null)
          Card(
            color: UptimeTheme.blue700,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '⚡ ${job.jobNumber} · ${job.status}',
                        style: const TextStyle(
                          color: UptimeTheme.teal500,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        '₹${job.estimatedPayoutInr} + ₹${job.surgeBonusInr} Surge',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    job.equipmentSummary,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    'AI Triage: ${job.aiPreDiagnosis}\n📍 ${job.ownerAddress}',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: UptimeTheme.teal500,
                      foregroundColor: UptimeTheme.dark,
                    ),
                    onPressed: tech.isFatigueRestricted
                        ? null
                        : () {
                            if (job.status == 'REQUESTED') {
                              ref.read(fieldJobProvider.notifier).acceptJob(tech);
                            }
                            onOpenJobExecution();
                          },
                    icon: const Icon(Icons.navigation),
                    label: Text(
                      job.status == 'REQUESTED'
                          ? 'Accept Dispatch (60s Timer) →'
                          : 'Open Active Job Execution →',
                    ),
                  ),
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),

        // Today's Stats Row per DESIGN.md Appendix
        const Text(
          "Today's Stats",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            _StatPill(label: 'Jobs', value: '${tech.jobsCompleted}'),
            const SizedBox(width: 8),
            _StatPill(label: 'Today', value: '₹${tech.todayEarningsInr}'),
            const SizedBox(width: 8),
            _StatPill(label: 'Rating', value: '${tech.ratingAvg}⭐'),
            const SizedBox(width: 8),
            const _StatPill(label: 'Accept', value: '94%'),
          ],
        ),
        const SizedBox(height: 16),

        // Weekly Earnings Preview Card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Earnings Preview (Mon–Sun)',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                ),
                const SizedBox(height: 6),
                Text(
                  '₹${tech.weeklyEarningsInr} this week ↑12% vs last week',
                  style: const TextStyle(
                    color: UptimeTheme.success,
                    fontWeight: FontWeight.w700,
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

class _StatPill extends StatelessWidget {
  final String label;
  final String value;
  const _StatPill({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: UptimeTheme.gray300),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 15,
                color: UptimeTheme.blue700,
              ),
            ),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 11, color: UptimeTheme.gray500)),
          ],
        ),
      ),
    );
  }
}

// ── TAB 2: NAVIGATION, 500M ARRIVAL OTP, FIELD AI COPILOT & COMPLETION ────
class _JobExecutionAndCopilotTab extends ConsumerStatefulWidget {
  final TechnicianProfile tech;
  const _JobExecutionAndCopilotTab({required this.tech});

  @override
  ConsumerState<_JobExecutionAndCopilotTab> createState() =>
      _JobExecutionAndCopilotTabState();
}

class _JobExecutionAndCopilotTabState extends ConsumerState<_JobExecutionAndCopilotTab> {
  final _arrivalOtpCtrl = TextEditingController(text: '123456');

  @override
  void dispose() {
    _arrivalOtpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final job = ref.watch(fieldJobProvider).valueOrNull;
    if (job == null) return const SizedBox.shrink();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            title: Text(
              '${job.jobNumber} · ${job.equipmentSummary}',
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            subtitle: Text('Status: ${job.status} · Owner: ${job.ownerName}'),
          ),
        ),
        const SizedBox(height: 12),

        // 500m Geofence + 6-Digit Arrival OTP Verification
        if (!job.otpVerified)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📍 Step 1: 500m GPS Geofence & Arrival OTP Verification',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'GPS Distance to Owner: 120m (Within 500m Geofence ✅). Enter Owner 6-digit Arrival OTP:',
                    style: TextStyle(fontSize: 13),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _arrivalOtpCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Owner Arrival OTP (123456)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton.icon(
                    onPressed: () {
                      ref
                          .read(fieldJobProvider.notifier)
                          .verifyArrivalOtp(_arrivalOtpCtrl.text.trim());
                    },
                    icon: const Icon(Icons.verified),
                    label: const Text('Verify Arrival OTP & Start Repair'),
                  ),
                ],
              ),
            ),
          )
        else ...[
          // Field AI Copilot + Checklist + Parts + SHA-256 Completion
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '🤖 Field AI Copilot & Mandatory Safety Checklist',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                  ),
                  const SizedBox(height: 8),
                  ...List.generate(job.checklistSteps.length, (i) {
                    final checked = job.completedSteps.contains(i);
                    return CheckboxListTile(
                      value: checked,
                      onChanged: (_) =>
                          ref.read(fieldJobProvider.notifier).toggleChecklistStep(i),
                      title: Text(
                        job.checklistSteps[i],
                        style: const TextStyle(fontSize: 13),
                      ),
                    );
                  }),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Spare Parts Logged: ₹${job.partsTotalInr}',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                      OutlinedButton.icon(
                        onPressed: () =>
                            ref.read(fieldJobProvider.notifier).addSparePart(450),
                        icon: const Icon(Icons.add),
                        label: const Text('+ Add OEM Relay (₹450)'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (job.status != 'COMPLETED')
                    ElevatedButton.icon(
                      onPressed: () => ref
                          .read(fieldJobProvider.notifier)
                          .completeJobWithSha256Lock(),
                      icon: const Icon(Icons.lock_outline),
                      label: const Text('Complete Job & Lock with SHA-256 Certificate'),
                    )
                  else
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: UptimeTheme.success),
                      ),
                      child: Text(
                        '✅ Job Completed & Cryptographically Locked!\nSHA-256: ${job.sha256RecordHash}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: UptimeTheme.success,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }
}

// ── TAB 3: 7-STEP KYC & SKILL VERIFICATION WIZARD (CORE-10) ───────────────
class _KycVerificationWizardTab extends ConsumerStatefulWidget {
  final TechnicianProfile tech;
  const _KycVerificationWizardTab({required this.tech});

  @override
  ConsumerState<_KycVerificationWizardTab> createState() =>
      _KycVerificationWizardTabState();
}

class _KycVerificationWizardTabState extends ConsumerState<_KycVerificationWizardTab> {
  final _aadhaarLast4Ctrl = TextEditingController(text: 'XXXX-XXXX-4829');
  final _upiCtrl = TextEditingController(text: 'raju.tech@okaxis');
  String _selectedTrade = 'CNC_SPINDLE_TECH';
  String _selectedTrack = 'EXPERIENCED_USTAD';
  String? _errorMsg;

  @override
  void dispose() {
    _aadhaarLast4Ctrl.dispose();
    _upiCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tech = widget.tech;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          '7-Step KYC & Skill Proof Wizard (Current: ${tech.levelBadge})',
          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 6),
        const Text(
          'DPDP Act 2023 Compliant: Never enter a 12-digit Aadhaar number. Only last 4 digits + DigiLocker token are stored.',
          style: TextStyle(fontSize: 12, color: UptimeTheme.gray700),
        ),
        const SizedBox(height: 12),
        if (_errorMsg != null)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: UptimeTheme.danger),
            ),
            child: Text(
              _errorMsg!,
              style: const TextStyle(
                color: UptimeTheme.danger,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Steps 1–3 & 6: L1 Identity + Selfie Liveness + UPI Penny-Drop',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _aadhaarLast4Ctrl,
                  decoration: const InputDecoration(
                    labelText: 'Masked Aadhaar (Last 4 Digits Only)',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _upiCtrl,
                  decoration: const InputDecoration(
                    labelText: 'UPI ID for ₹1 Penny-Drop Verification',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    try {
                      setState(() => _errorMsg = null);
                      ref.read(technicianStateProvider.notifier).completeL1Identity(
                            aadhaarMaskedInput: _aadhaarLast4Ctrl.text.trim(),
                            upiId: _upiCtrl.text.trim(),
                          );
                    } catch (e) {
                      setState(() => _errorMsg = e.toString());
                    }
                  },
                  child: const Text('Verify L1 Identity & Penny-Drop'),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Steps 4–5: Trade Track Selection & L2 / L2-P Skill Proof',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedTrade,
                  decoration: const InputDecoration(
                    labelText: 'Select Trade',
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(
                      value: 'CNC_SPINDLE_TECH',
                      child: Text('CNC Spindle Mechanic (Non-Regulated)'),
                    ),
                    DropdownMenuItem(
                      value: 'HV_ELECTRICIAN',
                      child: Text('High-Voltage Electrician (REGULATED — Track A Only)'),
                    ),
                  ],
                  onChanged: (v) => setState(() => _selectedTrade = v ?? 'CNC_SPINDLE_TECH'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: _selectedTrack,
                  decoration: const InputDecoration(
                    labelText: 'Verification Track',
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(
                      value: 'EXPERIENCED_USTAD',
                      child: Text('Track B — Experienced Ustad (MCQ + Video + Reference → L2-P)'),
                    ),
                    DropdownMenuItem(
                      value: 'CERTIFIED',
                      child: Text('Track A — Certified (ITI / Diploma / Statutory License → L2)'),
                    ),
                  ],
                  onChanged: (v) => setState(() => _selectedTrack = v ?? 'EXPERIENCED_USTAD'),
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    try {
                      setState(() => _errorMsg = null);
                      ref.read(technicianStateProvider.notifier).selectTradeAndTrack(
                            tradeCode: _selectedTrade,
                            track: _selectedTrack,
                          );
                      ref
                          .read(technicianStateProvider.notifier)
                          .submitSkillProofAndActivateL2P(
                            totalScore: 85,
                            safetyCorrect: 2,
                          );
                    } catch (e) {
                      setState(() => _errorMsg = e.toString());
                    }
                  },
                  child: const Text('Submit MCQ (85%, 2/2 Safety) + Video Proof'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── TAB 4: EARNINGS, WALLET & NFT SKILL BADGES ⭐ ──────────────────────────
class _EarningsAndBadgesTab extends ConsumerWidget {
  final TechnicianProfile tech;
  const _EarningsAndBadgesTab({required this.tech});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            leading: const Icon(Icons.account_balance_wallet, color: UptimeTheme.blue700, size: 32),
            title: Text(
              'Withdrawable Wallet Balance: ₹${tech.walletBalanceInr}',
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            subtitle: Text('Instant UPI Payout to ${tech.upiId}'),
          ),
        ),
        const SizedBox(height: 12),
        const Text(
          'On-Chain Verifiable NFT Skill Badges ⭐',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        const Card(
          child: ListTile(
            leading: Icon(Icons.military_tech, color: UptimeTheme.teal600, size: 34),
            title: Text(
              'CNC Spindle & High-Voltage Safety Badge #0089',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
            subtitle: Text('Soulbound Credential · Zero Safety Violations · 4.9⭐ Avg'),
          ),
        ),
      ],
    );
  }
}
