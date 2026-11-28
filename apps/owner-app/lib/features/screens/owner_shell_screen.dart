import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/app_config.dart';
import '../../core/utils/format_utils.dart';
import '../models/owner_models.dart';
import '../providers/owner_providers.dart';

const _kCobalt = Color(0xFF1E40AF);
const _kSafetyOrange = Color(0xFFEA580C);
const _kTeal = Color(0xFF00D4AA);
const _kInk = Color(0xFF0F172A);
const _kMuted = Color(0xFF64748B);

class _OwnerLocalJob {
  final String id;
  final String assetName;
  final String industry;
  final String symptom;
  final String technicianName;
  final String arrivalOtp;
  final int costInr;
  String status; // MATCHED -> EN_ROUTE -> ARRIVED -> IN_PROGRESS -> COMPLETED
  bool paid;
  int? rating;

  _OwnerLocalJob({
    required this.id,
    required this.assetName,
    required this.industry,
    required this.symptom,
    required this.technicianName,
    required this.arrivalOtp,
    required this.costInr,
    this.status = 'EN_ROUTE',
    this.paid = false,
    this.rating,
  });
}

class _OwnerAsset {
  final String id;
  final String name;
  final String sector;
  final int healthPct;
  final String note;

  const _OwnerAsset({
    required this.id,
    required this.name,
    required this.sector,
    required this.healthPct,
    required this.note,
  });
}

class OwnerRootScreen extends ConsumerStatefulWidget {
  const OwnerRootScreen({super.key});

  @override
  ConsumerState<OwnerRootScreen> createState() => _OwnerRootScreenState();
}

class _OwnerRootScreenState extends ConsumerState<OwnerRootScreen> {
  bool _authenticated = false;
  bool _otpSent = false;
  final _phoneCtrl = TextEditingController(text: '9845088210');
  final _otpCtrl = TextEditingController(text: '123456');
  String? _authError;

  int _tabIndex = 0;
  int _walletBalanceInr = 32500;
  final String _amcTier = 'PRO';
  bool _proPassActive = true;

  // Report & AI Triage state
  final _assetCtrl = TextEditingController(text: 'Siemens Sinumerik 828D CNC');
  final _symptomCtrl = TextEditingController(
    text: 'F30002 DC Link Overvoltage alarm during spindle deceleration',
  );
  String _urgency = 'EMERGENCY';
  bool _triageRan = false;
  String _aiCause = 'Braking resistor open-circuit or DC bus capacitor drift';
  String _aiCostBand = '₹6,500 – ₹11,500';
  String _aiSafety = 'Mandatory 415V Lockout-Tagout (LOTO) required before opening drive cabinet.';

  final List<_OwnerLocalJob> _jobs = [
    _OwnerLocalJob(
      id: 'JOB-9941',
      assetName: 'Siemens Sinumerik 828D CNC',
      industry: 'INDUSTRIAL',
      symptom: 'Spindle thermal alarm above 4500 RPM',
      technicianName: 'Raju Kumar Sharma (L2 Senior)',
      arrivalOtp: '884192',
      costInr: 9850,
      status: 'EN_ROUTE',
    ),
    _OwnerLocalJob(
      id: 'JOB-9918',
      assetName: 'APC Galaxy 250kVA 3-Phase UPS',
      industry: 'ELECTRONICS',
      symptom: 'Rectifier cooling blower fault & bypass warning',
      technicianName: 'Syed Mahmood (L3 Master)',
      arrivalOtp: '412095',
      costInr: 14200,
      status: 'COMPLETED',
      paid: true,
      rating: 5,
    ),
  ];

  final List<_OwnerAsset> _assets = [
    const _OwnerAsset(
      id: 'AST-01',
      name: 'Siemens Sinumerik 828D CNC',
      sector: 'INDUSTRIAL',
      healthPct: 82,
      note: '84.2 dB vibration drift • Est. RUL 18 hrs',
    ),
    const _OwnerAsset(
      id: 'AST-02',
      name: 'Tata Ace EV Fleet #14',
      sector: 'AUTOMOTIVE',
      healthPct: 95,
      note: 'OBD-II & BMS telemetry nominal',
    ),
    const _OwnerAsset(
      id: 'AST-03',
      name: 'APC Galaxy 250kVA 3-Phase UPS',
      sector: 'ELECTRONICS',
      healthPct: 98,
      note: '415V bus balanced • Load 64%',
    ),
  ];

