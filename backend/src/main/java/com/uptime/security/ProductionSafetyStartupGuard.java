package com.uptime.security;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

/**
 * Fail-fast startup guard mandated by PROJECT_UNDERSTANDING.md and TECHNICIAN_VERIFICATION.md:
 * Refuses to start the application if 'prod' or 'production' profile is active while any
 * Mock OTP or Mock Identity Verification bean is registered.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ProductionSafetyStartupGuard {

    private final Environment environment;
    private final ApplicationContext applicationContext;

    @PostConstruct
    public void verifyProductionSafety() {
        verifyContext(environment.getActiveProfiles(), applicationContext.getBeanDefinitionNames());
    }

    public static void verifyContext(String[] activeProfiles, String[] beanNames) {
        Set<String> profiles = Set.copyOf(Arrays.asList(activeProfiles));
        boolean isProd = profiles.contains("prod") || profiles.contains("production");
        if (!isProd) {
            return;
        }
        for (String beanName : beanNames) {
            String lower = beanName.toLowerCase();
            if (lower.contains("mockotp") || lower.contains("mockidentity")) {
                throw new IllegalStateException(
                        "CRITICAL SECURITY GUARD: Mock provider bean [" + beanName
                                + "] detected while running in production profile! Refusing to start.");
            }
        }
        log.info("Production safety guard passed: no mock OTP or mock identity providers active.");
    }
}
