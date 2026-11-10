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
                Map.of(
                        "code", "FANUC-ALM-108",
                        "title", "CNC Spindle Drive Relay & Harmonic Bearing Wear (4,210 Hz)",
                        "industry", "INDUSTRIAL",
                        "query", q,
                        "lotoRequired", true
                ),
                Map.of(
                        "code", "AUTO-REL-04",
                        "title", "Diagnosing Starter Relay Clicks & 24V Alternator Ripple",
                        "industry", "AUTOMOTIVE",
                        "query", q,
                        "lotoRequired", false
                )
        )));
    }

    @GetMapping("/schematics/{code}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSchematicByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "code", code,
                "title", "415V 3-Phase Spindle Drive Contactor & DC Bus Test Points (S42 / T32)",
                "testPoints", List.of(
                        Map.of("terminal", "L1-L2-L3 Input", "expectedReading", "415V AC ± 5% (0V after LOTO)"),
                        Map.of("terminal", "DC Link Bus (P-N)", "expectedReading", "320V–350V DC (Discharge < 12V before touch)"),
                        Map.of("terminal", "Contactor Coil A1-A2", "expectedReading", "24V DC Control Signal / 42 Ω Coil Resistance")
                ),
                "offlineCached", true
        )));
    }
}
