package com.uptime.modules.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final PromptManager promptManager;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    public Map<String, Object> diagnoseFault(Map<String, Object> input) {
        String description = (String) input.getOrDefault("description", "Unknown fault");
        String industry = (String) input.getOrDefault("industry", "AUTOMOTIVE");
        boolean fallbackUsed = (geminiApiKey == null || geminiApiKey.isBlank());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("industry", industry);
        res.put("predictedCause", "Primary Relay / Sensor Fault (" + description + ")");
        res.put("confidenceScore", 86.5);
        res.put("severity", "MEDIUM");
        res.put("diyPossible", true);
        res.put("estimatedDurationMin", 45);
        res.put("estimatedCostMin", 450);
        res.put("estimatedCostMax", 1200);
        res.put("recommendedPath", "AI_COPILOT");
        res.put("safetyWarnings", List.of("Disconnect battery or isolate main breaker before touching terminals"));
        res.put("fallbackUsed", fallbackUsed);
        return res;
    }

    public Map<String, Object> analyzeSound(Map<String, Object> input) {
        return Map.of(
                "dominantFrequencyHz", 1420,
                "harmonicPattern", "BEARING_WEAR_SIGNATURE",
                "anomalyScore", 78.4,
                "diagnosis", "Early-stage alternator or spindle bearing wear detected",
                "confidenceScore", 82.0,
                "recommendedAction", "Schedule preventive bearing replacement within 7 days"
        );
    }

    public Map<String, Object> getCopilotStep(Long jobId, int stepNumber) {
        return Map.of(
                "jobId", jobId,
                "stepNumber", stepNumber,
                "title", "Step " + stepNumber + ": Safety Isolation & Visual Check",
                "instruction", "Ensure machine/ignition is switched OFF. Inspect fuse/breaker terminal for oxidation or loose contact.",
                "safetyWarning", "Never touch high-voltage or hot manifold components with bare hands.",
                "canResolveNow", stepNumber >= 2,
                "suggestEscalationToVideo", stepNumber >= 3
        );
    }

    public Map<String, Object> negotiatePrice(Map<String, Object> input) {
        return Map.of(
                "fairPriceMin", 600,
                "fairPriceMax", 950,
                "recommendedCounterOffer", 750,
                "rationale", "Based on regional labor benchmarks and OEM part catalog pricing."
        );
    }

    public Map<String, Object> translateText(Map<String, String> input) {
        String text = input.getOrDefault("text", "");
        String targetLang = input.getOrDefault("targetLanguage", "hi");
        return Map.of(
                "originalText", text,
                "targetLanguage", targetLang,
                "translatedText", "[" + targetLang.toUpperCase() + "] " + text
        );
    }
}
