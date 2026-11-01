package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.TechnicianKycAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianKycAuditLogRepository extends JpaRepository<TechnicianKycAuditLog, Long> {
    List<TechnicianKycAuditLog> findByTechnicianIdOrderByCreatedAtDesc(Long technicianId);
}
