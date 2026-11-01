package com.uptime.modules.job.repository;

import com.uptime.modules.job.entity.JobPathHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPathHistoryRepository extends JpaRepository<JobPathHistory, Long> {
    List<JobPathHistory> findByJobIdOrderByPathNumberAsc(Long jobId);
}
