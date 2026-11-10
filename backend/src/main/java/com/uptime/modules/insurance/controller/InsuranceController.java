package com.uptime.modules.insurance.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/insurance")
public class InsuranceController {

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("planType", "BASIC", "monthlyPremiumInr", 99, "coverageAmountInr", 5000),
                Map.of("planType", "STANDARD", "monthlyPremiumInr", 199, "coverageAmountInr", 15000),
                Map.of("planType", "PRO", "monthlyPremiumInr", 499, "coverageAmountInr", 50000),
                Map.of("planType", "UPTIME_PRO_PASS", "monthlyPremiumInr", 999, "coverageAmountInr", 150000,
                        "benefits", "Zero visit fee, 15-min priority SLA, 2 free preventive audits/yr (S40)")
        )));
    }

    @PostMapping("/claims")
    public ResponseEntity<ApiResponse<Map<String, Object>>> fileEquipmentClaim(
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "claimNumber", "CLM-2026-00419",
                "assetName", body.getOrDefault("assetName", "CNC Haas VF-2 Spindle"),
                "claimedAmountInr", body.getOrDefault("claimedAmountInr", 18500),
                "sha256TamperProofVerified", true,
                "status", "UNDER_SURVEYOR_REVIEW",
                "submittedAt", Instant.now().toString()
        ), "Insurance claim filed with SHA-256 tamper-proof repair log (S32)"));
    }

    @GetMapping("/warranty-revisits")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listWarrantyRevisits() {
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of(
                        "claimNumber", "WR-2026-019",
                        "originalJobNumber", "UPT-2026-00842",
                        "equipmentSummary", "Mazak VMC Spindle Bearing Assembly",
                        "handoverNoiseDb", 62.0,
                        "callbackClaimNoiseDb", 78.0,
                        "handoverSha256Hash", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                        "zeroPenaltyApplied", true,
                        "status", "OPEN"
                )
        )));
    }

    @PostMapping("/warranty-revisits/{claimNumber}/schedule")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scheduleWarrantyRevisit(
            @PathVariable String claimNumber,
            @RequestBody(required = false) Map<String, Object> body) {
        String slot = body != null && body.containsKey("slot")
                ? String.valueOf(body.get("slot"))
                : "Today 16:30 IST";
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "claimNumber", claimNumber,
                "status", "REVISIT_SCHEDULED",
                "scheduledSlot", slot,
                "zeroPenaltyApplied", true
        ), "Priority 30-day warranty revisit scheduled with zero rating penalty (T40)"));
    }
}