  final List<MarketplaceItem> _catalogParts = const [
    MarketplaceItem(
      id: 'PART-101',
      name: 'SKF 7210 ACD Spindle Bearing Kit',
      category: 'SPARE_PART',
      industry: 'INDUSTRIAL',
      qualityBadge: 'OEM Genuine',
      compatibility: 'Siemens 828D / Haas VF-2',
      priceInr: 4850,
      mrpInr: 5600,
      warrantyMonths: 12,
    ),
    MarketplaceItem(
      id: 'PART-102',
      name: '47Ω 2kW Dynamic Braking Resistor',
      category: 'SPARE_PART',
      industry: 'INDUSTRIAL',
      qualityBadge: 'Siemens OEM',
      compatibility: 'Sinamics / Sinumerik 415V',
      priceInr: 3200,
      mrpInr: 3800,
      warrantyMonths: 12,
    ),
    MarketplaceItem(
      id: 'PART-103',
      name: '24V Axial Rectifier Cooling Blower',
      category: 'SPARE_PART',
      industry: 'ELECTRONICS',
      qualityBadge: 'ISO Certified',
      compatibility: 'APC Galaxy 250kVA UPS',
      priceInr: 2450,
      mrpInr: 2950,
      warrantyMonths: 6,
    ),
  ];

  static const _facilities = [
    SelectedLocation(
      label: 'Peenya Factory Unit #4',
      addressLine: 'Plot 42-B, Peenya Industrial Area Stage IV, Bengaluru 560058',
      areaCluster: 'Peenya Industrial Cluster',
      etaBadge: '12 mins SLA',
    ),
    SelectedLocation(
      label: 'Whitefield EV Logistics Hub',
      addressLine: 'EPIP Zone Phase 2, Whitefield, Bengaluru 560066',
      areaCluster: 'Whitefield Corridor',
      etaBadge: '14 mins SLA',
    ),
    SelectedLocation(
      label: 'Bommasandra Precision Plant',
      addressLine: 'Jigani Link Road, Bommasandra, Bengaluru 560099',
      areaCluster: 'Bommasandra Hub',
      etaBadge: '15 mins SLA',
    ),
  ];

  @override
  void dispose() {
    _phoneCtrl.dispose();
    _otpCtrl.dispose();
    _assetCtrl.dispose();
    _symptomCtrl.dispose();
    super.dispose();
  }

