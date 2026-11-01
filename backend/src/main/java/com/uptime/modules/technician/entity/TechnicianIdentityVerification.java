package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "technician_identity_verifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianIdentityVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technician_id", nullable = false, unique = true)
    private Long technicianId;

    @Column(name = "kyc_provider", nullable = false, length = 30)
    @Builder.Default
    private String kycProvider = "DIGILOCKER";

    @Column(name = "provider_reference_id", length = 100)
    private String providerReferenceId;

    @Column(name = "aadhaar_last4", length = 4)
    private String aadhaarLast4;

    @Column(name = "aadhaar_name", length = 120)
    private String aadhaarName;

    @Column(name = "aadhaar_dob")
    private LocalDate aadhaarDob;

    @Column(name = "pan_masked", length = 10)
    private String panMasked;

    @Column(name = "pan_name_match_score", precision = 5, scale = 2)
    private BigDecimal panNameMatchScore;

    @Column(name = "selfie_storage_ref")
    private String selfieStorageRef;

    @Column(name = "liveness_score", precision = 5, scale = 2)
    private BigDecimal livenessScore;

    @Column(name = "face_match_score", precision = 5, scale = 2)
    private BigDecimal faceMatchScore;

    @Column(name = "upi_penny_drop_verified", nullable = false)
    @Builder.Default
    private Boolean upiPennyDropVerified = false;

    @Column(name = "account_holder_name", length = 120)
    private String accountHolderName;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
