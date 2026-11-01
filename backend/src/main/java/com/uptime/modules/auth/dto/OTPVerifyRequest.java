package com.uptime.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OTPVerifyRequest {
    @NotBlank
    private String phone;
    @NotBlank
    private String otp;
    private String purpose = "LOGIN";
    private String userType = "OWNER";
}
