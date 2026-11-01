package com.uptime.modules.video.controller;

import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.BusinessRuleException;
import com.uptime.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/consultations")
public class VideoConsultationController {

    @Value("${app.features.video-consultation-enabled:false}")
    private boolean videoEnabled;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initiateConsultation() {
        if (!videoEnabled) {
            throw new BusinessRuleException(ErrorCodes.VIDEO_COMING_SOON,
                    "Path 2 Live Video Consultation is Coming Soon in Wave 3. Please use AI Copilot or Direct Technician Booking.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of("status", "WAITING_FOR_TECHNICIAN")));
    }
}
