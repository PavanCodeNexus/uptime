package com.uptime.modules.matching.service;

import com.uptime.common.constants.AppConstants;
import com.uptime.modules.job.entity.Job;
import com.uptime.modules.job.repository.JobRepository;
import com.uptime.modules.technician.entity.Technician;
import com.uptime.modules.technician.entity.TechnicianSkill;
import com.uptime.modules.technician.repository.TechnicianRepository;
import com.uptime.modules.technician.repository.TechnicianSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final TechnicianRepository technicianRepository;
    private final TechnicianSkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final ScoringEngine scoringEngine;

    public List<Map<String, Object>> findRankedCandidates(Long jobId) {
        if (jobId == null) {
            throw new IllegalArgumentException("Job ID is required");
        }
        Job job = jobRepository.findById(jobId).orElseThrow();
        List<Technician> eligiblePool = technicianRepository.findAvailableEligibleTechnicians();

        List<Map<String, Object>> ranked = new ArrayList<>();
        for (Technician tech : eligiblePool) {
            if (Boolean.TRUE.equals(tech.getIsFatigueRestricted())) {
                continue;
            }

            if (Boolean.TRUE.equals(tech.getIsProvisional())) {
                if ("EMERGENCY".equalsIgnoreCase(job.getUrgency()) || "CRITICAL".equalsIgnoreCase(job.getUrgency())) {
                    continue;
                }
                if (job.getAiEstimatedCostMax() != null
                        && job.getAiEstimatedCostMax().compareTo(AppConstants.PROVISIONAL_JOB_CAP_INR) > 0) {
                    continue;
                }
            }

            List<TechnicianSkill> skills = skillRepository.findByTechnicianIdAndIndustry(tech.getId(), job.getIndustry());
            boolean hasExactSkill = skills.stream()
                    .anyMatch(s -> job.getProblemCategory() == null
                            || s.getCategory().equalsIgnoreCase(job.getProblemCategory())
                            || s.getSkillName().equalsIgnoreCase(job.getProblemCategory()));
            boolean hasCert = skills.stream().anyMatch(s -> Boolean.TRUE.equals(s.getIsCertified()));

            double score = scoringEngine.calculateScore(
                    tech,
                    job.getOwnerLat().doubleValue(),
                    job.getOwnerLng().doubleValue(),
                    hasExactSkill,
                    hasCert
            );

            ranked.add(Map.of(
                    "technicianId", tech.getId(),
                    "verificationLevel", tech.getVerificationLevel(),
                    "isProvisional", tech.getIsProvisional(),
                    "ratingAvg", tech.getRatingAvg(),
                    "score", score
            ));
        }

        ranked.sort((a, b) -> Double.compare((Double) b.get("score"), (Double) a.get("score")));
        return ranked;
    }
}
