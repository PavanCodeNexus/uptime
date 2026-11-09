package com.uptime.modules.payment.controller;

import com.uptime.common.constants.ApiRoutes;
import com.uptime.common.response.ApiResponse;
import com.uptime.modules.payment.entity.Invoice;
import com.uptime.modules.payment.entity.Payment;
import com.uptime.modules.payment.service.PaymentService;
import com.uptime.security.CurrentUser;
import com.uptime.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.PAYMENTS)
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Payment>> createOrder(
            @CurrentUser CustomUserDetails currentUser,
            @RequestBody Map<String, Object> body) {
        Long jobId = ((Number) body.get("jobId")).longValue();
        BigDecimal amount = new BigDecimal(body.getOrDefault("amount", "1000.00").toString());
        return ResponseEntity.ok(ApiResponse.success(paymentService.createOrder(currentUser.getId(), jobId, amount)));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.verifyPayment(
                body.get("razorpayOrderId"),
                body.getOrDefault("razorpayPaymentId", "pay_test_123"),
                body.getOrDefault("razorpaySignature", "sig_verified")
        )));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleWebhook(
            @RequestBody String rawBody,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.handleWebhook(rawBody, signature)));
    }

    @GetMapping("/invoice/{jobId}")
    public ResponseEntity<ApiResponse<Invoice>> getInvoice(
            @PathVariable Long jobId,
            @CurrentUser CustomUserDetails currentUser) {
        return ResponseEntity.ok(ApiResponse.success(
                paymentService.getOrCreateInvoice(jobId, currentUser.getId(), currentUser.getId(), new BigDecimal("1000.00"))));
    }
}
