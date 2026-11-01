package com.uptime.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OTPRequest {
    @NotBlank(message = "Phone number is required")
    private String phone;
    private String purpose = "LOGIN";
}
