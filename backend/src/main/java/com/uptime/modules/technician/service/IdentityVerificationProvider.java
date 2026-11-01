package com.uptime.modules.technician.service;

import java.util.Map;

public interface IdentityVerificationProvider {
    Map<String, Object> initiateDigiLocker(Long technicianId);
    Map<String, Object> handleCallback(Long technicianId, String code, String panMasked);
    Map<String, Object> verifyLivenessSelfie(Long technicianId, String storageRef);
    Map<String, Object> verifyUpiPennyDrop(Long technicianId, String upiId, String expectedName);
    String getProviderName();
}
