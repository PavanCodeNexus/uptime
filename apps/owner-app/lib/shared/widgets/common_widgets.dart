import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/config/theme.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final color = UptimeTheme.statusColor(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: 0.5)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            status.toUpperCase(),
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}

class IndustryChip extends StatelessWidget {
  final String industry;
  final bool selected;
  final VoidCallback onTap;

  const IndustryChip({
    super.key,
    required this.industry,
    required this.selected,
    required this.onTap,
  });

  IconData get _icon {
    switch (industry.toUpperCase()) {
      case 'INDUSTRIAL':
        return Icons.precision_manufacturing_outlined;
      case 'AUTOMOBILE':
        return Icons.directions_car_outlined;
      case 'ELECTRONICS':
        return Icons.memory_outlined;
      default:
        return Icons.category_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = UptimeTheme.industryColor(industry);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(999),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          gradient: selected
              ? LinearGradient(colors: [color, color.withValues(alpha: 0.8)])
              : null,
          color: selected ? null : color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: selected ? Colors.white30 : color.withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: selected
              ? [
                  BoxShadow(
                    color: color.withValues(alpha: 0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  )
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _icon,
              size: 16,
              color: selected ? Colors.white : color,
            ),
            const SizedBox(width: 7),
            Text(
              industry,
              style: TextStyle(
                color: selected ? Colors.white : color,
                fontSize: 12,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PathCard extends StatelessWidget {
  final String badgeText;
  final String title;
  final String subtitle;
  final String priceTag;
  final IconData icon;
  final Color accentColor;
  final bool isComingSoon;
  final VoidCallback onSelect;

  const PathCard({
    super.key,
    required this.badgeText,
    required this.title,
    required this.subtitle,
    required this.priceTag,
    required this.icon,
    required this.accentColor,
    this.isComingSoon = false,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onSelect,
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: accentColor.withValues(alpha: 0.45),
              width: 1.5,
            ),
            gradient: LinearGradient(
              colors: [
                accentColor.withValues(alpha: isDark ? 0.14 : 0.06),
                Colors.transparent,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: accentColor.withValues(alpha: 0.16),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: accentColor, size: 26),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: accentColor.withValues(alpha: 0.18),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            badgeText,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: accentColor,
                            ),
                          ),
                        ),
                        if (isComingSoon)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: UptimeTheme.warning.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'LIVE DEMO READY',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: UptimeTheme.warning,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark ? Colors.white70 : UptimeTheme.gray700,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    priceTag,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w900,
                      color: accentColor,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Icon(Icons.arrow_forward_rounded, size: 20, color: accentColor),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Custom Circular Health Gauge (Digital Twin) ───────────────────────────
class CircularHealthGauge extends StatelessWidget {
  final int score;
  final String label;
  final double size;

  const CircularHealthGauge({
    super.key,
    required this.score,
    required this.label,
    this.size = 130,
  });

  Color get _color {
    if (score >= 80) return UptimeTheme.teal500;
    if (score >= 55) return UptimeTheme.warning;
    return UptimeTheme.danger;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _GaugePainter(score: score, color: _color),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$score%',
                style: TextStyle(
                  fontSize: size * 0.24,
                  fontWeight: FontWeight.w900,
                  color: _color,
                ),
              ),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: UptimeTheme.gray500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GaugePainter extends CustomPainter {
  final int score;
  final Color color;
  _GaugePainter({required this.score, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - 10;

    final bgPaint = Paint()
      ..color = color.withValues(alpha: 0.15)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 11
      ..strokeCap = StrokeCap.round;

    final fgPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 11
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      math.pi * 0.75,
      math.pi * 1.5,
      false,
      bgPaint,
    );

    final sweep = (score.clamp(0, 100) / 100.0) * (math.pi * 1.5);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      math.pi * 0.75,
      sweep,
      false,
      fgPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _GaugePainter oldDelegate) =>
      oldDelegate.score != score || oldDelegate.color != color;
}

// ── Custom Simulated Uber-Style Live GPS Tracking Map ─────────────────────
class SimulatedLiveMapCard extends StatelessWidget {
  final String technicianName;
  final int etaMinutes;
  final double distanceMeters;
  final String destinationLabel;

  const SimulatedLiveMapCard({
    super.key,
    required this.technicianName,
    required this.etaMinutes,
    required this.distanceMeters,
    required this.destinationLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 230,
      decoration: BoxDecoration(
        color: const Color(0xFF0B1528),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: UptimeTheme.teal500.withValues(alpha: 0.4), width: 1.5),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _MapGridAndRoutePainter(),
            ),
          ),
          // Top Live Telemetry Overlay
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.72),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: UptimeTheme.teal500.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: UptimeTheme.teal500,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'LIVE GPS • $technicianName ($etaMinutes mins ETA)',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: UptimeTheme.teal500.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${distanceMeters.toInt()}m • Inside 500m Geofence',
                    style: const TextStyle(
                      color: UptimeTheme.teal500,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Bottom Route Bar
          Positioned(
            bottom: 12,
            left: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.75),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.my_location, color: UptimeTheme.teal500, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'PostGIS ST_DWithin(500m) Active → $destinationLabel',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Text(
                    '34 km/h • Bat 86%',
                    style: TextStyle(
                      color: UptimeTheme.teal500,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MapGridAndRoutePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.05)
      ..strokeWidth = 1;

    for (double x = 0; x < size.width; x += 36) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += 36) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Roads
    final roadPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.08)
      ..strokeWidth = 14
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path()
      ..moveTo(size.width * 0.14, size.height * 0.72)
      ..quadraticBezierTo(
        size.width * 0.45,
        size.height * 0.25,
        size.width * 0.82,
        size.height * 0.48,
      );
    canvas.drawPath(path, roadPaint);

    // Glowing Teal Route
    final routePaint = Paint()
      ..color = UptimeTheme.teal500
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, routePaint);

    // 500m Geofence Ring around Owner Site
    final ownerPos = Offset(size.width * 0.82, size.height * 0.48);
    canvas.drawCircle(
      ownerPos,
      36,
      Paint()..color = UptimeTheme.teal500.withValues(alpha: 0.15),
    );
    canvas.drawCircle(
      ownerPos,
      36,
      Paint()
        ..color = UptimeTheme.teal500.withValues(alpha: 0.6)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5,
    );
    canvas.drawCircle(ownerPos, 8, Paint()..color = UptimeTheme.teal500);

    // Technician Moving Pin
    final techPos = Offset(size.width * 0.48, size.height * 0.42);
    canvas.drawCircle(
      techPos,
      18,
      Paint()..color = UptimeTheme.blue500.withValues(alpha: 0.35),
    );
    canvas.drawCircle(techPos, 9, Paint()..color = Colors.amberAccent);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ── Sound Spectrogram Visualizer (IND-U02 / AUTO-U01) ─────────────────────
class AcousticSpectrogramBar extends StatelessWidget {
  final bool active;
  const AcousticSpectrogramBar({super.key, required this.active});

  @override
  Widget build(BuildContext context) {
    final heights = [18.0, 34.0, 26.0, 48.0, 62.0, 42.0, 56.0, 30.0, 45.0, 60.0, 38.0, 24.0, 50.0, 32.0, 20.0];
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF0B1528),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: active ? UptimeTheme.teal500 : Colors.white24,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                active
                    ? 'FFT ACOUSTIC SPECTRUM • 3.8 kHz BEARING HARMONIC DETECTED'
                    : 'ACOUSTIC FINGERPRINT ANALYZER (20 Hz – 20 kHz)',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: active ? UptimeTheme.teal500 : Colors.white70,
                ),
              ),
              Text(
                active ? '94.2% MATCH' : 'READY',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: Colors.amberAccent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 64,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(heights.length, (i) {
                final h = active ? heights[i] : heights[i] * 0.35;
                final isPeak = i == 4 || i == 9;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: 10,
                  height: h,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(4),
                    gradient: LinearGradient(
                      colors: isPeak && active
                          ? [UptimeTheme.danger, Colors.amber]
                          : [UptimeTheme.teal500, UptimeTheme.blue500],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}
