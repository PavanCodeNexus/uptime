package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.TechnicianSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianSkillRepository extends JpaRepository<TechnicianSkill, Long> {
    List<TechnicianSkill> findByTechnicianId(Long technicianId);
    List<TechnicianSkill> findByTechnicianIdAndIndustry(Long technicianId, String industry);
}
