package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.TechnicianSkillTestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianSkillTestAttemptRepository extends JpaRepository<TechnicianSkillTestAttempt, Long> {
    List<TechnicianSkillTestAttempt> findByTechnicianIdAndTradeCodeOrderByAttemptNumberDesc(Long technicianId, String tradeCode);
}
