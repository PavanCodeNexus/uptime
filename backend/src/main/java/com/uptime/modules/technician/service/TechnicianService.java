package com.uptime.modules.technician.service;

import com.uptime.common.constants.AppConstants;
import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.BusinessRuleException;
import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.common.exceptions.ValidationException;
import com.uptime.common.utils.FileUtils;
import com.uptime.common.utils.HashUtils;
import com.uptime.common.utils.PhoneUtils;
import com.uptime.modules.technician.entity.*;
import com.uptime.modules.technician.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianRepository technicianRepository;
    private final TechnicianSkillRepository skillRepository;
    private final TechnicianDocumentRepository documentRepository;
    private final TechnicianIdentityVerificationRepository identityRepository;
    private final TechnicianTradeVerificationRepository tradeVerificationRepository;
    private final TechnicianSkillTestAttemptRepository testAttemptRepository;
    private final TechnicianReferenceRepository referenceRepository;
    private final TechnicianKycAuditLogRepository auditLogRepository;
    private final IdentityVerificationProvider identityProvider;

    public Technician getByUserId(Long userId) {
        return technicianRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.TECH_NOT_FOUND, "Technician profile not found"));
    }

    public Technician getById(Long id) {
        return technicianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.TECH_NOT_FOUND, "Technician not found: " + id));
    }

    @Transactional
    public Technician updateProfile(Long userId, Map<String, Object> updates) {
        Technician tech = getByUserId(userId);
        if (updates.containsKey("bio")) tech.setBio((String) updates.get("bio"));
        if (updates.containsKey("experienceYears")) tech.setExperienceYears(((Number) updates.get("experienceYears")).intValue());
        if (updates.containsKey("serviceRadiusKm")) tech.setServiceRadiusKm(((Number) updates.get("serviceRadiusKm")).intValue());
        if (updates.containsKey("upiId")) tech.setUpiId((String) updates.get("upiId"));
        if (updates.containsKey("emergencyContactName")) tech.setEmergencyContactName((String) updates.get("emergencyContactName"));
        if (updates.containsKey("emergencyContactPhone")) tech.setEmergencyContactPhone((String) updates.get("emergencyContactPhone"));
        return technicianRepository.save(tech);
    }

    @Transactional
    public Technician updateAvailability(Long userId, boolean isOnline, boolean isAvailable) {
        Technician tech = getByUserId(userId);
        if (Boolean.TRUE.equals(tech.getIsFatigueRestricted()) && isAvailable) {
            throw new BusinessRuleException(ErrorCodes.TECH_FATIGUE_RESTRICTED,
                    "Technician is currently in mandatory rest period until " + tech.getFatigueResetAt());
        }
        tech.setIsOnline(isOnline);
        tech.setIsAvailable(isAvailable);
        return technicianRepository.save(tech);
    }

    @Transactional
    public Technician updateLocation(Long userId, BigDecimal lat, BigDecimal lng) {
        Technician tech = getByUserId(userId);
        tech.setCurrentLat(lat);
        tech.setCurrentLng(lng);
        tech.setLocationUpdatedAt(Instant.now());
        return technicianRepository.save(tech);
    }

    public List<TechnicianSkill> getSkills(Long userId) {
        Technician tech = getByUserId(userId);
        return skillRepository.findByTechnicianId(tech.getId());
    }

    @Transactional
    public TechnicianSkill addSkill(Long userId, Map<String, Object> payload) {
        Technician tech = getByUserId(userId);
        TechnicianSkill skill = TechnicianSkill.builder()
                .technicianId(tech.getId())
                .industry((String) payload.getOrDefault("industry", "AUTOMOTIVE"))
                .category((String) payload.getOrDefault("category", "GENERAL"))
                .skillName((String) payload.get("skillName"))
                .proficiency((String) payload.getOrDefault("proficiency", "INTERMEDIATE"))
                .isCertified(Boolean.TRUE.equals(payload.get("isCertified")))
                .build();
        return skillRepository.save(skill);
    }

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        Technician tech = getByUserId(userId);
        TechnicianSkill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "Skill not found"));
        if (!skill.getTechnicianId().equals(tech.getId())) {
            throw new BusinessRuleException(ErrorCodes.AUTH_FORBIDDEN, "Skill does not belong to current technician");
        }
        skillRepository.delete(skill);
    }

    @Transactional
    public TechnicianDocument uploadDocument(Long userId, String docType, String docNumberMasked,
                                             String issuerName, byte[] fileBytes) {
        Technician tech = getByUserId(userId);
        if (PhoneUtils.containsFullAadhaarNumber(docNumberMasked)) {
            throw new ValidationException(ErrorCodes.KYC_INVALID_AADHAAR_PAYLOAD,
                    "Full 12-digit Aadhaar numbers are prohibited under DPDP Act 2023. Provide only last 4 digits.");
        }
        if (fileBytes != null && fileBytes.length > 0 && !FileUtils.isAllowedMagicSignature(fileBytes, fileBytes.length)) {
            throw new ValidationException(ErrorCodes.MAGIC_BYTES_MISMATCH, "Invalid file magic bytes. Allowed: JPEG, PNG, PDF, MP4.");
        }
        String sha256 = fileBytes != null && fileBytes.length > 0
                ? HashUtils.sha256(Base64.getEncoder().encodeToString(fileBytes))
                : HashUtils.sha256(docType + ":" + tech.getId() + ":" + Instant.now());
        String storageRef = "private://kyc-vault/" + tech.getId() + "/" + docType.toLowerCase() + "-" + UUID.randomUUID() + ".pdf";

        TechnicianDocument doc = TechnicianDocument.builder()
                .technicianId(tech.getId())
                .docType(docType)
                .docNumberMasked(docNumberMasked)
                .docUrl(storageRef)
                .storageRef(storageRef)
                .issuerName(issuerName)
                .fileSha256(sha256)
                .verificationStatus("PENDING")
                .build();
        TechnicianDocument saved = documentRepository.save(doc);

        logAudit(tech.getId(), userId, "TECHNICIAN", "DOCUMENT_UPLOADED",
                "L" + tech.getVerificationLevel(), "L" + tech.getVerificationLevel(),
                "Uploaded document: " + docType);
        return saved;
    }

    public Map<String, Object> getEarningsSummary(Long userId) {
        Technician tech = getByUserId(userId);
        return Map.of(
                "technicianId", tech.getId(),
                "walletBalance", tech.getWalletBalance(),
                "totalEarned", tech.getTotalEarned(),
                "jobsCompleted", tech.getJobsCompleted(),
                "upiId", tech.getUpiId() != null ? tech.getUpiId() : ""
        );
    }

    public Map<String, Object> getFatigueStatus(Long userId) {
        Technician tech = getByUserId(userId);
        return Map.of(
                "technicianId", tech.getId(),
                "fatigueScore", tech.getFatigueScore(),
                "consecutiveJobsCount", tech.getConsecutiveJobsCount(),
                "hoursWorkedToday", tech.getHoursWorkedToday(),
                "isFatigueRestricted", tech.getIsFatigueRestricted(),
                "fatigueResetAt", tech.getFatigueResetAt() != null ? tech.getFatigueResetAt().toString() : "",
                "notice", Boolean.TRUE.equals(tech.getIsFatigueRestricted())
                        ? "Mandatory rest period active. You are excluded from dispatch until " + tech.getFatigueResetAt()
                        : "Active and eligible for dispatch"
        );
    }

    public Map<String, Object> getVerificationStatus(Long userId) {
        Technician tech = getByUserId(userId);
        Optional<TechnicianIdentityVerification> identity = identityRepository.findByTechnicianId(tech.getId());
        List<TechnicianTradeVerification> trades = tradeVerificationRepository.findByTechnicianId(tech.getId());
        List<TechnicianDocument> docs = documentRepository.findByTechnicianId(tech.getId());

        return Map.of(
                "technicianId", tech.getId(),
                "verificationStatus", tech.getVerificationStatus(),
                "verificationLevel", tech.getVerificationLevel(),
                "isProvisional", tech.getIsProvisional(),
                "provisionalCompletedJobs", tech.getProvisionalCompletedJobs(),
                "identityVerification", identity.isPresent() ? identity.get() : Map.of("status", "NOT_STARTED"),
                "tradeVerifications", trades,
                "documentsCount", docs.size()
        );
    }

    @Transactional
    public Map<String, Object> initiateDigiLocker(Long userId) {
        Technician tech = getByUserId(userId);
        Map<String, Object> resp = identityProvider.initiateDigiLocker(tech.getId());
        TechnicianIdentityVerification idVer = identityRepository.findByTechnicianId(tech.getId())
                .orElseGet(() -> TechnicianIdentityVerification.builder()
                        .technicianId(tech.getId())
                        .kycProvider(identityProvider.getProviderName())
                        .status("PENDING")
                        .build());
        idVer.setProviderReferenceId((String) resp.get("providerReferenceId"));
        identityRepository.save(idVer);
        return resp;
    }

    @Transactional
    public TechnicianIdentityVerification handleDigiLockerCallback(Long userId, String code, String panNumber) {
        Technician tech = getByUserId(userId);
        if (PhoneUtils.containsFullAadhaarNumber(panNumber)) {
            throw new ValidationException(ErrorCodes.KYC_INVALID_AADHAAR_PAYLOAD, "12-digit Aadhaar number prohibited.");
        }
        String panMasked = (panNumber != null && panNumber.length() >= 10)
                ? panNumber.substring(0, 5) + "****" + panNumber.substring(9, 10)
                : "ABCDE****F";

        Map<String, Object> result = identityProvider.handleCallback(tech.getId(), code, panMasked);
        TechnicianIdentityVerification idVer = identityRepository.findByTechnicianId(tech.getId())
                .orElseGet(() -> TechnicianIdentityVerification.builder()
                        .technicianId(tech.getId())
                        .kycProvider(identityProvider.getProviderName())
                        .build());

        idVer.setAadhaarLast4((String) result.get("aadhaarLast4"));
        idVer.setAadhaarName((String) result.get("aadhaarName"));
        idVer.setAadhaarDob(LocalDate.parse((String) result.get("aadhaarDob")));
        idVer.setPanMasked((String) result.get("panMasked"));
        idVer.setPanNameMatchScore((BigDecimal) result.get("panNameMatchScore"));
        return identityRepository.save(idVer);
    }

    @Transactional
    public TechnicianIdentityVerification uploadSelfieLiveness(Long userId, byte[] imageBytes) {
        Technician tech = getByUserId(userId);
        if (imageBytes != null && imageBytes.length > 0 && !FileUtils.isAllowedMagicSignature(imageBytes, imageBytes.length)) {
            throw new ValidationException(ErrorCodes.MAGIC_BYTES_MISMATCH, "Invalid selfie image magic bytes.");
        }
        String storageRef = "private://kyc-vault/" + tech.getId() + "/selfie-" + UUID.randomUUID() + ".jpg";
        Map<String, Object> result = identityProvider.verifyLivenessSelfie(tech.getId(), storageRef);

        TechnicianIdentityVerification idVer = identityRepository.findByTechnicianId(tech.getId())
                .orElseGet(() -> TechnicianIdentityVerification.builder()
                        .technicianId(tech.getId())
                        .kycProvider(identityProvider.getProviderName())
                        .build());
        idVer.setSelfieStorageRef(storageRef);
        idVer.setLivenessScore((BigDecimal) result.get("livenessScore"));
        idVer.setFaceMatchScore((BigDecimal) result.get("faceMatchScore"));
        return identityRepository.save(idVer);
    }

    @Transactional
    public TechnicianIdentityVerification verifyUpiPennyDrop(Long userId, String upiId) {
        Technician tech = getByUserId(userId);
        TechnicianIdentityVerification idVer = identityRepository.findByTechnicianId(tech.getId())
                .orElseGet(() -> TechnicianIdentityVerification.builder()
                        .technicianId(tech.getId())
                        .kycProvider(identityProvider.getProviderName())
                        .build());

        Map<String, Object> result = identityProvider.verifyUpiPennyDrop(tech.getId(), upiId, idVer.getAadhaarName());
        idVer.setUpiPennyDropVerified((Boolean) result.get("verified"));
        idVer.setAccountHolderName((String) result.get("accountHolderName"));
        idVer.setStatus("VERIFIED");
        idVer.setVerifiedAt(Instant.now());
        identityRepository.save(idVer);

        String prevLevel = "L" + tech.getVerificationLevel();
        if (tech.getVerificationLevel() < 1) {
            tech.setVerificationLevel(1);
            tech.setVerificationStatus("UNDER_REVIEW");
            tech.setKycStatus("UNDER_REVIEW");
        }
        tech.setUpiId(upiId);
        technicianRepository.save(tech);

        logAudit(tech.getId(), userId, "TECHNICIAN", "IDENTITY_L1_VERIFIED", prevLevel, "L1",
                "Completed DigiLocker + Selfie + Penny-Drop L1 verification");
        return idVer;
    }

    @Transactional
    public TechnicianTradeVerification selectTrack(Long userId, String industry, String tradeCode,
                                                   String verificationTrack, String licenseNumber, String licenseState) {
        Technician tech = getByUserId(userId);
        boolean isRegulated = AppConstants.REGULATED_TRADES.contains(tradeCode.toUpperCase());
        if (isRegulated && "EXPERIENCED_USTAD".equalsIgnoreCase(verificationTrack)) {
            throw new BusinessRuleException(ErrorCodes.KYC_REGULATED_TRADE_REQUIRES_TRACK_A,
                    "Regulated trade " + tradeCode + " requires Track A (CERTIFIED) with mandatory statutory license.");
        }

        TechnicianTradeVerification tv = tradeVerificationRepository.findByTechnicianIdAndTradeCode(tech.getId(), tradeCode)
                .orElseGet(() -> TechnicianTradeVerification.builder()
                        .technicianId(tech.getId())
                        .industry(industry)
                        .tradeCode(tradeCode)
                        .build());

        tv.setVerificationTrack(verificationTrack.toUpperCase());
        tv.setIsRegulatedTrade(isRegulated);
        tv.setLicenseNumber(licenseNumber);
        tv.setLicenseIssuingState(licenseState);
        tv.setVerificationLevel(tech.getVerificationLevel() >= 1 ? "L1" : "L0");
        return tradeVerificationRepository.save(tv);
    }

    @Transactional
    public Map<String, Object> startSkillTest(Long userId, String tradeCode) {
        Technician tech = getByUserId(userId);
        List<TechnicianSkillTestAttempt> attempts = testAttemptRepository
                .findByTechnicianIdAndTradeCodeOrderByAttemptNumberDesc(tech.getId(), tradeCode);
        int nextAttempt = attempts.isEmpty() ? 1 : attempts.get(0).getAttemptNumber() + 1;
        if (nextAttempt > 3) {
            throw new BusinessRuleException(ErrorCodes.KYC_SKILL_TEST_COOLDOWN,
                    "Maximum 3 attempts reached for trade " + tradeCode + ". Cooldown active.");
        }

        String questionsJson = "[{\"id\":1,\"type\":\"SAFETY\",\"q\":\"Before inspecting an electrical panel, what is mandatory?\",\"options\":[\"Lockout/Tagout & Voltage test\",\"Touch with back of hand\",\"Turn off room light\"],\"correct\":0}," +
                "{\"id\":2,\"type\":\"SAFETY\",\"q\":\"When working under a raised vehicle, what must be in place?\",\"options\":[\"Rated axle jack stands\",\"Hydraulic jack only\",\"Bricks\"],\"correct\":0}]";

        TechnicianSkillTestAttempt attempt = TechnicianSkillTestAttempt.builder()
                .technicianId(tech.getId())
                .tradeCode(tradeCode)
                .attemptNumber(nextAttempt)
                .questionsJson(questionsJson)
                .startedAt(Instant.now())
                .build();
        TechnicianSkillTestAttempt saved = testAttemptRepository.save(attempt);

        return Map.of(
                "attemptId", saved.getId(),
                "tradeCode", tradeCode,
                "attemptNumber", nextAttempt,
                "questionsCount", 15,
                "passThreshold", 70,
                "mandatorySafetyQuestions", 2,
                "questions", questionsJson
        );
    }

    @Transactional
    public Map<String, Object> submitSkillTest(Long userId, String tradeCode, int totalScore, int safetyQuestionsCorrect, String answersJson) {
        Technician tech = getByUserId(userId);
        List<TechnicianSkillTestAttempt> attempts = testAttemptRepository
                .findByTechnicianIdAndTradeCodeOrderByAttemptNumberDesc(tech.getId(), tradeCode);
        TechnicianSkillTestAttempt attempt = attempts.isEmpty()
                ? TechnicianSkillTestAttempt.builder()
                    .technicianId(tech.getId())
                    .tradeCode(tradeCode)
                    .attemptNumber(1)
                    .questionsJson("[]")
                    .build()
                : attempts.get(0);

        boolean passed = totalScore >= 70 && safetyQuestionsCorrect >= 2;
        attempt.setAnswersJson(answersJson != null ? answersJson : "[]");
        attempt.setTotalScore(totalScore);
        attempt.setSafetyQuestionsCorrect(safetyQuestionsCorrect);
        attempt.setPassed(passed);
        attempt.setSubmittedAt(Instant.now());
        TechnicianSkillTestAttempt savedAttempt = testAttemptRepository.save(attempt);

        TechnicianTradeVerification tv = tradeVerificationRepository.findByTechnicianIdAndTradeCode(tech.getId(), tradeCode)
                .orElseGet(() -> TechnicianTradeVerification.builder()
                        .technicianId(tech.getId())
                        .industry("AUTOMOTIVE")
                        .tradeCode(tradeCode)
                        .verificationTrack("EXPERIENCED_USTAD")
                        .build());
        tv.setMcqScore(totalScore);
        tv.setMcqPassed(passed);
        tradeVerificationRepository.save(tv);

        return Map.of(
                "attemptId", savedAttempt.getId(),
                "tradeCode", tradeCode,
                "totalScore", totalScore,
                "safetyQuestionsCorrect", safetyQuestionsCorrect,
                "passed", passed
        );
    }

    @Transactional
    public TechnicianTradeVerification uploadVideoProof(Long userId, String tradeCode, byte[] videoBytes) {
        Technician tech = getByUserId(userId);
        if (videoBytes != null && videoBytes.length > 0 && !FileUtils.isAllowedMagicSignature(videoBytes, videoBytes.length)) {
            throw new ValidationException(ErrorCodes.MAGIC_BYTES_MISMATCH, "Invalid video file magic bytes.");
        }
        TechnicianTradeVerification tv = tradeVerificationRepository.findByTechnicianIdAndTradeCode(tech.getId(), tradeCode)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.RESOURCE_NOT_FOUND, "Trade track not initialized for " + tradeCode));

        String storageRef = "private://kyc-vault/" + tech.getId() + "/video-proof-" + tradeCode.toLowerCase() + ".mp4";
        tv.setVideoProofStorageRef(storageRef);
        tv.setVideoProofStatus("PENDING_REVIEW");
        return tradeVerificationRepository.save(tv);
    }

    @Transactional
    public TechnicianReference submitReference(Long userId, String tradeCode, String refereeName,
                                               String refereePhone, String refereeRole) {
        Technician tech = getByUserId(userId);
        TechnicianReference ref = TechnicianReference.builder()
                .technicianId(tech.getId())
                .tradeCode(tradeCode)
                .refereeName(refereeName)
                .refereePhone(refereePhone)
                .refereeRole(refereeRole != null ? refereeRole : "WORKSHOP_OWNER")
                .otpVerified(true)
                .verifiedAt(Instant.now())
                .build();
        TechnicianReference saved = referenceRepository.save(ref);

        tradeVerificationRepository.findByTechnicianIdAndTradeCode(tech.getId(), tradeCode).ifPresent(tv -> {
            if ("EXPERIENCED_USTAD".equalsIgnoreCase(tv.getVerificationTrack())
                    && Boolean.TRUE.equals(tv.getMcqPassed())
                    && !"NOT_SUBMITTED".equalsIgnoreCase(tv.getVideoProofStatus())) {
                tv.setVerificationLevel("L2-P");
                tradeVerificationRepository.save(tv);

                String prev = "L" + tech.getVerificationLevel();
                tech.setVerificationLevel(Math.max(tech.getVerificationLevel(), 2));
                tech.setIsProvisional(true);
                tech.setProvisionalExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
                tech.setVerificationStatus("PROVISIONAL");
                technicianRepository.save(tech);

                logAudit(tech.getId(), userId, "SYSTEM", "GRANTED_PROVISIONAL_L2P", prev, "L2-P",
                        "Track B Experienced Ustad provisional activation for " + tradeCode);
            }
        });
        return saved;
    }

    private void logAudit(Long technicianId, Long actorId, String actorRole, String action,
                          String prevLevel, String newLevel, String notes) {
        auditLogRepository.save(TechnicianKycAuditLog.builder()
                .technicianId(technicianId)
                .actorId(actorId)
                .actorRole(actorRole)
                .action(action)
                .previousLevel(prevLevel)
                .newLevel(newLevel)
                .notes(notes)
                .ipAddress("127.0.0.1")
                .build());
    }
}
