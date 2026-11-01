package com.uptime.modules.auth;

import com.uptime.common.constants.AppConstants;
import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.BusinessRuleException;
import com.uptime.common.exceptions.UnauthorizedException;
import com.uptime.common.exceptions.ValidationException;
import com.uptime.common.utils.PhoneUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final OtpProvider otpProvider;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Instant> lockouts = new ConcurrentHashMap<>();

    public void sendOTP(String rawPhone, String purpose) {
        String phone = PhoneUtils.normalizePhone(rawPhone);
        if (!PhoneUtils.isValidIndianMobile(phone)) {
            throw new ValidationException(ErrorCodes.VALIDATION_ERROR, "Invalid Indian mobile number format");
        }
        checkLockout(phone);

        String plainOtp = otpProvider.generateAndSendOtp(phone, purpose != null ? purpose : "LOGIN");
        String hash = passwordEncoder.encode(plainOtp);
        otpStore.put(phone, new OtpRecord(hash, 0, Instant.now().plusSeconds(AppConstants.OTP_TTL_SECONDS)));
    }

    public boolean verifyOTP(String rawPhone, String enteredOtp) {
        String phone = PhoneUtils.normalizePhone(rawPhone);
        checkLockout(phone);

        OtpRecord record = otpStore.get(phone);
        if (record == null || Instant.now().isAfter(record.expiresAt())) {
            otpStore.remove(phone);
            throw new UnauthorizedException(ErrorCodes.AUTH_OTP_EXPIRED, "OTP has expired or was not requested");
        }

        if (!passwordEncoder.matches(enteredOtp, record.bcryptHash())) {
            int attempts = record.attempts() + 1;
            if (attempts >= AppConstants.MAX_OTP_ATTEMPTS) {
                otpStore.remove(phone);
                lockouts.put(phone, Instant.now().plusSeconds(AppConstants.ACCOUNT_LOCKOUT_SECONDS));
                throw new BusinessRuleException(
                        ErrorCodes.AUTH_ACCOUNT_LOCKED,
                        "Account locked for 30 minutes due to 3 failed OTP attempts");
            }
            otpStore.put(phone, new OtpRecord(record.bcryptHash(), attempts, record.expiresAt()));
            throw new UnauthorizedException(ErrorCodes.AUTH_INVALID_OTP, "Invalid OTP code");
        }

        // Single-use: delete immediately upon verification
        otpStore.remove(phone);
        return true;
    }

    private void checkLockout(String phone) {
        Instant lockedUntil = lockouts.get(phone);
        if (lockedUntil != null) {
            if (Instant.now().isBefore(lockedUntil)) {
                throw new BusinessRuleException(
                        ErrorCodes.AUTH_ACCOUNT_LOCKED,
                        "Account is temporarily locked. Try again after " + lockedUntil);
            }
            lockouts.remove(phone);
        }
    }

    private record OtpRecord(String bcryptHash, int attempts, Instant expiresAt) {}
}
