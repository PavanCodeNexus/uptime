package com.uptime.modules.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile({"dev", "test"})
@Slf4j
public class MockOtpProvider implements OtpProvider {

    public static final String FIXED_DEV_OTP = "123456";

    @Override
    public String generateAndSendOtp(String phone, String purpose) {
        log.info("[DEV MOCK OTP] Phone={} Purpose={} OTP={}", phone, purpose, FIXED_DEV_OTP);
        return FIXED_DEV_OTP;
    }
}
