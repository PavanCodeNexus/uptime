package com.uptime.modules.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.PaymentException;
import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.common.utils.InvoiceNumberUtils;
import com.uptime.modules.payment.entity.Invoice;
import com.uptime.modules.payment.entity.Payment;
import com.uptime.modules.payment.repository.InvoiceRepository;
import com.uptime.modules.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Base64;
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

    @Value("${uptime.razorpay.webhook-secret:}")
    private String razorpayWebhookSecret;

    private volatile HttpClient httpClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final GSTService gstService;

    private HttpClient getHttpClient() {
        if (httpClient == null) {
            synchronized (this) {
                if (httpClient == null) {
                    httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build();
                }
            }
        }
        return httpClient;
    }

    private boolean hasRazorpayCredentials() {
        return razorpayKeyId != null && !razorpayKeyId.isBlank()
                && !razorpayKeyId.equals("rzp_test_uptime_demo")
                && !razorpayKeyId.equals("rzp_test_placeholder")
                && razorpayKeySecret != null && !razorpayKeySecret.isBlank()
                && !razorpayKeySecret.equals("uptime_test_secret_key")
                && !razorpayKeySecret.equals("secret_placeholder");
    }

    @Transactional
    public Payment createOrder(Long payerId, Long jobId, BigDecimal amount) {
        String txnNum = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String orderId = null;

        if (hasRazorpayCredentials()) {
            try {
                long amountPaise = amount.multiply(new BigDecimal("100")).longValueExact();
                String payload = objectMapper.writeValueAsString(Map.of(
                        "amount", amountPaise,
                        "currency", "INR",
                        "receipt", txnNum,
                        "notes", Map.of("jobId", String.valueOf(jobId), "payerId", String.valueOf(payerId))
                ));
                String basicAuth = Base64.getEncoder().encodeToString(
                        (razorpayKeyId + ":" + razorpayKeySecret).getBytes(StandardCharsets.UTF_8));

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.razorpay.com/v1/orders"))
                        .timeout(Duration.ofSeconds(15))
                        .header("Authorization", "Basic " + basicAuth)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(payload))
                        .build();

                HttpResponse<String> resp = getHttpClient().send(req, HttpResponse.BodyHandlers.ofString());
                if (resp.statusCode() / 100 == 2) {
                    JsonNode node = objectMapper.readTree(resp.body());
                    orderId = node.path("id").asText(null);
                } else {
                    log.warn("Razorpay order creation returned HTTP {}: {}", resp.statusCode(), resp.body());
                }
            } catch (Exception e) {
                log.warn("Razorpay API unreachable, falling back to local test order: {}", e.getMessage());
            }
        }

        if (orderId == null || orderId.isBlank()) {
            orderId = "order_test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        }

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

        if (hasRazorpayCredentials() && razorpayOrderId != null && !razorpayOrderId.startsWith("order_test_")) {
            String expected = hmacSha256Hex(razorpayOrderId + "|" + razorpayPaymentId, razorpayKeySecret);
            if (signature == null || !MessageDigest.isEqual(
                    expected.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8))) {
                throw new PaymentException(ErrorCodes.PAYMENT_FAILED, "Invalid Razorpay payment signature");
            }
        }

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus("ESCROW_HELD");
        return paymentRepository.save(payment);
    }

    @Transactional
    public Map<String, Object> handleWebhook(String rawBody, String signatureHeader) {
        boolean hasRealWebhookSecret = razorpayWebhookSecret != null
                && !razorpayWebhookSecret.isBlank()
                && !razorpayWebhookSecret.equals("uptime_webhook_secret")
                && !razorpayWebhookSecret.equals("webhook_secret_placeholder");

        if (hasRealWebhookSecret) {
            String expected = hmacSha256Hex(rawBody, razorpayWebhookSecret);
            if (signatureHeader == null || !MessageDigest.isEqual(
                    expected.getBytes(StandardCharsets.UTF_8),
                    signatureHeader.getBytes(StandardCharsets.UTF_8))) {
                throw new PaymentException(ErrorCodes.PAYMENT_FAILED, "Invalid Razorpay webhook signature");
            }
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String event = root.path("event").asText("");
            JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
            String orderId = paymentEntity.path("order_id").asText(null);
            String paymentId = paymentEntity.path("id").asText(null);

            if (orderId != null && !orderId.isBlank()) {
                paymentRepository.findByRazorpayOrderId(orderId).ifPresent(payment -> {
                    if (paymentId != null && !paymentId.isBlank()) {
                        payment.setRazorpayPaymentId(paymentId);
                    }
                    if ("payment.captured".equals(event) || "order.paid".equals(event)) {
                        payment.setStatus("ESCROW_HELD");
                    } else if ("payment.failed".equals(event)) {
                        payment.setStatus("FAILED");
                    }
                    paymentRepository.save(payment);
                });
            }
            return Map.of("received", true, "event", event);
        } catch (Exception e) {
            log.warn("Failed to parse Razorpay webhook payload: {}", e.getMessage());
            return Map.of("received", false);
        }
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

    private String hmacSha256Hex(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("HMAC-SHA256 calculation failed", e);
        }
    }
}
