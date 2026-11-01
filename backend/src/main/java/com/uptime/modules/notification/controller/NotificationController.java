package com.uptime.modules.notification.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listNotifications() {
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(Map.of("id", id, "isRead", true)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markAllRead() {
        return ResponseEntity.ok(ApiResponse.success(Map.of("markedAllRead", true)));
    }
}
