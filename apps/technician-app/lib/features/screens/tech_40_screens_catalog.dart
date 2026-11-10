import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/theme.dart';
import '../../core/utils/kyc_and_fatigue_validators.dart';
import '../providers/tech_providers.dart';

class TechScreenSpec {
  final String code; // T01..T40
  final int number;
  final String module;
  final String title;
  final String subtitle;
  final IconData icon;
  final Color accent;
  final int tabIndex; // maps to primary shell tabs 0..5

  const TechScreenSpec({
    required this.code,
    required this.number,
    required this.module,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.accent,
    required this.tabIndex,
  });
}

const List<TechScreenSpec> kTech40Screens = [
  // Module 1: Entry & KYC (T01-T05, T35, T36)
  TechScreenSpec(
    code: 'T01',
    number: 1,
    module: '1. Entry & KYC',
    title: 'Technician Splash Screen',
    subtitle: 'Pitch-black #000000 background, official UPTIME logo lockup & instant duty check',
    icon: Icons.bolt_rounded,
    accent: UptimeTheme.blue500,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T02',
    number: 2,
    module: '1. Entry & KYC',
    title: 'Trade Specialty Selector',
    subtitle: 'Industrial Machinery, Automobile & Fleet, Electronics & HVAC trade tracks',
    icon: Icons.precision_manufacturing_outlined,
    accent: UptimeTheme.industrial,
    tabIndex: 2,
  ),
  TechScreenSpec(
    code: 'T03',
    number: 3,
    module: '1. Entry & KYC',
    title: 'UIDAI Aadhaar DigiLocker & NCVT KYC',
    subtitle: 'DPDP Act 2023 masked Aadhaar (XXXX-XXXX-4829), NCVT ITI & CEA permit OCR',
    icon: Icons.badge_outlined,
    accent: UptimeTheme.teal600,
    tabIndex: 2,
  ),
  TechScreenSpec(
    code: 'T04',
    number: 4,
    module: '1. Entry & KYC',
    title: 'Tool Bag Declaration & Skills Matrix',
    subtitle: 'True-RMS multimeter, dial indicator, hydraulic gauges & Polygon NFT readiness',
    icon: Icons.handyman_outlined,
    accent: UptimeTheme.warning,
    tabIndex: 2,
  ),
  TechScreenSpec(
    code: 'T05',
    number: 5,
    module: '1. Entry & KYC',
    title: 'Technician Phone + SMS OTP',
    subtitle: 'Registered technician +91 mobile authentication with 6-digit OTP verification',
    icon: Icons.phonelink_lock_rounded,
    accent: UptimeTheme.blue700,
    tabIndex: 0,
  ),

  // Module 2: Workstation & Duty (T06-T08, T39)
  TechScreenSpec(
    code: 'T06',
    number: 6,
    module: '2. Workstation & Duty',
    title: 'Field Workstation Command HUD',
    subtitle: 'Giant ONLINE / OFFLINE duty toggle, ₹2,450 today earnings & live radar ping',
    icon: Icons.space_dashboard_outlined,
    accent: UptimeTheme.teal600,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T07',
    number: 7,
    module: '2. Workstation & Duty',
    title: 'Service Area & Radar Radius',
    subtitle: '1–25 km PostGIS dispatch slider with Peenya & Jalahalli industrial cluster pins',
    icon: Icons.radar_rounded,
    accent: UptimeTheme.blue500,
    tabIndex: 5,
  ),
  TechScreenSpec(
    code: 'T08',
    number: 8,
    module: '2. Workstation & Duty',
    title: 'Availability & On-Call Shift Schedule',
    subtitle: 'Weekly shift planner with 24/7 emergency roadside & plant on-call toggle',
    icon: Icons.calendar_month_outlined,
    accent: UptimeTheme.industrial,
    tabIndex: 5,
  ),

  // Module 3: Job Broadcasts (T09-T11)
  TechScreenSpec(
    code: 'T09',
    number: 9,
    module: '3. Job Broadcasts',
    title: 'Incoming Emergency Job Alert (42s Timer)',
    subtitle: 'Countdown ring, ₹950–₹1,490 payout, 96% skill match & oversized [ACCEPT] bar',
    icon: Icons.notifications_active_outlined,
    accent: UptimeTheme.danger,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T10',
    number: 10,
    module: '3. Job Broadcasts',
    title: 'Pre-Accept Symptom & Tool Checklist',
    subtitle: 'Customer audio recording, CNC Haas VF-2 / Mazak VMC fault summary & required tools',
    icon: Icons.fact_check_outlined,
    accent: UptimeTheme.warning,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T11',
    number: 11,
    module: '3. Job Broadcasts',
    title: '60-Second Emergency SOS Live Auction',
    subtitle: 'Rapid priority bidding room for critical factory line-down or highway breakdown',
    icon: Icons.gavel_rounded,
    accent: UptimeTheme.danger,
    tabIndex: 0,
  ),

  // Module 4: Navigation & Arrival (T12-T15)
  TechScreenSpec(
    code: 'T12',
    number: 12,
    module: '4. Navigation & Arrival',
    title: 'Turn-by-Turn GPS Navigation HUD',
    subtitle: 'Live PostGIS route, speed gauge, Exotel masked customer calling & ETA tracker',
    icon: Icons.navigation_outlined,
    accent: UptimeTheme.blue500,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T13',
    number: 13,
    module: '4. Navigation & Arrival',
    title: 'Customer Chat & 9-Language Translation',
    subtitle: 'Real-time Bhashini auto-translated chat (Kannada ↔ Hindi ↔ Tamil ↔ English)',
    icon: Icons.translate_rounded,
    accent: UptimeTheme.teal600,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T14',
    number: 14,
    module: '4. Navigation & Arrival',
    title: 'Physical Site Arrival & PostGIS Geofence',
    subtitle: 'Haversine <= 500m GPS geofence check before unlocking customer OTP verification',
    icon: Icons.location_searching_rounded,
    accent: UptimeTheme.success,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T15',
    number: 15,
    module: '4. Navigation & Arrival',
    title: 'Tactile Numeric Keypad for Customer OTP',
    subtitle: 'Glove-friendly oversized keypad to enter 6-digit arrival OTP (482196 / 123456)',
    icon: Icons.dialpad_rounded,
    accent: UptimeTheme.blue700,
    tabIndex: 1,
  ),

  // Module 5: Repair Execution (T16-T21, T38)
  TechScreenSpec(
    code: 'T16',
    number: 16,
    module: '5. Repair Execution',
    title: 'Pre-Repair Damage Evidence Camera',
    subtitle: 'Mandatory before-repair photo capture with timestamp & PostGIS GPS watermarks',
    icon: Icons.camera_alt_outlined,
    accent: UptimeTheme.warning,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T17',
    number: 17,
    module: '5. Repair Execution',
    title: 'Step-by-Step AI Diagnostic Copilot',
    subtitle: 'Multimeter test points (320–350V DC), spindle runout gauge & 415V LOTO warnings',
    icon: Icons.smart_toy_outlined,
    accent: UptimeTheme.industrial,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T18',
    number: 18,
    module: '5. Repair Execution',
    title: 'Spare Part Requisition & Quote Request',
    subtitle: 'Add OEM replacement part (SKF 7010 bearing / Schneider contactor) with owner push approval',
    icon: Icons.settings_suggest_outlined,
    accent: UptimeTheme.blue500,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T19',
    number: 19,
    module: '5. Repair Execution',
    title: 'Camera Live Stream to Remote Supervisor',
    subtitle: 'WebRTC video broadcast to Level-3 Master Engineer or factory owner for sign-off',
    icon: Icons.videocam_outlined,
    accent: UptimeTheme.danger,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T20',
    number: 20,
    module: '5. Repair Execution',
    title: 'Running Proof Video & Owner Signature Pad',
    subtitle: '10-second machine running proof video + touch canvas signature for handover',
    icon: Icons.draw_outlined,
    accent: UptimeTheme.teal600,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T21',
    number: 21,
    module: '5. Repair Execution',
    title: 'Job Complete & Escrow Payout Confirmation',
    subtitle: 'Itemized labour + parts invoice summary (₹1,490) & SHA-256 cryptographic lock',
    icon: Icons.verified_rounded,
    accent: UptimeTheme.success,
    tabIndex: 1,
  ),

  // Module 6: Earnings & Finance (T22-T24, T37)
  TechScreenSpec(
    code: 'T22',
    number: 22,
    module: '6. Earnings & Finance',
    title: 'Technician Earnings Dashboard & Ledger',
    subtitle: 'Available balance (₹8,420), 10% platform fee, 1% u/s 194C TDS & weekly bar chart',
    icon: Icons.account_balance_wallet_outlined,
    accent: UptimeTheme.teal600,
    tabIndex: 3,
  ),
  TechScreenSpec(
    code: 'T23',
    number: 23,
    module: '6. Earnings & Finance',
    title: '1-Tap Instant Bank Withdrawal via UPI',
    subtitle: 'Zero-fee instant transfer to verified UPI VPA (raju.tech@okaxis) in < 10 seconds',
    icon: Icons.currency_rupee_rounded,
    accent: UptimeTheme.success,
    tabIndex: 3,
  ),
  TechScreenSpec(
    code: 'T24',
    number: 24,
    module: '6. Earnings & Finance',
    title: 'GST Invoices & TDS Tax Statement Vault',
    subtitle: 'Downloadable monthly GST commission invoices & quarterly Form 16A certificates',
    icon: Icons.receipt_long_outlined,
    accent: UptimeTheme.blue700,
    tabIndex: 3,
  ),

  // Module 7: Badges & Reputation (T25-T26)
  TechScreenSpec(
    code: 'T25',
    number: 25,
    module: '7. Badges & Reputation',
    title: 'Polygon Blockchain NFT Skill Badges',
    subtitle: 'Tamper-proof ERC-721 credentials: Fanuc CNC Master #409 & HV Arc-Flash Specialist',
    icon: Icons.workspace_premium_outlined,
    accent: UptimeTheme.industrial,
    tabIndex: 4,
  ),
  TechScreenSpec(
    code: 'T26',
    number: 26,
    module: '7. Badges & Reputation',
    title: 'Technician Performance Scorecard',
    subtitle: '96.4% acceptance SLA, 98% on-time arrival, 4.9★ rating & L2-P → L2 graduation tracker',
    icon: Icons.insights_rounded,
    accent: UptimeTheme.teal600,
    tabIndex: 4,
  ),

  // Module 8: Job History & Warranty (T27-T28, T40)
  TechScreenSpec(
    code: 'T27',
    number: 27,
    module: '8. Job History & Warranty',
    title: 'Completed & Active Jobs Ledger',
    subtitle: 'Searchable field job archive (UPT-2026-XXXX) with payout chips & SHA-256 hashes',
    icon: Icons.history_rounded,
    accent: UptimeTheme.blue500,
    tabIndex: 3,
  ),
  TechScreenSpec(
    code: 'T28',
    number: 28,
    module: '8. Job History & Warranty',
    title: 'Detailed Job Audit File & Review',
    subtitle: 'Complete repair timeline, before/after media proof, replaced OEM parts & client review',
    icon: Icons.folder_special_outlined,
    accent: UptimeTheme.industrial,
    tabIndex: 3,
  ),

  // Module 9: Video Consult (T29-T30)
  TechScreenSpec(
    code: 'T29',
    number: 29,
    module: '9. Video Consult',
    title: 'Incoming Remote Video Consult Request',
    subtitle: '30-second incoming virtual diagnostic call alert with instant ₹199 payout',
    icon: Icons.ring_volume_outlined,
    accent: UptimeTheme.teal600,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T30',
    number: 30,
    module: '9. Video Consult',
    title: 'Agora Video Consult Workstation HUD',
    subtitle: 'WebRTC live video room with AR laser pointer overlay & multimeter probing guide',
    icon: Icons.video_call_outlined,
    accent: UptimeTheme.blue500,
    tabIndex: 1,
  ),

  // Module 10 & 11: Wiki, Alerts & Profile (T31-T34)
  TechScreenSpec(
    code: 'T31',
    number: 31,
    module: '10. Wiki & Settings',
    title: 'Offline Field Repair Wiki & Alarm Directory',
    subtitle: 'Offline-cached database of Fanuc, Siemens S7, Haas, Bosch & Daikin fault codes',
    icon: Icons.menu_book_rounded,
    accent: UptimeTheme.industrial,
    tabIndex: 5,
  ),
  TechScreenSpec(
    code: 'T32',
    number: 32,
    module: '10. Wiki & Settings',
    title: 'Wiki Wiring Schematics & Test Points',
    subtitle: 'Full 415V 3-phase contactor pinout diagrams, terminal voltages & torque specs',
    icon: Icons.electrical_services_rounded,
    accent: UptimeTheme.warning,
    tabIndex: 5,
  ),
  TechScreenSpec(
    code: 'T33',
    number: 33,
    module: '10. Wiki & Settings',
    title: 'Technician Notifications & Dispatch Alerts',
    subtitle: 'Real-time alert feed: instant UPI payout credits, SOS broadcasts & KYC updates',
    icon: Icons.notifications_none_rounded,
    accent: UptimeTheme.blue500,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T34',
    number: 34,
    module: '10. Wiki & Settings',
    title: 'Technician Profile, Vehicle & Dual Theme Mode',
    subtitle: 'Hero Splendor KA-02-EE-4821, Clean White vs High-Contrast Industrial Dark Mode',
    icon: Icons.person_outline_rounded,
    accent: UptimeTheme.teal600,
    tabIndex: 5,
  ),

  // Audited Regulatory, Safety & Bilateral Fairness Additions (T35-T40)
  TechScreenSpec(
    code: 'T35',
    number: 35,
    module: '1. Entry & KYC',
    title: '3D Face Liveness & Biometric Verification',
    subtitle: 'KYC L1 anti-spoofing oval camera with blink/tilt prompts & 98.4% Aadhaar match',
    icon: Icons.face_retouching_natural_rounded,
    accent: UptimeTheme.teal600,
    tabIndex: 2,
  ),
  TechScreenSpec(
    code: 'T36',
    number: 36,
    module: '1. Entry & KYC',
    title: 'Trade Skill MCQ & Mandatory Safety Assessment',
    subtitle: '15-question trade quiz with 20m timer & mandatory 2/2 LOTO safety pass rule',
    icon: Icons.quiz_outlined,
    accent: UptimeTheme.industrial,
    tabIndex: 2,
  ),
  TechScreenSpec(
    code: 'T37',
    number: 37,
    module: '6. Earnings & Finance',
    title: 'Bank Account Setup & ₹1 Penny-Drop Verification',
    subtitle: 'NPCI automated ₹1 penny-drop with 100% Aadhaar name match & Section 194C PAN link',
    icon: Icons.account_balance_outlined,
    accent: UptimeTheme.success,
    tabIndex: 3,
  ),
  TechScreenSpec(
    code: 'T38',
    number: 38,
    module: '5. Repair Execution',
    title: 'Blind Customer Rating & Site Safety Review',
    subtitle: 'CORE-07 confidential bilateral rating: evaluate plant LOTO safety & operator support',
    icon: Icons.thumbs_up_down_outlined,
    accent: UptimeTheme.warning,
    tabIndex: 1,
  ),
  TechScreenSpec(
    code: 'T39',
    number: 39,
    module: '2. Workstation & Duty',
    title: 'Fatigue Monitor, Shift Rest Gauge & Safety Lock',
    subtitle: 'ISO 45001 radial fatigue score (30/100), 10h shift cap, hydration alert & 45m break',
    icon: Icons.monitor_heart_outlined,
    accent: UptimeTheme.danger,
    tabIndex: 0,
  ),
  TechScreenSpec(
    code: 'T40',
    number: 40,
    module: '8. Job History & Warranty',
    title: 'Warranty Revisit & Dispute Evidence Resolution Desk',
    subtitle: '30-Day workmanship callback manager with side-by-side FFT acoustic proof comparison',
    icon: Icons.gpp_maybe_outlined,
    accent: UptimeTheme.blue700,
    tabIndex: 3,
  ),
];

