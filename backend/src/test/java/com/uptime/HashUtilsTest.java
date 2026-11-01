package com.uptime;

import com.uptime.common.utils.HashUtils;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class HashUtilsTest {

    @Test
    void shouldGenerateDeterministicSha256JobRecordHash() {
        Instant completedAt = Instant.parse("2026-11-01T10:15:30Z");

        String hash1 = HashUtils.computeJobTamperProofHash(
                100L, 200L, 300L, new BigDecimal("1180.00"), completedAt);
        String hash2 = HashUtils.computeJobTamperProofHash(
                100L, 200L, 300L, new BigDecimal("1180.00"), completedAt);
        String tamperedHash = HashUtils.computeJobTamperProofHash(
                100L, 200L, 300L, new BigDecimal("2180.00"), completedAt);

        assertEquals(64, hash1.length());
        assertEquals(hash1, hash2);
        assertNotEquals(hash1, tamperedHash);
    }
}
