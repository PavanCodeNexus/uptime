# UPTIME — Complete Security Documentation

> **Version:** 1.0  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Institution:** DSATM Bengaluru — VTU — 2026-27  

---

## Table of Contents

1. [Security Overview](#1-security-overview)
2. [Threat Model](#2-threat-model)
3. [Authentication Architecture](#3-authentication-architecture)
4. [Authorisation & RBAC](#4-authorisation--rbac)
5. [JWT Security](#5-jwt-security)
6. [OTP Security](#6-otp-security)
7. [API Security](#7-api-security)
8. [Rate Limiting](#8-rate-limiting)
9. [Input Validation](#9-input-validation)
10. [Injection Prevention](#10-injection-prevention)
11. [XSS Prevention](#11-xss-prevention)
12. [CSRF Prevention](#12-csrf-prevention)
13. [File Upload Security](#13-file-upload-security)
14. [Data Encryption](#14-data-encryption)
15. [Transport Security](#15-transport-security)
16. [Payment Security](#16-payment-security)
17. [Admin Security](#17-admin-security)
18. [Mobile App Security](#18-mobile-app-security)
19. [Database Security](#19-database-security)
20. [Third-Party Service Security](#20-third-party-service-security)
21. [Secrets Management](#21-secrets-management)
22. [Logging & Audit](#22-logging--audit)
23. [OWASP Top 10 Coverage](#23-owasp-top-10-coverage)
24. [Compliance](#24-compliance)
25. [Security Testing](#25-security-testing)
26. [Incident Response](#26-incident-response)

---

## 1. Security Overview

```
Security posture: Defence in depth
                  Multiple independent layers
                  No single point of failure

Security layers:
  Layer 1 → Cloudflare Edge (DDoS, SSL, WAF)
  Layer 2 → API Gateway (rate limit, JWT, CORS)
  Layer 3 → Application (RBAC, validation, OWASP)
  Layer 4 → Database (RLS, encryption, audit)
  Layer 5 → Infrastructure (secrets, Docker, env)

Key security properties:
  ✅ Authentication:  OTP + JWT (RS256)
  ✅ Authorisation:   RBAC on every endpoint
  ✅ Confidentiality: TLS 1.3 + AES-256
  ✅ Integrity:       SHA-256 tamper-proof records
  ✅ Non-repudiation: Immutable audit logs
  ✅ Availability:    DDoS protection + rate limiting

Security budget: ₹0 (all free-tier tools)
  → OWASP ZAP (free)
  → Dependabot (free)
  → GitHub secret scanning (free)
  → Sentry (free tier)
  → Cloudflare WAF (free)
```

---

## 2. Threat Model

### Assets to Protect

```
High value assets:
  → User PII (phone, Aadhaar masked, bank details)
  → Payment data (transactions, wallet balances)
  → Technician documents (Aadhaar, certificates)
  → Job records (tamper-proof, legal evidence)
  → AI prompt configurations
  → Admin credentials

Medium value assets:
  → Job media (photos, videos, audio)
  → Digital twin data
  → Machine/vehicle/device details
  → Ratings and reviews
  → Wiki articles

Lower value assets:
  → Platform analytics
  → Notification logs
  → Search logs
```

### Threat Actors

```
External attackers:
  → Automated bots (credential stuffing)
  → Script kiddies (common exploits)
  → Financially motivated hackers
  → Competitors (data theft)

Internal threats:
  → Rogue technician (fake arrival, data theft)
  → Rogue owner (fraudulent claims, fake reviews)
  → Compromised admin account
  → Disgruntled team member

Abuse cases:
  → Referral fraud (fake accounts for rewards)
  → Rating manipulation (fake reviews)
  → Insurance fraud (fake claims)
  → Payment fraud (stolen cards)
  → Fake pre-purchase scans
```

### Attack Surface

```
Public endpoints:
  POST /auth/send-otp      → OTP brute force
  POST /auth/verify-otp    → OTP brute force
  POST /auth/signup        → Account enumeration
  GET  /health             → Information disclosure

Protected endpoints:
  POST /jobs               → Fake job creation
  POST /ai/diagnose        → AI abuse / prompt injection
  POST /payments/webhook   → Webhook spoofing
  POST /marketplace/orders → Order fraud

File uploads:
  /jobs/{id}/media         → Malicious file upload
  /technicians/documents   → Document forgery

WebSocket:
  /ws/tracking/{jobId}     → Location spoofing
  /ws/auction/{jobId}      → Auction manipulation
```

---

## 3. Authentication Architecture

### OTP-Based Auth Flow

```
Step 1: User submits phone number
  POST /auth/send-otp
  Body: { phone: "9876543210" }

  Server actions:
  1. Validate phone format (^[6-9]\d{9}$)
  2. Check rate limit (5 OTPs per phone per hour)
  3. Check if account locked (too many failures)
  4. Generate cryptographically secure 6-digit OTP:
     SecureRandom.nextInt(900000) + 100000
  5. Hash OTP with BCrypt (cost 10):
     BCrypt.hashpw(otp.toString(), BCrypt.gensalt(10))
  6. Store in Redis:
     Key:   otp:{phone}
     Value: {hash, attempt_count: 0, purpose}
     TTL:   600 seconds (10 minutes)
  7. Also store in otp_verifications table (audit)
  8. Send via Twilio SMS

Step 2: User submits OTP
  POST /auth/verify-otp
  Body: { phone: "9876543210", otp: "123456" }

  Server actions:
  1. Fetch from Redis: otp:{phone}
  2. If not found → "OTP expired" (AUTH_002)
  3. Check attempt_count < 3 (else locked)
  4. BCrypt verify: matches?
     NO:
       increment attempt_count in Redis
       if attempt_count >= 3:
         Lock: login_attempts:{phone} TTL 1800s
         Return AUTH_003 (locked 30 mins)
       else: Return AUTH_001 (wrong OTP)
     YES:
       Delete Redis key (single use)
       Mark otp_verifications.is_used = true
       Proceed to JWT issuance

Step 3: JWT issuance
  1. Find/create user record
  2. Generate access token (RS256, 24h)
  3. Generate refresh token (UUID, 30 days)
  4. Store refresh token hash in DB
  5. Store session in Redis:
     Key:   session:{userId}
     Value: {refreshTokenHash, deviceId, ip}
     TTL:   2592000s (30 days)
  6. Return: { accessToken, refreshToken, user }
```

### Token Refresh Flow

```
POST /auth/refresh-token
Body: { refreshToken: "uuid-here" }

Server actions:
1. Hash the provided token
2. Find in refresh_tokens table WHERE:
   token_hash = hash AND is_revoked = FALSE
   AND expires_at > NOW()
3. If not found → 401 Unauthorized
4. Check session in Redis still valid
5. Issue new access token (24h)
6. Rotate refresh token:
   - Revoke old token (is_revoked = TRUE)
   - Create new refresh token
   - Update Redis session
7. Return new { accessToken, refreshToken }

Token rotation prevents refresh token reuse attacks.
If a stolen token is used → original user gets
new token → attacker's refresh token becomes invalid.
```

### Session Management

```
Redis session structure:
  Key:   session:{userId}
  Value: JSON {
    userId,
    deviceId,
    userType,       // OWNER/TECHNICIAN/ADMIN
    industry,
    ipAddress,
    lastActiveAt,
    refreshTokenHash
  }
  TTL: 30 days (sliding — reset on each use)

Logout:
  DELETE session:{userId} from Redis
  Mark refresh_token.is_revoked = TRUE
  Access token still valid until expiry (24h)
  → Acceptable trade-off for simplicity

Force logout (admin action):
  DELETE session:{userId}
  Revoke all refresh tokens for user
  Next request with old access token:
  → JwtAuthFilter checks session exists in Redis
  → If not found → 401 (forced logout)
```

---

## 4. Authorisation & RBAC

### Roles

```
OWNER:
  Can: manage own profile, own jobs, own assets,
       own payments, own insurance, marketplace
  Cannot: access other users' data, admin features,
          technician-only endpoints

TECHNICIAN:
  Can: manage own profile, view/accept assigned jobs,
       update location, own earnings, own badges,
       view wiki, manage own workshop
  Cannot: access owner data, admin features,
          create jobs, manage others' accounts

ADMIN:
  Can: view all data, verify technicians,
       resolve disputes, manage platform settings,
       send mass notifications, view analytics
  Cannot: access payment details beyond summaries,
          modify completed/locked job records,
          delete audit logs

SUPER_ADMIN:
  Can: everything ADMIN can + manage admin accounts,
       modify platform commission, export all data
  Note: Only 1 super_admin account exists
        Protected with hardware 2FA
```

### Spring Security Implementation

```java
// SecurityConfig.java
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http)
      throws Exception {
    http
      .csrf(csrf -> csrf.disable())     // JWT stateless
      .sessionManagement(session ->
        session.sessionCreationPolicy(
          SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        // Public endpoints
        .requestMatchers(
          "/api/v1/auth/**",
          "/api/v1/health",
          "/swagger-ui/**",
          "/v3/api-docs/**"
        ).permitAll()
        // Admin only
        .requestMatchers("/api/v1/admin/**")
          .hasAnyRole("ADMIN","SUPER_ADMIN")
        // All other endpoints require auth
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthFilter,
        UsernamePasswordAuthenticationFilter.class)
      .addFilterBefore(rateLimitFilter,
        JwtAuthFilter.class);
    return http.build();
  }
}

// Method-level RBAC
@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

  // Only owners can create jobs
  @PostMapping
  @PreAuthorize("hasRole('OWNER')")
  public ResponseEntity<?> createJob(...) {}

  // Only assigned tech OR job owner can view
  @GetMapping("/{id}")
  @PreAuthorize("@jobSecurity.canAccess(#id, authentication)")
  public ResponseEntity<?> getJob(@PathVariable Long id) {}

  // Only tech can update location
  @PostMapping("/{id}/location")
  @PreAuthorize("hasRole('TECHNICIAN') and " +
    "@jobSecurity.isAssignedTech(#id, authentication)")
  public ResponseEntity<?> updateLocation(...) {}

  // Admin can resolve disputes
  @PutMapping("/{id}/dispute/resolve")
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  public ResponseEntity<?> resolveDispute(...) {}
}

// Custom security expression
@Service("jobSecurity")
public class JobSecurityService {

  public boolean canAccess(Long jobId,
      Authentication auth) {
    Job job = jobRepo.findById(jobId)
      .orElseThrow(() -> new ResourceNotFoundException());
    Long userId = extractUserId(auth);
    String role = extractRole(auth);

    // Owner of the job
    if (role.equals("OWNER"))
      return job.getOwnerId().equals(userId);
    // Assigned technician
    if (role.equals("TECHNICIAN"))
      return userId.equals(job.getTechnicianId());
    // Admin always
    if (role.contains("ADMIN")) return true;

    return false;
  }

  public boolean isAssignedTech(Long jobId,
      Authentication auth) {
    Job job = jobRepo.findById(jobId).orElseThrow();
    Long techId = extractUserId(auth);
    return techId.equals(job.getTechnicianId());
  }
}
```

---

## 5. JWT Security

### Token Structure

```
Header:
  {
    "alg": "RS256",     // Asymmetric — private key signs
    "typ": "JWT"        //              public key verifies
  }

Payload:
  {
    "sub":      "12345",              // user ID
    "role":     "OWNER",              // single role
    "industry": "INDUSTRIAL",         // industry context
    "type":     "ACCESS",             // ACCESS or REFRESH
    "jti":      "uuid-v4",            // JWT ID (unique)
    "iat":      1728000000,           // issued at
    "exp":      1728086400            // expires (24h later)
  }

Signature: RS256(base64(header).base64(payload), privateKey)

Why RS256 (asymmetric) over HS256 (symmetric):
  → Private key: backend only (never shared)
  → Public key: can be shared with any service
     that needs to verify tokens
  → Compromise of one service doesn't expose
     signing capability
  → Industry standard for production systems
```

### Key Management

```java
// JwtTokenProvider.java

@Component
public class JwtTokenProvider {

  // Keys loaded from environment variables
  // NEVER hardcoded in source code
  @Value("${jwt.private-key}")
  private String privateKeyPem;

  @Value("${jwt.public-key}")
  private String publicKeyPem;

  private PrivateKey privateKey;
  private PublicKey  publicKey;

  @PostConstruct
  public void init() throws Exception {
    // Parse PEM keys on startup
    this.privateKey = loadPrivateKey(privateKeyPem);
    this.publicKey  = loadPublicKey(publicKeyPem);
  }

  public String generateAccessToken(User user) {
    return Jwts.builder()
      .subject(user.getId().toString())
      .claim("role",     user.getUserType())
      .claim("industry", user.getIndustryPreference())
      .claim("type",     "ACCESS")
      .id(UUID.randomUUID().toString())    // jti
      .issuedAt(new Date())
      .expiration(new Date(
        System.currentTimeMillis() + 86400000L)) // 24h
      .signWith(privateKey, Jwts.SIG.RS256)
      .compact();
  }

  public Claims validateToken(String token) {
    // Throws JwtException if invalid/expired
    return Jwts.parser()
      .verifyWith(publicKey)
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }
}
```

### JWT Filter

```java
// JwtAuthFilter.java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain)
      throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    // No token → skip (public routes handled by SecurityConfig)
    if (authHeader == null
        || !authHeader.startsWith("Bearer ")) {
      chain.doFilter(request, response);
      return;
    }

    String token = authHeader.substring(7);

    try {
      Claims claims = jwtTokenProvider.validateToken(token);

      // Check session still active in Redis
      // (handles force logout)
      String userId = claims.getSubject();
      if (!redisService.sessionExists(userId)) {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        writeError(response, "AUTH_004",
          "Session expired. Please login again.");
        return;
      }

      // Set authentication in SecurityContext
      UsernamePasswordAuthenticationToken auth =
        new UsernamePasswordAuthenticationToken(
          userId, null,
          List.of(new SimpleGrantedAuthority(
            "ROLE_" + claims.get("role")))
        );
      auth.setDetails(
        new WebAuthenticationDetailsSource()
          .buildDetails(request));
      SecurityContextHolder.getContext()
        .setAuthentication(auth);

    } catch (ExpiredJwtException e) {
      writeError(response, "AUTH_005", "Token expired");
      return;
    } catch (JwtException e) {
      writeError(response, "AUTH_004", "Invalid token");
      return;
    }

    chain.doFilter(request, response);
  }
}
```

---

## 6. OTP Security

### Security Properties

```
OTP generation:
  Source:  java.security.SecureRandom (CSPRNG)
  Range:   100000 – 999999 (always 6 digits)
  Entropy: log2(900000) ≈ 19.8 bits

Storage:
  Never store plaintext OTP
  BCrypt hash (cost factor 10)
  Redis with TTL (not DB-only, for performance)

Delivery:
  Primary:   Twilio SMS
  Fallback:  SendGrid email (if SMS fails)
  Never:     Display OTP in API response

Rate limiting per phone number:
  Max 5 OTP sends per hour
  Max 3 verify attempts per OTP
  After 3 failures: 30-minute lockout

Anti-enumeration:
  Same response for "phone not found"
  and "OTP sent" (don't reveal if phone exists)
  Same response time regardless (no timing attack)

Expiry:
  OTP valid 10 minutes
  Deleted from Redis on successful verify
  Cannot be reused (single use)

Arrival OTP (technician verification):
  Same OTP security + GPS proximity check
  Tech must be within 500m of job location
  Two-layer fraud prevention
```

---

## 7. API Security

### Security Headers

```java
// GlobalSecurityHeadersFilter.java
// Added to all responses

response.setHeader("X-Content-Type-Options",
  "nosniff");                    // Prevent MIME sniffing
response.setHeader("X-Frame-Options",
  "DENY");                       // Prevent clickjacking
response.setHeader("X-XSS-Protection",
  "1; mode=block");              // Legacy XSS filter
response.setHeader(
  "Strict-Transport-Security",
  "max-age=31536000; includeSubDomains"); // HSTS 1 year
response.setHeader(
  "Referrer-Policy",
  "strict-origin-when-cross-origin");
response.setHeader(
  "Permissions-Policy",
  "camera=(), microphone=(), geolocation=()");
response.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; " +
  "connect-src 'self' https://api.uptime.in; " +
  "img-src 'self' data: https://res.cloudinary.com; " +
  "script-src 'self'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "frame-ancestors 'none'");
response.setHeader("X-Request-ID",
  requestId);                    // For tracing
response.setHeader("X-API-Version", "1");
```

### CORS Configuration

```java
// CorsConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration config = new CorsConfiguration();

  // Allowed origins (strict whitelist)
  config.setAllowedOrigins(List.of(
    "https://uptime.in",
    "https://tech.uptime.in",
    "https://admin.uptime.in",
    // Dev only (removed in production)
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002"
  ));

  config.setAllowedMethods(
    List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
  config.setAllowedHeaders(
    List.of("Authorization","Content-Type",
            "X-Request-ID","Accept-Language"));
  config.setAllowCredentials(true);
  config.setMaxAge(3600L);     // Cache preflight 1 hour

  UrlBasedCorsConfigurationSource source =
    new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/api/**", config);
  return source;
}
```

---

## 8. Rate Limiting

### Redis Token Bucket Implementation

```java
// RateLimitFilter.java

@Component
public class RateLimitFilter extends OncePerRequestFilter {

  // Per-user limits (authenticated requests)
  private static final int USER_LIMIT   = 100; // per minute
  // Per-IP limits (unauthenticated requests)
  private static final int IP_LIMIT     = 200; // per minute
  // OTP endpoint — very strict
  private static final int OTP_LIMIT    = 5;   // per 10 mins
  // AI endpoint — expensive
  private static final int AI_LIMIT     = 20;  // per minute
  // Payment endpoint
  private static final int PAY_LIMIT    = 10;  // per minute

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain)
      throws ServletException, IOException {

    String path   = request.getRequestURI();
    String userId = extractUserIdIfAuthenticated(request);
    String ip     = extractClientIp(request);

    // Determine limit based on endpoint
    RateLimitConfig cfg = getRateLimitConfig(path);

    // Determine key
    String key = userId != null
      ? "rl:user:" + userId + ":" + cfg.endpoint
      : "rl:ip:"   + ip    + ":" + cfg.endpoint;

    // Token bucket check in Redis
    boolean allowed = redisService
      .checkAndConsumeToken(key, cfg.limit, cfg.windowSecs);

    if (!allowed) {
      // Log to rate_limit_logs table
      logRateLimitViolation(ip, userId, path);

      response.setStatus(429);
      response.setHeader("Retry-After",
        String.valueOf(cfg.windowSecs));
      writeError(response, "RATE_001",
        "Too many requests. Please slow down.");
      return;
    }

    // Add rate limit headers to response
    response.setHeader("X-RateLimit-Limit",
      String.valueOf(cfg.limit));
    response.setHeader("X-RateLimit-Remaining",
      String.valueOf(redisService.getRemaining(key)));

    chain.doFilter(request, response);
  }

  private RateLimitConfig getRateLimitConfig(String path) {
    if (path.startsWith("/api/v1/auth/send-otp"))
      return new RateLimitConfig("otp", OTP_LIMIT, 600);
    if (path.startsWith("/api/v1/ai/"))
      return new RateLimitConfig("ai",  AI_LIMIT, 60);
    if (path.startsWith("/api/v1/payments/"))
      return new RateLimitConfig("pay", PAY_LIMIT, 60);
    return new RateLimitConfig("default", USER_LIMIT, 60);
  }
}
```

### Redis Token Bucket Logic

```java
// RedisService.java

public boolean checkAndConsumeToken(
    String key, int limit, int windowSecs) {

  // Lua script for atomic check-and-consume
  String lua = """
    local current = redis.call('GET', KEYS[1])
    if current == false then
      redis.call('SET', KEYS[1], ARGV[1] - 1)
      redis.call('EXPIRE', KEYS[1], ARGV[2])
      return 1
    elseif tonumber(current) > 0 then
      redis.call('DECR', KEYS[1])
      return 1
    else
      return 0
    end
    """;

  Long result = redisTemplate.execute(
    new DefaultRedisScript<>(lua, Long.class),
    List.of(key),
    String.valueOf(limit),
    String.valueOf(windowSecs)
  );

  return result != null && result == 1L;
}
```

---

## 9. Input Validation

### Jakarta Bean Validation

```java
// All DTOs use Bean Validation annotations

public class JobCreateRequest {
  @NotBlank(message = "Industry is required")
  @Pattern(regexp = "INDUSTRIAL|AUTOMOBILE|ELECTRONICS",
    message = "Invalid industry")
  private String industry;

  @NotNull(message = "Location is required")
  @Valid
  private LocationDTO location;

  @Size(max = 2000,
    message = "Description too long (max 2000 chars)")
  private String faultDescription;

  @NotBlank(message = "Urgency is required")
  @Pattern(regexp = "LOW|MEDIUM|HIGH|CRITICAL")
  private String urgency;
}

public class LocationDTO {
  @NotNull(message = "Latitude required")
  @DecimalMin(value = "-90.0",  message = "Invalid latitude")
  @DecimalMax(value = "90.0",   message = "Invalid latitude")
  private Double latitude;

  @NotNull(message = "Longitude required")
  @DecimalMin(value = "-180.0", message = "Invalid longitude")
  @DecimalMax(value = "180.0",  message = "Invalid longitude")
  private Double longitude;
}

// Custom phone validator
@Constraint(validatedBy = PhoneValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhone {
  String message() default "Invalid Indian mobile number";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}

public class PhoneValidator
    implements ConstraintValidator<ValidPhone, String> {
  private static final Pattern INDIA_PHONE =
    Pattern.compile("^[6-9]\\d{9}$");

  @Override
  public boolean isValid(String value,
      ConstraintValidatorContext ctx) {
    if (value == null) return false;
    return INDIA_PHONE.matcher(value).matches();
  }
}
```

### Global Validation Error Handler

```java
// GlobalExceptionHandler.java

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<?>>
    handleValidationErrors(
    MethodArgumentNotValidException ex) {

  Map<String, String> errors = new LinkedHashMap<>();
  ex.getBindingResult()
    .getFieldErrors()
    .forEach(err ->
      errors.put(err.getField(), err.getDefaultMessage()));

  return ResponseEntity
    .status(HttpStatus.BAD_REQUEST)
    .body(ApiResponse.error(
      "VAL_001",
      "Validation failed",
      errors
    ));
}
```

---

## 10. Injection Prevention

### SQL Injection

```java
// ALWAYS use JPA/parameterised queries
// NEVER concatenate user input into SQL strings

// ✅ CORRECT — parameterised
@Query("SELECT j FROM Job j WHERE j.ownerId = :ownerId " +
       "AND j.status = :status " +
       "AND j.deletedAt IS NULL")
List<Job> findByOwnerAndStatus(
  @Param("ownerId") Long ownerId,
  @Param("status")  String status);

// ✅ CORRECT — Spring Data JPA (auto-parameterised)
List<Job> findByOwnerIdAndStatusAndDeletedAtIsNull(
  Long ownerId, String status);

// ❌ WRONG — NEVER do this
@Query("SELECT * FROM jobs WHERE owner_id = '"
  + ownerId + "'")  // SQL injection vulnerability!

// For native queries — still use named params
@Query(
  value = "SELECT * FROM jobs WHERE owner_id = :id",
  nativeQuery = true)
List<Job> findByOwnerId(@Param("id") Long id);
```

### NoSQL Injection (Redis)

```java
// Redis keys constructed with fixed prefixes
// User input NEVER directly used as key name

// ✅ CORRECT
String key = "otp:" + phone.replaceAll("[^0-9]", "");
// Sanitised — only digits allowed in key

// ❌ WRONG
String key = "otp:" + userInput; // Could contain ':'
```

### Prompt Injection (Gemini AI)

```java
// GeminiService.java — prevent prompt injection

public String buildFaultTriagePrompt(
    String userDescription, List<String> safeMediaUrls) {

  // Load system prompt from file (not user-controlled)
  String systemPrompt = promptManager
    .getActivePrompt("fault_triage");

  // Sanitise user input before including in prompt
  String sanitised = userDescription
    .replace("```",     "")      // Remove code blocks
    .replace("Ignore",  "")      // Prompt injection attempts
    .replace("System:", "")
    .replace("Human:",  "")
    .trim()
    .substring(0, Math.min(userDescription.length(), 1000));
  // Limit to 1000 chars

  // User input is clearly labelled — not part of instructions
  return systemPrompt +
    "\n\n---USER FAULT DESCRIPTION (UNTRUSTED INPUT)---\n" +
    sanitised +
    "\n---END USER INPUT---\n" +
    "\nAnalyse the above and respond in JSON format only.";
}
```

### Command Injection

```java
// NEVER use Runtime.exec() with user input
// NEVER use ProcessBuilder with user strings
// All external calls use SDKs (Twilio, Razorpay, etc.)
// No shell commands executed in application code
```

---

## 11. XSS Prevention

### React (Web)

```tsx
// React escapes all JSX expressions by default
// { userInput } is automatically HTML-encoded

// ✅ SAFE — React escapes automatically
<p>{job.faultDescription}</p>

// ❌ DANGEROUS — only use for trusted HTML
<div dangerouslySetInnerHTML={{ __html: content }} />
// UPTIME never uses dangerouslySetInnerHTML

// DOMPurify for any user-generated rich content (wiki)
import DOMPurify from 'dompurify';
const safeHtml = DOMPurify.sanitize(wikiContent, {
  ALLOWED_TAGS: ['p','b','i','ul','li','h3','a','img'],
  ALLOWED_ATTR: ['href','src','alt','class'],
});
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

### Content Security Policy

```
CSP header prevents inline script execution:
  script-src 'self'
  → Only scripts from same origin allowed
  → Inline <script> tags blocked
  → eval() blocked

This means even if XSS payload is injected
into the DOM, it cannot execute JavaScript.
```

### Backend Output Encoding

```java
// Spring Boot returns JSON — no HTML templating
// JSON encoding is handled by Jackson automatically
// Special characters in strings: \", \\, \n etc.
// HTML entities in JSON strings: not needed
// (JSON is not HTML — no HTML injection in JSON response)

// If ever generating HTML server-side (e.g., email templates):
import org.apache.commons.text.StringEscapeUtils;
String safe = StringEscapeUtils.escapeHtml4(userInput);
```

---

## 12. CSRF Prevention

```
CSRF not applicable because:
  → API is stateless (JWT, not session cookies)
  → No cookies used for authentication
  → Authorization header with Bearer token
     (cannot be set by cross-origin forms)

Additional protection:
  → CORS whitelist (only uptime.in origins)
  → SameSite cookies (if ever used):
     Set-Cookie: token=...; SameSite=Strict; Secure
  → Content-Type: application/json required
     (browser cannot send JSON from a form)

For admin panel (future):
  → If session cookies used → add Spring CSRF
  → Double-submit cookie pattern
```

---

## 13. File Upload Security

### Validation Layers

```java
// FileValidationService.java

public void validateUpload(MultipartFile file,
    String expectedType) throws ValidationException {

  // 1. Size check
  long maxSize = switch (expectedType) {
    case "PHOTO"    -> 10 * 1024 * 1024L; // 10MB
    case "AUDIO"    -> 20 * 1024 * 1024L; // 20MB
    case "VIDEO"    -> 100 * 1024 * 1024L;// 100MB
    case "DOCUMENT" -> 5  * 1024 * 1024L; // 5MB
    default         -> 5  * 1024 * 1024L;
  };
  if (file.getSize() > maxSize)
    throw new ValidationException("VAL_004",
      "File too large. Maximum: "
      + (maxSize / 1024 / 1024) + "MB");

  // 2. MIME type check (from Content-Type header)
  String mimeType = file.getContentType();
  Set<String> allowed = getAllowedMimes(expectedType);
  if (!allowed.contains(mimeType))
    throw new ValidationException("VAL_003",
      "File type not allowed: " + mimeType);

  // 3. Magic bytes check (cannot be spoofed like MIME)
  byte[] header = file.getBytes();
  if (!matchesMagicBytes(header, mimeType))
    throw new ValidationException("VAL_003",
      "File content does not match declared type");

  // 4. EXIF stripping (privacy — location data removal)
  // Done after upload to Cloudinary via transformation URL
}

private boolean matchesMagicBytes(
    byte[] header, String mimeType) {
  return switch (mimeType) {
    case "image/jpeg" ->
      header[0] == (byte)0xFF && header[1] == (byte)0xD8;
    case "image/png"  ->
      header[0] == (byte)0x89 && header[1] == (byte)0x50;
    case "image/webp" ->
      new String(header, 0, 4).equals("RIFF");
    case "audio/mpeg" ->
      header[0] == (byte)0xFF && header[1] == (byte)0xFB;
    case "video/mp4"  ->
      new String(header, 4, 4).equals("ftyp");
    case "application/pdf" ->
      new String(header, 0, 4).equals("%PDF");
    default -> false;
  };
}
```

### EXIF Stripping (Privacy)

```
After upload to Cloudinary:
  Transformation URL removes EXIF:
  https://res.cloudinary.com/uptime/image/upload/
    e_exif_strip/photo.jpg
  
  This removes:
  → GPS coordinates embedded in photo
  → Device make/model
  → Timestamp
  → Author information
  
  Why important:
  → Owner's home/factory location not exposed
  → Tech's location not exposed
  → Privacy protection (DPDP Act 2023 requirement)
```

### ClamAV Malware Scan (Production)

```
In production:
  Files scanned by ClamAV before storing
  Infected files deleted + incident logged
  Uploader account flagged for review
  Error returned: "File rejected — security scan"

In PBL development:
  ClamAV not installed (too complex for dev)
  Cloudinary content moderation used instead
  → Blocks known malware signatures
```

---

## 14. Data Encryption

### Encryption at Rest

```java
// Sensitive fields encrypted before DB storage
// AES-256-GCM (authenticated encryption)

// EncryptionService.java
@Service
public class EncryptionService {

  @Value("${encryption.key}")  // 256-bit key from env
  private String encryptionKey;

  public String encrypt(String plaintext) {
    try {
      SecretKeySpec keySpec = new SecretKeySpec(
        Base64.getDecoder().decode(encryptionKey),
        "AES");

      byte[] iv = new byte[12];
      SecureRandom.getInstanceStrong().nextBytes(iv);

      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.ENCRYPT_MODE, keySpec,
        new GCMParameterSpec(128, iv));

      byte[] encrypted = cipher.doFinal(
        plaintext.getBytes(StandardCharsets.UTF_8));

      // Prepend IV to encrypted data
      byte[] result = new byte[iv.length + encrypted.length];
      System.arraycopy(iv, 0, result, 0, iv.length);
      System.arraycopy(encrypted, 0, result,
        iv.length, encrypted.length);

      return Base64.getEncoder().encodeToString(result);
    } catch (Exception e) {
      throw new RuntimeException("Encryption failed", e);
    }
  }

  public String decrypt(String ciphertext) {
    try {
      byte[] data = Base64.getDecoder().decode(ciphertext);
      byte[] iv   = Arrays.copyOfRange(data, 0, 12);
      byte[] enc  = Arrays.copyOfRange(data, 12, data.length);

      SecretKeySpec keySpec = new SecretKeySpec(
        Base64.getDecoder().decode(encryptionKey), "AES");

      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.DECRYPT_MODE, keySpec,
        new GCMParameterSpec(128, iv));

      return new String(cipher.doFinal(enc),
        StandardCharsets.UTF_8);
    } catch (Exception e) {
      throw new RuntimeException("Decryption failed", e);
    }
  }
}

// Fields encrypted in database:
// technician_bank_accounts.account_number_encrypted
// smart_home_connections.access_token_encrypted
// smart_home_connections.refresh_token_encrypted
// admin_users.two_fa_secret
```

### Password Hashing

```java
// BCrypt for admin passwords
@Bean
public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder(12); // cost factor 12
}

// Usage
String hash = passwordEncoder.encode(rawPassword);
boolean match = passwordEncoder.matches(rawPassword, hash);

// BCrypt properties:
// → Adaptive: cost factor increases over time
// → Built-in salt: each hash unique
// → Slow by design: prevents brute force
// → Cost 12: ~250ms per hash (acceptable for login)
```

### SHA-256 Tamper-Proof Records

```java
// HashUtils.java
public class HashUtils {

  public static String sha256(String input) {
    try {
      MessageDigest digest =
        MessageDigest.getInstance("SHA-256");
      byte[] hash =
        digest.digest(input.getBytes(StandardCharsets.UTF_8));
      StringBuilder hex = new StringBuilder();
      for (byte b : hash)
        hex.append(String.format("%02x", b));
      return hex.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(e);
    }
  }

  // Build canonical job string for hashing
  public static String buildJobCanonical(Job job) {
    return String.join("|",
      job.getId().toString(),
      job.getJobNumber(),
      job.getOwnerId().toString(),
      job.getTechnicianId() != null
        ? job.getTechnicianId().toString() : "null",
      job.getFaultDescription() != null
        ? job.getFaultDescription() : "",
      job.getFinalCost() != null
        ? job.getFinalCost().toString() : "0",
      job.getCompletedAt() != null
        ? job.getCompletedAt().toString() : ""
    );
  }
}

// When job is completed:
String canonical = HashUtils.buildJobCanonical(job);
String hash = HashUtils.sha256(canonical);
job.setHashValue(hash);
job.setIsTamperProofLocked(true);
jobRepo.save(job);

// Verification:
// Recompute hash → compare with stored hash
// Any change → hashes won't match → tampered!
```

---

## 15. Transport Security

### TLS Configuration

```
Cloudflare handles TLS termination:
  → TLS 1.2 minimum (1.3 preferred)
  → Strong cipher suites only:
     TLS_AES_128_GCM_SHA256
     TLS_AES_256_GCM_SHA384
     TLS_CHACHA20_POLY1305_SHA256
  → Perfect Forward Secrecy (ECDHE key exchange)
  → Certificate: Cloudflare managed (auto-renewed)
  → HSTS enforced (1 year, includeSubDomains)

Railway (backend) to Cloudflare:
  → Origin certificate (Cloudflare issues)
  → Full (strict) SSL mode in Cloudflare

Database (Supabase):
  → TLS required on all connections
  → Spring Boot JDBC URL: ?sslmode=require
  → Certificate verified (not just encrypted)

Redis (Upstash):
  → rediss:// (TLS) protocol required
  → Upstash enforces TLS on all connections

Internal Docker network (dev only):
  → Plain HTTP acceptable (not exposed)
  → Docker bridge network isolates containers
```

### Certificate Pinning (Mobile)

```dart
// Flutter — certificate pinning for API calls
// Prevents MITM attacks on mobile

final dio = Dio();
(dio.httpClientAdapter as IOHttpClientAdapter)
    .onHttpClientCreate = (client) {
  client.badCertificateCallback =
    (X509Certificate cert, String host, int port) {
    // Verify certificate fingerprint
    final fingerprint = sha256ofBytes(cert.der);
    return fingerprint == EXPECTED_FINGERPRINT;
  };
  return client;
};

// EXPECTED_FINGERPRINT: SHA-256 of api.uptime.in cert
// Updated during app release cycle
// Backup pins included for certificate rotation
```

---

## 16. Payment Security

### Razorpay Webhook Verification

```java
// WebhookHandler.java

@PostMapping("/payments/webhook/razorpay")
public ResponseEntity<?> handleWebhook(
    @RequestBody String payload,
    @RequestHeader("X-Razorpay-Signature") String signature) {

  // 1. HMAC-SHA256 verification
  // signature = HMAC_SHA256(payload, webhookSecret)
  boolean valid = verifySignature(payload, signature);
  if (!valid) {
    // Log potential webhook spoofing attempt
    log.warn("Invalid webhook signature from IP: {}",
      request.getRemoteAddr());
    auditLogger.log("WEBHOOK_INVALID_SIGNATURE",
      payload.substring(0, 100));
    return ResponseEntity.status(400).build();
  }

  // 2. Parse event
  WebhookEvent event = parseEvent(payload);

  // 3. Idempotency check
  // Razorpay may retry — don't process twice
  String eventId = event.getEventId();
  if (redisService.exists("webhook:processed:" + eventId)) {
    return ResponseEntity.ok().build(); // Already processed
  }
  redisService.set("webhook:processed:" + eventId,
    "1", Duration.ofHours(24));

  // 4. Process asynchronously (respond 200 fast)
  rabbitMQService.publish("uptime.payments",
    "payment.webhook", event);

  return ResponseEntity.ok().build();
}

private boolean verifySignature(
    String payload, String signature) {
  try {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(
      webhookSecret.getBytes(StandardCharsets.UTF_8),
      "HmacSHA256"));
    String computed = bytesToHex(
      mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    return MessageDigest.isEqual(
      computed.getBytes(), signature.getBytes());
  } catch (Exception e) {
    return false;
  }
}
```

### Payment Security Rules

```
PCI DSS compliance:
  → UPTIME never stores card numbers
  → All card data handled by Razorpay (PCI DSS Level 1)
  → Only store: last4 digits, card network, Razorpay token
  → No CVV ever stored (not even temporarily)

Escrow protection:
  → Payment captured → held in platform account
  → Released to tech only after 24h no-dispute window
  → Admin manual release for disputed jobs

Fraud detection:
  → Referral fraud: same IP/device/bank = flagged
  → Multiple failed payments from same card = locked
  → Unusually large single job = manual review flagged
  → Bulk payouts > ₹50,000/day = manual approval

KYC requirements:
  → PAN required for annual earnings > ₹50,000
  → Aadhaar verification for technicians (mandatory)
  → Bank account verified via penny drop (₹1 test transfer)
```

---

## 17. Admin Security

### Authentication

```java
// AdminAuthService.java — two-factor authentication

public AdminAuthResponse login(
    String email, String password, String totpCode) {

  // Step 1: Find admin
  AdminUser admin = adminRepo.findByEmail(email)
    .orElseThrow(() -> {
      // Always increment failed count even if not found
      // (prevent email enumeration via timing)
      return new UnauthorizedException("Invalid credentials");
    });

  // Step 2: Check lockout
  if (admin.getLockedUntil() != null
      && admin.getLockedUntil().isAfter(Instant.now()))
    throw new UnauthorizedException(
      "Account locked until " + admin.getLockedUntil());

  // Step 3: IP whitelist check
  if (!admin.getAllowedIps().contains(requestIp))
    throw new UnauthorizedException("IP not whitelisted");

  // Step 4: Password check (BCrypt 12 rounds)
  if (!passwordEncoder.matches(password,
      admin.getPasswordHash())) {
    admin.setFailedLoginCount(
      admin.getFailedLoginCount() + 1);
    if (admin.getFailedLoginCount() >= 5) {
      admin.setLockedUntil(
        Instant.now().plusSeconds(3600)); // 1 hour
      auditLogger.log(admin.getId(),
        "ACCOUNT_LOCKED", "Too many failed logins");
    }
    adminRepo.save(admin);
    throw new UnauthorizedException("Invalid credentials");
  }

  // Step 5: TOTP verification (Google Authenticator)
  if (admin.getIs2faEnabled()) {
    String secret = encryptionService
      .decrypt(admin.getTwoFaSecret());
    boolean totpValid = totpService
      .verify(secret, totpCode);
    if (!totpValid)
      throw new UnauthorizedException("Invalid 2FA code");
  }

  // Step 6: Reset failed count + log success
  admin.setFailedLoginCount(0);
  admin.setLastLoginAt(Instant.now());
  admin.setLastLoginIp(requestIp);
  adminRepo.save(admin);
  auditLogger.log(admin.getId(), "ADMIN_LOGIN",
    "Successful login from " + requestIp);

  // Step 7: Issue admin JWT (30 min expiry)
  return new AdminAuthResponse(
    jwtProvider.generateAdminToken(admin));
}
```

### Admin Session Controls

```
Admin JWT expiry: 30 minutes (vs 24h for users)
Session timeout:  30 minutes of inactivity
  → Redis: admin:session:{id} with TTL 1800s
  → Every admin action resets TTL
  → After 30 min idle: auto-logout

All admin actions logged:
  → audit_logs table (immutable)
  → actor_id, action, entity_type, entity_id
  → old_values, new_values (before/after)
  → ip_address, user_agent, timestamp
  → Cannot be deleted (trigger prevents it)

Admin IP whitelist:
  → Stored in admin_users.allowed_ips (JSONB)
  → Checked on every login
  → Also enforced at Cloudflare WAF level
  → Change requires another admin to approve

Sensitive operations require re-auth:
  → Bulk payouts > ₹10,000
  → Modifying platform commission
  → Exporting user data
  → Re-enter password + TOTP
```

---

## 18. Mobile App Security

### Token Storage

```dart
// flutter_secure_storage — uses Android Keystore / iOS Keychain
// NOT SharedPreferences (plaintext)
// NOT Hive without encryption

final secureStorage = FlutterSecureStorage(
  aOptions: AndroidOptions(
    encryptedSharedPreferences: true,  // Android 6+
    keyCipherAlgorithm:
      KeyCipherAlgorithm.RSA_ECB_OAEPwithSHA_256andMGF1Padding,
    storageCipherAlgorithm:
      StorageCipherAlgorithm.AES_GCM_NoPadding,
  ),
  iOptions: IOSOptions(
    accessibility: KeychainAccessibility.first_unlock,
    // Available after first unlock, even before screen unlock
  ),
);

// Store tokens
await secureStorage.write(key: 'access_token',  value: token);
await secureStorage.write(key: 'refresh_token', value: refresh);

// Read tokens
final token = await secureStorage.read(key: 'access_token');

// Delete on logout
await secureStorage.deleteAll();
```

### Root/Jailbreak Detection

```dart
// flutter_jailbreak_detection package
// Warn user if device is rooted/jailbroken

Future<void> checkDeviceSecurity() async {
  bool isJailbroken = await FlutterJailbreakDetection
    .jailbroken;
  bool isDeveloperMode = await FlutterJailbreakDetection
    .developerMode;

  if (isJailbroken) {
    // Show warning dialog
    showDialog(context: context,
      builder: (_) => AlertDialog(
        title: Text("Security Warning"),
        content: Text(
          "This device appears to be rooted/jailbroken. "
          "Your data may be at risk. UPTIME recommends "
          "using a secure device."),
        actions: [
          TextButton(
            onPressed: () => exit(0), // Force exit
            child: Text("Exit App")),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("Continue Anyway")),
        ],
      )
    );
  }
}
```

### SSL Pinning (Flutter)

```dart
// Certificate pinning prevents MITM attacks
// Configured in Dio

class SecureDioClient {
  static Dio create() {
    final dio = Dio();

    (dio.httpClientAdapter as IOHttpClientAdapter)
        .onHttpClientCreate = (client) {
      // Load bundled certificate
      SecurityContext sc = SecurityContext();
      sc.setTrustedCertificatesBytes(
        // api.uptime.in certificate bytes
        // bundled in assets/certs/api.pem
        rootBundle.loadString('assets/certs/api.pem')
          .then((s) => Uint8List.fromList(s.codeUnits))
          as Uint8List,
      );
      return HttpClient(context: sc);
    };

    return dio;
  }
}
```

### App-Level Security

```
APK Security:
  → Code obfuscation (--obfuscate flag in release build)
  → Symbol file stored separately (not in APK)
  → ProGuard rules to remove debug info

Screenshot protection:
  → Payment screens: FLAG_SECURE (Android)
    FlutterSecurePlaceholder package
  → Prevents screenshots and screen recording
    on payment, OTP, and sensitive data screens

Background app screenshot:
  → On app entering background: blur screenshot
    (prevents OS from capturing sensitive data)
  → SecureApplication package

Biometric lock:
  → Optional: "Require biometric on open"
  → local_auth package
  → Fallback: PIN/password

Clipboard protection:
  → OTP input: paste disabled
  → Bank account fields: paste disabled
  → Prevents clipboard sniffing apps
```

---

## 19. Database Security

### Supabase Row Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Owners can only see their own jobs
CREATE POLICY "owners_own_jobs" ON jobs
  FOR ALL
  USING (owner_id = auth.uid()::BIGINT);

-- Techs can see jobs assigned to them
CREATE POLICY "techs_assigned_jobs" ON jobs
  FOR SELECT
  USING (technician_id = auth.uid()::BIGINT);

-- Users can only see their own profile
CREATE POLICY "users_own_profile" ON users
  FOR ALL
  USING (id = auth.uid()::BIGINT);

-- Note: Spring Boot uses service role key
-- which bypasses RLS (full access)
-- RLS protects against direct Supabase API access
```

### Database Access Controls

```
Service role key (Spring Boot):
  → Full access (bypasses RLS)
  → Used ONLY in backend
  → Never exposed to frontend
  → Stored in Railway environment variables

Anon key (Supabase):
  → Limited access (RLS enforced)
  → Used in frontend ONLY for Supabase Auth
  → NOT used for data queries (backend handles all)

Connection pooling:
  → HikariCP: max 10 connections
  → Prevents connection exhaustion
  → Connection timeout: 30 seconds

SQL audit:
  → PostgreSQL log_statement = 'ddl'
  → DDL changes logged (table create/drop/alter)
  → DML not logged (too much volume)
  → Flyway migration history is the DDL audit
```

### Backup Security

```
Supabase automatic backups:
  → Encrypted at rest (AES-256)
  → Point-in-time recovery (Pro tier)
  → Backups in Supabase-managed S3

Manual export security:
  → pg_dump output encrypted:
    pg_dump ... | gpg --symmetric > backup.sql.gpg
  → Encryption key: separate from DB credentials
  → Stored in different secure location

Restore testing:
  → Test restore quarterly to staging environment
  → Verify data integrity after restore
  → Document restore procedure (in uptime-docs)
```

---

## 20. Third-Party Service Security

### API Key Management

```
All API keys stored in:
  Development: .env file (gitignored)
  CI/CD:       GitHub Secrets
  Production:  Railway environment variables

Never in:
  → Source code (hardcoded)
  → Git repository (even .env committed by mistake)
  → Log files
  → Error messages to clients
  → Client-side JavaScript (except VITE_PUBLIC_*)

Key rotation policy:
  → Rotate every 90 days (production)
  → Rotate immediately if suspected compromise
  → Rotation procedure:
    1. Generate new key in service dashboard
    2. Update Railway env variable
    3. Railway redeploys automatically (zero downtime)
    4. Revoke old key after 24h (overlap period)
    5. Update GitHub Secrets for CI/CD

Keys with limited permissions:
  → Gemini: only generateContent permission
  → Cloudinary: only upload to uptime/ folder
  → Razorpay: only required webhook events
  → Twilio: only SMS send, no account management
  → Firebase: only FCM send, no auth admin
```

### Webhook Security

```
All incoming webhooks verified:
  Razorpay:   HMAC-SHA256 (X-Razorpay-Signature)
  Firebase:   JWT verification
  Twilio:     HMAC-SHA1 (X-Twilio-Signature)

Webhook endpoints:
  → Rate limited separately (max 100/min per IP)
  → Only accept from known IP ranges where possible
  → Log all webhook calls to audit_logs
  → Respond 200 quickly, process async

Secret exposure check:
  → GitHub secret scanning enabled (free)
  → Detects API keys accidentally committed
  → Email alert if key found in commit
  → Force-push to remove + rotate key immediately
```

---

## 21. Secrets Management

### Environment Variables

```bash
# .env.example — all keys listed, no values
# Committed to git (safe)

# .env — actual values
# NEVER committed (in .gitignore)
# Created manually on each dev machine

# Railway production
# Set via Railway dashboard → Variables
# Never visible after setting (write-only)

# GitHub Actions
# Set via repo Settings → Secrets → Actions
# Available as ${{ secrets.KEY_NAME }}
# Never logged even in debug output
```

### .gitignore Configuration

```
# uptime-backend/.gitignore

# Environment files
.env
.env.local
.env.*.local
!.env.example

# Build artifacts
target/
*.class
*.jar
*.war

# IDE
.idea/
*.iml
.vscode/

# Credentials
firebase-credentials.json
serviceAccountKey.json
*.p12
*.jks

# Security
*.pem          # Private keys
*.key          # Private keys
```

### Secret Scanning (GitHub)

```yaml
# GitHub automatically scans for:
# → AWS access keys
# → Google API keys
# → Razorpay keys (if pattern registered)
# → Twilio keys
# → Generic secret patterns

# .github/secret_scanning.yml
secret_scanning:
  push_protection:
    enabled: true  # Block push if secret detected
    bypass_reviewers:
      - PavanCodeNexus  # Tech lead can approve bypass
```

---

## 22. Logging & Audit

### What Is Logged

```java
// RequestLoggingFilter.java — every API call
{
  "timestamp":     "2026-10-09T10:30:00Z",
  "requestId":     "req-uuid-here",
  "userId":        12345,
  "userType":      "OWNER",
  "method":        "POST",
  "endpoint":      "/api/v1/jobs",
  "statusCode":    201,
  "responseTimeMs":143,
  "ipAddress":     "192.168.1.1",
  "userAgent":     "UPTIME-Android/2.0",
  // Sensitive fields OMITTED:
  // requestBody, responseBody, Authorization header
}

// AuditLogger.java — sensitive actions
{
  "actorId":      12345,
  "actorType":    "ADMIN",
  "action":       "TECHNICIAN_VERIFIED",
  "entityType":   "TECHNICIAN",
  "entityId":     67890,
  "oldValues":    {"verification_status": "PENDING"},
  "newValues":    {"verification_status": "APPROVED"},
  "ipAddress":    "192.168.1.1",
  "timestamp":    "2026-10-09T10:30:00Z"
}
```

### What Is Never Logged

```
NEVER log:
  → Passwords or password hashes
  → OTP values (plaintext)
  → Full JWT tokens
  → Full payment card numbers
  → Full bank account numbers
  → Aadhaar numbers (even masked)
  → API keys or secrets
  → Full request bodies (may contain PII)
  → Full response bodies (may contain sensitive data)

Log sanitisation:
  → Phone numbers: mask middle 5 digits
    9876543210 → 987XXXXX10
  → Email: mask local part
    user@email.com → u***@email.com
  → Job descriptions: truncate to 100 chars
```

### Audit Log Immutability

```sql
-- Trigger prevents modification
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION
    'Audit logs are immutable — modification not allowed';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_modification();

-- Even super_admin cannot delete audit logs
-- Provides: non-repudiation, legal evidence,
--           tamper-proof activity history
```

### Log Retention

```
api_logs:        90 days active, then archived
                 (partitioned by year — old partitions dropped)
audit_logs:      PERMANENT (immutable, legal requirement)
error_logs:      1 year active
security_events: 2 years (failed logins, rate limits)
user_activity:   1 year, then anonymised
```

---

## 23. OWASP Top 10 Coverage

### A01: Broken Access Control

```
✅ RBAC on every endpoint (@PreAuthorize)
✅ Resource-level checks (job owner only)
✅ Admin IP whitelist
✅ Audit logging of all access attempts
✅ JWT validation on every request
✅ Session check in Redis (force logout support)
```

### A02: Cryptographic Failures

```
✅ TLS 1.3 on all connections
✅ AES-256-GCM for sensitive field encryption
✅ BCrypt-12 for password hashing
✅ RS256 for JWT signing
✅ Secure random for OTP generation
✅ No weak ciphers (Cloudflare enforces)
✅ HSTS header (prevent protocol downgrade)
```

### A03: Injection

```
✅ JPA parameterised queries (no string concat)
✅ Bean Validation on all DTOs
✅ Input sanitisation before AI prompts
✅ No shell commands with user input
✅ Typed query parameters (no raw SQL)
```

### A04: Insecure Design

```
✅ Threat model documented (Section 2)
✅ Security by default (all endpoints protected)
✅ Fail secure (errors return safe defaults)
✅ Defence in depth (multiple layers)
✅ Escrow payment model (anti-fraud)
✅ Tamper-proof records (SHA-256)
```

### A05: Security Misconfiguration

```
✅ No default credentials
✅ Minimal admin exposure (no Swagger in prod)
✅ Error messages don't expose internals
✅ CORS whitelist (not wildcard *)
✅ Security headers on all responses
✅ Docker non-root user (production)
✅ No debug mode in production
```

### A06: Vulnerable Components

```
✅ OWASP Dependency Check (Maven plugin)
✅ Dependabot (GitHub — auto PRs for updates)
✅ npm audit (React apps — in CI/CD)
✅ flutter pub outdated (Flutter apps)
✅ Sentry monitors for known CVE impacts
✅ Quarterly manual dependency review

Maven plugin config:
<plugin>
  <groupId>org.owasp</groupId>
  <artifactId>dependency-check-maven</artifactId>
  <version>9.0.0</version>
  <configuration>
    <failBuildOnCVSS>7</failBuildOnCVSS>
    <!-- Fail if any HIGH/CRITICAL CVE -->
  </configuration>
</plugin>
```

### A07: Authentication Failures

```
✅ OTP brute force protection (3 attempts, 30-min lock)
✅ Rate limiting on auth endpoints
✅ Secure token storage (Flutter Keychain/Keystore)
✅ Token rotation on refresh
✅ Session invalidation on logout
✅ Admin 2FA mandatory
✅ Account lockout (5 failed admin logins)
```

### A08: Software and Data Integrity

```
✅ SHA-256 tamper-proof job records
✅ Webhook signature verification (Razorpay HMAC)
✅ Flyway migration checksums (schema integrity)
✅ Docker image hash pinning (production)
✅ GitHub secret scanning
✅ Signed APK release builds
```

### A09: Security Logging and Monitoring

```
✅ All API calls logged (api_logs)
✅ All sensitive actions in audit_logs
✅ Immutable audit log (trigger protection)
✅ Sentry error tracking + alerting
✅ Rate limit violations logged
✅ Admin actions logged
✅ Webhook signature failures logged
✅ Failed OTP attempts logged
```

### A10: SSRF

```
✅ No user-controlled URLs fetched by backend
   (Exception: Gemini File API — only used for
    pre-validated media uploaded by UPTIME system)
✅ External API calls use hardcoded base URLs
✅ No proxy or URL redirect functionality
✅ Cloudinary CDN URLs validated before use
✅ Google Maps API: only backend calls
   (no user-provided map URLs)
```

---

## 24. Compliance

### Digital Personal Data Protection (DPDP) Act, 2023 and DPDP Rules

```
Data minimisation:
  → Collect only necessary data
  → Aadhaar: store only last 4 digits (masked)
  → PAN: store only last 4 digits (masked)
  → Bank account: encrypted, access-controlled

Consent:
  → Explicit consent at signup (checkbox)
  → Separate consent for marketing
  → Cookie consent banner (web)
  → Stored in cookie_consents table
  → User can withdraw consent in settings

Data subject rights:
  GET  /users/me/data-export  → Download all data
  POST /users/me/delete       → Request deletion
  Response time: 30 days maximum

Data localization (when enforced):
  → Supabase: select India region
  → Cloudinary: India CDN
  → Railway: India data center

Data breach notification:
  → Notify DPDP Act authority within 72 hours
  → Notify affected users within 72 hours
  → Incident response plan: Section 26
```

### GST Compliance

```
GST calculations:
  → Intra-state: CGST (9%) + SGST (9%) = 18%
  → Inter-state: IGST (18%)
  → Determine by: owner's state vs UPTIME's state

GST records:
  → Every transaction: gst_records table
  → Monthly GSTR-1 export (downloadable by admin)
  → Technician GST number stored + verified
  → Invoice includes: HSN code, GSTIN, tax breakdown

TDS on payments:
  → Section 194C: 1% TDS on payments > ₹30,000
  → Annual limit: ₹1,00,000
  → Deducted at source during payout
  → Form 26AS: available for tech download

PAN requirement:
  → Annual earnings > ₹50,000: PAN mandatory
  → Verification: NSDL PAN verification API
  → Stored: pan_number_masked (last 4 + type)
```

### GDPR (for future EU expansion)

```
Currently: Not applicable (India only)
Prepared for:
  → Data export API ready
  → Data deletion API ready
  → Consent management ready
  → 30-day deletion timeline documented
  → Data processing records maintained
```

---

## 25. Security Testing

### OWASP ZAP Automated Scan

```bash
# Run before every production deployment
# CI/CD: GitHub Actions workflow

- name: OWASP ZAP Security Scan
  uses: zaproxy/action-full-scan@v0.10.0
  with:
    target: 'https://staging-api.uptime.in'
    rules_file_name: '.zap/rules.tsv'
    cmd_options: '-a'
    # -a = include alpha rules

# rules.tsv configures what to alert/fail on:
# 10016  PASS   Web Browser XSS Protection
# 10020  FAIL   X-Frame-Options
# 10021  FAIL   X-Content-Type-Options
# 40012  FAIL   SQL Injection (active)
# 40018  FAIL   SQL Injection (active)

# Fail build if HIGH or CRITICAL findings
```

### Postman Security Test Collection

```
Postman collection: UPTIME_Security_Tests.json

Test cases:
  Auth bypass:
    → Access /jobs without token → expect 401
    → Access /jobs with expired token → expect 401
    → Access /admin with OWNER token → expect 403
    → Access another user's job → expect 403

  Injection:
    → SQL in phone field: "'; DROP TABLE users; --"
    → XSS in description: "<script>alert(1)</script>"
    → Both should return 400 (validation) not 500

  Rate limiting:
    → Send 101 requests in 1 minute → expect 429
    → Send 6 OTPs in 10 minutes → expect 429

  OTP security:
    → Try wrong OTP 3 times → expect lockout
    → Try OTP after expiry → expect AUTH_002
    → Try used OTP again → expect AUTH_002

  File upload:
    → Upload .exe disguised as .jpg → expect 400
    → Upload 200MB file → expect 400
    → Upload PDF as image → expect 400 (magic bytes)
```

### Dependency Scanning

```xml
<!-- pom.xml — OWASP dependency check -->
<plugin>
  <groupId>org.owasp</groupId>
  <artifactId>dependency-check-maven</artifactId>
  <version>9.0.0</version>
  <executions>
    <execution>
      <goals><goal>check</goal></goals>
    </execution>
  </executions>
  <configuration>
    <failBuildOnCVSS>7</failBuildOnCVSS>
    <suppressionFile>
      .owasp-suppressions.xml
    </suppressionFile>
  </configuration>
</plugin>
```

### Security Checklist (Pre-Deploy)

```
Before every production deployment:
□ OWASP ZAP scan passed (no HIGH/CRITICAL)
□ Dependency check passed (no CVSS ≥ 7)
□ Postman security tests all passing
□ No secrets in latest commits (GitHub scan)
□ All new endpoints have @PreAuthorize
□ New DTOs have Bean Validation annotations
□ Audit logging added for new sensitive actions
□ Rate limiting applied to new public endpoints
□ Error messages reviewed (no stack traces)
□ New file upload endpoints validated
```

---

## 26. Incident Response

### Severity Levels

```
P1 — CRITICAL (respond in 1 hour):
  → Active data breach (PII exposed)
  → Payment system compromised
  → Admin account hijacked
  → SQL injection confirmed
  → Service completely down

P2 — HIGH (respond in 4 hours):
  → Suspected data breach
  → Mass account enumeration
  → Webhook signature bypass
  → DDoS causing degraded service

P3 — MEDIUM (respond next business day):
  → Unusual login patterns detected
  → Dependency with HIGH CVE found
  → Rate limit bypass detected
  → Suspicious bulk downloads

P4 — LOW (respond within 1 week):
  → Security header misconfiguration
  → Dependency with MEDIUM CVE
  → Minor information disclosure
```

### Response Playbook

```
Step 1: DETECT
  → Sentry alert, UptimeRobot, user report,
    GitHub secret scan, Cloudflare WAF alert

Step 2: CONTAIN
  → P1: Immediately block affected IP/account
  → Disable compromised API key
  → Force-logout affected users (Redis delete)
  → Enable maintenance mode if needed

Step 3: ASSESS
  → What data was exposed?
  → How many users affected?
  → How long was the breach active?
  → Root cause identified?

Step 4: NOTIFY
  → DPDP Act: Within 72 hours (P1 breach)
  → Affected users: Within 72 hours
  → Team: Immediate (group chat)
  → VTU/DSATM guide: Within 24 hours (PBL context)

Step 5: REMEDIATE
  → Fix the vulnerability
  → Deploy patched version
  → Rotate exposed credentials
  → Audit affected records

Step 6: REVIEW
  → Post-mortem document
  → Update threat model
  → Add test case for the vulnerability
  → Update runbook with lessons learned
```

### Emergency Contacts

```
API key compromise:
  Razorpay: +91-22-68528880 (24/7 fraud line)
  Firebase: console.firebase.google.com (disable key)
  Twilio:   emergency@twilio.com
  Supabase: support@supabase.com

Payment fraud:
  Razorpay fraud: razorpay.com/support
  Bank: Contact account bank directly

Legal (India DPDP Act):
  Data Protection Board: (when operational)
  Legal counsel: Retain before launch
```

---

*UPTIME Security Documentation — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*

---

## Appendix — Additional Attack Mitigations

### Man-in-the-Middle (MITM) Attack Prevention

```
MITM occurs when attacker intercepts communication
between client and server.

Prevention layers:

1. TLS 1.3 (transport layer)
   → All traffic encrypted end-to-end
   → Cloudflare terminates SSL at edge
   → No plaintext HTTP allowed (HSTS enforced)
   → Certificate pinned in Flutter apps

2. Certificate Pinning (mobile)
   → Flutter apps bundle expected cert fingerprint
   → Reject connections with unexpected certificate
   → Prevents rogue CA / corp proxy MITM

3. HSTS Header (web)
   Strict-Transport-Security: max-age=31536000
   → Browser never allows HTTP fallback
   → Prevents SSL stripping attacks

4. Public Key Infrastructure
   → RS256 JWT: asymmetric keys
   → Even if token intercepted, cannot forge new tokens
     without private key (server-only)

5. WebSocket security (WSS)
   → All WebSocket connections over WSS (not WS)
   → Same TLS protection as HTTPS
   → JWT required in STOMP CONNECT frame
```

### Replay Attack Prevention

```
Replay attack: attacker captures a valid request
and resends it to achieve an unauthorized action.

Prevention per attack surface:

1. JWT replay prevention
   → Short expiry (24h access, 30d refresh)
   → jti (JWT ID) claim — unique per token
   → Session check in Redis (deleted on logout)
   → Token rotation: refresh token single-use

2. OTP replay prevention
   → OTP deleted from Redis on first successful use
   → Single-use: second use returns AUTH_002
   → Short expiry (10 minutes)

3. Webhook replay prevention
   → Idempotency key stored in Redis (24h)
   → Same Razorpay event_id processed only once
   → Redis key: webhook:processed:{eventId}

4. Payment replay prevention
   → Razorpay order_id single-use
   → idempotency_key column on transactions
   → Duplicate order_id → 409 Conflict

5. Arrival OTP replay prevention
   → OTP + GPS check combined
   → OTP valid only for the specific job_id
   → Cannot reuse an OTP from job A for job B
   → Deleted immediately after successful verification

6. API request replay prevention
   → Rate limiting catches bulk replays
   → Idempotent GET requests: safe to replay
   → POST requests: unique job/transaction IDs
     prevent duplicate resource creation
```



---

## 25. Technician KYC & Aadhaar Security Protocol

> **Specification Reference:** [TECHNICIAN_VERIFICATION.md](file:///F:/uptime/TECHNICIAN_VERIFICATION.md). Implements strict UIDAI Aadhaar handling restrictions, DPDP Act 2023 compliance, signed temporary document URLs, automated raw image purging, and production startup guards.

### Aadhaar Storage & UIDAI Rules (TECHNICIAN_VERIFICATION.md Section 4.4)

```
NEVER store:  full Aadhaar number, Aadhaar XML, QR payload, biometric data.
NEVER log:    any 12-digit number (add a log filter that masks \b\d{12}\b).
STORE:        aadhaar_last4, name_on_id, year_of_birth, is_adult, method, provider_reference,
              name_match_score, consent text version + timestamp, verified_at.
IF an ID image is uploaded: mask the first 8 digits BEFORE storing, store privately, and
              auto-delete 30 days after the decision. Keep only the decision + metadata.
```

---

### KYC Security, Encryption & DPDP Act Compliance (TECHNICIAN_VERIFICATION.md Section 13)

```
- Documents stored PRIVATE (Cloudinary "authenticated"/private delivery or private bucket).
  Never put a KYC file behind a public URL. Admin views use signed URLs that expire in 5 minutes.
- PAN and bank account number encrypted at rest (AES-256-GCM). UI shows masked values.
- Only ADMIN with KYC_REVIEWER permission may open documents. Everyone else gets 403.
- Purge job (daily): delete raw ID images/selfies past delete_after (default 30 days after decision).
  Keep decision + metadata + audit log.
- Consent is stored and versioned. Technician can withdraw consent -> account moves to SUSPENDED
  until they re-verify; raw data deleted on request (except what law requires).
- Logging: mask 12-digit numbers, PAN pattern, bank account numbers.
- Law reference in SECURITY.md Section 24 is outdated: replace "PDPB 2023 (Bill)" with the
  Digital Personal Data Protection (DPDP) Act, 2023 and the DPDP Rules, 2025; confirm the current
  phase-in dates before launch.
- Rate limits: 3 identity attempts/day, 3 skill-test attempts/trade, 5 document uploads/hour.
```

