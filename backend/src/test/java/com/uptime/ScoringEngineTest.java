package com.uptime;

import com.uptime.modules.job.entity.Job;
import com.uptime.modules.job.repository.JobRepository;
import com.uptime.modules.matching.service.MatchingService;
import com.uptime.modules.matching.service.ScoringEngine;
import com.uptime.modules.technician.entity.Technician;
import com.uptime.modules.technician.repository.TechnicianRepository;
import com.uptime.modules.technician.repository.TechnicianSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ScoringEngineTest {

    private ScoringEngine scoringEngine;
    private TechnicianRepository technicianRepository;
    private TechnicianSkillRepository skillRepository;
    private JobRepository jobRepository;
    private MatchingService matchingService;

    private List<Technician> fakeEligibleTechs = new ArrayList<>();
    private Map<Long, Job> fakeJobs = new HashMap<>();

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        scoringEngine = new ScoringEngine();
        fakeEligibleTechs.clear();
        fakeJobs.clear();

        technicianRepository = (TechnicianRepository) Proxy.newProxyInstance(
                TechnicianRepository.class.getClassLoader(),
                new Class<?>[]{TechnicianRepository.class},
                (proxy, method, args) -> {
                    if ("findAvailableEligibleTechnicians".equals(method.getName())) {
                        return fakeEligibleTechs;
                    }
                    return null;
                }
        );

        skillRepository = (TechnicianSkillRepository) Proxy.newProxyInstance(
                TechnicianSkillRepository.class.getClassLoader(),
                new Class<?>[]{TechnicianSkillRepository.class},
                (proxy, method, args) -> Collections.emptyList()
        );

        jobRepository = (JobRepository) Proxy.newProxyInstance(
                JobRepository.class.getClassLoader(),
                new Class<?>[]{JobRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName()) && args != null && args.length > 0) {
                        return Optional.ofNullable(fakeJobs.get(args[0]));
                    }
                    return Optional.empty();
                }
        );

        matchingService = new MatchingService(technicianRepository, skillRepository, jobRepository, scoringEngine);
    }

    @Test
    void shouldCalculateHighScoreForNearbyCertifiedTechnician() {
        Technician tech = Technician.builder()
                .id(10L)
                .verificationLevel(3)
                .isFatigueRestricted(false)
                .currentLat(new BigDecimal("17.3850"))
                .currentLng(new BigDecimal("78.4867"))
                .serviceRadiusKm(15)
                .ratingAvg(new BigDecimal("4.90"))
                .experienceYears(8)
                .responseTimeAvgSec(20)
                .build();

        double score = scoringEngine.calculateScore(tech, 17.3855, 78.4870, true, true);
        assertTrue(score >= 90.0 && score <= 100.0, "Expected high score >= 90, got: " + score);
    }

    @Test
    void shouldRejectFatigueRestrictedTechnicianInScoringEngine() {
        Technician fatiguedTech = Technician.builder()
                .id(11L)
                .isFatigueRestricted(true)
                .build();

        assertThrows(IllegalArgumentException.class, () ->
                scoringEngine.calculateScore(fatiguedTech, 17.3850, 78.4867, true, true));
    }

    @Test
    void restrictedTechnicianIsAbsentFromMatchingResults() {
        Long jobId = 100L;
        Long activeTechId = 201L;
        Long fatiguedTechId = 202L;

        Job job = Job.builder()
                .id(jobId)
                .industry("AUTOMOTIVE")
                .urgency("NORMAL")
                .ownerLat(new BigDecimal("17.3850"))
                .ownerLng(new BigDecimal("78.4867"))
                .aiEstimatedCostMax(new BigDecimal("1500.00"))
                .build();

        Technician activeTech = Technician.builder()
                .id(activeTechId)
                .verificationLevel(2)
                .isProvisional(false)
                .isFatigueRestricted(false)
                .currentLat(new BigDecimal("17.3900"))
                .currentLng(new BigDecimal("78.4900"))
                .serviceRadiusKm(15)
                .ratingAvg(new BigDecimal("4.75"))
                .build();

        Technician fatiguedTech = Technician.builder()
                .id(fatiguedTechId)
                .verificationLevel(3)
                .isProvisional(false)
                .isFatigueRestricted(true)
                .currentLat(new BigDecimal("17.3851"))
                .currentLng(new BigDecimal("78.4868"))
                .serviceRadiusKm(15)
                .ratingAvg(new BigDecimal("5.00"))
                .build();

        fakeJobs.put(jobId, job);
        fakeEligibleTechs.addAll(List.of(activeTech, fatiguedTech));

        List<Map<String, Object>> results = matchingService.findRankedCandidates(jobId);

        assertEquals(1, results.size());
        assertEquals(activeTechId, results.get(0).get("technicianId"));
        assertTrue(results.stream().noneMatch(r -> fatiguedTechId.equals(r.get("technicianId"))),
                "Fatigue-restricted technician must be completely absent from results");
    }

    @Test
    void provisionalTechnicianIsExcludedFromHighValueJobs() {
        Long jobId = 101L;
        Technician provisionalTech = Technician.builder()
                .id(301L)
                .verificationLevel(2)
                .isProvisional(true)
                .isFatigueRestricted(false)
                .currentLat(new BigDecimal("17.3850"))
                .currentLng(new BigDecimal("78.4867"))
                .build();

        Job highValueJob = Job.builder()
                .id(jobId)
                .industry("AUTOMOTIVE")
                .urgency("NORMAL")
                .ownerLat(new BigDecimal("17.3850"))
                .ownerLng(new BigDecimal("78.4867"))
                .aiEstimatedCostMax(new BigDecimal("4500.00"))
                .build();

        fakeJobs.put(jobId, highValueJob);
        fakeEligibleTechs.add(provisionalTech);

        List<Map<String, Object>> results = matchingService.findRankedCandidates(jobId);
        assertTrue(results.isEmpty(), "Provisional L2-P technician must be excluded from jobs > INR 3,000");
    }
}