package com.uptime.modules.technician.controller;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.technician.entity.*;
import com.uptime.modules.technician.service.TechnicianService;
import com.uptime.security.CurrentUser;
import com.uptime.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.TECHNICIANS)
@RequiredArgsConstructor
public class TechnicianController {

    private final TechnicianService technicianService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Technician>> getMyProfile(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.getByUserId(currentUser.getId())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Technician>> updateMyProfile(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.updateProfile(currentUser.getId(), updates)));
    }

    @PutMapping("/me/availability")
    public ResponseEntity<ApiResponse<Technician>> updateAvailability(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Boolean> body) {
        boolean isOnline = Boolean.TRUE.equals(body.get("isOnline"));
        boolean isAvailable = Boolean.TRUE.equals(body.get("isAvailable"));
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.updateAvailability(currentUser.getId(), isOnline, isAvailable)));
    }

    @PutMapping("/me/location")
    public ResponseEntity<ApiResponse<Technician>> updateLocation(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, BigDecimal> body) {
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.updateLocation(currentUser.getId(), body.get("lat"), body.get("lng"))));
    }

    @GetMapping("/me/skills")
    public ResponseEntity<ApiResponse<List<TechnicianSkill>>> getSkills(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.getSkills(currentUser.getId())));
    }

    @PostMapping("/me/skills")
    public ResponseEntity<ApiResponse<TechnicianSkill>> addSkill(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.addSkill(currentUser.getId(), body)));
    }

    @DeleteMapping("/me/skills/{id}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteSkill(
            @CurrentUser CustomUserDetails currentUser,
            @PathVariable Long id) {
        technicianService.deleteSkill(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("deleted", true)));
    }

    @PostMapping("/me/documents")
    public ResponseEntity<ApiResponse<TechnicianDocument>> uploadDocument(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        byte[] bytes = body.containsKey("fileBase64") && body.get("fileBase64") != null
                ? Base64.getDecoder().decode(body.get("fileBase64"))
                : new byte[]{0x25, 0x50, 0x44, 0x46}; // %PDF header
        return ResponseEntity.ok(ApiResponse.success(technicianService.uploadDocument(
                currentUser.getId(),
                body.getOrDefault("docType", "ITI_NCVT_CERT"),
                body.get("docNumberMasked"),
                body.get("issuerName"),
                bytes
        )));
    }

    @GetMapping("/me/earnings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEarnings(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.getEarningsSummary(currentUser.getId())));
    }

    @GetMapping("/me/fatigue-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFatigueStatus(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.getFatigueStatus(currentUser.getId())));
    }

    @PostMapping("/me/fatigue/rest-break")
    public ResponseEntity<ApiResponse<Map<String, Object>>> takeRestBreak(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody(required = false) Map<String, Object> body) {
        int mins = (body != null && body.containsKey("durationMinutes"))
                ? ((Number) body.get("durationMinutes")).intValue()
                : 45;
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.recordFatigueRestBreak(currentUser.getId(), mins),
                "45-minute hydration & rest break recorded (T39)"));
    }

    @PutMapping("/me/base-zone")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateBaseZone(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Object> body) {
        BigDecimal lat = new BigDecimal(String.valueOf(body.getOrDefault("lat", "13.0285")));
        BigDecimal lng = new BigDecimal(String.valueOf(body.getOrDefault("lng", "77.5197")));
        String label = String.valueOf(body.getOrDefault("label", "Peenya Industrial Cluster #4"));
        technicianService.updateLocation(currentUser.getId(), lat, lng);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "label", label,
                "lat", lat,
                "lng", lng,
                "status", "BASE_ZONE_UPDATED"
        )));
    }

    @GetMapping("/{id}/public")
    public ResponseEntity<ApiResponse<Technician>> getPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.getById(id)));
    }

    @GetMapping("/me/verification-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVerificationStatus(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.getVerificationStatus(currentUser.getId())));
    }

    @PostMapping("/me/kyc/digilocker/initiate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initiateDigiLocker(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.initiateDigiLocker(currentUser.getId())));
    }

    @PostMapping("/me/kyc/digilocker/callback")
    public ResponseEntity<ApiResponse<TechnicianIdentityVerification>> digiLockerCallback(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.handleDigiLockerCallback(
                currentUser.getId(), body.get("code"), body.get("panNumber"))));
    }

    @PostMapping("/me/kyc/selfie-liveness")
    public ResponseEntity<ApiResponse<TechnicianIdentityVerification>> uploadSelfieLiveness(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody(required = false) Map<String, String> body) {
        byte[] bytes = (body != null && body.containsKey("imageBase64"))
                ? Base64.getDecoder().decode(body.get("imageBase64"))
                : new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0};
        return ResponseEntity.ok(ApiResponse.success(technicianService.uploadSelfieLiveness(currentUser.getId(), bytes)));
    }

    @PostMapping("/me/kyc/upi-penny-drop")
    public ResponseEntity<ApiResponse<TechnicianIdentityVerification>> upiPennyDrop(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.verifyUpiPennyDrop(currentUser.getId(), body.get("upiId"))));
    }

    @PostMapping("/me/skill-verification/select-track")
    public ResponseEntity<ApiResponse<TechnicianTradeVerification>> selectTrack(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.selectTrack(
                currentUser.getId(),
                body.getOrDefault("industry", "AUTOMOTIVE"),
                body.get("tradeCode"),
                body.get("verificationTrack"),
                body.get("licenseNumber"),
                body.get("licenseIssuingState")
        )));
    }

    @PostMapping("/me/skill-verification/test/start")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startSkillTest(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.startSkillTest(currentUser.getId(), body.get("tradeCode"))));
    }

    @PostMapping("/me/skill-verification/test/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitSkillTest(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Object> body) {
        String tradeCode = (String) body.get("tradeCode");
        int totalScore = ((Number) body.getOrDefault("totalScore", 85)).intValue();
        int safetyCorrect = ((Number) body.getOrDefault("safetyQuestionsCorrect", 2)).intValue();
        String answersJson = body.containsKey("answersJson") ? body.get("answersJson").toString() : "[]";
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.submitSkillTest(currentUser.getId(), tradeCode, totalScore, safetyCorrect, answersJson)));
    }

    @PostMapping("/me/skill-verification/video-proof")
    public ResponseEntity<ApiResponse<TechnicianTradeVerification>> uploadVideoProof(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        byte[] bytes = new byte[]{0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70};
        return ResponseEntity.ok(ApiResponse.success(
                technicianService.uploadVideoProof(currentUser.getId(), body.get("tradeCode"), bytes)));
    }

    @PostMapping("/me/skill-verification/references")
    public ResponseEntity<ApiResponse<TechnicianReference>> submitReference(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(technicianService.submitReference(
                currentUser.getId(),
                body.get("tradeCode"),
                body.get("refereeName"),
                body.get("refereePhone"),
                body.get("refereeRole")
        )));
    }
}
