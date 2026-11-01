package com.uptime.modules.tracking.controller;

import com.uptime.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequiredArgsConstructor
public class TrackingController {

    private final Map<Long, Map<String, Object>> latestJobLocations = new ConcurrentHashMap<>();

    @MessageMapping("/job/{jobId}/location")
    @SendTo("/topic/job/{jobId}/location")
    public Map<String, Object> broadcastLocation(
            @DestinationVariable Long jobId,
            Map<String, Object> payload) {
        Map<String, Object> enriched = Map.of(
                "jobId", jobId,
                "lat", payload.getOrDefault("lat", 17.3850),
                "lng", payload.getOrDefault("lng", 78.4867),
                "etaMinutes", payload.getOrDefault("etaMinutes", 12),
                "timestamp", Instant.now().toString()
        );
        latestJobLocations.put(jobId, enriched);
        return enriched;
    }

    @GetMapping("/api/v1/tracking/{jobId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getJobTracking(@PathVariable Long jobId) {
        Map<String, Object> loc = latestJobLocations.getOrDefault(jobId, Map.of(
                "jobId", jobId,
                "lat", 17.3850,
                "lng", 78.4867,
                "etaMinutes", 10,
                "timestamp", Instant.now().toString()
        ));
        return ResponseEntity.ok(ApiResponse.success(loc));
    }
}
