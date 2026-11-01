package com.uptime.modules.job.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_number", nullable = false, unique = true, length = 20)
    private String jobNumber;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(name = "technician_id")
    private Long technicianId;

    @Column(nullable = false, length = 20)
    private String industry;

    @Column(name = "equipment_summary", length = 200)
    private String equipmentSummary;

    @Column(name = "fault_description", columnDefinition = "TEXT")
    private String problemDescription;

    @Column(name = "ai_fault_category", length = 100)
    private String problemCategory;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String urgency = "NORMAL";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "CREATED";

    @Column(name = "resolution_path", length = 30)
    @Builder.Default
    private String resolutionPath = "DIRECT_BOOKING";

    @Column(name = "path_chosen_at")
    private Instant pathChosenAt;

    @Column(name = "copilot_attempted", nullable = false)
    @Builder.Default
    private Boolean copilotAttempted = false;

    @Column(name = "video_consult_attempted", nullable = false)
    @Builder.Default
    private Boolean videoConsultAttempted = false;

    @Column(name = "escalated_from_path", length = 20)
    private String escalatedFromPath;

    @Column(name = "escalation_reason", columnDefinition = "TEXT")
    private String escalationReason;

    @Column(name = "video_consult_fee_credited", nullable = false)
    @Builder.Default
    private Boolean videoConsultFeeCredited = false;

    @Column(name = "video_consult_credit_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal videoConsultCreditAmount = BigDecimal.ZERO;

    @Column(name = "estimated_cost_min", precision = 10, scale = 2)
    private BigDecimal aiEstimatedCostMin;

    @Column(name = "estimated_cost_max", precision = 10, scale = 2)
    private BigDecimal aiEstimatedCostMax;

    @Column(name = "owner_lat", nullable = false, precision = 10, scale = 8)
    private BigDecimal ownerLat;

    @Column(name = "owner_lng", nullable = false, precision = 11, scale = 8)
    private BigDecimal ownerLng;

    @Column(name = "owner_address_text", columnDefinition = "TEXT")
    private String ownerAddress;

    @Column(name = "owner_city", length = 100)
    private String ownerCity;

    @Column(name = "accepted_at")
    private Instant acceptedAt;

    @Column(name = "en_route_at")
    private Instant enRouteAt;

    @Column(name = "arrived_at")
    private Instant arrivedAt;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "arrival_otp", length = 255)
    private String arrivalOtp;

    @Column(name = "otp_verified", nullable = false)
    @Builder.Default
    private Boolean otpVerified = false;

    @Column(name = "otp_verified_at")
    private Instant otpVerifiedAt;

    @Column(name = "arrival_gps_lat", precision = 10, scale = 8)
    private BigDecimal arrivalGpsLat;

    @Column(name = "arrival_gps_lng", precision = 11, scale = 8)
    private BigDecimal arrivalGpsLng;

    @Column(name = "labour_cost", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal laborCharge = BigDecimal.ZERO;

    @Column(name = "parts_cost", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal partsCharge = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "gst_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(name = "final_cost", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "tech_notes", columnDefinition = "TEXT")
    private String workDoneSummary;

    @Column(name = "hash_value", length = 64)
    private String recordHash;

    @Column(name = "is_tamper_proof_locked", nullable = false)
    @Builder.Default
    private Boolean isLocked = false;

    @Column(name = "locked_at")
    private Instant lockedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
