package com.uptime.modules.technician.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "technician_skill_tests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianSkillTestAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technician_id", nullable = false)
    private Long technicianId;

    @Column(name = "trade_code", nullable = false, length = 60)
    private String tradeCode;

    @Column(name = "attempt_no", nullable = false)
    @Builder.Default
    private Integer attemptNumber = 1;

    @Column(name = "questions", nullable = false, columnDefinition = "TEXT")
    private String questionsJson;

    @Column(name = "answers", columnDefinition = "TEXT")
    private String answersJson;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "safety_questions_correct")
    private Integer safetyQuestionsCorrect;

    @Column(name = "passed", nullable = false)
    @Builder.Default
    private Boolean passed = false;

    @Column(name = "started_at", nullable = false)
    @Builder.Default
    private Instant startedAt = Instant.now();

    @Column(name = "submitted_at")
    private Instant submittedAt;
}
