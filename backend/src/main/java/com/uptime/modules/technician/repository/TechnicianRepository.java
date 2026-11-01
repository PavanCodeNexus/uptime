package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    Optional<Technician> findByUserId(Long userId);

    /**
     * Strict query-level exclusion of fatigued technicians (isFatigueRestricted = false)
     * and unverified technicians (verificationLevel >= 2).
     */
    @Query("SELECT t FROM Technician t WHERE t.isOnline = true AND t.isAvailable = true " +
           "AND t.isOnJob = false AND t.isFatigueRestricted = false AND t.verificationLevel >= 2")
    List<Technician> findAvailableEligibleTechnicians();
}
