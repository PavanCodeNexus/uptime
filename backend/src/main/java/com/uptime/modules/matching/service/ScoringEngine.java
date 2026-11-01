package com.uptime.modules.matching.service;

import com.uptime.common.utils.GeoUtils;
import com.uptime.modules.technician.entity.Technician;
import org.springframework.stereotype.Component;

/**
 * UPTIME 60-Second Technician Scoring Engine (CORE-03).
 *
 * LOCKED RULE:
 * Technicians with isFatigueRestricted = TRUE are filtered out at the database query level
 * (AND is_fatigue_restricted = FALSE) before ScoringEngine is ever invoked.
 * ScoringEngine NEVER subtracts 50 points or assigns score = 0 as a fatigue penalty.
 */
@Component
public class ScoringEngine {

    public double calculateScore(Technician technician, double jobLat, double jobLng,
                                 boolean hasExactSkill, boolean hasCertifiedSkill) {
        if (Boolean.TRUE.equals(technician.getIsFatigueRestricted())) {
            throw new IllegalArgumentException(
                    "Fatigue-restricted technicians must be excluded at the query level and never passed to ScoringEngine.");
        }

        double techLat = technician.getCurrentLat() != null ? technician.getCurrentLat().doubleValue() : jobLat;
        double techLng = technician.getCurrentLng() != null ? technician.getCurrentLng().doubleValue() : jobLng;
        double distanceKm = GeoUtils.distanceKm(jobLat, jobLng, techLat, techLng);

        // 1. Distance Score (Weight: 40%, max 40 points)
        double maxRadius = technician.getServiceRadiusKm() != null && technician.getServiceRadiusKm() > 0
                ? technician.getServiceRadiusKm() : 15.0;
        double distanceRatio = Math.max(0.0, 1.0 - (distanceKm / maxRadius));
        double distancePoints = distanceRatio * 40.0;

        // 2. Skill Score (Weight: 60%, max 60 points)
        double skillPoints = hasExactSkill ? 45.0 : 25.0;
        if (hasCertifiedSkill || Integer.valueOf(3).equals(technician.getVerificationLevel())) {
            skillPoints += 15.0;
        }

        // 3. Quality & Speed Bonuses (capped at 100 total)
        double ratingBonus = technician.getRatingAvg() != null
                ? Math.max(0.0, (technician.getRatingAvg().doubleValue() - 3.5) * 4.0) : 4.0;
        double experienceBonus = technician.getExperienceYears() != null
                ? Math.min(5.0, technician.getExperienceYears() * 0.5) : 0.0;
        double responseBonus = (technician.getResponseTimeAvgSec() != null && technician.getResponseTimeAvgSec() <= 30)
                ? 4.0 : 1.0;

        double rawTotal = distancePoints + skillPoints + ratingBonus + experienceBonus + responseBonus;
        return Math.round(Math.min(100.0, Math.max(1.0, rawTotal)) * 100.0) / 100.0;
    }
}
