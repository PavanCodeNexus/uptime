package com.uptime.modules.job.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "job_parts_used")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPartsUsed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "part_name", nullable = false, length = 200)
    private String partName;

    @Column(name = "part_number", length = 100)
    private String partNumber;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "warranty_months")
    @Builder.Default
    private Integer warrantyMonths = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
