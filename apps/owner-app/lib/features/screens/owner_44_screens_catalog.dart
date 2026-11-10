import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/config/theme.dart';
import '../../core/utils/format_utils.dart';
import '../../shared/widgets/common_widgets.dart';
import '../models/owner_models.dart';
import '../providers/owner_providers.dart';

class OwnerScreenSpec {
  final int id;
  final String code;
  final String module;
  final String title;
  final String subtitle;
  final IconData icon;
  final Color accent;

  const OwnerScreenSpec({
    required this.id,
    required this.code,
    required this.module,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.accent,
  });
}

const List<OwnerScreenSpec> kOwner44Screens = [
  // 1. Entry & Location (S01 - S02)
  OwnerScreenSpec(
    id: 1,
    code: 'S01',
    module: 'Entry & Discovery',
    title: 'Splash Screen — "DOWNTIME ENDS HERE."',
    subtitle: 'Pitch-black lockup with white rounded UPTIME gear/wrench emblem & instant guest entry.',
    icon: Icons.flash_on_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 2,
    code: 'S02',
    module: 'Entry & Discovery',
    title: 'Zomato / BigBasket Location & Cluster Picker',
    subtitle: 'Switch between Peenya Factory, Electronic City, Whitefield or GPS auto-detect.',
    icon: Icons.location_on_rounded,
    accent: Color(0xFFE11D48),
  ),

  // 2. Home & Guest Exploration (S03 - S06)
  OwnerScreenSpec(
    id: 3,
    code: 'S03',
    module: 'Home & Exploration',
    title: 'Urban Company Style Clean White Home Hub',
    subtitle: 'Top location bar, universal search, 3 industry verticals, & live active dispatch banner.',
    icon: Icons.home_rounded,
    accent: UptimeTheme.blue700,
  ),
  OwnerScreenSpec(
    id: 4,
    code: 'S04',
    module: 'Home & Exploration',
    title: 'Universal Search & Fault Autocomplete',
    subtitle: 'Search CNC alarms, EV battery codes, inverter PCB faults, or OEM spare parts.',
    icon: Icons.search_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 5,
    code: 'S05',
    module: 'Home & Exploration',
    title: 'Industrial / Auto / Electronics Category Catalog',
    subtitle: 'Transparent upfront pricing cards, SLA arrival times, and verified specialist counts.',
    icon: Icons.grid_view_rounded,
    accent: UptimeTheme.industrial,
  ),
  OwnerScreenSpec(
    id: 6,
    code: 'S06',
    module: 'Home & Exploration',
    title: '9-Language Regional Switcher (PLT-07)',
    subtitle: 'Instant UI & voice switching across English, Hindi, Kannada, Tamil, Telugu & 4 more.',
    icon: Icons.translate_rounded,
    accent: UptimeTheme.electronics,
  ),

  // 3. Multimodal AI Fault Reporting (S07 - S10)
  OwnerScreenSpec(
    id: 7,
    code: 'S07',
    module: 'AI Fault Triage',
    title: 'Multimodal Fault Report Studio (CORE-01)',
    subtitle: 'Text description, regional voice note, equipment photo upload, and urgency selector.',
    icon: Icons.report_problem_rounded,
    accent: UptimeTheme.warning,
  ),
  OwnerScreenSpec(
    id: 8,
    code: 'S08',
    module: 'AI Fault Triage',
    title: '10-Second Acoustic Sound Fingerprinting (IND-U02)',
    subtitle: '48 kHz FFT spectrogram analyzer detecting spindle bearing & motor harmonics.',
    icon: Icons.graphic_eq_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 9,
    code: 'S09',
    module: 'AI Fault Triage',
    title: 'Gemini 1.5 Flash 30-Second Diagnosis Report',
    subtitle: '92% confidence root-cause breakdown, itemized cost range, and safety warnings.',
    icon: Icons.auto_awesome_rounded,
    accent: UptimeTheme.industrial,
  ),
  OwnerScreenSpec(
    id: 10,
    code: 'S10',
    module: 'AI Fault Triage',
    title: 'Owner-Controlled 3-Path Resolution Selector',
    subtitle: 'Choose Path A (Free AI Copilot), Path B (₹149 Video Consult), or Path C (Direct Tech).',
    icon: Icons.alt_route_rounded,
    accent: UptimeTheme.blue500,
  ),

  // 4. Path A & Path B Resolution (S11 - S13)
  OwnerScreenSpec(
    id: 11,
    code: 'S11',
    module: '3-Path Resolution',
    title: 'Path A — Interactive DIY AI Copilot Stepper',
    subtitle: 'Step-by-step LOTO safety & multimeter probes with Step-3 auto-escalation guard.',
    icon: Icons.smart_toy_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 12,
    code: 'S12',
    module: '3-Path Resolution',
    title: 'Path B — Live Agora Video Consult Room (VIRT-01)',
    subtitle: 'HD video call with L3 Master Specialist + Gemini thermal/AR camera overlay.',
    icon: Icons.videocam_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 13,
    code: 'S13',
    module: '3-Path Resolution',
    title: 'Video-to-Physical Visit ₹149 Fee Credit',
    subtitle: '100% of video consult fee credited automatically when escalating to on-site repair.',
    icon: Icons.savings_rounded,
    accent: UptimeTheme.success,
  ),

  // 5. Smart Matching, Negotiation & SOS (S14 - S18)
  OwnerScreenSpec(
    id: 14,
    code: 'S14',
    module: 'Matching & Dispatch',
    title: 'Ranked Specialist List (40% Distance + 60% Skill)',
    subtitle: 'Fatigue-restricted technicians strictly excluded; shows L2/L3 & Polygon NFT badges.',
    icon: Icons.engineering_rounded,
    accent: UptimeTheme.industrial,
  ),
  OwnerScreenSpec(
    id: 15,
    code: 'S15',
    module: 'Matching & Dispatch',
    title: 'Specialist Full Profile, NCVT Certs & Trust Score',
    subtitle: 'Inspect verified licences, past machine repairs, and Polygon blockchain credentials.',
    icon: Icons.badge_rounded,
    accent: UptimeTheme.blue700,
  ),
  OwnerScreenSpec(
    id: 16,
    code: 'S16',
    module: 'Matching & Dispatch',
    title: 'Real-Time In-App Chat & 9-Language Translation',
    subtitle: 'Bi-directional chat with en-route specialist with Kannada/Hindi/English translation.',
    icon: Icons.chat_bubble_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 17,
    code: 'S17',
    module: 'Matching & Dispatch',
    title: 'IND-U04 Counter-Offer Price Negotiation Slider',
    subtitle: 'Propose fair labor counter-offer before locking Razorpay escrow.',
    icon: Icons.handshake_rounded,
    accent: UptimeTheme.warning,
  ),
  OwnerScreenSpec(
    id: 18,
    code: 'S18',
    module: 'Matching & Dispatch',
    title: '60-Second Emergency SOS Live Auction (CORE-12)',
    subtitle: 'Broadcast critical line stoppage or highway breakdown to all L2/L3 techs within 10 km.',
    icon: Icons.sos_rounded,
    accent: UptimeTheme.danger,
  ),

  // 6. Contextual Auth & Escrow Booking (S19 - S21)
  OwnerScreenSpec(
    id: 19,
    code: 'S19',
    module: 'Contextual Login & Escrow',
    title: 'Contextual Mobile OTP Sign-In Sheet',
    subtitle: 'Triggered only when booking a service — preserves full guest browsing freedom.',
    icon: Icons.lock_open_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 20,
    code: 'S20',
    module: 'Contextual Login & Escrow',
    title: '6-Digit SMS OTP Verification & Session Lock',
    subtitle: 'Instant verification (123456 in dev/demo) with JWT token persistence.',
    icon: Icons.pin_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 21,
    code: 'S21',
    module: 'Contextual Login & Escrow',
    title: 'Booking Confirmation & Razorpay Escrow Hold',
    subtitle: 'Funds held safely in escrow; released only after arrival OTP & running proof.',
    icon: Icons.account_balance_wallet_rounded,
    accent: UptimeTheme.success,
  ),

  // 7. Live GPS Tracking, Arrival OTP & Completion (S22 - S24)
  OwnerScreenSpec(
    id: 22,
    code: 'S22',
    module: 'Live Track & Handover',
    title: 'Uber-Style Live GPS Map & Telemetry HUD',
    subtitle: 'Real-time WebSocket location, speed, battery level, and minute-by-minute ETA.',
    icon: Icons.map_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 23,
    code: 'S23',
    module: 'Live Track & Handover',
    title: '500m PostGIS Geofence + 6-Digit Arrival OTP',
    subtitle: 'Dual-layer anti-fraud verification confirming technician is physically on-site.',
    icon: Icons.verified_user_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 24,
    code: 'S24',
    module: 'Live Track & Handover',
    title: '18% GST Invoice, SHA-256 Certificate & Blind Rating',
    subtitle: 'CGST 9% + SGST 9% invoice, tamper-proof repair hash, and CORE-07 5-star review.',
    icon: Icons.receipt_long_rounded,
    accent: UptimeTheme.success,
  ),

  // 8. Digital Twin & Predictive Health (S25 - S29)
  OwnerScreenSpec(
    id: 25,
    code: 'S25',
    module: 'IoT Digital Twin',
    title: 'Asset Digital Twin & Circular Health Gauge',
    subtitle: 'Live health score (0-100%), Mood Score ⭐, and Silent Killer energy waste alerts.',
    icon: Icons.donut_large_rounded,
    accent: UptimeTheme.industrial,
  ),
  OwnerScreenSpec(
    id: 26,
    code: 'S26',
    module: 'IoT Digital Twin',
    title: 'Deep Component Health & Vibration FFT Spectrogram',
    subtitle: '4,210 Hz peak harmonic analysis, Remaining Useful Life (RUL), and lubrication gauge.',
    icon: Icons.analytics_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 27,
    code: 'S27',
    module: 'IoT Digital Twin',
    title: 'Register New Machine / Vehicle / Appliance Twin',
    subtitle: 'Onboard CNC machines, commercial EVs, or HVAC chillers via QR or serial plate.',
    icon: Icons.add_box_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 28,
    code: 'S28',
    module: 'IoT Digital Twin',
    title: 'AUTO-U02 Vehicle Mood Score & OBD-II Telemetry',
    subtitle: 'HV traction pack SOH, 12V parasitic draw alert, and regenerative braking health.',
    icon: Icons.directions_car_rounded,
    accent: UptimeTheme.automobile,
  ),
  OwnerScreenSpec(
    id: 29,
    code: 'S29',
    module: 'IoT Digital Twin',
    title: 'ELEC-U02 Silent Killer Power Consumption Audit',
    subtitle: 'Detects dirty condenser coils or failing capacitors adding excess monthly electricity cost.',
    icon: Icons.bolt_rounded,
    accent: UptimeTheme.warning,
  ),

  // 9. Micro-Insurance, Claims & Warranty (S30 - S33)
  OwnerScreenSpec(
    id: 30,
    code: 'S30',
    module: 'Uptime Shield & Claims',
    title: 'Per-Job Micro-Insurance Shield Hub (IND-U08)',
    subtitle: 'Active ₹50,000 repair protection and 30-day workmanship guarantee.',
    icon: Icons.shield_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 31,
    code: 'S31',
    module: 'Uptime Shield & Claims',
    title: 'OCR Warranty & GST Invoice Vault Scanner',
    subtitle: 'Auto-extract serial numbers and warranty expiry dates from paper invoices.',
    icon: Icons.document_scanner_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 32,
    code: 'S32',
    module: 'Uptime Shield & Claims',
    title: 'File Insurance Incident Claim Form',
    subtitle: 'Submit breakdown category, damage photos, GST invoice, and loss estimate.',
    icon: Icons.assignment_late_rounded,
    accent: UptimeTheme.danger,
  ),
  OwnerScreenSpec(
    id: 33,
    code: 'S33',
    module: 'Uptime Shield & Claims',
    title: 'Automated AI Claim Assessment & Payout Tracker',
    subtitle: 'Cross-verifies SHA-256 repair history for instant claim approval.',
    icon: Icons.fact_check_rounded,
    accent: UptimeTheme.success,
  ),

  // 10. OEM Marketplace & Refurbished Store (S34 - S37)
  OwnerScreenSpec(
    id: 34,
    code: 'S34',
    module: 'OEM Marketplace',
    title: 'OEM Spare Parts, Pro Tools & Refurbished Store',
    subtitle: 'QR-verified SKF bearings, Schneider contactors, Exide batteries & Grade A+ laptops.',
    icon: Icons.storefront_rounded,
    accent: UptimeTheme.blue700,
  ),
  OwnerScreenSpec(
    id: 35,
    code: 'S35',
    module: 'OEM Marketplace',
    title: 'Spare Part Specification & Machine Fit Verification',
    subtitle: 'Guaranteed compatibility check for Mazak/Haas/Nexon EV + GST input tax credit.',
    icon: Icons.verified_rounded,
    accent: UptimeTheme.teal600,
  ),
  OwnerScreenSpec(
    id: 36,
    code: 'S36',
    module: 'OEM Marketplace',
    title: 'ELEC-C02 Interactive Repair vs Replace AI Advisor',
    subtitle: 'Compare repair cost ratio against Grade A+ upgrade with ₹2,400 salvage credit.',
    icon: Icons.calculate_rounded,
    accent: UptimeTheme.industrial,
  ),
  OwnerScreenSpec(
    id: 37,
    code: 'S37',
    module: 'OEM Marketplace',
    title: 'Spare Parts Cart & Direct-to-Technician Delivery',
    subtitle: 'Sync spare part delivery directly with your arriving specialist.',
    icon: Icons.shopping_cart_checkout_rounded,
    accent: UptimeTheme.success,
  ),

  // 11. Enterprise Fleet, Subscriptions & Green Credits (S38 - S40)
  OwnerScreenSpec(
    id: 38,
    code: 'S38',
    module: 'Enterprise & Pro Pass',
    title: 'Multi-Factory & Commercial Fleet Console (PLT-05)',
    subtitle: 'Manage 24 CNC machines & 12 EV vans under a single GSTIN dashboard.',
    icon: Icons.domain_rounded,
    accent: UptimeTheme.blue700,
  ),
  OwnerScreenSpec(
    id: 39,
    code: 'S39',
    module: 'Enterprise & Pro Pass',
    title: 'PLT-06 Green Repair Carbon Credit Ledger',
    subtitle: 'Track kg of CO₂ saved by repairing equipment instead of scrapping.',
    icon: Icons.eco_rounded,
    accent: UptimeTheme.success,
  ),
  OwnerScreenSpec(
    id: 40,
    code: 'S40',
    module: 'Enterprise & Pro Pass',
    title: 'Uptime Pro Pass & MSME Subscription Plans (PLT-02)',
    subtitle: '₹999/mo plan: Zero platform fee, 15-min SLA guarantee, and 4 free video consults.',
    icon: Icons.workspace_premium_rounded,
    accent: Color(0xFFD97706),
  ),

  // 12. Repair Wiki, Notifications & Owner Profile (S41 - S44)
  OwnerScreenSpec(
    id: 41,
    code: 'S41',
    module: 'Wiki, Alerts & Profile',
    title: 'Crowdsourced Master Technician Repair Wiki',
    subtitle: 'Searchable fault library for Fanuc, Siemens, Tata EV, and Daikin error codes.',
    icon: Icons.menu_book_rounded,
    accent: UptimeTheme.industrial,
  ),
  OwnerScreenSpec(
    id: 42,
    code: 'S42',
    module: 'Wiki, Alerts & Profile',
    title: 'Wiki Fault Article & Step-by-Step Schematic Guide',
    subtitle: 'Pinout test voltages, required PPE, community upvotes, and 1-tap specialist booking.',
    icon: Icons.schema_rounded,
    accent: UptimeTheme.blue500,
  ),
  OwnerScreenSpec(
    id: 43,
    code: 'S43',
    module: 'Wiki, Alerts & Profile',
    title: 'Dedicated Notifications & IoT Alerts Center',
    subtitle: 'Filter All | Jobs | IoT Alerts — live arrival countdowns and harmonic warnings.',
    icon: Icons.notifications_active_rounded,
    accent: Color(0xFFE11D48),
  ),
  OwnerScreenSpec(
    id: 44,
    code: 'S44',
    module: 'Wiki, Alerts & Profile',
    title: 'Owner Profile, Saved Addresses & GST Settings',
    subtitle: 'Manage factory locations, GSTIN invoicing details, and Clean White / Dark theme.',
    icon: Icons.manage_accounts_rounded,
    accent: UptimeTheme.blue700,
  ),
];

