package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "technician_trade_verifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianTradeVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technician_id", nullable = false)
    private Long technicianId;

    @Column(nullable = false, length = 20)
    private String industry;

    @Column(name = "trade_code", nullable = false, length = 60)
    private String tradeCode;

    @Column(name = "verification_track", nullable = false, length = 25)
    private String verificationTrack;

    @Column(name = "verification_level", nullable = false, length = 10)
    @Builder.Default
    private String verificationLevel = "L0";

    @Column(name = "is_regulated_trade", nullable = false)
    @Builder.Default
    private Boolean isRegulatedTrade = false;

    @Column(name = "license_number", length = 80)
    private String licenseNumber;

    @Column(name = "license_issuing_state", length = 50)
    private String licenseIssuingState;

    @Column(name = "license_expires_at")
    private LocalDate licenseExpiresAt;

    @Column(name = "mcq_score")
    private Integer mcqScore;

    @Column(name = "mcq_passed", nullable = false)
    @Builder.Default
    private Boolean mcqPassed = false;

    @Column(name = "video_proof_storage_ref")
    private String videoProofStorageRef;

    @Column(name = "video_proof_status", nullable = false, length = 20)
    @Builder.Default
    private String videoProofStatus = "NOT_SUBMITTED";

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
