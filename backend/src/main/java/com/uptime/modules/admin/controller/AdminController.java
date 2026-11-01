package com.uptime.modules.admin.controller;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.admin.service.AdminService;
import com.uptime.modules.technician.entity.Technician;
import com.uptime.modules.technician.entity.TechnicianDocument;
import com.uptime.security.CurrentUser;
import com.uptime.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.ADMIN)
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                adminService.loginStep1(body.get("email"), body.get("password"))));
    }

    @PostMapping("/auth/verify-2fa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verify2fa(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                adminService.verify2faStep2(body.get("temp2faToken"), body.get("totpCode"))));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardMetrics()));
    }

    @GetMapping("/technicians/pending-kyc")
    public ResponseEntity<ApiResponse<List<TechnicianDocument>>> getPendingKyc() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPendingKycDocuments()));
    }

    @GetMapping("/technicians/{id}/documents/{docId}/view-url")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDocumentSignedViewUrl(
            @CurrentUser CustomUserDetails currentUser,
            @PathVariable Long id,
            @PathVariable Long docId) {
        Long actorId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(ApiResponse.success(adminService.generateSignedDocumentViewUrl(actorId, id, docId)));
    }

    @PutMapping("/technicians/{id}/documents/{docId}/review")
    public ResponseEntity<ApiResponse<TechnicianDocument>> reviewDocument(
            @CurrentUser CustomUserDetails currentUser,
            @PathVariable Long id,
            @PathVariable Long docId,
            @RequestBody Map<String, String> body) {
        Long actorId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(ApiResponse.success(adminService.reviewDocument(
                actorId, id, docId,
                body.getOrDefault("status", "VERIFIED"),
                body.get("rejectionReason")
        )));
    }

    @PutMapping("/technicians/{id}/verify")
    public ResponseEntity<ApiResponse<Technician>> verifyTechnician(
            @CurrentUser CustomUserDetails currentUser,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Long actorId = currentUser != null ? currentUser.getId() : 1L;
        int level = ((Number) body.getOrDefault("verificationLevel", 2)).intValue();
        String status = (String) body.getOrDefault("verificationStatus", "VERIFIED");
        String reason = (String) body.get("reason");
        return ResponseEntity.ok(ApiResponse.success(adminService.verifyTechnicianLevel(actorId, id, level, status, reason)));
    }

    @PutMapping("/technicians/{id}/graduate-provisional")
    public ResponseEntity<ApiResponse<Technician>> graduateProvisional(
            @CurrentUser CustomUserDetails currentUser,
            @PathVariable Long id) {
        Long actorId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(ApiResponse.success(adminService.graduateProvisional(actorId, id)));
    }
}
