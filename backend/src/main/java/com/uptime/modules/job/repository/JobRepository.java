package com.uptime.modules.job.repository;

import com.uptime.modules.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Job> findByTechnicianIdOrderByCreatedAtDesc(Long technicianId);
}