// ═══════════════════════════════════════════════════════════════════════════
// S01: EXACT UPLOADED PITCH-BLACK SPLASH LOCKUP WIDGET
// ═══════════════════════════════════════════════════════════════════════════
class UptimeExactSplashLockup extends StatelessWidget {
  final VoidCallback onExploreApp;
  const UptimeExactSplashLockup({super.key, required this.onExploreApp});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 22),
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              // White Rounded Square Icon with Blue U, Gear & Wrench
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const Icon(
                      Icons.settings_rounded,
                      color: Color(0xFF0284C7),
                      size: 46,
                    ),
                    Container(
                      padding: const EdgeInsets.all(6),
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
              const SizedBox(width: 16),
              Container(
                width: 2,
                height: 48,
                color: Colors.white54,
              ),
              const SizedBox(width: 16),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'UPTIME',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 3.5,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'DOWNTIME ENDS HERE.',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2.2,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// S02: ZOMATO / BIGBASKET STYLE LOCATION SELECTOR BOTTOM SHEET
// ═══════════════════════════════════════════════════════════════════════════
void showZomatoLocationPickerSheet(BuildContext context, WidgetRef ref) {
  const locations = [
    SelectedLocation(
      label: 'Peenya Factory Unit #4',
      addressLine: 'Plot 42-B, Peenya Industrial Area Stage IV, Bengaluru 560058',
      areaCluster: 'Peenya Industrial Cluster',
      etaBadge: '12 mins SLA',
    ),
    SelectedLocation(
      label: 'Electronic City Assembly Plant',
      addressLine: 'Phase 1, Hosur Road, Electronic City, Bengaluru 560100',
      areaCluster: 'Electronic City Cluster',
      etaBadge: '14 mins SLA',
    ),
    SelectedLocation(
      label: 'Whitefield EV Fleet Depot',
      addressLine: 'ITPL Main Road, Mahadevapura, Whitefield, Bengaluru 560048',
      areaCluster: 'Whitefield Tech Corridor',
      etaBadge: '16 mins SLA',
    ),
    SelectedLocation(
      label: 'Home Residence — Jayanagar',
      addressLine: '4th Block, 11th Main Road, Jayanagar, Bengaluru 560011',
      areaCluster: 'South Bengaluru Residential',
      etaBadge: '15 mins SLA',
    ),
  ];

  final current = ref.read(selectedLocationProvider);

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (ctx) => Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.location_on_rounded, color: Color(0xFFE11D48), size: 26),
              const SizedBox(width: 10),
              const Expanded(
                child: Text(
                  'Select Service Location (S02)',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: UptimeTheme.dark,
                  ),
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(ctx),
                icon: const Icon(Icons.close_rounded),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1F2),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFFECDD3)),
            ),
            child: const Row(
              children: [
                Icon(Icons.my_location_rounded, color: Color(0xFFE11D48), size: 20),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Use Current GPS Location • PostGIS 500m High-Accuracy Pin',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFBE123C),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'SAVED FACTORY, FLEET & HOME ADDRESSES',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: UptimeTheme.gray500,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 10),
          ...locations.map((loc) {
            final isSelected = loc.label == current.label;
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              color: isSelected ? UptimeTheme.blue50 : Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
                side: BorderSide(
                  color: isSelected ? UptimeTheme.blue500 : const Color(0xFFE2E8F0),
                  width: isSelected ? 1.5 : 1,
                ),
              ),
              child: ListTile(
                onTap: () {
                  ref.read(selectedLocationProvider.notifier).selectLocation(loc);
                  Navigator.pop(ctx);
                },
                leading: CircleAvatar(
                  backgroundColor: isSelected
                      ? UptimeTheme.blue500
                      : const Color(0xFFF1F5F9),
                  child: Icon(
                    loc.label.contains('Home')
                        ? Icons.home_rounded
                        : Icons.factory_rounded,
                    color: isSelected ? Colors.white : UptimeTheme.dark,
                    size: 20,
                  ),
                ),
                title: Row(
                  children: [
                    Expanded(
                      child: Text(
                        loc.label,
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                          color: UptimeTheme.dark,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: UptimeTheme.success.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        loc.etaBadge,
                        style: const TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w800,
                          color: UptimeTheme.success,
                        ),
                      ),
                    ),
                  ],
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    loc.addressLine,
                    style: const TextStyle(fontSize: 12, color: UptimeTheme.gray500),
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    ),
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ALL 44 SCREENS INTERACTIVE DIRECTORY & ARTBOARD LAUNCHER
// ═══════════════════════════════════════════════════════════════════════════
class OwnerAll44ScreensBrowser extends ConsumerStatefulWidget {
  final ValueChanged<int>? onSelectMainTab;
  final VoidCallback? onOpenFaultStudio;

  const OwnerAll44ScreensBrowser({
    super.key,
    this.onSelectMainTab,
    this.onOpenFaultStudio,
  });

  @override
  ConsumerState<OwnerAll44ScreensBrowser> createState() =>
      _OwnerAll44ScreensBrowserState();
}

class _OwnerAll44ScreensBrowserState
    extends ConsumerState<OwnerAll44ScreensBrowser> {
  String _selectedModule = 'ALL';

  @override
  Widget build(BuildContext context) {
    final modules = [
      'ALL',
      ...{for (final s in kOwner44Screens) s.module},
    ];
    final filtered = _selectedModule == 'ALL'
        ? kOwner44Screens
        : kOwner44Screens.where((s) => s.module == _selectedModule).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: UptimeTheme.dark,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Owner App — All 44 Screens Directory',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
            ),
            Text(
              '12 Modules • Urban Company / Zomato Clean White Design System',
              style: TextStyle(fontSize: 11.5, color: UptimeTheme.gray500),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: modules.map((m) {
                final selected = _selectedModule == m;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(m),
                    selected: selected,
                    onSelected: (_) => setState(() => _selectedModule = m),
                  ),
                );
              }).toList(),
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              itemBuilder: (ctx, i) {
                final spec = filtered[i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  color: Colors.white,
                  child: ListTile(
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    leading: Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: spec.accent.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: Text(
                          spec.code,
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 13,
                            color: spec.accent,
                          ),
                        ),
                      ),
                    ),
                    title: Text(
                      spec.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 14.5,
                        color: UptimeTheme.dark,
                      ),
                    ),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        '${spec.module} • ${spec.subtitle}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: UptimeTheme.gray500,
                        ),
                      ),
                    ),
                    trailing: const Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 15,
                      color: UptimeTheme.gray500,
                    ),
                    onTap: () => openOwnerDedicatedScreen(context, ref, spec),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

