package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "technician_skills")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technician_id", nullable = false)
    private Long technicianId;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String industry = "AUTOMOTIVE";

    @Column(name = "skill_category", nullable = false, length = 100)
    private String category;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String proficiency = "INTERMEDIATE";

    @Column(name = "is_certified", nullable = false)
    @Builder.Default
    private Boolean isCertified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
