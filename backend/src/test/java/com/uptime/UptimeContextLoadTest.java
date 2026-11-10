package com.uptime;

import com.uptime.common.exceptions.BusinessRuleException;
import com.uptime.modules.admin.service.AdminService;
import com.uptime.modules.insurance.controller.InsuranceController;
import com.uptime.modules.marketplace.controller.MarketplaceController;
import com.uptime.modules.rating.controller.RatingController;
import com.uptime.modules.wiki.controller.WikiController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@org.springframework.test.annotation.DirtiesContext
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("test")
class UptimeContextLoadTest {

    @Autowired
    private AdminService adminService;

    @Autowired
    private RatingController ratingController;

    @Autowired
    private InsuranceController insuranceController;

    @Autowired
    private MarketplaceController marketplaceController;

    @Autowired
    private WikiController wikiController;

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

    @Test
    void blindMutualRatingAndWarrantyAndFitmentEndpointsWork() {
        // 1. Technician submits blind rating (T38) -> sealed until Owner submits
        var techRes = ratingController.submitBlindMutualRating(Map.of(
                "jobId", 901L,
                "role", "TECHNICIAN",
                "stars", 5,
                "siteSafetyTags", List.of("Clean work area", "Proper 415V LOTO switch")
        ));
        assertNotNull(techRes.getBody());
        assertFalse((Boolean) techRes.getBody().getData().get("isRevealed"));

        // 2. Owner submits blind rating (S21) -> both revealed!
        var ownerRes = ratingController.submitBlindMutualRating(Map.of(
                "jobId", 901L,
                "role", "OWNER",
                "stars", 5
        ));
        assertNotNull(ownerRes.getBody());
        assertTrue((Boolean) ownerRes.getBody().getData().get("isRevealed"));

        // 3. Warranty Revisit & FFT Dispute Desk (T40) + Insurance Claim (S32)
        var warrantyRes = insuranceController.listWarrantyRevisits();
        assertNotNull(warrantyRes.getBody());
        assertEquals(1, warrantyRes.getBody().getData().size());

        // 4. Spare Part Fitment Check (S35) & Wiki 415V Schematic (S42 / T32)
        var fitmentRes = marketplaceController.checkPartFitment(Map.of(
                "sku", "SKF-7010-CDGA",
                "assetModel", "CNC Haas VF-2"
        ));
        assertNotNull(fitmentRes.getBody());
        assertTrue((Boolean) fitmentRes.getBody().getData().get("compatible"));

        var schematicRes = wikiController.getSchematicByCode("FANUC-ALM-108");
        assertNotNull(schematicRes.getBody());
        assertEquals("FANUC-ALM-108", schematicRes.getBody().getData().get("code"));
    }
}
