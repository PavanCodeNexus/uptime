package com.uptime;

import com.uptime.modules.payment.service.GSTService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GSTServiceTest {

    private final GSTService gstService = new GSTService();

    @Test
    void shouldCalculateIntraStateCgstAndSgst() {
        Map<String, BigDecimal> res = gstService.calculateGstBreakdown(new BigDecimal("1000.00"), true);
        assertEquals(new BigDecimal("90.00"), res.get("cgst"));
        assertEquals(new BigDecimal("90.00"), res.get("sgst"));
        assertEquals(new BigDecimal("0.00"), res.get("igst"));
        assertEquals(new BigDecimal("180.00"), res.get("totalGst"));
        assertEquals(new BigDecimal("1180.00"), res.get("grandTotal"));
    }

    @Test
    void shouldCalculateInterStateIgst() {
        Map<String, BigDecimal> res = gstService.calculateGstBreakdown(new BigDecimal("1000.00"), false);
        assertEquals(new BigDecimal("0.00"), res.get("cgst"));
        assertEquals(new BigDecimal("0.00"), res.get("sgst"));
        assertEquals(new BigDecimal("180.00"), res.get("igst"));
        assertEquals(new BigDecimal("180.00"), res.get("totalGst"));
        assertEquals(new BigDecimal("1180.00"), res.get("grandTotal"));
    }
}
