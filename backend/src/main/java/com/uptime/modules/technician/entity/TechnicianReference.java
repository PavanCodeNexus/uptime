package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "technician_references")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianReference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technician_id", nullable = false)
    private Long technicianId;

    @Column(name = "trade_code", nullable = false, length = 60)
    private String tradeCode;

    @Column(name = "referee_name", nullable = false, length = 100)
    private String refereeName;

    @Column(name = "referee_phone", nullable = false, length = 15)
    private String refereePhone;

    @Column(name = "referee_role", nullable = false, length = 30)
    private String refereeRole;

    @Column(name = "otp_verified", nullable = false)
    @Builder.Default
    private Boolean otpVerified = false;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
