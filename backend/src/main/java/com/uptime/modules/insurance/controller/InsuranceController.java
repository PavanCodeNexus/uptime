package com.uptime.modules.insurance.controller;

import com.uptime.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                Map.of("planType", "PRO", "monthlyPremiumInr", 499, "coverageAmountInr", 50000)
        )));
    }
}
