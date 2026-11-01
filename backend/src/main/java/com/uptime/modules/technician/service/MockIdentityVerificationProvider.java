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
@Profile({"dev", "demo", "test"})
public class MockIdentityVerificationProvider implements IdentityVerificationProvider {

    @Override
    public Map<String, Object> initiateDigiLocker(Long technicianId) {
        log.info("[MOCK-KYC] Initiating DigiLocker OAuth for technician {}", technicianId);
        return Map.of(
                "authorizationUrl", "https://digilocker.meripehchaan.gov.in/mock-oauth?state=" + technicianId,
                "providerReferenceId", "MOCK-DL-" + UUID.randomUUID().toString().substring(0, 8),
                "mode", "MOCK"
        );
    }

    @Override
    public Map<String, Object> handleCallback(Long technicianId, String code, String panMasked) {
        log.info("[MOCK-KYC] Handling DigiLocker callback for technician {}", technicianId);
        return Map.of(
                "aadhaarLast4", "4829",
                "aadhaarName", "Verified Technician",
                "aadhaarDob", LocalDate.of(1994, 5, 15).toString(),
                "panMasked", panMasked != null ? panMasked : "ABCDE****F",
                "panNameMatchScore", new BigDecimal("98.50")
        );
    }

    @Override
    public Map<String, Object> verifyLivenessSelfie(Long technicianId, String storageRef) {
        return Map.of(
                "livenessScore", new BigDecimal("96.40"),
                "faceMatchScore", new BigDecimal("94.20"),
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
        return "MOCK";
    }
}