void openOwnerDedicatedScreen(
  BuildContext context,
  WidgetRef ref,
  OwnerScreenSpec spec,
) {
  Navigator.of(context).push(
    MaterialPageRoute(
      builder: (_) => OwnerDedicatedScreenViewer(spec: spec),
    ),
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDICATED HIGH-FIDELITY VIEWER FOR S01..S44 SCREENS
// ═══════════════════════════════════════════════════════════════════════════
class OwnerDedicatedScreenViewer extends ConsumerStatefulWidget {
  final OwnerScreenSpec spec;
  const OwnerDedicatedScreenViewer({super.key, required this.spec});

  @override
  ConsumerState<OwnerDedicatedScreenViewer> createState() =>
      _OwnerDedicatedScreenViewerState();
}

class _OwnerDedicatedScreenViewerState
    extends ConsumerState<OwnerDedicatedScreenViewer> {
  final _chatCtrl = TextEditingController();
  final List<(String, String, String)> _chatMessages = [
    (
      'TECH',
      'Raju Sharma (L3 Master)',
      'Namaste sir! I have crossed Jalahalli Cross. Carrying SKF 7014 bearing puller and CAT-IV multimeter. Reaching Gate #2 in 6 mins.',
    ),
    (
      'TRANSLATED',
      'Auto-Translated from Kannada (KN → EN)',
      '"ನಮಸ್ಕಾರ ಸರ್! ನಾನು ಜಾಲಹಳ್ಳಿ ಕ್ರಾಸ್ ದಾಟಿದ್ದೇನೆ. 6 ನಿಮಿಷಗಳಲ್ಲಿ ತಲುಪುತ್ತೇನೆ."',
    ),
    (
      'OWNER',
      'You (Plant Owner)',
      'Gate pass approved at Security Desk. Machine 415V isolator is already turned off for LOTO.',
    ),
  ];

  @override
  void dispose() {
    _chatCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final spec = widget.spec;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: UptimeTheme.dark,
        title: Text(
          '${spec.code} • ${spec.title}',
          style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w900),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Header Badge Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: spec.accent.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: spec.accent.withValues(alpha: 0.3)),
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
                          letterSpacing: 0.6,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        spec.title,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: UptimeTheme.dark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        spec.subtitle,
                        style: const TextStyle(
                          fontSize: 12.5,
                          color: UptimeTheme.gray700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Specialized Content per Screen ID
          if (spec.id == 1)
            UptimeExactSplashLockup(
              onExploreApp: () => Navigator.pop(context),
            )
          else if (spec.id == 16)
            _buildS16ChatAndTranslationScreen()
          else if (spec.id == 26)
            _buildS26ComponentFftScreen()
          else if (spec.id == 32)
            _buildS32FileInsuranceClaimScreen(context)
          else if (spec.id == 35)
            _buildS35ProductFitmentScreen(context)
          else if (spec.id == 40)
            _buildS40UptimeProPassScreen(context)
          else if (spec.id == 42)
            _buildS42WikiSchematicArticleScreen(context)
          else if (spec.id == 43)
            _buildS43NotificationsCenterScreen()
          else
            _buildInteractiveScreenPreviewCard(context, spec),
        ],
      ),
    );
  }

  // S16: Real-Time In-App Chat & 9-Language Translation
  Widget _buildS16ChatAndTranslationScreen() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: UptimeTheme.teal50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: UptimeTheme.teal500),
          ),
          child: const Row(
            children: [
              Icon(Icons.translate_rounded, color: UptimeTheme.teal600, size: 20),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Live 9-Language Neural Translation Active: Kannada (KN) ↔ Hindi (HI) ↔ English (EN)',
                  style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        ..._chatMessages.map((m) {
          final isOwner = m.$1 == 'OWNER';
          return Align(
            alignment: isOwner ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              constraints: const BoxConstraints(maxWidth: 420),
              decoration: BoxDecoration(
                color: isOwner ? UptimeTheme.blue700 : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    m.$2,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: isOwner ? Colors.white70 : UptimeTheme.blue700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    m.$3,
                    style: TextStyle(
                      fontSize: 13.5,
                      color: isOwner ? Colors.white : UptimeTheme.dark,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _chatCtrl,
                decoration: const InputDecoration(
                  hintText: 'Type message in English, Kannada or Hindi...',
                ),
              ),
            ),
            const SizedBox(width: 10),
            ElevatedButton.icon(
              onPressed: () {
                if (_chatCtrl.text.trim().isEmpty) return;
                setState(() {
                  _chatMessages.add(('OWNER', 'You (Plant Owner)', _chatCtrl.text.trim()));
                  _chatCtrl.clear();
                });
              },
              icon: const Icon(Icons.send_rounded, size: 18),
              label: const Text('Send'),
            ),
          ],
        ),
      ],
    );
  }

  // S26: Deep Component Health & Vibration FFT Spectrogram
  Widget _buildS26ComponentFftScreen() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const AcousticSpectrogramBar(active: true),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'SKF 7014 Angular Contact Spindle Bearing — Telemetry Deep Dive',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 10),
                const Text('• Peak Harmonic Frequency: 4,210 Hz (+4.2 dB above ISO 10816 baseline)'),
                const Text('• Remaining Useful Life (RUL): 142 Machine Operating Hours (~18 days)'),
                const Text('• Bearing Outer-Race Temperature: 68.4°C (Warning threshold: 75°C)'),
                const Text('• Lubrication Viscosity Index: 82% (ISO VG 68 synthetic spindle oil)'),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.build_circle_outlined),
                  label: const Text('Book Preventive Bearing Overhaul (Saves ₹14,200)'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // S32: File Insurance Incident Claim Form
  Widget _buildS32FileInsuranceClaimScreen(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Uptime Shield ₹50,000 Per-Job Protection Claim Form',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 12),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Covered Job Number',
                hintText: 'UPT-2026-04988',
              ),
            ),
            const SizedBox(height: 12),
            const TextField(
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Incident Description & Recurrence Symptoms',
                hintText: 'Describe voltage surge, part defect, or post-repair recurrence...',
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Claim #CLM-2026-812 submitted! AI SHA-256 audit initiated.'),
                  ),
                );
              },
              icon: const Icon(Icons.verified_user_rounded),
              label: const Text('Submit Instant AI Insurance Claim'),
            ),
          ],
        ),
      ),
    );
  }

  // S35: Spare Part Specification & Machine Fit Verification
  Widget _buildS35ProductFitmentScreen(BuildContext context) {
    final item = ref.read(marketplaceCatalogProvider).first;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: UptimeTheme.success.withValues(alpha: 0.14),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                '✓ GUARANTEED FIT FOR YOUR REGISTERED MAZAK QT-COMPACT-200MY',
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w900,
                  color: UptimeTheme.success,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              item.name,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 6),
            Text(
              'OEM Quality: ${item.qualityBadge} • Warranty: ${item.warrantyMonths} Months',
              style: const TextStyle(fontSize: 13, color: UptimeTheme.gray500),
            ),
            const SizedBox(height: 12),
            Text(
              'Price: ${FormatUtils.formatInr(item.priceInr)} (Includes 18% GST Input Tax Credit of ${FormatUtils.formatInr(item.priceInr * 0.18)})',
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                ref.read(cartProvider.notifier).addItem(item);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Added ${item.name} to Spare Parts Cart!')),
                );
              },
              icon: const Icon(Icons.add_shopping_cart_rounded),
              label: const Text('Add Verified OEM Part to Cart'),
            ),
          ],
        ),
      ),
    );
  }

  // S40: Uptime Pro Pass & MSME Subscription Plans
  Widget _buildS40UptimeProPassScreen(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'UPTIME PRO PASS — MSME & Fleet Membership (₹999 / month)',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 10),
            const Text('✓ ₹0 Platform Dispatch Fees on all emergency and scheduled jobs'),
            const Text('✓ Priority 15-Minute Specialist Arrival SLA'),
            const Text('✓ 4 Free Level-3 Master Video Consultations (Worth ₹596/mo)'),
            const Text('✓ Continuous Digital Twin IoT Telemetry & Consolidated GST Billing'),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('UPTIME GOLD AMC / Pro Pass is active on your account!')),
                );
              },
              icon: const Icon(Icons.workspace_premium_rounded),
              label: const Text('Active Plan: GOLD AMC (Manage Subscription)'),
            ),
          ],
        ),
      ),
    );
  }

  // S42: Wiki Fault Article & Step-by-Step Schematic Guide
  Widget _buildS42WikiSchematicArticleScreen(BuildContext context) {
    final article = ref.read(wikiArticlesProvider).first;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              article.title,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 6),
            Text(
              'Authored by ${article.authorTech} • ${article.helpfulCount} Verified Upvotes • ${article.readTime}',
              style: const TextStyle(fontSize: 12.5, color: UptimeTheme.gray500),
            ),
            const SizedBox(height: 12),
            Text(article.summary, style: const TextStyle(fontSize: 13.5, height: 1.45)),
            const SizedBox(height: 12),
            ...article.steps.map(
              (s) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.check_circle_outline, size: 18, color: UptimeTheme.teal600),
                    const SizedBox(width: 8),
                    Expanded(child: Text(s, style: const TextStyle(fontSize: 13))),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // S43: Dedicated Notifications & IoT Alerts Center
  Widget _buildS43NotificationsCenterScreen() {
    const alerts = [
      (
        'LIVE DISPATCH',
        'Raju Sharma (L3 Master) is 180m away (ETA 7 mins)',
        'Share Arrival OTP 123456 once specialist is at your machine.',
        UptimeTheme.teal600,
      ),
      (
        'IOT DIGITAL TWIN',
        'Mazak CNC #4 Spindle Bearing Harmonic +4.2 dB Alert',
        'Predicted failure window: 18 days. Book preventive overhaul to save ₹14,200.',
        UptimeTheme.warning,
      ),
      (
        'SHA-256 WARRANTY',
        'Tamper-Proof Certificate Locked for Job UPT-2026-04988',
        '30-day rework guarantee and GST tax invoice available in vault.',
        UptimeTheme.success,
      ),
    ];

    return Column(
      children: alerts
          .map(
            (a) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: a.$4.withValues(alpha: 0.14),
                  child: Icon(Icons.notifications_active_rounded, color: a.$4, size: 20),
                ),
                title: Text(
                  '${a.$1} • ${a.$2}',
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5),
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(a.$3, style: const TextStyle(fontSize: 12.5)),
                ),
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildInteractiveScreenPreviewCard(
      BuildContext context, OwnerScreenSpec spec) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Interactive Module Ready — ${spec.code}: ${spec.title}',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Text(
              spec.subtitle,
              style: const TextStyle(fontSize: 13.5, height: 1.45),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.check_circle_outline_rounded),
              label: const Text('Return to Active Workspace'),
            ),
          ],
        ),
      ),
    );
  }
}
