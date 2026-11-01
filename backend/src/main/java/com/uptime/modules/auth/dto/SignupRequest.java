package com.uptime.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank
    private String phone;
    @NotBlank
    private String otp;
    @NotBlank
    private String fullName;
    private String email;
    private String userType = "OWNER";
    private String industryPreference = "INDUSTRIAL";
    private LocalDate dateOfBirth;
}
