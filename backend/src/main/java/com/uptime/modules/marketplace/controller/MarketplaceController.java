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
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of(
                        "id", 101,
                        "sku", "SKF-7010-CDGA",
                        "name", "SKF 7010 High-Precision Angular Contact Spindle Bearing",
                        "industry", "INDUSTRIAL",
                        "quality", "OEM",
                        "priceInr", 3450,
                        "gstPercent", 18,
                        "itcEligible", true,
                        "warrantyMonths", 12
                ),
                Map.of(
                        "id", 102,
                        "sku", "SCH-LC1D65A",
                        "name", "Schneider TeSys Deca 415V 3-Phase Contactor Coil",
                        "industry", "INDUSTRIAL",
                        "quality", "OEM",
                        "priceInr", 1280,
                        "gstPercent", 18,
                        "itcEligible", true,
                        "warrantyMonths", 12
                ),
                Map.of(
                        "id", 103,
                        "sku", "BOSCH-CRI2-16",
                        "name", "Bosch Common Rail Piezo Diesel Injector (BS6)",
                        "industry", "AUTOMOBILE",
                        "quality", "REFURBISHED_CERTIFIED",
                        "priceInr", 4200,
                        "gstPercent", 18,
                        "itcEligible", true,
                        "warrantyMonths", 6
                )
        )));
    }

    @PostMapping("/parts/fitment-check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPartFitment(
            @RequestBody Map<String, Object> body) {
        String sku = String.valueOf(body.getOrDefault("sku", "SKF-7010-CDGA"));
        String assetModel = String.valueOf(body.getOrDefault("assetModel", "CNC Haas VF-2"));
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "sku", sku,
                "assetModel", assetModel,
                "compatible", true,
                "fitmentConfidencePercent", 99.4,
                "gstInputTaxCreditPercent", 18,
                "notes", "Direct OEM bore & thermal tolerance match verified against Digital Twin (S35)"
        )));
    }

    @GetMapping("/auctions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listAuctions() {
        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of(
                        "auctionId", 501,
                        "jobNumber", "UPT-2026-00891",
                        "title", "Emergency CNC Haas VF-2 Spindle Line-Down SOS",
                        "location", "Peenya Industrial Area Stage IV, Bengaluru",
                        "basePayoutInr", 1150,
                        "currentSurgeBonusInr", 340,
                        "secondsRemaining", 42,
                        "status", "LIVE_BIDDING"
                )
        )));
    }
}
