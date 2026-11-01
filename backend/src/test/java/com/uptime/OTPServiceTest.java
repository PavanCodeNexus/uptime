package com.uptime;

import com.uptime.common.utils.FileUtils;
import com.uptime.common.utils.OTPUtils;
import com.uptime.common.utils.PhoneUtils;
import com.uptime.modules.auth.MockOtpProvider;
import com.uptime.modules.auth.OTPService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class OTPServiceTest {

    @Test
    void mockOtpProviderVerifies123456InDev() {
        MockOtpProvider provider = new MockOtpProvider();
        OTPService otpService = new OTPService(provider, new BCryptPasswordEncoder(4));

        otpService.sendOTP("9876543210", "LOGIN");
        assertTrue(otpService.verifyOTP("9876543210", "123456"));
    }

    @Test
    void otpUtilsGeneratesSixDigitString() {
        String otp = OTPUtils.generateSixDigitOtp();
        assertNotNull(otp);
        assertTrue(otp.matches("^\\d{6}$"));
    }

    @Test
    void fileUtilsAndAadhaarGuardValidateStrictly() {
        byte[] validJpeg = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10};
        byte[] validPdf = new byte[]{0x25, 0x50, 0x44, 0x46, 0x2D, 0x31};
        byte[] maliciousExe = new byte[]{0x4D, 0x5A, (byte) 0x90, 0x00};

        assertTrue(FileUtils.isAllowedMagicSignature(validJpeg, validJpeg.length));
        assertTrue(FileUtils.isAllowedMagicSignature(validPdf, validPdf.length));
        assertFalse(FileUtils.isAllowedMagicSignature(maliciousExe, maliciousExe.length));

        assertTrue(PhoneUtils.containsFullAadhaarNumber("1234 5678 9012"));
        assertFalse(PhoneUtils.containsFullAadhaarNumber("XXXX-XXXX-9012"));
    }
}
