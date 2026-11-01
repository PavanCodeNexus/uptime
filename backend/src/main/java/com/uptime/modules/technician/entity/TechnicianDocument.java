package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "technician_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technician_id", nullable = false)
    private Long technicianId;

    @Column(name = "document_type", nullable = false, length = 50)
    private String docType;

    @Column(name = "document_number_masked", length = 50)
    private String docNumberMasked;

    @Column(name = "document_url", nullable = false)
    private String docUrl;

    @Column(name = "storage_ref")
    private String storageRef;

    @Column(name = "issuer", length = 200)
    private String issuerName;

    @Column(name = "file_sha256", length = 64)
    private String fileSha256;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Column(name = "reviewed_by")
    private Long verifiedBy;

    @Column(name = "reviewed_at")
    private Instant verifiedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
