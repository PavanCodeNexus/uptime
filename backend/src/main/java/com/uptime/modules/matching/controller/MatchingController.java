package com.uptime.modules.matching.controller;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.matching.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.MATCHING)
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/jobs/{jobId}/candidates")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCandidates(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(matchingService.findRankedCandidates(jobId)));
    }
}
