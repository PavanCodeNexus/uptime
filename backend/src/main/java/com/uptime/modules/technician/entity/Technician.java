package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "technicians")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "industry_type", length = 20)
    @Builder.Default
    private String industryType = "AUTOMOTIVE";

    @Column(name = "kyc_status", nullable = false, length = 30)
    @Builder.Default
    private String kycStatus = "NOT_STARTED";

    @Column(name = "verification_status", nullable = false, length = 30)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Column(name = "verification_level", nullable = false)
    @Builder.Default
    private Integer verificationLevel = 0;

    @Column(name = "is_provisional", nullable = false)
    @Builder.Default
    private Boolean isProvisional = false;

    @Column(name = "provisional_completed_jobs", nullable = false)
    @Builder.Default
    private Integer provisionalCompletedJobs = 0;

    @Column(name = "provisional_expires_at")
    private Instant provisionalExpiresAt;

    @Column(name = "kyc_rejection_reason")
    private String kycRejectionReason;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "experience_years", nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    @Column(name = "bio")
    private String bio;

    @Column(name = "service_radius_km", nullable = false)
    @Builder.Default
    private Integer serviceRadiusKm = 15;

    @Column(name = "current_lat", precision = 10, scale = 8)
    private BigDecimal currentLat;

    @Column(name = "current_lng", precision = 11, scale = 8)
    private BigDecimal currentLng;

    @Column(name = "location_updated_at")
    private Instant locationUpdatedAt;

    @Column(name = "is_online", nullable = false)
    @Builder.Default
    private Boolean isOnline = false;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = false;

    @Column(name = "is_on_job", nullable = false)
    @Builder.Default
    private Boolean isOnJob = false;

    @Column(name = "rating_avg", nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal ratingAvg = new BigDecimal("5.00");

    @Column(name = "rating_count", nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    @Column(name = "jobs_completed", nullable = false)
    @Builder.Default
    private Integer jobsCompleted = 0;

    @Column(name = "response_time_avg_sec", nullable = false)
    @Builder.Default
    private Integer responseTimeAvgSec = 30;

    @Column(name = "fatigue_score", nullable = false)
    @Builder.Default
    private Integer fatigueScore = 0;

    @Column(name = "consecutive_jobs_count", nullable = false)
    @Builder.Default
    private Integer consecutiveJobsCount = 0;

    @Column(name = "hours_worked_today", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal hoursWorkedToday = BigDecimal.ZERO;

    @Column(name = "is_fatigue_restricted", nullable = false)
    @Builder.Default
    private Boolean isFatigueRestricted = false;

    @Column(name = "fatigue_reset_at")
    private Instant fatigueResetAt;

    @Column(name = "wallet_balance", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal walletBalance = BigDecimal.ZERO;

    @Column(name = "total_earned", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal totalEarned = BigDecimal.ZERO;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 15)
    private String emergencyContactPhone;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
