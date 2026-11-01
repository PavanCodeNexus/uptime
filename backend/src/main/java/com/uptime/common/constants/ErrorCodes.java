package com.uptime.common.constants;

public final class ErrorCodes {
    private ErrorCodes() {}

    public static final String AUTH_INVALID_OTP = "AUTH_001";
    public static final String AUTH_OTP_EXPIRED = "AUTH_002";
    public static final String AUTH_ACCOUNT_LOCKED = "AUTH_003";
    public static final String AUTH_INVALID_TOKEN = "AUTH_004";
    public static final String AUTH_TOKEN_EXPIRED = "AUTH_005";
    public static final String AUTH_FORBIDDEN = "AUTH_006";
    public static final String AUTH_IP_NOT_ALLOWED = "AUTH_010";

    public static final String TECH_NOT_FOUND = "TECH_001";
    public static final String TECH_FATIGUE_RESTRICTED = "TECH_002";

    public static final String JOB_NOT_FOUND = "JOB_001";
    public static final String JOB_INVALID_TRANSITION = "JOB_004";
    public static final String JOB_ARRIVAL_OTP_INVALID = "JOB_005";
    public static final String JOB_ARRIVAL_GPS_TOO_FAR = "JOB_006";
    public static final String JOB_TAMPER_LOCKED = "JOB_007";

    public static final String KYC_CONSENT_REQUIRED = "KYC_001";
    public static final String KYC_INVALID_AADHAAR_PAYLOAD = "KYC_002";
    public static final String KYC_UNDERAGE = "KYC_003";
    public static final String KYC_DUPLICATE_IDENTITY = "KYC_004";
    public static final String KYC_SIGNED_URL_EXPIRED = "KYC_005";
    public static final String KYC_SKILL_TEST_COOLDOWN = "KYC_006";
    public static final String KYC_LEVEL_INSUFFICIENT = "KYC_007";
    public static final String KYC_REGULATED_TRADE_REQUIRES_TRACK_A = "KYC_008";

    public static final String VALIDATION_ERROR = "VAL_001";
    public static final String MAGIC_BYTES_MISMATCH = "FILE_001";
    public static final String RESOURCE_NOT_FOUND = "RES_001";
    public static final String AI_SERVICE_UNAVAILABLE = "AI_001";
    public static final String VIDEO_COMING_SOON = "VID_001";
    public static final String PAYMENT_FAILED = "PAY_001";
    public static final String SERVER_ERROR = "SERVER_001";
}
