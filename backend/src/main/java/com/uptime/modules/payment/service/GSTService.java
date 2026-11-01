package com.uptime.modules.payment.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class GSTService {

    private static final BigDecimal CGST_RATE = new BigDecimal("0.09");
    private static final BigDecimal SGST_RATE = new BigDecimal("0.09");
    private static final BigDecimal IGST_RATE = new BigDecimal("0.18");

    public Map<String, BigDecimal> calculateGstBreakdown(BigDecimal subtotal, boolean intraState) {
        BigDecimal cleanSubtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        if (intraState) {
            BigDecimal cgst = cleanSubtotal.multiply(CGST_RATE).setScale(2, RoundingMode.HALF_UP);
            BigDecimal sgst = cleanSubtotal.multiply(SGST_RATE).setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalGst = cgst.add(sgst);
            return Map.of(
                    "subtotal", cleanSubtotal,
                    "cgst", cgst,
                    "sgst", sgst,
                    "igst", BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    "totalGst", totalGst,
                    "grandTotal", cleanSubtotal.add(totalGst)
            );
        } else {
            BigDecimal igst = cleanSubtotal.multiply(IGST_RATE).setScale(2, RoundingMode.HALF_UP);
            return Map.of(
                    "subtotal", cleanSubtotal,
                    "cgst", BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    "sgst", BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP),
                    "igst", igst,
                    "totalGst", igst,
                    "grandTotal", cleanSubtotal.add(igst)
            );
        }
    }
}
