import 'package:flutter/material.dart';
import '../../core/config/theme.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    final color = UptimeTheme.statusColor(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.14),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status.replaceAll('_', ' '),
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: color,
        ),
      ),
    );
  }
}

class IndustryChip extends StatelessWidget {
  final String industry;
  final bool selected;
  final VoidCallback onTap;

  const IndustryChip({
    required this.industry,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = UptimeTheme.industryColor(industry);
    final icon = switch (industry.toUpperCase()) {
      'INDUSTRIAL' => Icons.precision_manufacturing,
      'AUTOMOBILE' => Icons.directions_car,
      _ => Icons.memory,
    };
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(999),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? color : Colors.white,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: selected ? color : UptimeTheme.gray300, width: 1.5),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: selected ? Colors.white : color),
            const SizedBox(width: 6),
            Text(
              industry,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: selected ? Colors.white : UptimeTheme.dark,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PathCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String badge;
  final Color badgeColor;
  final Color color;
  final Color borderColor;
  final String? subText;
  final VoidCallback onTap;

  const PathCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.badge,
    required this.badgeColor,
    required this.color,
    required this.borderColor,
    this.subText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor, width: 2),
        ),
        child: Row(
          children: [
            Icon(icon, size: 32, color: badgeColor),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          title,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: UptimeTheme.dark,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: badgeColor,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          badge,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 13, color: UptimeTheme.gray700),
                  ),
                  if (subText != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      subText!,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: badgeColor,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, size: 16, color: UptimeTheme.gray500),
          ],
        ),
      ),
    );
  }
}
