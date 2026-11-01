package com.uptime.modules.job.repository;

import com.uptime.modules.job.entity.JobDispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobDisputeRepository extends JpaRepository<JobDispute, Long> {
    List<JobDispute> findByStatus(String status);
}
