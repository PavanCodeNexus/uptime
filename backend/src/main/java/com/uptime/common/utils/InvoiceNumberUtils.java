package com.uptime.common.utils;

import java.time.Year;
import java.util.concurrent.atomic.AtomicLong;

public final class InvoiceNumberUtils {
    private static final AtomicLong JOB_COUNTER = new AtomicLong(1000);
    private static final AtomicLong INVOICE_COUNTER = new AtomicLong(5000);

    private InvoiceNumberUtils() {}

    public static String nextJobNumber() {
        return String.format("UPT-%d-%05d", Year.now().getValue(), JOB_COUNTER.incrementAndGet());
    }

    public static String nextInvoiceNumber() {
        return String.format("INV-%d-%05d", Year.now().getValue(), INVOICE_COUNTER.incrementAndGet());
    }
}
