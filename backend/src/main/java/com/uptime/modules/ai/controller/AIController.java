package com.uptime.modules.ai.controller;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.ai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.AI)
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/diagnose")
    public ResponseEntity<ApiResponse<Map<String, Object>>> diagnose(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.diagnoseFault(body)));
    }

    @PostMapping("/sound-analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> soundAnalysis(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.analyzeSound(body)));
    }

    @PostMapping("/copilot/{jobId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startCopilot(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.getCopilotStep(jobId, 1)));
    }

    @PostMapping("/copilot/{jobId}/next")
    public ResponseEntity<ApiResponse<Map<String, Object>>> nextCopilotStep(
            @PathVariable Long jobId,
            @RequestBody(required = false) Map<String, Object> body) {
        int step = (body != null && body.containsKey("stepNumber"))
                ? ((Number) body.get("stepNumber")).intValue() : 2;
        return ResponseEntity.ok(ApiResponse.success(geminiService.getCopilotStep(jobId, step)));
    }

    @PostMapping("/negotiate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> negotiate(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.negotiatePrice(body)));
    }

    @PostMapping("/translate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> translate(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.translateText(body)));
    }
}
