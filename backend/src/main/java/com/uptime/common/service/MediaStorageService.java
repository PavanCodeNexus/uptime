package com.uptime.common.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
public class MediaStorageService {

    @Value("${uptime.media.cloudinary-cloud-name:}")
    private String cloudName;

    @Value("${uptime.media.cloudinary-api-key:}")
    private String apiKey;

    @Value("${uptime.media.cloudinary-api-secret:}")
    private String apiSecret;

    @Value("${uptime.media.upload-dir:./uploads}")
    private String localUploadDir;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Uploads media bytes (photo, document, audio) to Cloudinary.
     * Falls back to local directory storage if Cloudinary fails or is unconfigured.
     */
    public String uploadMedia(byte[] bytes, String fileName, String contentType, String folder) {
        if (bytes == null || bytes.length == 0) {
            throw new IllegalArgumentException("Upload file content cannot be empty");
        }

        if (hasCloudinaryConfig()) {
            try {
                return uploadToCloudinary(bytes, contentType, folder);
            } catch (Exception e) {
                log.warn("Cloudinary upload failed ({}), falling back to local storage: {}", e.getClass().getSimpleName(), e.getMessage());
            }
        }

        return uploadToLocalDisk(bytes, fileName);
    }

    public String uploadMultipart(MultipartFile file, String folder) {
        try {
            return uploadMedia(file.getBytes(), file.getOriginalFilename(), file.getContentType(), folder);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read upload file bytes", e);
        }
    }

    private boolean hasCloudinaryConfig() {
        return cloudName != null && !cloudName.isBlank()
                && apiKey != null && !apiKey.isBlank()
                && apiSecret != null && !apiSecret.isBlank();
    }

    private String uploadToCloudinary(byte[] bytes, String contentType, String folder) throws Exception {
        String base64Data = Base64.getEncoder().encodeToString(bytes);
        String mime = (contentType != null && !contentType.isBlank()) ? contentType : "image/jpeg";
        String dataUri = "data:" + mime + ";base64," + base64Data;
        String timestamp = String.valueOf(Instant.now().getEpochSecond());

        StringBuilder toSign = new StringBuilder();
        if (folder != null && !folder.isBlank()) {
            toSign.append("folder=").append(folder).append("&");
        }
        toSign.append("timestamp=").append(timestamp).append(apiSecret);

        String signature = sha1Hex(toSign.toString());

        StringBuilder form = new StringBuilder();
        form.append("file=").append(URLEncoder.encode(dataUri, StandardCharsets.UTF_8));
        form.append("&api_key=").append(URLEncoder.encode(apiKey, StandardCharsets.UTF_8));
        form.append("&timestamp=").append(timestamp);
        if (folder != null && !folder.isBlank()) {
            form.append("&folder=").append(URLEncoder.encode(folder, StandardCharsets.UTF_8));
        }
        form.append("&signature=").append(signature);

        String endpoint = "https://api.cloudinary.com/v1_1/" + cloudName + "/auto/upload";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(45))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form.toString()))
                .build();

        HttpResponse<String> resp = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() / 100 != 2) {
            throw new RuntimeException("Cloudinary HTTP " + resp.statusCode() + ": " + resp.body());
        }

        JsonNode json = objectMapper.readTree(resp.body());
        if (json.has("secure_url")) {
            return json.get("secure_url").asText();
        } else if (json.has("url")) {
            return json.get("url").asText();
        }
        throw new RuntimeException("Cloudinary response missing url field: " + resp.body());
    }

    private String uploadToLocalDisk(byte[] bytes, String originalFilename) {
        try {
            File dir = new File(localUploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
            } else {
                ext = ".bin";
            }
            String uniqueName = UUID.randomUUID() + ext;
            File dest = new File(dir, uniqueName);
            try (FileOutputStream fos = new FileOutputStream(dest)) {
                fos.write(bytes);
            }
            log.info("Saved file locally to: {}", dest.getAbsolutePath());
            return "/uploads/" + uniqueName;
        } catch (IOException e) {
            throw new RuntimeException("Local file write failed", e);
        }
    }

    private String sha1Hex(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
