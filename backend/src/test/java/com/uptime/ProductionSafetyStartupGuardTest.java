package com.uptime;

import com.uptime.security.ProductionSafetyStartupGuard;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductionSafetyStartupGuardTest {

    @Test
    void shouldFailStartupWhenMockOtpProviderExistsInProdProfile() {
        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                ProductionSafetyStartupGuard.verifyContext(
                        new String[]{"prod"},
                        new String[]{"mockOtpProvider", "securityConfig"}));
        assertTrue(ex.getMessage().contains("CRITICAL SECURITY GUARD"));
    }

    @Test
    void shouldFailStartupWhenMockIdentityProviderExistsInProdProfile() {
        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                ProductionSafetyStartupGuard.verifyContext(
                        new String[]{"production"},
                        new String[]{"mockIdentityVerificationProvider"}));
        assertTrue(ex.getMessage().contains("CRITICAL SECURITY GUARD"));
    }

    @Test
    void shouldPassStartupInDevProfileWithMockProviders() {
        assertDoesNotThrow(() ->
                ProductionSafetyStartupGuard.verifyContext(
                        new String[]{"dev"},
                        new String[]{"mockOtpProvider", "mockIdentityVerificationProvider"}));
    }
}
