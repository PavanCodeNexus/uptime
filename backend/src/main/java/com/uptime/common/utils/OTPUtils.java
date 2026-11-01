package com.uptime.common.utils;

import java.security.SecureRandom;

public final class OTPUtils {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private OTPUtils() {}

    public static String generateSixDigitOtp() {
        int code = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(code);
    }
}
