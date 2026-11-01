package com.uptime.common.constants;

import java.math.BigDecimal;
import java.util.Set;

public final class AppConstants {
    private AppConstants() {}

    public static final String APP_NAME = "UPTIME";
    public static final String TAGLINE = "Downtime ends here.";
    public static final double DEFAULT_MATCHING_RADIUS_KM = 20.0;
    public static final double ARRIVAL_VERIFICATION_RADIUS_METERS = 500.0;
    public static final int OTP_LENGTH = 6;
    public static final int OTP_TTL_SECONDS = 600;
    public static final int MAX_OTP_ATTEMPTS = 3;
    public static final int MAX_ADMIN_LOGIN_ATTEMPTS = 5;
    public static final int ACCOUNT_LOCKOUT_SECONDS = 1800;
    public static final int FATIGUE_MAX_CONSECUTIVE_JOBS = 6;
    public static final double FATIGUE_MAX_DAILY_HOURS = 10.0;
    public static final int FATIGUE_REST_HOURS = 8;
    public static final BigDecimal PROVISIONAL_JOB_CAP_INR = new BigDecimal("3000.00");
    public static final int PROVISIONAL_MAX_DAILY_JOBS = 2;
    public static final BigDecimal DEFAULT_GST_RATE = new BigDecimal("0.18");
    public static final BigDecimal DEFAULT_PLATFORM_COMMISSION_RATE = new BigDecimal("0.12");

    public static final Set<String> REGULATED_TRADES = Set.of(
        "IND_ELECTRICAL_HV",
        "IND_BOILER",
        "AUTO_EV_HV",
        "ELEC_HVAC_FGAS",
        "HT_LT_ELECTRICAL",
        "INDUSTRIAL_BOILER",
        "MEDICAL_GAS_BIOMEDICAL",
        "COMMERCIAL_HVAC_REFRIGERATION"
    );

    public static final Set<String> SEEDED_DEMO_PHONES = Set.of(
        "9876543210",
        "9876543211",
        "9876543212",
        "9876500001",
        "9876500002",
        "9876500003"
    );
}
