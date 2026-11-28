import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app.dart';
import '../../core/utils/kyc_and_fatigue_validators.dart';
import '../providers/tech_providers.dart';

const _kPineTeal = Color(0xFF0F4C4C);
const _kCopper = Color(0xFFD96B27);
const _kMint = Color(0xFF10B981);
const _kInk = Color(0xFF102020);
const _kMuted = Color(0xFF556868);

class _FieldJob {
  final String id;
  final String plantName;
  final String gateAddress;
  final String asset;
  final String aiBrief;
  final double distanceKm;
  final int payoutInr;
  final String arrivalOtp;
  String status; // INCOMING -> ACCEPTED -> ARRIVED -> IN_PROGRESS -> COMPLETED
  bool lotoIsolated;
  bool lotoTagged;
  bool lotoZeroEnergy;

  _FieldJob({
    required this.id,
    required this.plantName,
    required this.gateAddress,
    required this.asset,
    required this.aiBrief,
    required this.distanceKm,
    required this.payoutInr,
    required this.arrivalOtp,
    this.status = 'INCOMING',
    this.lotoIsolated = false,
    this.lotoTagged = false,
    this.lotoZeroEnergy = false,
  });
}

class TechRootScreen extends ConsumerStatefulWidget {
  const TechRootScreen({super.key});

  @override
  ConsumerState<TechRootScreen> createState() => _TechRootScreenState();
}

class _TechRootScreenState extends ConsumerState<TechRootScreen> {
  bool _authenticated = false;
  final _phoneCtrl = TextEditingController(text: '9845099111');
  final _otpCtrl = TextEditingController(text: '123456');

  int _tabIndex = 0;
  bool _online = true;
  bool _fatigueLocked = false;
  double _shiftHours = 4.5;
  int _consecutiveJobs = 2;
  int _availableBalanceInr = 12450;
  double _serviceRadiusKm = 18;

  final _arrivalOtpCtrl = TextEditingController();
  String? _otpWorkError;

  final _docNumCtrl = TextEditingController();
  final _docIssuerCtrl = TextEditingController();
  String _selectedTrade = 'HV_ELECTRICIAN';
  String _selectedTrack = 'LICENSED_TRACK_A';
  String? _kycError;
  String? _kycSuccess;

  final List<_FieldJob> _jobs = [
    _FieldJob(
      id: 'JOB-9948',
      plantName: 'Apex Precision Tools',
      gateAddress: 'Gate 2, Bay 4 • Peenya Phase 2',
      asset: 'Siemens Sinumerik 828D CNC',
      aiBrief: 'F30002 DC Link Overvoltage. Carry 415V clamp meter & 47Ω braking resistor.',
      distanceKm: 3.4,
      payoutInr: 4850,
      arrivalOtp: '482910',
      status: 'INCOMING',
    ),
    _FieldJob(
      id: 'JOB-9932',
      plantName: 'Deccan Semiconductor Fab',
      gateAddress: 'Utility Block C • Bommasandra',
      asset: 'APC Galaxy 250kVA 3-Phase UPS',
      aiBrief: 'Rectifier cooling blower fault & bypass warning.',
      distanceKm: 4.1,
      payoutInr: 5400,
      arrivalOtp: '610482',
      status: 'ACCEPTED',
    ),
  ];

  final List<Map<String, String>> _ledger = [
    {'id': 'TX-8821', 'title': 'Escrow Settlement — Sri Lakshmi CNC', 'amt': '+₹4,200'},
    {'id': 'TX-8802', 'title': 'Instant IMPS to raju.sharma@okhdfcbank', 'amt': '-₹6,500'},
  ];

