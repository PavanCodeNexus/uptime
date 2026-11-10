package com.uptime.modules.rating.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/ratings")
public class RatingController {

    private final Map<Long, Map<String, Object>> blindRatingsStore = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createRating(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "overallRating", body.getOrDefault("overallRating", 5),
                "status", "RECORDED"
        )));
    }

    @PostMapping("/blind")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitBlindMutualRating(
            @RequestBody Map<String, Object> body) {
        long jobId = ((Number) body.getOrDefault("jobId", 901L)).longValue();
        String submittedByRole = String.valueOf(body.getOrDefault("role", "TECHNICIAN")).toUpperCase();
        int stars = ((Number) body.getOrDefault("stars", 5)).intValue();
        Object safetyTags = body.getOrDefault("siteSafetyTags",
                List.of("Clean work area", "Proper 415V LOTO switch", "Fast gate pass"));

        Map<String, Object> current = new ConcurrentHashMap<>(
                blindRatingsStore.getOrDefault(jobId, Map.of(
                        "jobId", jobId,
                        "ownerSubmitted", false,
                        "techSubmitted", false,
                        "isRevealed", false
                ))
        );

        if ("OWNER".equals(submittedByRole)) {
            current.put("ownerSubmitted", true);
            current.put("ownerStars", stars);
            current.put("ownerSubmittedAt", Instant.now().toString());
        } else {
            current.put("techSubmitted", true);
            current.put("techStars", stars);
            current.put("siteSafetyTags", safetyTags);
            current.put("techSubmittedAt", Instant.now().toString());
        }

        boolean bothSubmitted = Boolean.TRUE.equals(current.get("ownerSubmitted"))
                && Boolean.TRUE.equals(current.get("techSubmitted"));
        current.put("isRevealed", bothSubmitted);
        if (bothSubmitted) {
            current.put("revealedAt", Instant.now().toString());
        }
        blindRatingsStore.put(jobId, current);

        return ResponseEntity.ok(ApiResponse.success(current,
                bothSubmitted
                        ? "Both blind ratings submitted — ratings are now mutually revealed!"
                        : "Blind rating sealed in escrow vault until counterparty submits (CORE-07)."));
    }

    @GetMapping("/job/{jobId}/blind-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBlindRatingStatus(@PathVariable Long jobId) {
        Map<String, Object> state = blindRatingsStore.getOrDefault(jobId, Map.of(
                "jobId", jobId,
                "ownerSubmitted", true,
                "techSubmitted", true,
                "isRevealed", true,
                "ownerStars", 5,
                "techStars", 5,
                "siteSafetyTags", List.of("Clean work area", "Proper 415V LOTO switch", "Fast gate pass")
        ));
        return ResponseEntity.ok(ApiResponse.success(state));
    }

    @GetMapping("/technician/{id}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTechnicianRatings(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("technicianId", id, "overallRating", 5, "reviewText", "Fast diagnosis and transparent repair.")
        )));
    }
}
