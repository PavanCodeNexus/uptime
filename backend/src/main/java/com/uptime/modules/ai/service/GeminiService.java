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
    private volatile HttpClient httpClient;

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
        HttpResponse<String> resp = getHttpClient().send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() / 100 != 2) throw new IllegalStateException("Gemini HTTP " + resp.statusCode());
        for (JsonNode step : objectMapper.readTree(resp.body()).path("steps")) {
            if ("model_output".equals(step.path("type").asText())) {
                return step.path("content").path(0).path("text").asText();
            }
        }
        throw new IllegalStateException("Gemini returned no model_output");
    }

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

    private static String stripFences(String s) {
        return s.replaceAll("(?s)^\\s*```(?:json)?\\s*|\\s*```\\s*$", "").trim();
    }
    public Map<String, Object> analyzeSound(Map<String, Object> input) {
        String description = String.valueOf(input.getOrDefault("description", "Abnormal motor hum and vibration"));
        Object freqObj = input.getOrDefault("dominantFrequencyHz", 1420);
        int dominantHz = (freqObj instanceof Number) ? ((Number) freqObj).intValue() : 1420;

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                String prompt = promptManager.loadPrompt("sound_analysis_v1.txt")
                        + "\n\nDominant Frequency: " + dominantHz + " Hz\nAudio / Spectrogram Observations: " + description;
                JsonNode d = objectMapper.readTree(stripFences(callGemini(prompt)));
                double conf = d.path("confidence").asDouble(0.85);

                Map<String, Object> res = new LinkedHashMap<>();
                res.put("dominantFrequencyHz", dominantHz);
                res.put("faultType", d.path("faultType").asText("Bearing Failure"));
                res.put("harmonicPattern", d.path("frequencyAnomaly").asText("HARMONIC_PEAK_AT_" + dominantHz + "_HZ"));
                res.put("anomalyScore", Math.round(conf * 1000) / 10.0);
                res.put("diagnosis", d.path("description").asText("Acoustic harmonic anomaly detected"));
                res.put("confidenceScore", conf <= 1.0 ? Math.round(conf * 1000) / 10.0 : conf);
                res.put("severity", d.path("severity").asText("MEDIUM"));
                res.put("recommendedAction", d.path("recommendedAction").asText("Inspect bearings and dynamic balance within 7 days"));
                res.put("fallbackUsed", false);
                return res;
            } catch (Exception e) {
                log.warn("Gemini sound analysis failed, using fallback: {}", e.getClass().getSimpleName());
            }
        }

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("dominantFrequencyHz", dominantHz);
        fallback.put("faultType", "Bearing Failure");
        fallback.put("harmonicPattern", "BEARING_WEAR_SIGNATURE");
        fallback.put("anomalyScore", 78.4);
        fallback.put("diagnosis", "Early-stage alternator or spindle bearing wear detected");
        fallback.put("confidenceScore", 82.0);
        fallback.put("severity", "MEDIUM");
        fallback.put("recommendedAction", "Schedule preventive bearing replacement within 7 days");
        fallback.put("fallbackUsed", true);
        return fallback;
    }

    public Map<String, Object> getCopilotStep(Long jobId, int stepNumber) {
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                String prompt = promptManager.loadPrompt("copilot_step_v1.txt")
                        + "\n\nJob ID: " + jobId + "\nCurrent Step Number: " + stepNumber
                        + "\nProvide details specifically for step " + stepNumber + " in a safe diagnostic and repair procedure.";
                JsonNode root = objectMapper.readTree(stripFences(callGemini(prompt)));
                JsonNode step = root.path("steps").isArray() && root.path("steps").size() > 0
                        ? root.path("steps").get(0) : root;

                Map<String, Object> res = new LinkedHashMap<>();
                res.put("jobId", jobId);
                res.put("stepNumber", stepNumber);
                res.put("title", step.path("title").asText("Step " + stepNumber + ": Guided Visual & Safety Isolation"));
                res.put("instruction", step.path("instruction").asText("Ensure machine is isolated and inspect connections."));
                res.put("safetyWarning", step.path("safetyWarning").asText("Never touch live electrical terminals or moving parts."));
                res.put("toolNeeded", step.path("toolNeeded").asText("Multimeter, Insulated Hand Tools"));
                res.put("expectedResult", step.path("expectedResult").asText("Zero energy state verified"));
                res.put("canResolveNow", stepNumber >= 2);
                res.put("suggestEscalationToVideo", stepNumber >= 3);
                res.put("fallbackUsed", false);
                return res;
            } catch (Exception e) {
                log.warn("Gemini copilot step failed, using fallback: {}", e.getClass().getSimpleName());
            }
        }

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("jobId", jobId);
        fallback.put("stepNumber", stepNumber);
        fallback.put("title", "Step " + stepNumber + ": Safety Isolation & Visual Check");
        fallback.put("instruction", "Ensure machine/ignition is switched OFF. Inspect fuse/breaker terminal for oxidation or loose contact.");
        fallback.put("safetyWarning", "Never touch high-voltage or hot manifold components with bare hands.");
        fallback.put("toolNeeded", "Multimeter, Insulated Screwdriver");
        fallback.put("expectedResult", "Main breaker OFF and zero voltage confirmed.");
        fallback.put("canResolveNow", stepNumber >= 2);
        fallback.put("suggestEscalationToVideo", stepNumber >= 3);
        fallback.put("fallbackUsed", true);
        return fallback;
    }

    public Map<String, Object> negotiatePrice(Map<String, Object> input) {
        Object quotedObj = input.getOrDefault("quotedPrice", 1800.0);
        double quotedPrice = (quotedObj instanceof Number) ? ((Number) quotedObj).doubleValue() : 1800.0;
        String faultCategory = String.valueOf(input.getOrDefault("faultCategory", "Spindle / Alternator Bearing Replacement"));
        String city = String.valueOf(input.getOrDefault("city", "Bengaluru"));

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                String prompt = promptManager.loadPrompt("negotiation_v1.txt")
                        + "\n\nFault Category: " + faultCategory
                        + "\nTechnician Quoted Price: Rs. " + quotedPrice
                        + "\nLocation / Market: " + city;
                JsonNode d = objectMapper.readTree(stripFences(callGemini(prompt)));

                Map<String, Object> res = new LinkedHashMap<>();
                res.put("quotedPrice", quotedPrice);
                res.put("fairPriceMin", d.path("minFairPrice").asDouble(quotedPrice * 0.75));
                res.put("fairPriceMax", d.path("maxFairPrice").asDouble(quotedPrice * 1.15));
                res.put("recommendedCounterOffer", d.path("suggestedCounterOffer").asDouble(quotedPrice * 0.85));
                res.put("verdict", d.path("verdict").asText("SLIGHTLY_HIGH"));
                res.put("rationale", d.path("marketContext").asText("Based on standard OEM labor and spare part rates in " + city));
                res.put("fallbackUsed", false);
                return res;
            } catch (Exception e) {
                log.warn("Gemini negotiate failed, using fallback: {}", e.getClass().getSimpleName());
            }
        }

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("quotedPrice", quotedPrice);
        fallback.put("fairPriceMin", Math.round(quotedPrice * 0.7));
        fallback.put("fairPriceMax", Math.round(quotedPrice * 1.1));
        fallback.put("recommendedCounterOffer", Math.round(quotedPrice * 0.82));
        fallback.put("verdict", "SLIGHTLY_HIGH");
        fallback.put("rationale", "Based on regional labor benchmarks and OEM part catalog pricing.");
        fallback.put("fallbackUsed", true);
        return fallback;
    }

    public Map<String, Object> translateText(Map<String, String> input) {
        String text = input.getOrDefault("text", "");
        String targetLang = input.getOrDefault("targetLanguage", "hi");

        if (geminiApiKey != null && !geminiApiKey.isBlank() && !text.isBlank()) {
            try {
                String prompt = promptManager.loadPrompt("translation_v1.txt")
                        + "\n\nTarget Language Code: " + targetLang
                        + "\nText to translate:\n" + text;
                JsonNode d = objectMapper.readTree(stripFences(callGemini(prompt)));

                Map<String, Object> res = new LinkedHashMap<>();
                res.put("originalText", text);
                res.put("targetLanguage", targetLang);
                res.put("detectedSourceLanguage", d.path("detectedSourceLanguage").asText("en"));
                res.put("translatedText", d.path("translatedText").asText(text));
                res.put("fallbackUsed", false);
                return res;
            } catch (Exception e) {
                log.warn("Gemini translation failed, using fallback: {}", e.getClass().getSimpleName());
            }
        }

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("originalText", text);
        fallback.put("targetLanguage", targetLang);
        fallback.put("detectedSourceLanguage", "en");
        fallback.put("translatedText", "[" + targetLang.toUpperCase() + "] " + text);
        fallback.put("fallbackUsed", true);
        return fallback;
    }
}