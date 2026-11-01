package com.uptime.common.utils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

public final class HashUtils {
    private HashUtils() {}

    public static String sha256(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Input for SHA-256 cannot be null");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    public static String computeJobTamperProofHash(
            Long jobId,
            Long ownerId,
            Long technicianId,
            BigDecimal finalCost,
            Instant completedAt) {
        String payload = String.format("JOB|%d|OWNER|%d|TECH|%d|COST|%s|COMPLETED|%s",
                jobId,
                ownerId,
                technicianId != null ? technicianId : 0L,
                finalCost != null ? finalCost.toPlainString() : "0.00",
                completedAt != null ? completedAt.toString() : "");
        return sha256(payload);
    }

    public static boolean verifyHash(String payload, String expectedHexHash) {
        if (payload == null || expectedHexHash == null) {
            return false;
        }
        return sha256(payload).equalsIgnoreCase(expectedHexHash);
    }
}
