package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.TechnicianIdentityVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicianIdentityVerificationRepository extends JpaRepository<TechnicianIdentityVerification, Long> {
    Optional<TechnicianIdentityVerification> findByTechnicianId(Long technicianId);
}