// ═══════════════════════════════════════════════════════════════════════════
// OFFICIAL PITCH-BLACK SPLASH SCREEN LOCKUP (T01 — Matches Uploaded Image)
// ═══════════════════════════════════════════════════════════════════════════
class UptimeTechSplashLockup extends StatelessWidget {
  final VoidCallback? onContinue;
  const UptimeTechSplashLockup({super.key, this.onContinue});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF1E293B), width: 1.5),
        boxShadow: const [
          BoxShadow(
            color: Color(0x26000000),
            blurRadius: 24,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 66,
                height: 66,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const Icon(
                      Icons.settings_rounded,
                      color: Color(0xFF1D4ED8),
                      size: 46,
                    ),
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.build_rounded,
                        color: Color(0xFF0F172A),
                        size: 20,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 2,
                height: 52,
                margin: const EdgeInsets.symmetric(horizontal: 16),
                color: Colors.white70,
              ),
              const Flexible(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'UPTIME',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 3.0,
                        height: 1.05,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'DOWNTIME ENDS HERE.',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 2.2,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: UptimeTheme.teal500.withValues(alpha: 0.16),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: UptimeTheme.teal500.withValues(alpha: 0.5)),
            ),
            child: const Text(
              'CERTIFIED FIELD SPECIALIST EDITION • 40 SCREENS',
              style: TextStyle(
                color: UptimeTheme.teal500,
                fontSize: 10.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.1,
              ),
            ),
          ),
          if (onContinue != null) ...[
            const SizedBox(height: 16),
            TextButton.icon(
              onPressed: onContinue,
              icon: const Icon(Icons.grid_view_rounded, color: UptimeTheme.teal500, size: 18),
              label: const Text(
                'Preview Fullscreen T01 Splash or Browse All 40 Screens →',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12.5),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOP BASE-ZONE & RADAR HUB SELECTOR SHEET (Urban Company / Zomato Partner Style)
// ═══════════════════════════════════════════════════════════════════════════
Future<void> showTechBaseZonePickerSheet(BuildContext context, WidgetRef ref) async {
  const presetZones = [
    TechBaseZoneLocation(
      label: 'Peenya Industrial Cluster #4',
      addressLine: 'Stage IV, Peenya Industrial Area, Bengaluru 560058',
      radarBadge: '12 km Radar • 4 High-Payout Jobs',
    ),
    TechBaseZoneLocation(
      label: 'Whitefield & ITPL Tech Corridor',
      addressLine: 'EPIP Zone, Whitefield Main Rd, Bengaluru 560066',
      radarBadge: '10 km Radar • 3 Commercial HVAC/EV Jobs',
    ),
    TechBaseZoneLocation(
      label: 'Bommasandra & Electronic City',
      addressLine: 'Hosur Rd Industrial Estate, Bengaluru 560099',
      radarBadge: '15 km Radar • 5 CNC & PLC Breakdowns',
    ),
    TechBaseZoneLocation(
      label: 'Yeshwanthpur Highway & Fleet Hub',
      addressLine: 'NH-48 Tumkur Road Logistics Park, Bengaluru 560022',
      radarBadge: '20 km Radar • 2 Emergency Highway SOS',
    ),
  ];

  final current = ref.read(techBaseZoneProvider);

  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (ctx) {
      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.my_location_rounded, color: UptimeTheme.blue700),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Select Active Dispatch Base Zone (T07)',
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close_rounded),
                  ),
                ],
              ),
              const Text(
                'PostGIS 5-second live GPS ping matches you to jobs within your selected base zone.',
                style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
              ),
              const SizedBox(height: 14),
              ...presetZones.map((zone) {
                final isSelected = zone.label == current.label;
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: BorderSide(
                      color: isSelected ? UptimeTheme.blue500 : const Color(0xFFE2E8F0),
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: isSelected
                          ? UptimeTheme.blue500.withValues(alpha: 0.14)
                          : UptimeTheme.gray100,
                      child: Icon(
                        Icons.factory_outlined,
                        color: isSelected ? UptimeTheme.blue500 : UptimeTheme.gray700,
                      ),
                    ),
                    title: Text(
                      zone.label,
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                    ),
                    subtitle: Text(
                      '${zone.addressLine}\n⚡ ${zone.radarBadge}',
                      style: const TextStyle(fontSize: 12, height: 1.35),
                    ),
                    isThreeLine: true,
                    trailing: isSelected
                        ? const Icon(Icons.check_circle_rounded, color: UptimeTheme.blue500)
                        : null,
                    onTap: () {
                      ref.read(techBaseZoneProvider.notifier).selectZone(zone);
                      Navigator.pop(ctx);
                    },
                  ),
                );
              }),
            ],
          ),
        ),
      );
    },
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ALL 40 SCREENS INTERACTIVE DIRECTORY & MODULE BROWSER
// ═══════════════════════════════════════════════════════════════════════════
Future<void> showTechAll40ScreensSheet(
  BuildContext context, {
  required ValueChanged<int> onJumpToTab,
}) async {
  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (ctx) => DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.88,
      minChildSize: 0.55,
      maxChildSize: 0.96,
      builder: (_, scrollCtrl) => TechAll40ScreensBrowser(
        scrollController: scrollCtrl,
        onSelectScreen: (spec) {
          Navigator.pop(ctx);
          onJumpToTab(spec.tabIndex);
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => TechDedicatedScreenViewer(
                initialSpec: spec,
                onJumpToTab: onJumpToTab,
              ),
            ),
          );
        },
      ),
    ),
  );
}

