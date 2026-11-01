package com.uptime.common;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping(ApiRoutes.HEALTH)
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "status", "UP",
                "service", "uptime-backend",
                "tagline", "Downtime ends here.",
                "timestamp", Instant.now().toString()
        )));
    }
}
