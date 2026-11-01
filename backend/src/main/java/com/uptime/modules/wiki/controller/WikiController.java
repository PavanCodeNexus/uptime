package com.uptime.modules.wiki.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wiki")
public class WikiController {

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchWiki(
            @RequestParam(required = false, defaultValue = "") String q) {
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("title", "Diagnosing Starter Relay Clicks", "industry", "AUTOMOTIVE", "query", q)
        )));
    }
}
