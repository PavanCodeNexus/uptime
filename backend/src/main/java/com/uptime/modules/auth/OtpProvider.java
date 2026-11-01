package com.uptime.modules.auth;

public interface OtpProvider {
    String generateAndSendOtp(String phone, String purpose);
}
