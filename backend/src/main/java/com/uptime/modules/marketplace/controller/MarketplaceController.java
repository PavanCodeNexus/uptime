package com.uptime.modules.marketplace.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class MarketplaceController {

    @GetMapping("/parts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listParts() {
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }

    @GetMapping("/auctions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listAuctions() {
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }
}
