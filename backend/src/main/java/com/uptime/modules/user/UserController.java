package com.uptime.modules.user;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.user.dto.AddressCreateRequest;
import com.uptime.modules.user.dto.UserDTO;
import com.uptime.modules.user.dto.UserUpdateRequest;
import com.uptime.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.USERS)
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile & address management")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get current user profile")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getMe(@CurrentUser Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getMe(userId)));
    }

    @Operation(summary = "Update current user profile")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> updateMe(
            @CurrentUser Long userId,
            @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateMe(userId, request), "Profile updated"));
    }

    @Operation(summary = "Upload user profile photo (with magic-bytes check)")
    @PostMapping("/me/photo")
    public ResponseEntity<ApiResponse<UserDTO>> uploadPhoto(
            @CurrentUser Long userId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success(userService.uploadPhoto(userId, file), "Photo uploaded"));
    }

    @Operation(summary = "Get user addresses")
    @GetMapping("/me/addresses")
    public ResponseEntity<ApiResponse<List<UserAddress>>> getAddresses(@CurrentUser Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAddresses(userId)));
    }

    @Operation(summary = "Add new user address")
    @PostMapping("/me/addresses")
    public ResponseEntity<ApiResponse<UserAddress>> addAddress(
            @CurrentUser Long userId,
            @Valid @RequestBody AddressCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userService.addAddress(userId, request), "Address saved"));
    }
}