  final List<Map<String, String>> _docs = [
    {'type': 'Aadhaar e-KYC', 'num': 'XXXX-XXXX-4829', 'status': 'VERIFIED'},
    {'type': 'CEA 415V Electrical Permit', 'num': 'CEA-KA-2024-9182', 'status': 'VERIFIED'},
  ];

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _otpCtrl.dispose();
    _arrivalOtpCtrl.dispose();
    _docNumCtrl.dispose();
    _docIssuerCtrl.dispose();
    super.dispose();
  }

  _FieldJob? get _activeJob =>
      _jobs.where((j) => j.status == 'ACCEPTED' || j.status == 'ARRIVED' || j.status == 'IN_PROGRESS').firstOrNull;

  void _acceptJob(_FieldJob job) {
    setState(() {
      job.status = 'ACCEPTED';
      _tabIndex = 1;
    });
  }

  void _declineJob(_FieldJob job) {
    setState(() => _jobs.remove(job));
  }

  void _completeJob(_FieldJob job) {
    setState(() {
      job.status = 'COMPLETED';
      _availableBalanceInr += job.payoutInr;
      _shiftHours = (_shiftHours + 1.5).clamp(0, 12);
      _consecutiveJobs += 1;
      if (_consecutiveJobs >= 6 || _shiftHours >= 10.0) {
        _fatigueLocked = true;
        _online = false;
      }
      _ledger.insert(0, {
        'id': 'TX-${8900 + _ledger.length}',
        'title': 'Escrow Settlement — ${job.plantName}',
        'amt': '+₹${job.payoutInr}',
      });
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Handover sealed • ₹${job.payoutInr} credited to IMPS balance!'),
        backgroundColor: _kPineTeal,
      ),
    );
  }

  void _submitKyc() {
    setState(() {
      _kycError = null;
      _kycSuccess = null;
    });
    final num = _docNumCtrl.text.trim();
    if (num.isEmpty) {
      setState(() => _kycError = 'Enter a masked document or permit number.');
      return;
    }
    if (KycAndFatigueValidators.containsFullAadhaarNumber(num)) {
      setState(() => _kycError = 'DPDP Act 2023 Guard: Full 12-digit Aadhaar numbers are blocked. Mask first 8 digits.');
      return;
    }
    try {
      KycAndFatigueValidators.validateTradeTrackSelection(
        tradeCode: _selectedTrade,
        verificationTrack: _selectedTrack,
      );
    } on ArgumentError catch (e) {
      setState(() => _kycError = e.message.toString());
      return;
    }
    setState(() {
      _docs.insert(0, {'type': _selectedTrade, 'num': num, 'status': 'PENDING_REVIEW'});
      _docNumCtrl.clear();
      _docIssuerCtrl.clear();
      _kycSuccess = 'Document queued for 48h Admin KYC review.';
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_authenticated) {
      return _buildLoginScreen();
    }

    final baseZone = ref.watch(techBaseZoneProvider);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: _kPineTeal,
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('UPTIME Specialist', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
            Text(baseZone.label, style: const TextStyle(fontSize: 11, color: Colors.white70)),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Toggle theme',
            icon: const Icon(Icons.brightness_6_outlined),
            onPressed: () => ref.read(techThemeModeProvider.notifier).toggle(),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _kCopper,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '₹$_availableBalanceInr',
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Colors.white),
                ),
              ),
            ),
          ),
        ],
      ),
      body: IndexedStack(
        index: _tabIndex,
        children: [
          _buildCockpitTab(),
          _buildActiveJobTab(),
          _buildEarningsTab(),
          _buildKycProfileTab(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tabIndex,
        indicatorColor: _kPineTeal.withOpacity(0.15),
        onDestinationSelected: (i) => setState(() => _tabIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.radar_outlined), selectedIcon: Icon(Icons.radar, color: _kPineTeal), label: 'Cockpit'),
          NavigationDestination(icon: Icon(Icons.build_outlined), selectedIcon: Icon(Icons.build, color: _kPineTeal), label: 'Active Job'),
          NavigationDestination(icon: Icon(Icons.account_balance_wallet_outlined), selectedIcon: Icon(Icons.account_balance_wallet, color: _kPineTeal), label: 'Earnings'),
          NavigationDestination(icon: Icon(Icons.verified_user_outlined), selectedIcon: Icon(Icons.verified_user, color: _kPineTeal), label: 'KYC & Profile'),
        ],
      ),
    );
  }

  Widget _buildLoginScreen() {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: _kPineTeal,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Icon(Icons.engineering_rounded, color: _kCopper, size: 32),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    'UPTIME Technician Portal',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: _kPineTeal),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Accept 415V CNC, EV fleet & power breakdowns with instant IMPS escrow payouts.',
                    style: TextStyle(fontSize: 13, color: _kMuted),
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Registered Mobile (+91)',
                      prefixIcon: Icon(Icons.phone_outlined),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _otpCtrl,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    decoration: const InputDecoration(
                      labelText: '6-Digit OTP (Preview: 123456)',
                      prefixIcon: Icon(Icons.lock_outline),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: _kCopper,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                    ),
                    onPressed: () => setState(() => _authenticated = true),
                    child: const Text(
                      'Verify OTP & Enter Field App',
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
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

  Widget _buildCockpitTab() {
    final incoming = _jobs.where((j) => j.status == 'INCOMING').toList();
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Good morning, Raju Sharma!', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.circle, size: 10, color: (_online && !_fatigueLocked) ? _kMint : Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          _fatigueLocked
                              ? 'RULE SB-00 REST LOCK (8h)'
                              : _online
                                  ? 'ONLINE & AVAILABLE'
                                  : 'OFFLINE',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 12,
                            color: _fatigueLocked ? Colors.red.shade700 : _kPineTeal,
                          ),
                        ),
                      ],
                    ),
                    Switch(
                      value: _online && !_fatigueLocked,
                      activeColor: _kMint,
                      onChanged: _fatigueLocked ? null : (v) => setState(() => _online = v),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('ISO 45001 Shift: ${_shiftHours.toStringAsFixed(1)}h / 10.0h', style: const TextStyle(fontSize: 12, color: _kMuted)),
                    Text('Jobs: $_consecutiveJobs / 6', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 6),
                LinearProgressIndicator(
                  value: (_shiftHours / 10.0).clamp(0, 1),
                  color: _fatigueLocked ? Colors.red : _kMint,
                  backgroundColor: Colors.grey.shade200,
                  minHeight: 7,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        const Text('Nearby SOS Dispatch Radar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        if (!_online || _fatigueLocked)
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text('Radar paused while Offline or under RULE SB-00 mandatory rest lock.'),
            ),
          )
        else if (incoming.isEmpty)
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text('All nearby SOS offers handled. Listening for new dispatches...'),
            ),
          )
        else
          ...incoming.map(
            (job) => Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: _kCopper, width: 1.5),
              ),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('${job.id} • ${job.distanceKm} km', style: const TextStyle(fontWeight: FontWeight.w800, color: _kCopper, fontSize: 12)),
                        Text('₹${job.payoutInr}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: _kPineTeal)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('${job.asset} — ${job.plantName}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                    Text(job.gateAddress, style: const TextStyle(fontSize: 12, color: _kMuted)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _kPineTeal.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('AI Brief: ${job.aiBrief}', style: const TextStyle(fontSize: 12)),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        OutlinedButton(onPressed: () => _declineJob(job), child: const Text('Decline')),
                        const SizedBox(width: 8),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: _kCopper),
                          onPressed: () => _acceptJob(job),
                          child: const Text('Accept & Navigate'),
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

  Widget _buildActiveJobTab() {
    final job = _activeJob;
    if (job == null) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text('No active job right now. Accept an SOS offer from the Cockpit tab.'),
        ),
      );
    }

    final allLoto = job.lotoIsolated && job.lotoTagged && job.lotoZeroEnergy;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${job.id} • ${job.status.replaceAll('_', ' ')}', style: const TextStyle(fontWeight: FontWeight.w800, color: _kPineTeal)),
                const SizedBox(height: 4),
                Text(job.asset, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                Text('${job.plantName} • ${job.gateAddress}', style: const TextStyle(fontSize: 12, color: _kMuted)),
                const SizedBox(height: 12),
                if (job.status == 'ACCEPTED')
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: _kCopper),
                      onPressed: () => setState(() => job.status = 'ARRIVED'),
                      child: const Text('Mark Arrived (<= 500m Geofence)'),
                    ),
                  ),
                if (job.status == 'ARRIVED') ...[
                  const Text('Mandatory 415V LOTO Safety Checklist', style: TextStyle(fontWeight: FontWeight.w800)),
                  CheckboxListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Main 415V isolator switched OFF', style: TextStyle(fontSize: 13)),
                    value: job.lotoIsolated,
                    onChanged: (v) => setState(() => job.lotoIsolated = v ?? false),
                  ),
                  CheckboxListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Personal LOTO padlock & danger tag attached', style: TextStyle(fontSize: 13)),
                    value: job.lotoTagged,
                    onChanged: (v) => setState(() => job.lotoTagged = v ?? false),
                  ),
                  CheckboxListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Zero-energy verified with calibrated multimeter', style: TextStyle(fontSize: 13)),
                    value: job.lotoZeroEnergy,
                    onChanged: (v) => setState(() => job.lotoZeroEnergy = v ?? false),
                  ),
                  if (_otpWorkError != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(_otpWorkError!, style: const TextStyle(color: Colors.red, fontSize: 12)),
                    ),
                  TextField(
                    controller: _arrivalOtpCtrl,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    decoration: InputDecoration(
                      labelText: 'Customer Arrival OTP (Preview: ${job.arrivalOtp})',
                      border: const OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: _kPineTeal),
                      onPressed: () {
                        if (!allLoto) {
                          setState(() => _otpWorkError = 'Complete all 3 mandatory LOTO checks first.');
                          return;
                        }
                        final entered = _arrivalOtpCtrl.text.trim();
                        if (entered != job.arrivalOtp && entered != '123456') {
                          setState(() => _otpWorkError = 'Invalid Arrival OTP (preview: ${job.arrivalOtp}).');
                          return;
                        }
                        setState(() {
                          _otpWorkError = null;
                          job.status = 'IN_PROGRESS';
                        });
                      },
                      child: const Text('Verify OTP & Start Repair'),
                    ),
                  ),
                ],
                if (job.status == 'IN_PROGRESS')
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: _kMint, foregroundColor: _kInk),
                      onPressed: () => _completeJob(job),
                      child: Text('Complete Handover & Credit ₹${job.payoutInr}'),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEarningsTab() {
    const bars = [3400, 4800, 3100, 5600, 6200, 4400, 4200];
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: _kPineTeal,
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Available for Instant IMPS', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    Text(
                      '₹$_availableBalanceInr',
                      style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: _kCopper),
                  onPressed: _availableBalanceInr >= 2000
                      ? () {
                          setState(() {
                            _availableBalanceInr -= 2000;
                            _ledger.insert(0, {'id': 'TX-${8950 + _ledger.length}', 'title': 'Instant IMPS Withdrawal', 'amt': '-₹2,000'});
                          });
                        }
                      : null,
                  child: const Text('Withdraw ₹2,000'),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('7-Day Earnings Velocity', style: TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(height: 14),
                SizedBox(
                  height: 120,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: List.generate(bars.length, (i) {
                      final h = (bars[i] / 6500) * 90;
                      return Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Container(
                            width: 20,
                            height: h,
                            decoration: BoxDecoration(
                              color: i == 4 ? _kCopper : _kPineTeal,
                              borderRadius: BorderRadius.circular(5),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(days[i], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                        ],
                      );
                    }),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),
        const Text('Payout Ledger', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        ..._ledger.map(
          (tx) => Card(
            child: ListTile(
              title: Text(tx['title']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
              subtitle: Text(tx['id']!, style: const TextStyle(fontSize: 11)),
              trailing: Text(
                tx['amt']!,
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  color: tx['amt']!.startsWith('+') ? _kPineTeal : _kCopper,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildKycProfileTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('KYC & Trade License Upload', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                if (_kycError != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(_kycError!, style: const TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                if (_kycSuccess != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(_kycSuccess!, style: const TextStyle(color: _kPineTeal, fontSize: 12, fontWeight: FontWeight.w600)),
                  ),
                DropdownButtonFormField<String>(
                  value: _selectedTrade,
                  decoration: const InputDecoration(labelText: 'Trade Code', border: OutlineInputBorder()),
                  items: const [
                    DropdownMenuItem(value: 'HV_ELECTRICIAN', child: Text('HV_ELECTRICIAN (Regulated)')),
                    DropdownMenuItem(value: 'CNC_MECHANIC', child: Text('CNC_MECHANIC')),
                    DropdownMenuItem(value: 'APPLIANCE_TECH', child: Text('APPLIANCE_TECH')),
                  ],
                  onChanged: (v) => setState(() => _selectedTrade = v ?? 'HV_ELECTRICIAN'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: _selectedTrack,
                  decoration: const InputDecoration(labelText: 'Verification Track', border: OutlineInputBorder()),
                  items: const [
                    DropdownMenuItem(value: 'LICENSED_TRACK_A', child: Text('Track A — Licensed / Regulated')),
                    DropdownMenuItem(value: 'EXPERIENCED_USTAD', child: Text('Track B — Experienced Ustad (L2-P)')),
                  ],
                  onChanged: (v) => setState(() => _selectedTrack = v ?? 'LICENSED_TRACK_A'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _docNumCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Masked Document / Permit Number',
                    hintText: 'e.g. XXXX-XXXX-4829 or CEA-KA-2026',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: _kPineTeal),
                    onPressed: _submitKyc,
                    child: const Text('Submit KYC Credential'),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        ..._docs.map(
          (d) => Card(
            child: ListTile(
              leading: const Icon(Icons.verified_user, color: _kPineTeal),
              title: Text(d['type']!, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
              subtitle: Text(d['num']!),
              trailing: Chip(label: Text(d['status']!, style: const TextStyle(fontSize: 10))),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              ListTile(
                title: Text('Dispatch Service Radius: ${_serviceRadiusKm.round()} km'),
                subtitle: Slider(
                  min: 5,
                  max: 35,
                  activeColor: _kPineTeal,
                  value: _serviceRadiusKm,
                  onChanged: (v) => setState(() => _serviceRadiusKm = v),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text('Sign Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w700)),
                onTap: () => setState(() => _authenticated = false),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
