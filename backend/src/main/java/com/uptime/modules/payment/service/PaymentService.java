package com.uptime.modules.payment.service;

import com.uptime.common.constants.ErrorCodes;
import com.uptime.common.exceptions.ResourceNotFoundException;
import com.uptime.common.utils.InvoiceNumberUtils;
import com.uptime.modules.payment.entity.Invoice;
import com.uptime.modules.payment.entity.Payment;
import com.uptime.modules.payment.repository.InvoiceRepository;
import com.uptime.modules.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

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
            return invoiceRepository.save(inv);
        });
    }
}
