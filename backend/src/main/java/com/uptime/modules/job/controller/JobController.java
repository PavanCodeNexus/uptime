package com.uptime.modules.job.controller;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.job.entity.Job;
import com.uptime.modules.job.entity.JobDispute;
import com.uptime.modules.job.entity.JobPartsUsed;
import com.uptime.modules.job.service.JobService;
import com.uptime.security.CurrentUser;
import com.uptime.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.JOBS)
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createJob(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(jobService.createJob(currentUser.getId(), body)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJob(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Job>>> listMyJobs(@CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(
                jobService.listJobsForUser(currentUser.getId(), currentUser.getRole())));
    }

    @PostMapping("/{id}/choose-path")
    public ResponseEntity<ApiResponse<Job>> choosePath(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(jobService.choosePath(id, body.get("resolutionPath"))));
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<ApiResponse<Job>> escalatePath(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                jobService.escalatePath(id, body.get("targetPath"), body.get("reason"))));
    }

    @GetMapping("/{id}/path-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPathStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getPathStatus(id)));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<Job>> acceptJob(
            @PathVariable Long id,
            @CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(jobService.acceptJob(id, currentUser.getId())));
    }

    @PutMapping("/{id}/enroute")
    public ResponseEntity<ApiResponse<Job>> markEnRoute(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.updateStatus(id, "EN_ROUTE")));
    }

    @PutMapping("/{id}/arrive")
    public ResponseEntity<ApiResponse<Job>> markArrived(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.updateStatus(id, "ARRIVED")));
    }

    @PostMapping("/{id}/otp-verify")
    public ResponseEntity<ApiResponse<Job>> verifyArrivalOtp(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        String otp = (String) body.get("otp");
        double lat = ((Number) body.getOrDefault("lat", 17.3850)).doubleValue();
        double lng = ((Number) body.getOrDefault("lng", 78.4867)).doubleValue();
        return ResponseEntity.ok(ApiResponse.success(jobService.verifyArrivalOtp(id, otp, lat, lng)));
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<ApiResponse<Job>> startJob(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.updateStatus(id, "IN_PROGRESS")));
    }

    @PostMapping("/{id}/parts")
    public ResponseEntity<ApiResponse<JobPartsUsed>> addPart(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(jobService.addPart(id, body)));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Job>> completeJob(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(jobService.completeJob(id, body)));
    }

    @PostMapping("/{id}/dispute")
    public ResponseEntity<ApiResponse<JobDispute>> raiseDispute(
            @PathVariable Long id,
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(jobService.raiseDispute(id, currentUser.getId(), body)));
    }
}
