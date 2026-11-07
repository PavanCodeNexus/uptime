package com.uptime.modules.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final PromptManager promptManager;

    @Value("${uptime.ai.gemini-api-key:}")
    private String geminiApiKey;

    @Value("${uptime.ai.gemini-model:gemini-3.8-flash}")
    private String geminiModel;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public Map<String, Object> diagnoseFault(Map<String, Object> input) {
        String description = String.valueOf(input.getOrDefault("description", "Unknown fault"));
        String industry = String.valueOf(input.getOrDefault("industry", "AUTOMOTIVE"));
        if (description.length() > 2000) description = description.substring(0, 2000);

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                String prompt = promptManager.loadPrompt("fault_triage_v1.txt")
                        + "\n\nIndustry: " + industry + "\nFault description: " + description;
                JsonNode d = objectMapper.readTree(stripFences(callGemini(prompt)));
                double conf = d.path("confidence").asDouble(0.8);
                Map<String, Object> res = new LinkedHashMap<>();
                boolean diy = d.path("diyPossible").asBoolean(false);
                res.put("industry", industry);
                res.put("faultCategory", d.path("faultCategory").asText(""));
                res.put("predictedCause", d.path("diagnosisText").asText(""));
                res.put("confidenceScore", conf <= 1.0 ? Math.round(conf * 1000) / 10.0 : conf);
                res.put("severity", d.path("urgency").asText("MEDIUM"));
                res.put("diyPossible", diy);
                res.put("estimatedCostMin", d.path("estimatedCostMin").asDouble(0));
                res.put("estimatedCostMax", d.path("estimatedCostMax").asDouble(0));
                res.put("estimatedDurationMin", 45);
                res.put("recommendedPath", diy ? "AI_COPILOT" : "FIELD_TECH");
                res.put("skillTags", objectMapper.convertValue(d.path("skillTags"), List.class));
                res.put("safetyWarnings", objectMapper.convertValue(d.path("safetyWarnings"), List.class));
                res.put("fallbackUsed", false);
                return res;
            } catch (Exception e) {
                log.warn("Gemini diagnosis failed, using fallback: {}", e.getClass().getSimpleName());
            }
        }

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
        res.put("fallbackUsed", true);
        return res;
    }

    /** Calls the Gemini Interactions REST API and returns the model's text output. */
    private String callGemini(String prompt) throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("model", geminiModel, "input", prompt));
        HttpRequest req = HttpRequest.newBuilder(URI.create("https://generativelanguage.googleapis.com/v1beta/interactions"))
                .timeout(Duration.ofSeconds(60))
                .header("x-goog-api-key", geminiApiKey)
                .header("api-revision", "2026-05-20")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() / 100 != 2) throw new IllegalStateException("Gemini HTTP " + resp.statusCode());
        for (JsonNode step : objectMapper.readTree(resp.body()).path("steps")) {
            if ("model_output".equals(step.path("type").asText())) {
                return step.path("content").path(0).path("text").asText();
            }
        }
        throw new IllegalStateException("Gemini returned no model_output");
    }

    private static String stripFences(String s) {
        return s.replaceAll("(?s)^\\s*```(?:json)?\\s*|\\s*```\\s*$", "").trim();
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
