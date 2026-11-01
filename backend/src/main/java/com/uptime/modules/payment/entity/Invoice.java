package com.uptime.modules.payment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 30)
    private String invoiceNumber;

    @Column(name = "job_id")
    private Long jobId;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(name = "technician_id")
    private Long technicianId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "gst_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalGst;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal grandTotal;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant issuedAt;
}