class TechAll40ScreensBrowser extends StatefulWidget {
  final ScrollController? scrollController;
  final ValueChanged<TechScreenSpec> onSelectScreen;

  const TechAll40ScreensBrowser({
    super.key,
    this.scrollController,
    required this.onSelectScreen,
  });

  @override
  State<TechAll40ScreensBrowser> createState() => _TechAll40ScreensBrowserState();
}

class _TechAll40ScreensBrowserState extends State<TechAll40ScreensBrowser> {
  String _selectedModule = 'All 40';

  List<String> get _modules {
    final set = <String>{'All 40'};
    for (final s in kTech40Screens) {
      set.add(s.module);
    }
    return set.toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedModule == 'All 40'
        ? kTech40Screens
        : kTech40Screens.where((s) => s.module == _selectedModule).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: UptimeTheme.blue700,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '40 SCREENS',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Text(
                  'UPTIME Technician App — Complete 40-Screen Atlas (T01–T40)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
              ),
              IconButton(
                onPressed: () => Navigator.maybePop(context),
                icon: const Icon(Icons.close_rounded),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 44,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: _modules.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (_, idx) {
              final mod = _modules[idx];
              final selected = mod == _selectedModule;
              return ChoiceChip(
                label: Text(mod, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                selected: selected,
                onSelected: (_) => setState(() => _selectedModule = mod),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.builder(
            controller: widget.scrollController,
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
            itemCount: filtered.length,
            itemBuilder: (_, idx) {
              final spec = filtered[idx];
              final isAuditAddition = spec.number >= 35;
              return Card(
                margin: const EdgeInsets.only(bottom: 10),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: spec.accent.withValues(alpha: 0.14),
                    child: Text(
                      spec.code,
                      style: TextStyle(
                        color: spec.accent,
                        fontWeight: FontWeight.w900,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  title: Row(
                    children: [
                      Expanded(
                        child: Text(
                          spec.title,
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                        ),
                      ),
                      if (isAuditAddition)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: UptimeTheme.teal500.withValues(alpha: 0.18),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: const Text(
                            'COMPLIANCE +',
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w900,
                              color: UptimeTheme.teal600,
                            ),
                          ),
                        ),
                    ],
                  ),
                  subtitle: Text(
                    '${spec.module} • ${spec.subtitle}',
                    style: const TextStyle(fontSize: 12),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 15),
                  onTap: () => widget.onSelectScreen(spec),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDICATED INTERACTIVE VIEWER FOR ALL 40 TECHNICIAN SCREENS (T01–T40)
// ═══════════════════════════════════════════════════════════════════════════
class TechDedicatedScreenViewer extends ConsumerStatefulWidget {
  final TechScreenSpec initialSpec;
  final ValueChanged<int>? onJumpToTab;

  const TechDedicatedScreenViewer({
    super.key,
    required this.initialSpec,
    this.onJumpToTab,
  });

  @override
  ConsumerState<TechDedicatedScreenViewer> createState() =>
      _TechDedicatedScreenViewerState();
}

class _TechDedicatedScreenViewerState extends ConsumerState<TechDedicatedScreenViewer> {
  late int _currentIndex;
  String _keypadOtp = '482196';
  int _livenessStep = 2; // 0: Look straight, 1: Blink, 2: Verified 98.4%
  int _mcqSelectedSafetyAnswer = 0;
  bool _pennyDropDone = true;
  int _blindRatingStars = 5;
  final Set<String> _blindSafetyTags = {
    'Clean work area',
    'Proper 415V LOTO switch',
    'Fast gate pass',
  };
  bool _warrantyRevisitScheduled = false;

  @override
  void initState() {
    super.initState();
    _currentIndex = kTech40Screens
        .indexWhere((s) => s.code == widget.initialSpec.code)
        .clamp(0, kTech40Screens.length - 1);
  }

  TechScreenSpec get _spec => kTech40Screens[_currentIndex];

  @override
  Widget build(BuildContext context) {
    final spec = _spec;
    final tech = ref.watch(technicianStateProvider).valueOrNull;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          '${spec.code} • ${spec.title}',
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
        ),
        actions: [
          IconButton(
            tooltip: 'Previous Screen',
            onPressed: _currentIndex > 0
                ? () => setState(() => _currentIndex--)
                : null,
            icon: const Icon(Icons.chevron_left_rounded),
          ),
          Center(
            child: Text(
              '${_currentIndex + 1}/40',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
            ),
          ),
          IconButton(
            tooltip: 'Next Screen',
            onPressed: _currentIndex < kTech40Screens.length - 1
                ? () => setState(() => _currentIndex++)
                : null,
            icon: const Icon(Icons.chevron_right_rounded),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Screen Header Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: spec.accent.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: spec.accent.withValues(alpha: 0.35)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: spec.accent,
                  child: Icon(spec.icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${spec.code} • ${spec.module.toUpperCase()}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          color: spec.accent,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        spec.title,
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        spec.subtitle,
                        style: const TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Dedicated Interactive Content per Screen
          _buildInteractiveScreenBody(context, spec, tech),

          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    widget.onJumpToTab?.call(spec.tabIndex);
                    Navigator.pop(context);
                  },
                  icon: const Icon(Icons.open_in_new_rounded, size: 16),
                  label: Text('Open in Main Tab #${spec.tabIndex + 1}'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInteractiveScreenBody(
    BuildContext context,
    TechScreenSpec spec,
    dynamic tech,
  ) {
    switch (spec.code) {
      case 'T01':
        return const UptimeTechSplashLockup();

      case 'T09':
      case 'T11':
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: UptimeTheme.danger,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: const Text(
                        '⏱ 00:42 REMAINING • 96% SKILL MATCH',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const Spacer(),
                    const Text(
                      '₹1,490 Est.',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: UptimeTheme.success,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'CNC Haas VF-2 Spindle Drive Fault (Alarm 108)',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 6),
                const Text(
                  '📍 Peenya Industrial Area Stage IV (1.8 km away • 6 mins ETA)\n'
                  '🔧 Required Tools: Fluke True-RMS Multimeter, Dial Indicator, 415V LOTO Padlock',
                  style: TextStyle(fontSize: 13, height: 1.45),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: UptimeTheme.success,
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(52),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Emergency Job UPT-2026-00891 Accepted! Navigating...'),
                        ),
                      );
                    },
                    icon: const Icon(Icons.check_circle_rounded),
                    label: const Text('ACCEPT EMERGENCY DISPATCH (₹1,490)'),
                  ),
                ),
              ],
            ),
          ),
        );

      case 'T13':
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Real-Time 9-Language Auto-Translated Chat (Bhashini AI)',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: UptimeTheme.gray100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Owner (Kannada → Hindi/English):',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                      ),
                      SizedBox(height: 4),
                      Text(
                        '"ಮೇನ್ ಗೇಟ್ ನಂಬರ್ 2 ರಲ್ಲಿ ಸೆಕ್ಯುರಿಟಿ ಪಾಸ್ ಸಿದ್ಧವಾಗಿದೆ." →\n"Security gate pass is ready at Main Gate #2. Machine is already isolated."',
                        style: TextStyle(fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: UptimeTheme.blue50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'You: "Reaching Gate #2 in 3 minutes with SKF bearing kit and multimeter."',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
        );

      case 'T15':
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Text(
                  'Enter Customer 6-Digit Arrival OTP',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 6),
                const Text(
                  'PostGIS Distance: 85m (<= 500m Geofence Verified ✓)',
                  style: TextStyle(
                    fontSize: 12.5,
                    color: UptimeTheme.success,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
                  decoration: BoxDecoration(
                    color: UptimeTheme.gray100,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    _keypadOtp.padRight(6, '•'),
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 10,
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  alignment: WrapAlignment.center,
                  children: [
                    for (final d in ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'])
                      SizedBox(
                        width: 82,
                        height: 48,
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() {
                              if (d == 'C') {
                                _keypadOtp = '';
                              } else if (d == '✓') {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Arrival OTP Verified! Escrow Timer Started.'),
                                  ),
                                );
                              } else if (_keypadOtp.length < 6) {
                                _keypadOtp += d;
                              }
                            });
                          },
                          child: Text(
                            d,
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );

      case 'T35':
        // Audited Screen T35: 3D Face Liveness & Biometric Anti-Spoof Verification
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Container(
                  width: 170,
                  height: 210,
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(100),
                    border: Border.all(color: UptimeTheme.teal500, width: 4),
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.face_retouching_natural_rounded,
                        color: UptimeTheme.teal500,
                        size: 64,
                      ),
                      SizedBox(height: 10),
                      Text(
                        '3D DEPTH MESH\n98.4% MATCH',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'KYC Level 1 — 3D Face Liveness & Anti-Spoof Check',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Matches live selfie against UIDAI DigiLocker Masked Aadhaar (XXXX-XXXX-4829) to prevent account sharing.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                ),
                const SizedBox(height: 14),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    ChoiceChip(
                      label: const Text('1. Look Straight ✓'),
                      selected: _livenessStep >= 0,
                      onSelected: (_) => setState(() => _livenessStep = 0),
                    ),
                    ChoiceChip(
                      label: const Text('2. Blink Slowly ✓'),
                      selected: _livenessStep >= 1,
                      onSelected: (_) => setState(() => _livenessStep = 1),
                    ),
                    ChoiceChip(
                      label: const Text('3. Turn Slightly Right ✓'),
                      selected: _livenessStep >= 2,
                      onSelected: (_) => setState(() => _livenessStep = 2),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );

      case 'T36':
        // Audited Screen T36: Trade Skill MCQ & Mandatory Safety Assessment
        final passed = KycAndFatigueValidators.evaluateSkillTest(
          totalScorePercent: 87,
          safetyQuestionsCorrect: _mcqSelectedSafetyAnswer == 0 ? 2 : 1,
        );
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: UptimeTheme.danger.withValues(alpha: 0.14),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: const Text(
                        'MANDATORY SAFETY QUESTION 2 OF 2',
                        style: TextStyle(
                          color: UptimeTheme.danger,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const Spacer(),
                    const Text(
                      '⏱ 14:22 left',
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Q14 (415V LOTO Safety): Before replacing a 3-phase spindle contactor coil, what is the mandatory first step?',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 10),
                RadioListTile<int>(
                  value: 0,
                  groupValue: _mcqSelectedSafetyAnswer,
                  onChanged: (v) => setState(() => _mcqSelectedSafetyAnswer = v ?? 0),
                  title: const Text(
                    'Apply personal LOTO padlock on main 415V isolator & verify 0V across L1-L2-L3 with True-RMS multimeter',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                  ),
                ),
                RadioListTile<int>(
                  value: 1,
                  groupValue: _mcqSelectedSafetyAnswer,
                  onChanged: (v) => setState(() => _mcqSelectedSafetyAnswer = v ?? 1),
                  title: const Text(
                    'Press emergency stop button only without locking main breaker',
                    style: TextStyle(fontSize: 13),
                  ),
                ),
                const Divider(height: 20),
                Text(
                  passed
                      ? '✅ Statutory Pass Rule Met: Score 87% (>= 70%) AND 2/2 Safety Questions Correct!'
                      : '❌ Statutory Rule Failed: Must answer 2/2 mandatory safety questions correctly.',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    color: passed ? UptimeTheme.success : UptimeTheme.danger,
                  ),
                ),
              ],
            ),
          ),
        );

      case 'T37':
        // Audited Screen T37: Bank Account Setup & ₹1 Penny-Drop Verification
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'NPCI Automated ₹1 Penny-Drop & Section 194C TDS Setup (FIN-02)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 12),
                const ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: UptimeTheme.teal50,
                    child: Icon(Icons.account_balance_rounded, color: UptimeTheme.teal600),
                  ),
                  title: Text(
                    'Axis Bank • A/C XXXX-XXXX-9182 (IFSC: UTIB0000142)',
                    style: TextStyle(fontWeight: FontWeight.w800),
                  ),
                  subtitle: Text(
                    'UPI VPA: raju.tech@okaxis • PAN Linked: ABCPS4829K (1% TDS u/s 194C)',
                  ),
                ),
                const SizedBox(height: 8),
                InkWell(
                  onTap: () => setState(() => _pennyDropDone = !_pennyDropDone),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: UptimeTheme.success.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: UptimeTheme.success),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.verified_rounded, color: UptimeTheme.success),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _pennyDropDone
                                ? '₹1.00 Credited (UTR: 631490812441) • Beneficiary Name "RAJU SHARMA" matches Aadhaar KYC 100%.'
                                : 'Verifying beneficiary bank account via NPCI IMPS...',
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w800,
                              color: UptimeTheme.success,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );

      case 'T38':
        // Audited Screen T38: Blind Customer Rating & Site Safety Review
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Confidential Blind Customer & Site Safety Review (CORE-07)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Your rating is sealed until the customer also submits their review — preventing retaliation.',
                  style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
                ),
                const SizedBox(height: 14),
                Row(
                  children: List.generate(5, (idx) {
                    final star = idx + 1;
                    return IconButton(
                      onPressed: () => setState(() => _blindRatingStars = star),
                      icon: Icon(
                        star <= _blindRatingStars
                            ? Icons.star_rounded
                            : Icons.star_border_rounded,
                        color: Colors.amber.shade700,
                        size: 32,
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    'Clean work area',
                    'Proper 415V LOTO switch',
                    'Fast gate pass',
                    'Skilled machine operator',
                    'Prompt OTP sign-off',
                  ].map((tag) {
                    final selected = _blindSafetyTags.contains(tag);
                    return FilterChip(
                      label: Text(tag),
                      selected: selected,
                      onSelected: (v) {
                        setState(() {
                          if (v) {
                            _blindSafetyTags.add(tag);
                          } else {
                            _blindSafetyTags.remove(tag);
                          }
                        });
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        );

      case 'T39':
        // Audited Screen T39: Fatigue Monitor, Shift Rest Gauge & Statutory Safety Lock
        final isRestricted = tech?.isFatigueRestricted ?? false;
        final score = tech?.fatigueScore ?? 30;
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: (isRestricted ? UptimeTheme.danger : UptimeTheme.success)
                          .withValues(alpha: 0.15),
                      child: Text(
                        '$score',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: isRestricted ? UptimeTheme.danger : UptimeTheme.success,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isRestricted
                                ? 'MANDATORY 8-HOUR REST LOCK ACTIVE (SB-00)'
                                : 'Fatigue Index: $score/100 — Healthy & Dispatch Eligible',
                            style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Continuous Shift: 4.5h / 10.0h Max • Consecutive Jobs: 3 / 5 Max\n'
                            'Ambient Plant Temp: 31°C • Hydration Reminder: Drink 250ml water',
                            style: TextStyle(fontSize: 12.5, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          ref
                              .read(technicianStateProvider.notifier)
                              .simulateFatigueLockout(restricted: !isRestricted);
                        },
                        icon: const Icon(Icons.bedtime_outlined),
                        label: Text(
                          isRestricted
                              ? 'Reset Fatigue Simulation'
                              : 'Take 45-Min Rest Break / Simulate Lock',
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );

      case 'T40':
        // Audited Screen T40: Warranty Revisit & Dispute Evidence Resolution Desk
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '30-Day Workmanship Warranty & FFT Dispute Desk (WARRANTY-01)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Claim #WR-2026-019 • Job UPT-2026-00842 (Mazak VMC Spindle Bearing)\n'
                  'Side-by-Side Acoustic FFT Telemetry Comparison:',
                  style: TextStyle(fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: UptimeTheme.success.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'HANDOVER PROOF',
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w900,
                                color: UptimeTheme.success,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              '62 dB @ 4,000 RPM\nSHA-256 Verified ✓',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: UptimeTheme.warning.withValues(alpha: 0.14),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'DAY 11 CALLBACK CLAIM',
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w900,
                                color: UptimeTheme.warning,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              '78 dB @ 4,000 RPM\nCoolant Line Looseness',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: () => setState(() => _warrantyRevisitScheduled = true),
                  icon: const Icon(Icons.event_available_rounded),
                  label: Text(
                    _warrantyRevisitScheduled
                        ? 'Priority Warranty Revisit Confirmed (Today 16:30 IST) ✓'
                        : 'Schedule Priority Warranty Revisit (Zero Penalty)',
                  ),
                ),
              ],
            ),
          ),
        );

      default:
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${spec.code} — ${spec.title}',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 8),
                Text(
                  spec.subtitle,
                  style: const TextStyle(fontSize: 13.5, height: 1.45),
                ),
                const SizedBox(height: 14),
                const Text(
                  '• Clean White Urban Company / Zomato Partner default surface with optional High-Contrast Industrial Field Dark Mode.\n'
                  '• Large 48dp+ glove-friendly touch targets for industrial & roadside environments.\n'
                  '• Connected to live Riverpod state (technicianStateProvider, fieldJobProvider, techBaseZoneProvider).',
                  style: TextStyle(fontSize: 12.5, color: UptimeTheme.gray500, height: 1.5),
                ),
              ],
            ),
          ),
        );
    }
  }
}
