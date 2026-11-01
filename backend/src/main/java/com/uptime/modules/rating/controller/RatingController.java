package com.uptime.modules.rating.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ratings")
public class RatingController {

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createRating(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "overallRating", body.getOrDefault("overallRating", 5),
                "status", "RECORDED"
        )));
    }

    @GetMapping("/technician/{id}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTechnicianRatings(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("technicianId", id, "overallRating", 5, "reviewText", "Fast diagnosis and transparent repair.")
        )));
    }
}