  void _sendOtp() {
    final digits = _phoneCtrl.text.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 10) {
      setState(() => _authError = 'Enter a valid 10-digit mobile number.');
      return;
    }
    setState(() {
      _authError = null;
      _otpSent = true;
    });
  }

  void _verifyOtp() {
    final code = _otpCtrl.text.replaceAll(RegExp(r'\D'), '');
    if (code.length != 6) {
      setState(() => _authError = 'Enter the 6-digit OTP (use 123456 for preview).');
      return;
    }
    setState(() {
      _authError = null;
      _authenticated = true;
    });
  }

  void _runAiTriage(String industry) {
    setState(() {
      _triageRan = true;
      if (industry == 'AUTOMOTIVE') {
        _aiCause = 'EV BMS contactor isolation fault or 12V auxiliary voltage drop';
        _aiCostBand = '₹3,200 – ₹6,800';
        _aiSafety = 'Engage HV service disconnect before probing traction harness.';
      } else if (industry == 'ELECTRONICS') {
        _aiCause = 'IGBT rectifier thermal latch or aged DC bus filter capacitors';
        _aiCostBand = '₹4,500 – ₹9,200';
        _aiSafety = 'Isolate dual AC/battery feeds and verify zero-energy state.';
      } else {
        _aiCause = 'Braking resistor open-circuit or DC bus capacitor drift';
        _aiCostBand = '₹6,500 – ₹11,500';
        _aiSafety = 'Mandatory 415V Lockout-Tagout (LOTO) required before opening cabinet.';
      }
    });
  }

  void _bookTechnician(TechnicianCandidate tech, String industry) {
    final newId = 'JOB-${9950 + _jobs.length}';
    final otp = '${400000 + (_jobs.length * 13721) % 500000}';
    setState(() {
      _jobs.insert(
        0,
        _OwnerLocalJob(
          id: newId,
          assetName: _assetCtrl.text.trim().isEmpty ? 'Industrial Asset' : _assetCtrl.text.trim(),
          industry: industry,
          symptom: _symptomCtrl.text.trim().isEmpty ? 'Breakdown reported' : _symptomCtrl.text.trim(),
          technicianName: '${tech.fullName} (L${tech.verificationLevel})',
          arrivalOtp: otp,
          costInr: 8900,
          status: 'MATCHED',
        ),
      );
      _tabIndex = 2;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Dispatched ${tech.fullName} ($newId) • Arrival OTP: $otp'),
        backgroundColor: _kCobalt,
      ),
    );
  }

  void _openJobDetail(_OwnerLocalJob job) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            final gst = (job.costInr * 0.18).round();
            final total = job.costInr + gst;
            return Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        job.id,
                        style: const TextStyle(fontWeight: FontWeight.w800, color: _kCobalt),
                      ),
                      Chip(
                        label: Text(
                          job.status.replaceAll('_', ' '),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                        ),
                        backgroundColor: _kTeal.withOpacity(0.18),
                      ),
                    ],
                  ),
                  Text(
                    job.assetName,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 4),
                  Text(job.symptom, style: const TextStyle(color: _kMuted, fontSize: 13)),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: _kInk,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'ASSIGNED SPECIALIST',
                              style: TextStyle(color: Colors.white60, fontSize: 10, letterSpacing: 1),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              job.technicianName,
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'ARRIVAL OTP',
                              style: TextStyle(color: _kTeal, fontSize: 10, letterSpacing: 1),
                            ),
                            Text(
                              job.arrivalOtp,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 2,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  if (job.status != 'COMPLETED')
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        style: FilledButton.styleFrom(backgroundColor: _kCobalt),
                        onPressed: () {
                          const order = ['MATCHED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];
                          final idx = order.indexOf(job.status);
                          if (idx >= 0 && idx < order.length - 1) {
                            setState(() => job.status = order[idx + 1]);
                            setModalState(() {});
                          }
                        },
                        child: Text(
                          job.status == 'MATCHED'
                              ? 'Mark Specialist En Route'
                              : job.status == 'EN_ROUTE'
                                  ? 'Confirm 500m Geofence Arrival'
                                  : job.status == 'ARRIVED'
                                      ? 'Verify OTP & Start Repair'
                                      : 'Complete Handover & Seal SHA-256',
                        ),
                      ),
                    ),
                  if (job.status == 'COMPLETED' && !job.paid) ...[
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total incl. 18% GST (${FormatUtils.formatInr(gst)})'),
                        Text(
                          FormatUtils.formatInr(total),
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        style: FilledButton.styleFrom(backgroundColor: _kSafetyOrange),
                        onPressed: () {
                          setState(() {
                            job.paid = true;
                            _walletBalanceInr = (_walletBalanceInr - total).clamp(0, 9999999);
                          });
                          setModalState(() {});
                        },
                        child: Text('Pay ${FormatUtils.formatInr(total)} via Corporate Wallet'),
                      ),
                    ),
                  ],
                  if (job.status == 'COMPLETED' && job.paid && job.rating == null) ...[
                    const SizedBox(height: 10),
                    const Text('Sealed 48h Double-Blind Rating', style: TextStyle(fontWeight: FontWeight.w700)),
                    Row(
                      children: List.generate(
                        5,
                        (i) => IconButton(
                          icon: const Icon(Icons.star_rounded, color: Colors.amber),
                          onPressed: () {
                            setState(() => job.rating = i + 1);
                            setModalState(() {});
                          },
                        ),
                      ),
                    ),
                  ],
                  if (job.rating != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        '✓ Escrow settled & rated ${job.rating}/5 stars',
                        style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w700),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_authenticated) {
      return _buildLoginScreen(context);
    }

    final location = ref.watch(selectedLocationProvider);
    final cart = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: GestureDetector(
          onTap: () => _showFacilityPicker(context),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.location_on_rounded, size: 16, color: _kCobalt),
                  const SizedBox(width: 4),
                  Flexible(
                    child: Text(
                      location.label,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                    ),
                  ),
                  const Icon(Icons.keyboard_arrow_down_rounded, size: 18),
                ],
              ),
              Text(
                '${location.areaCluster} • ${location.etaBadge}',
                style: const TextStyle(fontSize: 11, color: _kMuted),
              ),
            ],
          ),
        ),
        actions: [
          IconButton(
            tooltip: 'Toggle theme',
            icon: const Icon(Icons.brightness_6_outlined),
            onPressed: () => ref.read(themeModeProvider.notifier).toggle(),
          ),
          if (cart.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Badge(
                label: Text('${cart.length}'),
                child: IconButton(
                  icon: const Icon(Icons.shopping_cart_outlined),
                  onPressed: () => setState(() => _tabIndex = 3),
                ),
              ),
            ),
        ],
      ),
      body: IndexedStack(
        index: _tabIndex,
        children: [
          _buildHomeTab(context),
          _buildReportTab(context),
          _buildJobsTab(context),
          _buildAssetsAndPartsTab(context),
          _buildAccountTab(context),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tabIndex,
        onDestinationSelected: (i) => setState(() => _tabIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.bolt_outlined), selectedIcon: Icon(Icons.bolt), label: 'AI Triage'),
          NavigationDestination(icon: Icon(Icons.assignment_outlined), selectedIcon: Icon(Icons.assignment), label: 'Jobs'),
          NavigationDestination(icon: Icon(Icons.precision_manufacturing_outlined), selectedIcon: Icon(Icons.precision_manufacturing), label: 'Assets'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Account'),
        ],
      ),
    );
  }

  void _showFacilityPicker(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('Select Active Facility', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
            ),
            ..._facilities.map(
              (f) => ListTile(
                leading: const Icon(Icons.factory_outlined, color: _kCobalt),
                title: Text(f.label, style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Text(f.addressLine, maxLines: 1, overflow: TextOverflow.ellipsis),
                trailing: Text(f.etaBadge, style: const TextStyle(color: _kCobalt, fontWeight: FontWeight.w700, fontSize: 12)),
                onTap: () {
                  ref.read(selectedLocationProvider.notifier).selectLocation(f);
                  Navigator.pop(ctx);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoginScreen(BuildContext context) {
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
                      color: _kCobalt,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Icon(Icons.bolt_rounded, color: _kTeal, size: 34),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    AppConfig.appName,
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: -0.5),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    AppConfig.tagline,
                    style: TextStyle(fontSize: 15, color: _kMuted, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 28),
                  if (_authError != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 14),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.red.shade200),
                      ),
                      child: Text(_authError!, style: TextStyle(color: Colors.red.shade800, fontSize: 13)),
                    ),
                  TextField(
                    controller: _phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Mobile Number (+91)',
                      prefixIcon: Icon(Icons.phone_outlined),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  if (_otpSent) ...[
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
                  ],
                  const SizedBox(height: 18),
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: _otpSent ? _kSafetyOrange : _kCobalt,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                    ),
                    onPressed: _otpSent ? _verifyOtp : _sendOtp,
                    child: Text(
                      _otpSent ? 'Verify OTP & Continue' : 'Send OTP (123456)',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
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

  Widget _buildHomeTab(BuildContext context) {
    final activeJob = _jobs.where((j) => j.status != 'COMPLETED').firstOrNull;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [_kCobalt, Color(0xFF1E3A8A)]),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Machine, Vehicle or Device Down?',
                style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 6),
              const Text(
                'Run AI fault triage or dispatch a verified 415V specialist with 15-minute arrival SLA.',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: FilledButton.icon(
                      style: FilledButton.styleFrom(backgroundColor: _kSafetyOrange),
                      onPressed: () => setState(() => _tabIndex = 1),
                      icon: const Icon(Icons.bolt_rounded, size: 18),
                      label: const Text('Report Breakdown'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        if (activeJob != null) ...[
          const Text('Active Dispatch', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              onTap: () => _openJobDetail(activeJob),
              leading: const CircleAvatar(
                backgroundColor: _kCobalt,
                child: Icon(Icons.engineering_rounded, color: Colors.white),
              ),
              title: Text(activeJob.assetName, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text('${activeJob.technicianName} • OTP: ${activeJob.arrivalOtp}'),
              trailing: Chip(
                label: Text(activeJob.status.replaceAll('_', ' '), style: const TextStyle(fontSize: 10)),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
        Row(
          children: [
            Expanded(
              child: _kpiTile('Corporate Wallet', FormatUtils.formatInr(_walletBalanceInr), _kCobalt),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _kpiTile('Assets Monitored', '${_assets.length} Units', _kTeal),
            ),
          ],
        ),
        const SizedBox(height: 16),
        const Text('Recent Service History', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        ..._jobs.map(
          (j) => Card(
            child: ListTile(
              onTap: () => _openJobDetail(j),
              title: Text('${j.id} • ${j.assetName}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              subtitle: Text(j.symptom, maxLines: 1, overflow: TextOverflow.ellipsis),
              trailing: Text(FormatUtils.formatInr(j.costInr), style: const TextStyle(fontWeight: FontWeight.w800)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _kpiTile(String label, String value, Color accent) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: accent.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: accent.withOpacity(0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: _kMuted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _buildReportTab(BuildContext context) {
    final industry = ref.watch(selectedIndustryProvider);
    final rankedAsync = ref.watch(rankedTechniciansProvider(industry));

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('AI Fault Triage & Dispatch', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          children: ['INDUSTRIAL', 'AUTOMOTIVE', 'ELECTRONICS'].map((ind) {
            final selected = industry == ind;
            return ChoiceChip(
              label: Text(ind),
              selected: selected,
              onSelected: (_) => ref.read(selectedIndustryProvider.notifier).select(ind),
            );
          }).toList(),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _assetCtrl,
          decoration: const InputDecoration(labelText: 'Machine / Vehicle / Device', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _symptomCtrl,
          maxLines: 2,
          decoration: const InputDecoration(labelText: 'Fault Symptoms or Error Code', border: OutlineInputBorder()),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'STANDARD', label: Text('Standard')),
                  ButtonSegment(value: 'EMERGENCY', label: Text('SOS Emergency')),
                ],
                selected: {_urgency},
                onSelectionChanged: (s) => setState(() => _urgency = s.first),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        FilledButton.icon(
          style: FilledButton.styleFrom(backgroundColor: _kCobalt),
          onPressed: () => _runAiTriage(industry),
          icon: const Icon(Icons.auto_awesome),
          label: const Text('Run AI First-Look Diagnosis'),
        ),
        if (_triageRan) ...[
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.amber.shade50,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.amber.shade300),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('AI Preliminary Triage', style: TextStyle(fontWeight: FontWeight.w800, color: _kInk)),
                const SizedBox(height: 4),
                Text('Probable Cause: $_aiCause', style: const TextStyle(fontSize: 13)),
                Text('Estimated Cost: $_aiCostBand', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                const SizedBox(height: 4),
                Text('Safety: $_aiSafety', style: TextStyle(fontSize: 12, color: Colors.orange.shade900)),
              ],
            ),
          ),
        ],
        const SizedBox(height: 18),
        const Text('Eligible Verified Specialists (40/60 Match)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        rankedAsync.when(
          loading: () => const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator())),
          error: (e, _) => Text('Unable to load specialists: $e'),
          data: (techs) => Column(
            children: techs.map((t) {
              return Card(
                child: ListTile(
                  title: Text(t.fullName, style: const TextStyle(fontWeight: FontWeight.w700)),
                  subtitle: Text(
                    'L${t.verificationLevel} • ${t.distanceKm.toStringAsFixed(1)} km • Score ${t.matchScore.toStringAsFixed(0)}/100',
                  ),
                  trailing: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: _kSafetyOrange),
                    onPressed: () => _bookTechnician(t, industry),
                    child: const Text('Book'),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildJobsTab(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('My Jobs & Live Tracking', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
        const SizedBox(height: 10),
        ..._jobs.map(
          (j) => Card(
            child: ListTile(
              onTap: () => _openJobDetail(j),
              title: Text('${j.id} • ${j.assetName}', style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text('${j.technicianName}\nStatus: ${j.status.replaceAll('_', ' ')} • OTP ${j.arrivalOtp}'),
              isThreeLine: true,
              trailing: const Icon(Icons.chevron_right),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAssetsAndPartsTab(BuildContext context) {
    final cart = ref.watch(cartProvider);
    final cartTotal = cart.fold<int>(0, (sum, i) => sum + i.priceInr.round());

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Registered Plant & Fleet Assets', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        ..._assets.map(
          (a) => Card(
            child: ListTile(
              title: Text(a.name, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text('${a.sector} • ${a.note}'),
              trailing: TextButton(
                onPressed: () {
                  _assetCtrl.text = a.name;
                  ref.read(selectedIndustryProvider.notifier).select(a.sector);
                  setState(() => _tabIndex = 1);
                },
                child: const Text('Report'),
              ),
            ),
          ),
        ),
        const SizedBox(height: 18),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('OEM Spare Parts Store', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
            if (cart.isNotEmpty)
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: _kCobalt),
                onPressed: () {
                  ref.read(cartProvider.notifier).clear();
                  setState(() => _walletBalanceInr = (_walletBalanceInr - cartTotal).clamp(0, 9999999));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Order placed for ${FormatUtils.formatInr(cartTotal)} • Express 60m delivery!')),
                  );
                },
                child: Text('Checkout (${FormatUtils.formatInr(cartTotal)})'),
              ),
          ],
        ),
        const SizedBox(height: 8),
        ..._catalogParts.map(
          (p) => Card(
            child: ListTile(
              title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              subtitle: Text('${p.qualityBadge} • ${p.compatibility}'),
              trailing: OutlinedButton(
                onPressed: () => ref.read(cartProvider.notifier).addItem(p),
                child: Text('+ ${FormatUtils.formatInr(p.priceInr)}'),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAccountTab(BuildContext context) {
    final lang = ref.watch(selectedLanguageProvider);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Corporate Wallet', style: TextStyle(color: _kMuted, fontSize: 12)),
                    Text(
                      FormatUtils.formatInr(_walletBalanceInr),
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: _kCobalt),
                    ),
                  ],
                ),
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: _kCobalt),
                  onPressed: () => setState(() => _walletBalanceInr += 5000),
                  child: const Text('+ Add ₹5,000'),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              SwitchListTile(
                title: const Text('UPTIME Pro Pass (Priority 15m SLA)'),
                subtitle: Text('Active AMC Tier: $_amcTier'),
                value: _proPassActive,
                onChanged: (v) => setState(() => _proPassActive = v),
              ),
              ListTile(
                title: const Text('App Language'),
                subtitle: Text(lang),
                trailing: DropdownButton<String>(
                  value: lang,
                  underline: const SizedBox.shrink(),
                  items: const [
                    DropdownMenuItem(value: 'EN • English', child: Text('English')),
                    DropdownMenuItem(value: 'KN • ಕನ್ನಡ', child: Text('ಕನ್ನಡ')),
                    DropdownMenuItem(value: 'HI • हिन्दी', child: Text('हिन्दी')),
                    DropdownMenuItem(value: 'TA • தமிழ்', child: Text('தமிழ்')),
                  ],
                  onChanged: (v) {
                    if (v != null) ref.read(selectedLanguageProvider.notifier).select(v);
                  },
                ),
              ),
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text('Sign Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.w700)),
                onTap: () => setState(() {
                  _authenticated = false;
                  _otpSent = false;
                }),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
