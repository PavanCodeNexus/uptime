package com.uptime.modules.auth;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.auth.dto.*;
import com.uptime.modules.user.dto.UserDTO;
import com.uptime.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.AUTH)
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Consumer OTP Authentication & Session Management")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Send 6-digit OTP to mobile phone")
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@Valid @RequestBody OTPRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("phone", request.getPhone(), "expiresInSeconds", 600),
                "OTP sent successfully"));
    }

    @Operation(summary = "Verify OTP and issue RS256 JWT tokens")
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OTPVerifyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                authService.verifyOtp(request), "OTP verified successfully"));
    }

    @Operation(summary = "Register a new account with OTP verification")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(authService.signup(request), "Signup completed successfully"));
    }

    @Operation(summary = "Rotate refresh token and issue new access token")
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                authService.refreshToken(request), "Token refreshed"));
    }

    @Operation(summary = "Logout and invalidate refresh token")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        authService.logout(request != null ? request.getRefreshToken() : null);
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }

    @Operation(summary = "Get currently authenticated user")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> me(@CurrentUser Long userId) {
        return ResponseEntity.ok(ApiResponse.success(authService.getMe(userId)));
    }
}
