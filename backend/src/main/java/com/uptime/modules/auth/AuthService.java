package com.uptime.modules.auth;

import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.UnauthorizedException;
import com.uptime.common.exceptions.ValidationException;
import com.uptime.common.utils.DateUtils;
import com.uptime.common.utils.PhoneUtils;
import com.uptime.modules.auth.dto.*;
import com.uptime.modules.technician.entity.Technician;
import com.uptime.modules.technician.repository.TechnicianRepository;
import com.uptime.modules.user.User;
import com.uptime.modules.user.UserRepository;
import com.uptime.modules.user.UserService;
import com.uptime.modules.user.dto.UserDTO;
import com.uptime.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OTPService otpService;
    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final JwtTokenProvider jwtTokenProvider;

    private final Map<String, Long> refreshTokenStore = new ConcurrentHashMap<>();

    public void sendOtp(OTPRequest req) {
        otpService.sendOTP(req.getPhone(), req.getPurpose());
    }

    @Transactional
    public AuthResponse verifyOtp(OTPVerifyRequest req) {
        String phone = PhoneUtils.normalizePhone(req.getPhone());
        otpService.verifyOTP(phone, req.getOtp());

        boolean isNew = false;
        User user = userRepository.findByPhone(phone).orElse(null);
        if (user == null) {
            isNew = true;
            String role = req.getUserType() != null ? req.getUserType().toUpperCase() : "OWNER";
            user = User.builder()
                    .fullName("UPTIME User " + phone.substring(phone.length() - 4))
                    .phone(phone)
                    .phoneVerified(true)
                    .userType(role)
                    .industryPreference("INDUSTRIAL")
                    .referralCode("UPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .lastLoginAt(Instant.now())
                    .build();
            if (user == null) {
                throw new IllegalStateException("Failed to construct user");
            }
            user = userRepository.save(user);

            if ("TECHNICIAN".equals(role)) {
                ensureTechnicianRecord(user);
            }
        } else {
            user.setPhoneVerified(true);
            user.setLastLoginAt(Instant.now());
            user = userRepository.save(user);
        }

        return issueTokens(user, isNew);
    }

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (req.getDateOfBirth() != null && !DateUtils.isAdult(req.getDateOfBirth())) {
            throw new ValidationException(ErrorCodes.KYC_UNDERAGE, "User must be 18 years or older");
        }
        String phone = PhoneUtils.normalizePhone(req.getPhone());
        otpService.verifyOTP(phone, req.getOtp());

        String role = req.getUserType() != null ? req.getUserType().toUpperCase() : "OWNER";
        User user = userRepository.findByPhone(phone).orElseGet(User::new);
        user.setPhone(phone);
        user.setFullName(req.getFullName().trim());
        user.setEmail(req.getEmail());
        user.setPhoneVerified(true);
        user.setUserType(role);
        user.setIndustryPreference(req.getIndustryPreference() != null ? req.getIndustryPreference() : "INDUSTRIAL");
        user.setDateOfBirth(req.getDateOfBirth());
        if (user.getReferralCode() == null) {
            user.setReferralCode("UPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        user.setLastLoginAt(Instant.now());
        user = userRepository.save(user);

        if ("TECHNICIAN".equals(role)) {
            ensureTechnicianRecord(user);
        }

        return issueTokens(user, true);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest req) {
        Long userId = refreshTokenStore.remove(req.getRefreshToken());
        if (userId == null) {
            throw new UnauthorizedException(ErrorCodes.AUTH_INVALID_TOKEN, "Invalid or expired refresh token");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException(ErrorCodes.AUTH_INVALID_TOKEN, "User not found"));
        return issueTokens(user, false);
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            refreshTokenStore.remove(refreshToken);
        }
    }

    @Transactional(readOnly = true)
    public UserDTO getMe(Long userId) {
        if (userId == null) {
            throw new UnauthorizedException(ErrorCodes.AUTH_INVALID_TOKEN, "User not authenticated");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException(ErrorCodes.AUTH_INVALID_TOKEN, "User not found"));
        return UserService.toDTO(user);
    }

    private void ensureTechnicianRecord(User user) {
        if (technicianRepository.findByUserId(user.getId()).isEmpty()) {
            Technician tech = Technician.builder()
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .phone(user.getPhone())
                    .industryType(user.getIndustryPreference() != null ? user.getIndustryPreference() : "INDUSTRIAL")
                    .verificationLevel(0)
                    .kycStatus("NOT_STARTED")
                    .verificationStatus("PENDING")
                    .isOnline(false)
                    .isAvailable(false)
                    .isFatigueRestricted(false)
                    .build();
            if (tech != null) {
                technicianRepository.save(tech);
            }
        }
    }

    private AuthResponse issueTokens(User user, boolean isNew) {
        String accessToken = jwtTokenProvider.generateConsumerAccessToken(
                user.getId(), user.getUserType(), user.getIndustryPreference());
        String refreshToken = UUID.randomUUID().toString();
        refreshTokenStore.put(refreshToken, user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400)
                .isNewUser(isNew)
                .user(UserService.toDTO(user))
                .build();
    }
}
