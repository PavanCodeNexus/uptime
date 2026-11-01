package com.uptime.modules.job.repository;

import com.uptime.modules.job.entity.JobPartsUsed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPartsUsedRepository extends JpaRepository<JobPartsUsed, Long> {
    List<JobPartsUsed> findByJobId(Long jobId);
}
