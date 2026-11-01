package com.uptime;

import com.uptime.common.exceptions.BusinessRuleException;
import com.uptime.modules.admin.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UptimeContextLoadTest {

    @Autowired
    private AdminService adminService;

    @Test
    void contextLoadsAndAdminTwoStepAuthWorks() {
        Map<String, Object> step1 = adminService.loginStep1("admin@uptime.in", "UptimeAdmin@2026");
        assertTrue((Boolean) step1.get("requires2fa"));
        String tempToken = (String) step1.get("temp2faToken");
        assertNotNull(tempToken);

        Map<String, Object> step2 = adminService.verify2faStep2(tempToken, "123456");
        assertNotNull(step2.get("accessToken"));
        assertEquals(1800, step2.get("expiresInSeconds"));
    }

    @Test
    void adminLocksOutAfterFiveFailedLoginAttempts() {
        String testEmail = "lockout-check@uptime.in";
        for (int i = 1; i <= 4; i++) {
            assertThrows(RuntimeException.class, () -> adminService.loginStep1(testEmail, "wrong"));
        }
        BusinessRuleException lockedEx = assertThrows(BusinessRuleException.class,
                () -> adminService.loginStep1(testEmail, "wrong"));
        assertEquals("AUTH_003", lockedEx.getErrorCode());
    }
}
