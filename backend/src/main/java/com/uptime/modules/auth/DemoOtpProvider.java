package com.uptime.modules.auth;

import com.uptime.common.constants.AppConstants;
import com.uptime.common.utils.OTPUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("demo")
@Slf4j
public class DemoOtpProvider implements OtpProvider {

    @Override
    public String generateAndSendOtp(String phone, String purpose) {
        if (AppConstants.SEEDED_DEMO_PHONES.contains(phone)) {
            log.info("[DEMO SEEDED OTP] Phone={} Purpose={} OTP=123456", phone, purpose);
            return "123456";
        }
        String otp = OTPUtils.generateSixDigitOtp();
        log.info("[DEMO NON-SEEDED OTP] Phone={} Purpose={} Generated random OTP", phone, purpose);
        return otp;
    }
}
