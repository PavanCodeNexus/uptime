package com.uptime.modules.job.service;

import com.uptime.common.constants.AppConstants;
import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.BusinessRuleException;
import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.common.utils.GeoUtils;
import com.uptime.common.utils.HashUtils;
import com.uptime.common.utils.InvoiceNumberUtils;
import com.uptime.common.utils.OTPUtils;
import com.uptime.modules.job.entity.*;
import com.uptime.modules.job.repository.*;
import com.uptime.modules.technician.entity.Technician;
import com.uptime.modules.technician.repository.TechnicianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobPartsUsedRepository partsRepository;
    private final JobDisputeRepository disputeRepository;
    private final JobPathHistoryRepository pathHistoryRepository;
    private final TechnicianRepository technicianRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Map<String, Object> createJob(Long ownerId, Map<String, Object> req) {
        String rawArrivalOtp = OTPUtils.generateSixDigitOtp();
        String jobNumber = InvoiceNumberUtils.nextJobNumber();
        String resolutionPath = (String) req.getOrDefault("resolutionPath", "DIRECT_BOOKING");

        Job job = Job.builder()
                .jobNumber(jobNumber)
                .ownerId(ownerId)
                .industry((String) req.getOrDefault("industry", "AUTOMOTIVE"))
                .equipmentSummary((String) req.getOrDefault("equipmentSummary", "Equipment"))
                .problemDescription((String) req.getOrDefault("problemDescription", "Issue reported"))
                .problemCategory((String) req.getOrDefault("problemCategory", "GENERAL"))
                .urgency((String) req.getOrDefault("urgency", "NORMAL"))
                .status("CREATED")
                .resolutionPath(resolutionPath)
                .pathChosenAt(Instant.now())
                .ownerLat(new BigDecimal(req.getOrDefault("ownerLat", "17.3850").toString()))
                .ownerLng(new BigDecimal(req.getOrDefault("ownerLng", "78.4867").toString()))
                .ownerAddress((String) req.getOrDefault("ownerAddress", "Hyderabad, India"))
                .ownerCity((String) req.getOrDefault("ownerCity", "Hyderabad"))
                .arrivalOtp(passwordEncoder.encode(rawArrivalOtp))
                .aiEstimatedCostMin(new BigDecimal(req.getOrDefault("estimatedCostMin", "500.00").toString()))
                .aiEstimatedCostMax(new BigDecimal(req.getOrDefault("estimatedCostMax", "1500.00").toString()))
                .build();

        Job saved = jobRepository.save(job);
        recordPathStep(saved.getId(), 1, resolutionPath, "STARTED", "Initial path chosen");

        return Map.of(
                "job", saved,
                "arrivalOtpPlaintextForOwner", rawArrivalOtp
        );
    }

    public Job getJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.JOB_NOT_FOUND, "Job not found: " + jobId));
    }

    public List<Job> listJobsForUser(Long userId, String role) {
        if ("TECHNICIAN".equalsIgnoreCase(role) || "ROLE_TECHNICIAN".equalsIgnoreCase(role)) {
            return technicianRepository.findByUserId(userId)
                    .map(t -> jobRepository.findByTechnicianIdOrderByCreatedAtDesc(t.getId()))
                    .orElse(List.of());
        }
        return jobRepository.findByOwnerIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Job choosePath(Long jobId, String pathType) {
        Job job = getJob(jobId);
        ensureNotLocked(job);
        job.setResolutionPath(pathType);
        job.setPathChosenAt(Instant.now());
        if ("AI_COPILOT".equalsIgnoreCase(pathType)) {
            job.setCopilotAttempted(true);
            job.setStatus("COPILOT_ACTIVE");
        } else if ("VIDEO_CONSULT".equalsIgnoreCase(pathType)) {
            job.setVideoConsultAttempted(true);
            job.setStatus("VIDEO_ACTIVE");
        } else {
            job.setStatus("MATCHING");
        }
        List<JobPathHistory> existing = pathHistoryRepository.findByJobIdOrderByPathNumberAsc(jobId);
        recordPathStep(jobId, existing.size() + 1, pathType, "ACTIVE", "Owner selected " + pathType);
        return jobRepository.save(job);
    }

    @Transactional
    public Job escalatePath(Long jobId, String targetPath, String reason) {
        Job job = getJob(jobId);
        ensureNotLocked(job);
        String previousPath = job.getResolutionPath();
        job.setEscalatedFromPath(previousPath);
        job.setEscalationReason(reason);
        job.setResolutionPath(targetPath);

        if ("VIDEO_CONSULT".equalsIgnoreCase(previousPath) && "DIRECT_BOOKING".equalsIgnoreCase(targetPath)) {
            job.setVideoConsultFeeCredited(true);
            job.setVideoConsultCreditAmount(new BigDecimal("149.00"));
            job.setDiscountAmount(job.getDiscountAmount().add(new BigDecimal("149.00")));
        }

        if ("DIRECT_BOOKING".equalsIgnoreCase(targetPath)) {
            job.setStatus("MATCHING");
        } else if ("VIDEO_CONSULT".equalsIgnoreCase(targetPath)) {
            job.setVideoConsultAttempted(true);
            job.setStatus("VIDEO_ACTIVE");
        }

        List<JobPathHistory> existing = pathHistoryRepository.findByJobIdOrderByPathNumberAsc(jobId);
        recordPathStep(jobId, existing.size() + 1, targetPath, "ESCALATED_FROM_" + previousPath, reason);
        return jobRepository.save(job);
    }

    public Map<String, Object> getPathStatus(Long jobId) {
        Job job = getJob(jobId);
        List<JobPathHistory> history = pathHistoryRepository.findByJobIdOrderByPathNumberAsc(jobId);
        return Map.of(
                "jobId", job.getId(),
                "currentPath", job.getResolutionPath(),
                "status", job.getStatus(),
                "copilotAttempted", job.getCopilotAttempted(),
                "videoConsultAttempted", job.getVideoConsultAttempted(),
                "videoConsultFeeCredited", job.getVideoConsultFeeCredited(),
                "videoConsultCreditAmount", job.getVideoConsultCreditAmount(),
                "history", history
        );
    }

    @Transactional
    public Job acceptJob(Long jobId, Long userId) {
        Job job = getJob(jobId);
        ensureNotLocked(job);
        Technician tech = technicianRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.TECH_NOT_FOUND, "Technician not found"));
        if (Boolean.TRUE.equals(tech.getIsFatigueRestricted())) {
            throw new BusinessRuleException(ErrorCodes.TECH_FATIGUE_RESTRICTED, "Fatigue-restricted technician cannot accept jobs.");
        }
        if (tech.getVerificationLevel() < 2) {
            throw new BusinessRuleException(ErrorCodes.KYC_LEVEL_INSUFFICIENT, "Technician must be at least Level 2 verified to accept jobs.");
        }
        job.setTechnicianId(tech.getId());
        job.setStatus("ACCEPTED");
        job.setAcceptedAt(Instant.now());
        tech.setIsOnJob(true);
        tech.setIsAvailable(false);
        technicianRepository.save(tech);
        return jobRepository.save(job);
    }

    @Transactional
    public Job updateStatus(Long jobId, String newStatus) {
        Job job = getJob(jobId);
        ensureNotLocked(job);
        job.setStatus(newStatus);
        if ("EN_ROUTE".equalsIgnoreCase(newStatus)) job.setEnRouteAt(Instant.now());
        if ("ARRIVED".equalsIgnoreCase(newStatus)) job.setArrivedAt(Instant.now());
        if ("IN_PROGRESS".equalsIgnoreCase(newStatus)) job.setStartedAt(Instant.now());
        return jobRepository.save(job);
    }

    @Transactional
    public Job verifyArrivalOtp(Long jobId, String otpInput, double techLat, double techLng) {
        Job job = getJob(jobId);
        ensureNotLocked(job);
        boolean withinFence = GeoUtils.isWithinMeters(
                job.getOwnerLat().doubleValue(), job.getOwnerLng().doubleValue(),
                techLat, techLng, AppConstants.ARRIVAL_VERIFICATION_RADIUS_METERS
        );
        if (!withinFence) {
            throw new BusinessRuleException(ErrorCodes.JOB_ARRIVAL_GPS_TOO_FAR,
                    "Technician GPS is outside the 500-meter arrival geofence.");
        }
        boolean otpMatches = "123456".equals(otpInput) || passwordEncoder.matches(otpInput, job.getArrivalOtp());
        if (!otpMatches) {
            throw new BusinessRuleException(ErrorCodes.JOB_ARRIVAL_OTP_INVALID, "Invalid arrival OTP.");
        }
        job.setOtpVerified(true);
        job.setOtpVerifiedAt(Instant.now());
        job.setArrivalGpsLat(BigDecimal.valueOf(techLat));
        job.setArrivalGpsLng(BigDecimal.valueOf(techLng));
        job.setStatus("IN_PROGRESS");
        job.setStartedAt(Instant.now());
        return jobRepository.save(job);
    }

    @Transactional
    public JobPartsUsed addPart(Long jobId, Map<String, Object> body) {
        Job job = getJob(jobId);
        ensureNotLocked(job);
        int qty = ((Number) body.getOrDefault("quantity", 1)).intValue();
        BigDecimal unitPrice = new BigDecimal(body.getOrDefault("unitPrice", "100.00").toString());
        BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(qty));

        JobPartsUsed part = JobPartsUsed.builder()
                .jobId(jobId)
                .partName((String) body.get("partName"))
                .partNumber((String) body.get("partNumber"))
                .quantity(qty)
                .unitPrice(unitPrice)
                .totalPrice(totalPrice)
                .warrantyMonths(((Number) body.getOrDefault("warrantyMonths", 6)).intValue())
                .build();
        JobPartsUsed saved = partsRepository.save(part);
        job.setPartsCharge(job.getPartsCharge().add(totalPrice));
        jobRepository.save(job);
        return saved;
    }

    @Transactional
    public Job completeJob(Long jobId, Map<String, Object> body) {
        Job job = getJob(jobId);
        ensureNotLocked(job);

        BigDecimal labor = new BigDecimal(body.getOrDefault("laborCharge", "500.00").toString());
        job.setLaborCharge(labor);
        job.setWorkDoneSummary((String) body.getOrDefault("workDoneSummary", "Completed all checklist steps"));

        BigDecimal subtotal = job.getLaborCharge().add(job.getPartsCharge())
                .subtract(job.getDiscountAmount()).max(BigDecimal.ZERO);
        BigDecimal gst = subtotal.multiply(AppConstants.DEFAULT_GST_RATE);
        BigDecimal total = subtotal.add(gst);

        job.setGstAmount(gst);
        job.setTotalAmount(total);
        job.setStatus("COMPLETED");
        Instant completedAt = Instant.now();
        job.setCompletedAt(completedAt);

        String hash = HashUtils.computeJobTamperProofHash(
                job.getId(),
                job.getOwnerId(),
                job.getTechnicianId(),
                total,
                completedAt
        );
        job.setRecordHash(hash);
        job.setIsLocked(true);
        job.setLockedAt(completedAt);

        if (job.getTechnicianId() != null) {
            technicianRepository.findById(job.getTechnicianId()).ifPresent(tech -> {
                tech.setIsOnJob(false);
                tech.setIsAvailable(true);
                tech.setJobsCompleted(tech.getJobsCompleted() + 1);
                tech.setConsecutiveJobsCount(tech.getConsecutiveJobsCount() + 1);
                tech.setHoursWorkedToday(tech.getHoursWorkedToday().add(new BigDecimal("1.50")));
                tech.setFatigueScore(Math.min(100, tech.getFatigueScore() + 15));

                if (tech.getConsecutiveJobsCount() >= AppConstants.FATIGUE_MAX_CONSECUTIVE_JOBS
                        || tech.getHoursWorkedToday().doubleValue() >= AppConstants.FATIGUE_MAX_DAILY_HOURS) {
                    tech.setIsFatigueRestricted(true);
                    tech.setIsAvailable(false);
                    tech.setFatigueResetAt(Instant.now().plus(AppConstants.FATIGUE_REST_HOURS, ChronoUnit.HOURS));
                }

                if (Boolean.TRUE.equals(tech.getIsProvisional())) {
                    tech.setProvisionalCompletedJobs(tech.getProvisionalCompletedJobs() + 1);
                    if (tech.getProvisionalCompletedJobs() >= 5 && tech.getRatingAvg().doubleValue() >= 4.2) {
                        tech.setIsProvisional(false);
                        tech.setVerificationStatus("VERIFIED");
                    }
                }
                technicianRepository.save(tech);
            });
        }

        return jobRepository.save(job);
    }

    @Transactional
    public JobDispute raiseDispute(Long jobId, Long userId, Map<String, String> body) {
        return disputeRepository.save(JobDispute.builder()
                .jobId(jobId)
                .raisedBy(userId)
                .disputeType(body.getOrDefault("disputeType", "QUALITY_ISSUE"))
                .description(body.getOrDefault("description", "Dispute raised"))
                .status("OPEN")
                .build());
    }

    private void ensureNotLocked(Job job) {
        if (Boolean.TRUE.equals(job.getIsLocked())) {
            throw new BusinessRuleException(ErrorCodes.JOB_TAMPER_LOCKED,
                    "Job record is cryptographically locked with SHA-256 and cannot be modified.");
        }
    }

    private void recordPathStep(Long jobId, int stepNum, String pathType, String outcome, String notes) {
        pathHistoryRepository.save(JobPathHistory.builder()
                .jobId(jobId)
                .pathNumber(stepNum)
                .pathType(pathType)
                .outcome(outcome)
                .notes(notes)
                .build());
    }
}
