package com.uptime.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    @Size(min = 2, max = 100)
    private String fullName;

    @Email
    private String email;

    private LocalDate dateOfBirth;
    private String gender;
    private String industryPreference;
}
