package com.uptime.modules.user.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Boolean phoneVerified;
    private String profilePhotoUrl;
    private LocalDate dateOfBirth;
    private String gender;
    private String userType;
    private String industryPreference;
    private Integer greenPointsBalance;
    private BigDecimal carbonCreditsBalance;
    private String referralCode;
    private Instant createdAt;
}
