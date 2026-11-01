package com.uptime.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressCreateRequest {
    @NotBlank
    private String label;
    @NotBlank
    private String addressLine1;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private String pincode;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    private Boolean isDefault = false;
}
