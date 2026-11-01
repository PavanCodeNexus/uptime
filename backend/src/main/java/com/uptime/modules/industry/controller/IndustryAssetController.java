package com.uptime.modules.industry.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/v1")
public class IndustryAssetController {

    private final Map<Long, Map<String, Object>> assets = new ConcurrentHashMap<>();
    private final AtomicLong assetIdSeq = new AtomicLong(1);

    @GetMapping({"/machines", "/vehicles", "/devices"})
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listAssets() {
        return ResponseEntity.ok(ApiResponse.success(new ArrayList<>(assets.values())));
    }

    @PostMapping({"/machines", "/vehicles", "/devices"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAsset(@RequestBody Map<String, Object> body) {
        Long id = assetIdSeq.getAndIncrement();
        Map<String, Object> record = new HashMap<>(body);
        record.put("id", id);
        record.put("healthScore", 92);
        assets.put(id, record);
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @GetMapping("/twins/{equipmentId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDigitalTwin(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "equipmentId", equipmentId,
                "overallHealthScore", 88,
                "moodState", "THRIVING",
                "predictedNextServiceDays", 42
        )));
    }
}
