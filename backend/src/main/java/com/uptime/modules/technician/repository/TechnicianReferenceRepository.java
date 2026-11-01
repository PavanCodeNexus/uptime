package com.uptime.modules.technician.repository;

import com.uptime.modules.technician.entity.TechnicianReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianReferenceRepository extends JpaRepository<TechnicianReference, Long> {
    List<TechnicianReference> findByTechnicianIdAndTradeCode(Long technicianId, String tradeCode);
}
