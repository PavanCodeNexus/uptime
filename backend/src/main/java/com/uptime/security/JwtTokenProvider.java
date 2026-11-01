package com.uptime.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${uptime.jwt.private-key:}")
    private String privateKeyPem;

    @Value("${uptime.jwt.public-key:}")
    private String publicKeyPem;

    @Value("${uptime.jwt.consumer-access-ttl-seconds:86400}")
    private long consumerAccessTtlSeconds;

    @Value("${uptime.jwt.admin-access-ttl-seconds:1800}")
    private long adminAccessTtlSeconds;

    @Value("${uptime.jwt.admin-temp-2fa-ttl-seconds:300}")
    private long adminTemp2faTtlSeconds;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    @PostConstruct
    public void init() {
        try {
            if (privateKeyPem != null && !privateKeyPem.isBlank()
                    && publicKeyPem != null && !publicKeyPem.isBlank()) {
                this.privateKey = parsePrivateKey(privateKeyPem);
                this.publicKey = parsePublicKey(publicKeyPem);
                log.info("Loaded configured RS256 keypair for JWT signing");
            } else {
                KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
                gen.initialize(2048);
                KeyPair pair = gen.generateKeyPair();
                this.privateKey = pair.getPrivate();
                this.publicKey = pair.getPublic();
                log.info("Generated ephemeral 2048-bit RS256 keypair for development/demo JWT signing");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize RS256 JWT keys", e);
        }
    }

    public String generateConsumerAccessToken(Long userId, String role, String industry) {
        return buildToken(userId, role, industry, "ACCESS", List.of(), consumerAccessTtlSeconds);
    }

    public String generateAdminTemp2faToken(Long adminId, String role) {
        return buildToken(adminId, role, "ALL", "TEMP_2FA", List.of(), adminTemp2faTtlSeconds);
    }

    public String generateAdminAccessToken(Long adminId, String role, List<String> permissions) {
        return buildToken(adminId, role, "ALL", "ACCESS", permissions, adminAccessTtlSeconds);
    }

    private String buildToken(
            Long subjectId,
            String role,
            String industry,
            String tokenType,
            List<String> permissions,
            long ttlSeconds) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(ttlSeconds);
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(subjectId))
                .claim("role", role)
                .claim("industry", industry)
                .claim("type", tokenType)
                .claim("permissions", permissions != null ? permissions : List.of())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    public Claims validateAndParseClaims(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private PrivateKey parsePrivateKey(String pem) throws Exception {
        String clean = pem.replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] decoded = Base64.getDecoder().decode(clean);
        return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    private PublicKey parsePublicKey(String pem) throws Exception {
        String clean = pem.replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] decoded = Base64.getDecoder().decode(clean);
        return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
    }
}
