package com.uptime.common.enums;

import java.util.Map;
import java.util.Set;

public enum JobStatus {
    POSTED,
    AI_ANALYZED,
    MATCHING,
    ACCEPTED,
    EN_ROUTE,
    ARRIVED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    DISPUTED;

    private static final Map<JobStatus, Set<JobStatus>> VALID_TRANSITIONS = Map.of(
        POSTED, Set.of(AI_ANALYZED, MATCHING, ACCEPTED, CANCELLED),
        AI_ANALYZED, Set.of(MATCHING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED),
        MATCHING, Set.of(ACCEPTED, CANCELLED),
        ACCEPTED, Set.of(EN_ROUTE, CANCELLED),
        EN_ROUTE, Set.of(ARRIVED, CANCELLED),
        ARRIVED, Set.of(IN_PROGRESS, CANCELLED),
        IN_PROGRESS, Set.of(COMPLETED, DISPUTED, CANCELLED),
        DISPUTED, Set.of(COMPLETED, CANCELLED),
        COMPLETED, Set.of(DISPUTED),
        CANCELLED, Set.of()
    );

    public boolean canTransitionTo(JobStatus target) {
        if (this == target) {
            return true;
        }
        return VALID_TRANSITIONS.getOrDefault(this, Set.of()).contains(target);
    }
}
