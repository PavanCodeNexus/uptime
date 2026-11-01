package com.uptime.modules.job.repository;

import com.uptime.modules.job.entity.JobChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobChecklistItemRepository extends JpaRepository<JobChecklistItem, Long> {
    List<JobChecklistItem> findByJobIdOrderByStepNumberAsc(Long jobId);
}
