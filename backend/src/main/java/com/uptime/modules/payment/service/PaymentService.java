package com.uptime.modules.payment.service;

import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.common.utils.InvoiceNumberUtils;
import com.uptime.modules.payment.entity.Invoice;
import com.uptime.modules.payment.entity.Payment;
import com.uptime.modules.payment.repository.InvoiceRepository;
import com.uptime.modules.payment.repository.PaymentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    @Value("${uptime.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${uptime.razorpay.key-secret:}")
    private String razorpayKeySecret;

    private volatile HttpClient httpClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final GSTService gstService;

    @Transactional
    public Payment createOrder(Long payerId, Long jobId, BigDecimal amount) {
        String orderId = "order_test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        String txnNum = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Payment payment = Payment.builder()
                .transactionNumber(txnNum)
                .jobId(jobId)
                .payerId(payerId)
                .razorpayOrderId(orderId)
                .amount(amount)
                .currency("INR")
                .status("CREATED")
                .build();
        if (payment == null) {
            throw new IllegalStateException("Failed to build payment");
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment verifyPayment(String razorpayOrderId, String razorpayPaymentId, String signature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCodes.PAYMENT_FAILED, "Order not found: " + razorpayOrderId));
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus("ESCROW_HELD");
        return paymentRepository.save(payment);
    }

    @Transactional
    public Invoice getOrCreateInvoice(Long jobId, Long ownerId, Long techId, BigDecimal subtotal) {
        return invoiceRepository.findByJobId(jobId).orElseGet(() -> {
            Map<String, BigDecimal> gst = gstService.calculateGstBreakdown(subtotal, true);
            Invoice inv = Invoice.builder()
                    .invoiceNumber(InvoiceNumberUtils.nextInvoiceNumber())
                    .jobId(jobId)
                    .ownerId(ownerId)
                    .technicianId(techId)
                    .subtotal(gst.get("subtotal"))
                    .totalGst(gst.get("totalGst"))
                    .grandTotal(gst.get("grandTotal"))
                    .build();
            if (inv == null) {
                throw new IllegalStateException("Failed to build invoice");
            }
            return invoiceRepository.save(inv);
        });
    }
}
