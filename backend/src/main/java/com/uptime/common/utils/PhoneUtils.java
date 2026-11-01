package com.uptime.common.utils;

import java.util.regex.Pattern;

public final class PhoneUtils {
    private static final Pattern INDIAN_MOBILE_PATTERN = Pattern.compile("^[6-9]\\d{9}$");
    private static final Pattern TWELVE_DIGIT_AADHAAR = Pattern.compile("\\b\\d{4}\\s?\\d{4}\\s?\\d{4}\\b");

    private PhoneUtils() {}

    public static String normalizePhone(String raw) {
        if (raw == null) {
            return "";
        }
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() == 12 && digits.startsWith("91")) {
            return digits.substring(2);
        }
        return digits;
    }

    public static boolean isValidIndianMobile(String phone) {
        return INDIAN_MOBILE_PATTERN.matcher(normalizePhone(phone)).matches();
    }

    public static boolean containsFullAadhaarNumber(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return TWELVE_DIGIT_AADHAAR.matcher(text).find();
    }

    public static String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "XXXX";
        }
        return "XXXXXX" + accountNumber.substring(accountNumber.length() - 4);
    }
}
