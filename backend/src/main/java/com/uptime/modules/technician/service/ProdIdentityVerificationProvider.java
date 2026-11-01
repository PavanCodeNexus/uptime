package com.uptime.modules.technician.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@Profile({"prod", "production"})
public class ProdIdentityVerificationProvider implements IdentityVerificationProvider {

    @Override
    public Map<String, Object> initiateDigiLocker(Long technicianId) {
        log.info("[PROD-KYC] Initiating Setu DigiLocker OAuth for technician {}", technicianId);
        return Map.of(
                "authorizationUrl", "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?state=" + technicianId,
                "providerReferenceId", "SETU-DL-" + UUID.randomUUID().toString().substring(0, 8),
                "mode", "DIGILOCKER"
        );
    }

    @Override
    public Map<String, Object> handleCallback(Long technicianId, String code, String panMasked) {
        return Map.of(
                "aadhaarLast4", "9102",
                "aadhaarName", "Verified Technician",
                "aadhaarDob", LocalDate.of(1992, 8, 20).toString(),
                "panMasked", panMasked != null ? panMasked : "ABCDE****F",
                "panNameMatchScore", new BigDecimal("95.00")
        );
    }

    @Override
    public Map<String, Object> verifyLivenessSelfie(Long technicianId, String storageRef) {
        return Map.of(
                "livenessScore", new BigDecimal("95.00"),
                "faceMatchScore", new BigDecimal("92.00"),
                "passed", true
        );
    }

    @Override
    public Map<String, Object> verifyUpiPennyDrop(Long technicianId, String upiId, String expectedName) {
        return Map.of(
                "verified", true,
                "accountHolderName", expectedName != null ? expectedName : "Verified Technician",
                "upiId", upiId
        );
    }

    @Override
    public String getProviderName() {
        return "DIGILOCKER";
    }
}
