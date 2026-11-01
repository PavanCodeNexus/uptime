package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.TechnicianDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianDocumentRepository extends JpaRepository<TechnicianDocument, Long> {
    List<TechnicianDocument> findByTechnicianId(Long technicianId);
    List<TechnicianDocument> findByVerificationStatus(String verificationStatus);
}
