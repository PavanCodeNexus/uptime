# UPTIME — Complete Project Structure

> **Version:** 1.0  
> **Project:** AI-Assisted On-Demand Technician Dispatch Platform  
> **Institution:** DSATM Bengaluru — VTU  
> **Academic Year:** 2026–27  

---

## Table of Contents

1. [Repository Overview](#1-repository-overview)
2. [GitHub Organisation Setup](#2-github-organisation-setup)
3. [uptime-backend — Spring Boot](#3-uptime-backend--spring-boot)
4. [uptime-owner-web — React PWA](#4-uptime-owner-web--react-pwa)
5. [uptime-owner-app — Flutter](#5-uptime-owner-app--flutter)
6. [uptime-tech-web — React](#6-uptime-tech-web--react)
7. [uptime-technician-app — Flutter](#7-uptime-technician-app--flutter)
8. [uptime-admin-web — React](#8-uptime-admin-web--react)
9. [uptime-shared — TypeScript Package](#9-uptime-shared--typescript-package)
10. [uptime-docs — Documentation](#10-uptime-docs--documentation)
11. [Root Level Files](#11-root-level-files)
12. [GitHub Actions Workflows](#12-github-actions-workflows)
13. [Docker Configuration](#13-docker-configuration)
14. [Environment Files](#14-environment-files)
15. [Database Migration Files](#15-database-migration-files)
16. [AI Prompt Files](#16-ai-prompt-files)
17. [Configuration Files](#17-configuration-files)

---

## 1. Repository Overview

```
GitHub Organisation: uptime-platform
Total Repositories:  8

uptime-platform/
├── uptime-backend/           Spring Boot Java — main API
├── uptime-owner-web/         React 18 PWA — owner web app
├── uptime-owner-app/         Flutter — owner mobile app
├── uptime-tech-web/          React 18 — technician web app
├── uptime-technician-app/    Flutter — technician field app
├── uptime-admin-web/         React 18 — admin command center
├── uptime-shared/            TypeScript shared types + utils
└── uptime-docs/              All documentation + reports
```

---

## 2. GitHub Organisation Setup

```
uptime-platform/
├── .github/
│   ├── CODEOWNERS                    # Code ownership rules
│   ├── pull_request_template.md      # PR template (all repos)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md             # Bug report template
│   │   ├── feature_request.md        # Feature request template
│   │   └── task.md                   # General task template
│   └── workflows/                    # CI/CD (per repo — see section 12)
│
├── Teams (GitHub Organisation Teams):
│   ├── tech-lead/                    # Member 1 — Pavan (admin all repos)
│   ├── backend-dev/                  # Member 2 (write: backend)
│   ├── frontend-dev/                 # Member 3 (write: all UI repos)
│   └── qa-docs/                      # Member 4 (write: docs, read: all)
│
├── Projects (GitHub Kanban):
│   └── UPTIME Development Board
│       ├── Backlog
│       ├── In Progress
│       ├── In Review
│       ├── Done
│       └── Bug
│
└── Milestones:
    ├── Week 1-2: Foundation
    ├── Week 3-4: Core Backend + AI
    ├── Week 5-6: Matching + Owner Web
    ├── Week 7-8: Mobile + Payments
    ├── Week 9-10: Unique Features
    ├── Week 11: Testing
    └── Week 12: PBL Submission
```

---

## 3. uptime-backend — Spring Boot

```
uptime-backend/
│
├── 📄 pom.xml                              # Maven dependencies + plugins
├── 📄 .env                                 # Local env vars (NEVER commit)
├── 📄 .env.example                         # Template (committed to git)
├── 📄 .gitignore                           # Ignores target/, .env, *.class
├── 📄 Dockerfile                           # Docker build for Railway
├── 📄 .dockerignore                        # Excludes target/, .git
├── 📄 README.md                            # Backend setup guide
│
├── 📁 .github/workflows/
│   └── backend.yml                         # CI/CD pipeline
│
├── 📁 src/
│   ├── 📁 main/
│   │   ├── 📁 java/com/uptime/
│   │   │   │
│   │   │   ├── 📄 UptimeApplication.java           # Main class + @EnableCaching
│   │   │   │
│   │   │   ├── 📁 config/
│   │   │   │   ├── SecurityConfig.java             # Spring Security + JWT filter chain
│   │   │   │   ├── WebSocketConfig.java            # STOMP WebSocket config
│   │   │   │   ├── RedisConfig.java                # Upstash Redis + cache manager
│   │   │   │   ├── RabbitMQConfig.java             # Exchanges, queues, bindings
│   │   │   │   ├── SwaggerConfig.java              # Springdoc OpenAPI config
│   │   │   │   ├── CorsConfig.java                 # CORS whitelist config
│   │   │   │   ├── MailConfig.java                 # SendGrid email config
│   │   │   │   ├── CloudinaryConfig.java           # Cloudinary SDK config
│   │   │   │   ├── AsyncConfig.java                # @Async thread pool config
│   │   │   │   ├── FirebaseConfig.java             # Firebase Admin SDK init
│   │   │   │   └── AgoraConfig.java                # Agora token generator config
│   │   │   │
│   │   │   ├── 📁 common/
│   │   │   │   ├── 📁 constants/
│   │   │   │   │   ├── AppConstants.java           # App-wide constants
│   │   │   │   │   ├── ApiRoutes.java              # All API route strings
│   │   │   │   │   ├── ErrorCodes.java             # All error code strings
│   │   │   │   │   ├── CacheNames.java             # Redis cache name constants
│   │   │   │   │   └── QueueNames.java             # RabbitMQ queue name constants
│   │   │   │   │
│   │   │   │   ├── 📁 enums/
│   │   │   │   │   ├── Industry.java               # INDUSTRIAL, AUTOMOBILE, ELECTRONICS
│   │   │   │   │   ├── JobStatus.java              # POSTED → COMPLETED
│   │   │   │   │   ├── JobUrgency.java             # LOW, MEDIUM, HIGH, CRITICAL
│   │   │   │   │   ├── UserType.java               # OWNER, TECHNICIAN, ADMIN
│   │   │   │   │   ├── PaymentStatus.java          # INITIATED → COMPLETED
│   │   │   │   │   ├── NotificationType.java       # All notification types
│   │   │   │   │   ├── VerificationStatus.java     # PENDING, APPROVED, REJECTED
│   │   │   │   │   └── FuelType.java               # PETROL, DIESEL, CNG, EV
│   │   │   │   │
│   │   │   │   ├── 📁 exceptions/
│   │   │   │   │   ├── GlobalExceptionHandler.java # @ControllerAdvice — all errors
│   │   │   │   │   ├── ResourceNotFoundException.java   # 404
│   │   │   │   │   ├── UnauthorizedException.java       # 401/403
│   │   │   │   │   ├── BusinessRuleException.java       # 422
│   │   │   │   │   ├── PaymentException.java            # 402
│   │   │   │   │   ├── AIServiceException.java          # 503 degraded
│   │   │   │   │   └── ValidationException.java         # 400
│   │   │   │   │
│   │   │   │   ├── 📁 response/
│   │   │   │   │   ├── ApiResponse.java            # Standard {success, data, message}
│   │   │   │   │   ├── PagedResponse.java          # Paginated list response
│   │   │   │   │   └── ErrorResponse.java          # Standard error format
│   │   │   │   │
│   │   │   │   └── 📁 utils/
│   │   │   │       ├── HashUtils.java              # SHA-256 tamper-proof hashing
│   │   │   │       ├── GeoUtils.java               # Haversine distance fallback
│   │   │   │       ├── OTPUtils.java               # 6-digit OTP generation
│   │   │   │       ├── DateUtils.java              # Date formatting helpers
│   │   │   │       ├── InvoiceNumberUtils.java     # UPT-2026-XXXXX generator
│   │   │   │       ├── PhoneUtils.java             # Phone validation + formatting
│   │   │   │       └── FileUtils.java              # MIME type + magic bytes check
│   │   │   │
│   │   │   ├── 📁 security/
│   │   │   │   ├── JwtTokenProvider.java           # JWT generate + validate (RS256)
│   │   │   │   ├── JwtAuthFilter.java              # OncePerRequestFilter — JWT check
│   │   │   │   ├── RateLimitFilter.java            # Redis token bucket rate limiter
│   │   │   │   ├── CustomUserDetails.java          # Spring Security user details
│   │   │   │   ├── CustomUserDetailsService.java   # Load user from Supabase
│   │   │   │   └── JobSecurityService.java         # @PreAuthorize custom expressions
│   │   │   │
│   │   │   ├── 📁 modules/
│   │   │   │   │
│   │   │   │   ├── 📁 auth/
│   │   │   │   │   ├── AuthController.java         # POST /auth/* endpoints
│   │   │   │   │   ├── AuthService.java            # Interface
│   │   │   │   │   ├── AuthServiceImpl.java        # Login, signup, OTP verify logic
│   │   │   │   │   ├── OTPService.java             # Generate + store + verify OTP
│   │   │   │   │   ├── RefreshTokenService.java    # Refresh token rotation
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── LoginRequest.java
│   │   │   │   │       ├── SignupRequest.java
│   │   │   │   │       ├── OTPRequest.java
│   │   │   │   │       ├── OTPVerifyRequest.java
│   │   │   │   │       ├── RefreshTokenRequest.java
│   │   │   │   │       └── AuthResponse.java
│   │   │   │   │
│   │   │   │   ├── 📁 user/
│   │   │   │   │   ├── UserController.java         # GET/PUT /users/*
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── UserServiceImpl.java
│   │   │   │   │   ├── UserRepository.java         # JpaRepository<User, Long>
│   │   │   │   │   ├── UserAddressRepository.java
│   │   │   │   │   ├── UserPreferencesRepository.java
│   │   │   │   │   ├── User.java                   # @Entity users table
│   │   │   │   │   ├── UserAddress.java            # @Entity user_addresses
│   │   │   │   │   ├── UserPreferences.java        # @Entity user_preferences
│   │   │   │   │   ├── UserDevice.java             # @Entity user_devices
│   │   │   │   │   ├── Referral.java               # @Entity referrals
│   │   │   │   │   ├── UserMapper.java             # MapStruct mapper
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── UserDTO.java
│   │   │   │   │       ├── UserUpdateRequest.java
│   │   │   │   │       ├── AddressDTO.java
│   │   │   │   │       ├── AddressCreateRequest.java
│   │   │   │   │       └── PreferencesDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 technician/
│   │   │   │   │   ├── TechnicianController.java
│   │   │   │   │   ├── TechnicianService.java
│   │   │   │   │   ├── TechnicianServiceImpl.java
│   │   │   │   │   ├── TechnicianRepository.java
│   │   │   │   │   ├── TechnicianLocationRepository.java
│   │   │   │   │   ├── TechnicianSkillRepository.java
│   │   │   │   │   ├── TechnicianBadgeRepository.java
│   │   │   │   │   ├── SkillService.java           # Skill CRUD + tag matching
│   │   │   │   │   ├── VerificationService.java    # Document verify + admin approval
│   │   │   │   │   ├── LocationService.java        # Update live GPS location
│   │   │   │   │   ├── BadgeService.java           # Badge criteria check + award
│   │   │   │   │   ├── FatigueService.java         # Fatigue score calculation
│   │   │   │   │   ├── Technician.java
│   │   │   │   │   ├── TechnicianSkill.java
│   │   │   │   │   ├── TechnicianDocument.java
│   │   │   │   │   ├── TechnicianVerification.java
│   │   │   │   │   ├── TechnicianLocation.java
│   │   │   │   │   ├── TechnicianAvailability.java
│   │   │   │   │   ├── TechnicianServiceArea.java
│   │   │   │   │   ├── TechnicianStatistics.java
│   │   │   │   │   ├── TechnicianBadge.java
│   │   │   │   │   ├── TechnicianBankAccount.java
│   │   │   │   │   ├── TechnicianMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── TechnicianDTO.java
│   │   │   │   │       ├── TechnicianProfileRequest.java
│   │   │   │   │       ├── SkillDTO.java
│   │   │   │   │       ├── AvailabilityDTO.java
│   │   │   │   │       ├── LocationUpdateRequest.java
│   │   │   │   │       ├── EarningsDTO.java
│   │   │   │   │       ├── BadgeDTO.java
│   │   │   │   │       └── NearbyTechnicianDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 job/
│   │   │   │   │   ├── JobController.java
│   │   │   │   │   ├── JobService.java
│   │   │   │   │   ├── JobServiceImpl.java
│   │   │   │   │   ├── JobRepository.java
│   │   │   │   │   ├── JobMediaRepository.java
│   │   │   │   │   ├── JobChecklistRepository.java
│   │   │   │   │   ├── JobDisputeRepository.java
│   │   │   │   │   ├── JobAuctionRepository.java
│   │   │   │   │   ├── ChecklistService.java       # Checklist CRUD + step verify
│   │   │   │   │   ├── DisputeService.java         # Dispute lifecycle
│   │   │   │   │   ├── AuctionService.java         # Auction timer + bonus increment
│   │   │   │   │   ├── OTPVerificationService.java # Arrival OTP + GPS verify
│   │   │   │   │   ├── CertificateService.java     # PDF certificate generation
│   │   │   │   │   ├── TamperProofService.java     # SHA-256 hash lock
│   │   │   │   │   ├── Job.java
│   │   │   │   │   ├── JobMedia.java
│   │   │   │   │   ├── JobStatusHistory.java
│   │   │   │   │   ├── JobChecklist.java
│   │   │   │   │   ├── JobChecklistItem.java
│   │   │   │   │   ├── JobPartsUsed.java
│   │   │   │   │   ├── JobTimeline.java
│   │   │   │   │   ├── JobCancellation.java
│   │   │   │   │   ├── JobDispute.java
│   │   │   │   │   ├── JobAuction.java
│   │   │   │   │   ├── JobAuctionBid.java
│   │   │   │   │   ├── JobOTPVerification.java
│   │   │   │   │   ├── JobMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── JobCreateRequest.java
│   │   │   │   │       ├── JobDTO.java
│   │   │   │   │       ├── JobSummaryDTO.java
│   │   │   │   │       ├── JobStatusUpdateRequest.java
│   │   │   │   │       ├── ChecklistDTO.java
│   │   │   │   │       ├── ChecklistItemDTO.java
│   │   │   │   │       ├── PartsUsedDTO.java
│   │   │   │   │       ├── DisputeCreateRequest.java
│   │   │   │   │       ├── DisputeDTO.java
│   │   │   │   │       ├── AuctionDTO.java
│   │   │   │   │       └── OTPVerifyRequest.java
│   │   │   │   │
│   │   │   │   ├── 📁 ai/
│   │   │   │   │   ├── AIController.java           # POST /ai/* endpoints
│   │   │   │   │   ├── GeminiService.java          # Core Gemini REST client
│   │   │   │   │   ├── GeminiServiceImpl.java
│   │   │   │   │   ├── FaultTriageService.java     # Multi-modal fault analysis
│   │   │   │   │   ├── SoundAnalysisService.java   # Audio FFT fault detection
│   │   │   │   │   ├── ImageAnalysisService.java   # Visual damage assessment
│   │   │   │   │   ├── RepairCopilotService.java   # Step-by-step repair guide
│   │   │   │   │   ├── EpidemicDetectionService.java # Fault pattern clustering
│   │   │   │   │   ├── SilentKillerService.java    # Hazard detection
│   │   │   │   │   ├── PredictionService.java      # Failure prediction
│   │   │   │   │   ├── NegotiationService.java     # Fair price calculation
│   │   │   │   │   ├── TranslationService.java     # 9-language translation
│   │   │   │   │   ├── OCRService.java             # Warranty card OCR
│   │   │   │   │   ├── WikiExtractionService.java  # Extract knowledge from jobs
│   │   │   │   │   ├── PromptManager.java          # Load + version prompts
│   │   │   │   │   ├── AIFaultDiagnosis.java       # @Entity
│   │   │   │   │   ├── AISoundAnalysis.java
│   │   │   │   │   ├── AIImageAnalysis.java
│   │   │   │   │   ├── AICopilotSession.java
│   │   │   │   │   ├── AICopilotStep.java
│   │   │   │   │   ├── EpidemicDetection.java
│   │   │   │   │   ├── EpidemicAffectedUser.java
│   │   │   │   │   ├── SilentKillerAlert.java
│   │   │   │   │   ├── RepairPrediction.java
│   │   │   │   │   ├── AIPromptVersion.java
│   │   │   │   │   ├── AIMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── DiagnosisRequest.java
│   │   │   │   │       ├── DiagnosisResponse.java
│   │   │   │   │       ├── SoundAnalysisRequest.java
│   │   │   │   │       ├── SoundAnalysisResponse.java
│   │   │   │   │       ├── CopilotStepDTO.java
│   │   │   │   │       ├── PredictionDTO.java
│   │   │   │   │       ├── NegotiationRequest.java
│   │   │   │   │       └── NegotiationResponse.java
│   │   │   │   │
│   │   │   │   ├── 📁 matching/
│   │   │   │   │   ├── MatchingController.java
│   │   │   │   │   ├── MatchingService.java
│   │   │   │   │   ├── MatchingServiceImpl.java
│   │   │   │   │   ├── ScoringEngine.java          # Core algorithm (40/60 weights)
│   │   │   │   │   ├── DispatchService.java        # Notify techs + handle acceptance
│   │   │   │   │   ├── SurgePricingService.java    # Surge multiplier calculation
│   │   │   │   │   ├── AuctionTimerService.java    # Countdown + bonus increment
│   │   │   │   │   ├── MatchingRequest.java        # @Entity
│   │   │   │   │   ├── MatchingScore.java
│   │   │   │   │   ├── TechnicianDispatchHistory.java
│   │   │   │   │   ├── SurgePricing.java
│   │   │   │   │   ├── LiveLocationTracking.java
│   │   │   │   │   ├── JobNotificationSent.java
│   │   │   │   │   ├── MatchingMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── MatchingRequest.java
│   │   │   │   │       ├── MatchingResult.java
│   │   │   │   │       ├── TechnicianScoreDTO.java
│   │   │   │   │       └── AuctionStatusDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 payment/
│   │   │   │   │   ├── PaymentController.java
│   │   │   │   │   ├── PaymentService.java
│   │   │   │   │   ├── PaymentServiceImpl.java
│   │   │   │   │   ├── RazorpayService.java        # Orders + webhook + payout API
│   │   │   │   │   ├── WalletService.java          # Credit/debit wallet ledger
│   │   │   │   │   ├── PayoutService.java          # Daily payout processing
│   │   │   │   │   ├── InvoiceService.java         # PDF invoice generation (iText)
│   │   │   │   │   ├── GSTService.java             # CGST/SGST/IGST calculation
│   │   │   │   │   ├── SubscriptionService.java    # Plan management + renewal
│   │   │   │   │   ├── WebhookHandler.java         # Razorpay webhook + HMAC verify
│   │   │   │   │   ├── Transaction.java            # @Entity
│   │   │   │   │   ├── WalletTransaction.java
│   │   │   │   │   ├── Payout.java
│   │   │   │   │   ├── Subscription.java
│   │   │   │   │   ├── SubscriptionPlan.java
│   │   │   │   │   ├── Invoice.java
│   │   │   │   │   ├── GSTRecord.java
│   │   │   │   │   ├── Refund.java
│   │   │   │   │   ├── PaymentMethod.java
│   │   │   │   │   ├── PlatformRevenue.java
│   │   │   │   │   ├── PaymentMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── PaymentInitRequest.java
│   │   │   │   │       ├── PaymentInitResponse.java
│   │   │   │   │       ├── PaymentVerifyRequest.java
│   │   │   │   │       ├── WalletDTO.java
│   │   │   │   │       ├── PayoutDTO.java
│   │   │   │   │       ├── InvoiceDTO.java
│   │   │   │   │       └── SubscriptionDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 notification/
│   │   │   │   │   ├── NotificationController.java
│   │   │   │   │   ├── NotificationService.java
│   │   │   │   │   ├── NotificationServiceImpl.java
│   │   │   │   │   ├── FCMService.java             # Firebase push notifications
│   │   │   │   │   ├── SMSService.java             # Twilio SMS
│   │   │   │   │   ├── EmailService.java           # SendGrid email
│   │   │   │   │   ├── WhatsAppService.java        # Twilio WhatsApp
│   │   │   │   │   ├── TemplateService.java        # Multilingual template engine
│   │   │   │   │   ├── MassNotificationService.java # Bulk notifications
│   │   │   │   │   ├── Notification.java           # @Entity
│   │   │   │   │   ├── NotificationTemplate.java
│   │   │   │   │   ├── NotificationPreference.java
│   │   │   │   │   ├── MassNotification.java
│   │   │   │   │   ├── NotificationAnalytics.java
│   │   │   │   │   ├── PushDeliveryLog.java
│   │   │   │   │   ├── NotificationMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── NotificationDTO.java
│   │   │   │   │       ├── SendNotificationRequest.java
│   │   │   │   │       └── MassNotificationRequest.java
│   │   │   │   │
│   │   │   │   ├── 📁 tracking/
│   │   │   │   │   ├── TrackingController.java
│   │   │   │   │   ├── TrackingService.java
│   │   │   │   │   ├── TrackingServiceImpl.java
│   │   │   │   │   ├── WebSocketHandler.java       # STOMP message handler
│   │   │   │   │   ├── LocationBroadcastService.java # Broadcast to subscribers
│   │   │   │   │   ├── ETAService.java             # Google Maps ETA calculation
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── LocationUpdateMessage.java
│   │   │   │   │       ├── LocationBroadcast.java
│   │   │   │   │       └── TrackingSessionDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 rating/
│   │   │   │   │   ├── RatingController.java
│   │   │   │   │   ├── RatingService.java
│   │   │   │   │   ├── RatingServiceImpl.java
│   │   │   │   │   ├── TrustScoreService.java      # Weighted rolling avg
│   │   │   │   │   ├── NPSService.java             # NPS survey management
│   │   │   │   │   ├── JobRating.java              # @Entity
│   │   │   │   │   ├── RatingCategory.java
│   │   │   │   │   ├── TechnicianTrustScore.java
│   │   │   │   │   ├── OwnerTrustScore.java
│   │   │   │   │   ├── PlatformNPS.java
│   │   │   │   │   ├── ReviewReport.java
│   │   │   │   │   ├── RatingAnalytics.java
│   │   │   │   │   ├── RatingMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── RatingCreateRequest.java
│   │   │   │   │       ├── RatingDTO.java
│   │   │   │   │       └── TrustScoreDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 industry/
│   │   │   │   │   ├── 📁 industrial/
│   │   │   │   │   │   ├── MachineController.java
│   │   │   │   │   │   ├── MachineService.java
│   │   │   │   │   │   ├── MachineServiceImpl.java
│   │   │   │   │   │   ├── MachineRepository.java
│   │   │   │   │   │   ├── Machine.java            # @Entity machines
│   │   │   │   │   │   ├── MachineServiceHistory.java
│   │   │   │   │   │   ├── WorkshopInventory.java
│   │   │   │   │   │   ├── MachineMapper.java
│   │   │   │   │   │   └── dto/
│   │   │   │   │   │       ├── MachineDTO.java
│   │   │   │   │   │       ├── MachineCreateRequest.java
│   │   │   │   │   │       └── ServiceHistoryDTO.java
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 automobile/
│   │   │   │   │   │   ├── VehicleController.java
│   │   │   │   │   │   ├── VehicleService.java
│   │   │   │   │   │   ├── VehicleServiceImpl.java
│   │   │   │   │   │   ├── VehicleRepository.java
│   │   │   │   │   │   ├── Vehicle.java
│   │   │   │   │   │   ├── VehicleDocument.java
│   │   │   │   │   │   ├── VehicleServiceHistory.java
│   │   │   │   │   │   ├── VehicleFuelLog.java
│   │   │   │   │   │   ├── DriverSafetyScore.java
│   │   │   │   │   │   ├── PrePurchaseScan.java
│   │   │   │   │   │   ├── VehicleScanDetail.java
│   │   │   │   │   │   ├── EngineFingerprint.java
│   │   │   │   │   │   ├── VehicleMoodScore.java
│   │   │   │   │   │   ├── VehicleMapper.java
│   │   │   │   │   │   └── dto/
│   │   │   │   │   │       ├── VehicleDTO.java
│   │   │   │   │   │       ├── VehicleCreateRequest.java
│   │   │   │   │   │       ├── FuelLogDTO.java
│   │   │   │   │   │       ├── SafetyScoreDTO.java
│   │   │   │   │   │       └── PrePurchaseScanDTO.java
│   │   │   │   │   │
│   │   │   │   │   └── 📁 electronics/
│   │   │   │   │       ├── DeviceController.java
│   │   │   │   │       ├── DeviceService.java
│   │   │   │   │       ├── DeviceServiceImpl.java
│   │   │   │   │       ├── DeviceRepository.java
│   │   │   │   │       ├── Device.java
│   │   │   │   │       ├── DeviceHealthLog.java
│   │   │   │   │       ├── DeviceServiceHistory.java
│   │   │   │   │       ├── SmartHomeConnection.java
│   │   │   │   │       ├── IoTSensorReading.java
│   │   │   │   │       ├── DeviceMapper.java
│   │   │   │   │       └── dto/
│   │   │   │   │           ├── DeviceDTO.java
│   │   │   │   │           ├── DeviceCreateRequest.java
│   │   │   │   │           ├── HealthLogDTO.java
│   │   │   │   │           └── SmartHomeDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 digital_twin/
│   │   │   │   │   ├── DigitalTwinController.java
│   │   │   │   │   ├── DigitalTwinService.java
│   │   │   │   │   ├── DigitalTwinServiceImpl.java
│   │   │   │   │   ├── DigitalTwinRepository.java
│   │   │   │   │   ├── DigitalTwin.java
│   │   │   │   │   ├── DigitalTwinComponent.java
│   │   │   │   │   ├── DigitalTwinMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── DigitalTwinDTO.java
│   │   │   │   │       └── ComponentHealthDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 insurance/
│   │   │   │   │   ├── InsuranceController.java
│   │   │   │   │   ├── InsuranceService.java
│   │   │   │   │   ├── InsuranceServiceImpl.java
│   │   │   │   │   ├── ClaimService.java
│   │   │   │   │   ├── WarrantyService.java
│   │   │   │   │   ├── AMCService.java
│   │   │   │   │   ├── MicroInsuranceService.java  # Per-job insurance
│   │   │   │   │   ├── InsurancePolicy.java
│   │   │   │   │   ├── InsuranceClaim.java
│   │   │   │   │   ├── Warranty.java
│   │   │   │   │   ├── AMCContract.java
│   │   │   │   │   ├── ExtendedWarranty.java
│   │   │   │   │   ├── JobMicroInsurance.java
│   │   │   │   │   ├── InsuranceMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── PolicyDTO.java
│   │   │   │   │       ├── ClaimCreateRequest.java
│   │   │   │   │       ├── ClaimDTO.java
│   │   │   │   │       └── WarrantyDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 marketplace/
│   │   │   │   │   ├── MarketplaceController.java
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   ├── ProductServiceImpl.java
│   │   │   │   │   ├── OrderService.java
│   │   │   │   │   ├── SellerService.java
│   │   │   │   │   ├── RefurbishedService.java
│   │   │   │   │   ├── SparePartsRequestService.java
│   │   │   │   │   ├── MarketplaceProduct.java
│   │   │   │   │   ├── MarketplaceSeller.java
│   │   │   │   │   ├── MarketplaceOrder.java
│   │   │   │   │   ├── MarketplaceOrderItem.java
│   │   │   │   │   ├── MarketplaceRefurbished.java
│   │   │   │   │   ├── SparePartsRequest.java
│   │   │   │   │   ├── MarketplaceMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── ProductDTO.java
│   │   │   │   │       ├── OrderDTO.java
│   │   │   │   │       ├── SellerDTO.java
│   │   │   │   │       └── RefurbishedDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 wiki/
│   │   │   │   │   ├── WikiController.java
│   │   │   │   │   ├── WikiService.java
│   │   │   │   │   ├── WikiServiceImpl.java
│   │   │   │   │   ├── ContributionService.java
│   │   │   │   │   ├── WikiArticle.java
│   │   │   │   │   ├── WikiVersion.java
│   │   │   │   │   ├── WikiContribution.java
│   │   │   │   │   ├── WikiVote.java
│   │   │   │   │   ├── WikiComment.java
│   │   │   │   │   ├── WikiMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── WikiArticleDTO.java
│   │   │   │   │       ├── WikiCreateRequest.java
│   │   │   │   │       └── WikiContributionDTO.java
│   │   │   │   │
│   │   │   │   ├── 📁 video/
│   │   │   │   │   ├── VideoController.java
│   │   │   │   │   ├── VideoService.java
│   │   │   │   │   ├── VideoServiceImpl.java
│   │   │   │   │   ├── AgoraService.java           # Token generation + channel mgmt
│   │   │   │   │   ├── FrameAnalysisService.java   # Gemini frame annotation
│   │   │   │   │   ├── VirtualConsultation.java
│   │   │   │   │   ├── JobLiveStream.java
│   │   │   │   │   ├── VideoMapper.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── ConsultationCreateRequest.java
│   │   │   │   │       ├── ConsultationDTO.java
│   │   │   │   │       ├── AgoraTokenResponse.java
│   │   │   │   │       └── FrameAnnotation.java
│   │   │   │   │
│   │   │   │   ├── 📁 analytics/
│   │   │   │   │   ├── AnalyticsController.java
│   │   │   │   │   ├── AnalyticsService.java
│   │   │   │   │   ├── AnalyticsServiceImpl.java
│   │   │   │   │   ├── PlatformAnalytics.java
│   │   │   │   │   ├── SearchLog.java
│   │   │   │   │   ├── ApiLog.java
│   │   │   │   │   ├── ErrorLog.java
│   │   │   │   │   ├── AuditLog.java
│   │   │   │   │   ├── UserActivityLog.java
│   │   │   │   │   ├── PlatformHealthScore.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── PlatformStatsDTO.java
│   │   │   │   │       └── HealthScoreDTO.java
│   │   │   │   │
│   │   │   │   └── 📁 admin/
│   │   │   │       ├── AdminController.java
│   │   │   │       ├── AdminService.java
│   │   │   │       ├── AdminServiceImpl.java
│   │   │   │       ├── VerificationQueueService.java
│   │   │   │       ├── DisputeResolutionService.java
│   │   │   │       ├── PlatformAnalyticsService.java
│   │   │   │       ├── FeatureFlagService.java
│   │   │   │       ├── PlatformSettingsService.java
│   │   │   │       ├── AdminUser.java
│   │   │   │       ├── AdminRole.java
│   │   │   │       ├── AdminPermission.java
│   │   │   │       ├── PlatformSettings.java
│   │   │   │       ├── FeatureFlag.java
│   │   │   │       ├── CookieConsent.java
│   │   │   │       ├── EndOfLifeRecord.java
│   │   │   │       ├── NftTransaction.java
│   │   │   │       ├── CarbonCredit.java
│   │   │   │       ├── ReferralCampaign.java
│   │   │   │       ├── AppVersion.java
│   │   │   │       ├── TamperProofVerification.java
│   │   │   │       ├── AuctionBonusHistory.java
│   │   │   │       ├── JobNegotiation.java
│   │   │   │       ├── AdminMapper.java
│   │   │   │       └── dto/
│   │   │   │           ├── AdminDTO.java
│   │   │   │           ├── VerificationDTO.java
│   │   │   │           ├── DisputeResolutionDTO.java
│   │   │   │           ├── PlatformStatsDTO.java
│   │   │   │           └── FeatureFlagDTO.java
│   │   │   │
│   │   │   └── 📁 scheduler/
│   │   │       ├── RepairPredictionScheduler.java  # 2 AM daily
│   │   │       ├── EpidemicDetectionScheduler.java # Every 5 mins
│   │   │       ├── ReminderScheduler.java          # 9 AM daily
│   │   │       ├── PayoutScheduler.java            # 11 AM daily
│   │   │       ├── RatingRecalculationScheduler.java # 3 AM daily
│   │   │       ├── WarrantyExpiryScheduler.java    # 8 AM Monday
│   │   │       └── PlatformHealthScheduler.java    # Every 10 mins
│   │   │
│   │   └── 📁 resources/
│   │       ├── application.yml                     # Main config
│   │       ├── application-development.yml         # Dev overrides
│   │       ├── application-staging.yml             # Staging overrides
│   │       ├── application-production.yml          # Prod overrides
│   │       ├── application-test.yml                # H2 test config
│   │       ├── logback-spring.xml                  # Logging config
│   │       │
│   │       ├── 📁 db/migration/                    # Flyway SQL files
│   │       │   ├── V1__create_users_and_auth.sql
│   │       │   ├── V2__create_technicians.sql
│   │       │   ├── V3__create_jobs_and_workflow.sql
│   │       │   ├── V4__create_ai_and_diagnosis.sql
│   │       │   ├── V5__create_matching.sql
│   │       │   ├── V6__create_payments.sql
│   │       │   ├── V7__create_ratings.sql
│   │       │   ├── V8__create_industry_specific.sql
│   │       │   ├── V9__create_insurance.sql
│   │       │   ├── V10__create_marketplace.sql
│   │       │   ├── V11__create_notifications.sql
│   │       │   ├── V12__create_analytics_and_logs.sql
│   │       │   ├── V13__create_wiki.sql
│   │       │   ├── V14__create_admin.sql
│   │       │   ├── V15__add_indexes_and_spatial.sql
│   │       │   ├── V16__add_triggers_and_views.sql
│   │       │   └── V17__seed_demo_data.sql
│   │       │
│   │       ├── 📁 prompts/                         # Gemini AI prompts
│   │       │   ├── fault_triage_v1.txt
│   │       │   ├── sound_analysis_v1.txt
│   │       │   ├── image_analysis_v1.txt
│   │       │   ├── copilot_step_v1.txt
│   │       │   ├── negotiation_v1.txt
│   │       │   ├── prediction_v1.txt
│   │       │   ├── epidemic_v1.txt
│   │       │   ├── silent_killer_v1.txt
│   │       │   ├── pre_purchase_v1.txt
│   │       │   ├── wiki_extraction_v1.txt
│   │       │   ├── translation_v1.txt
│   │       │   └── ocr_warranty_v1.txt
│   │       │
│   │       └── 📁 static/
│   │           └── invoice_template.html           # PDF invoice HTML template
│   │
│   └── 📁 test/
│       └── 📁 java/com/uptime/
│           ├── 📁 modules/
│           │   ├── auth/AuthServiceTest.java
│           │   ├── job/JobServiceTest.java
│           │   ├── job/JobLifecycleIntegrationTest.java
│           │   ├── matching/ScoringEngineTest.java
│           │   ├── ai/GeminiServiceTest.java
│           │   ├── ai/FaultTriageServiceTest.java
│           │   ├── payment/PaymentServiceTest.java
│           │   ├── payment/GSTServiceTest.java
│           │   └── tracking/WebSocketTest.java
│           └── 📁 utils/
│               ├── HashUtilsTest.java
│               └── OTPUtilsTest.java
```

---

## 4. uptime-owner-web — React PWA

```
uptime-owner-web/
│
├── 📄 index.html                           # Vite entry + CSP meta tag
├── 📄 vite.config.ts                       # Vite + React plugin config
├── 📄 tailwind.config.ts                   # Tailwind + custom tokens
├── 📄 tsconfig.json                        # TypeScript strict config
├── 📄 tsconfig.node.json
├── 📄 postcss.config.js
├── 📄 .env.development                     # Local env (not committed)
├── 📄 .env.staging
├── 📄 .env.production
├── 📄 .env.example                         # Template (committed)
├── 📄 .gitignore
├── 📄 .eslintrc.json
├── 📄 .prettierrc
├── 📄 Dockerfile
├── 📄 nginx.conf                           # SPA routing fix
├── 📄 README.md
│
├── 📁 .github/workflows/
│   └── owner-web.yml
│
├── 📁 public/
│   ├── manifest.json                       # PWA manifest
│   ├── sw.js                               # Service worker (cache strategy)
│   ├── favicon.ico
│   ├── robots.txt
│   └── 📁 icons/
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
│
└── 📁 src/
    │
    ├── 📄 main.tsx                         # ReactDOM.render + providers
    ├── 📄 App.tsx                          # Routes + global providers
    ├── 📄 router.tsx                       # React Router v6 config
    ├── 📄 vite-env.d.ts
    │
    ├── 📁 assets/
    │   ├── 📁 images/
    │   │   ├── logo.svg
    │   │   ├── logo-dark.svg
    │   │   ├── logo-white.svg
    │   │   ├── hero-industrial.svg
    │   │   ├── hero-automobile.svg
    │   │   ├── hero-electronics.svg
    │   │   ├── onboarding-1.svg
    │   │   ├── onboarding-2.svg
    │   │   └── onboarding-3.svg
    │   └── 📁 animations/                  # Lottie JSON files
    │       ├── success.json
    │       ├── booking-confirmed.json
    │       ├── ai-thinking.json
    │       ├── technician-coming.json
    │       ├── job-complete.json
    │       ├── empty-state.json
    │       ├── error-state.json
    │       └── offline.json
    │
    ├── 📁 styles/
    │   ├── globals.css                     # Tailwind directives + custom CSS
    │   ├── tokens.css                      # CSS custom properties (colors, fonts)
    │   └── animations.css                  # Custom keyframe animations
    │
    ├── 📁 lib/
    │   ├── axios.ts                        # Axios instance + interceptors
    │   ├── queryClient.ts                  # React Query client config
    │   ├── socket.ts                       # Socket.io WebSocket client
    │   ├── firebase.ts                     # Firebase app init + FCM
    │   ├── razorpay.ts                     # Razorpay checkout helper
    │   └── utils.ts                        # General utility functions
    │
    ├── 📁 store/                           # Redux Toolkit
    │   ├── index.ts                        # Store config + RootState types
    │   ├── authSlice.ts                    # user, token, role, isLoggedIn
    │   ├── jobSlice.ts                     # activeJob, jobList, currentStep
    │   ├── notificationSlice.ts            # unreadCount, notifications[]
    │   ├── industrySlice.ts                # selectedIndustry, assets
    │   ├── trackingSlice.ts                # techLocation, eta, isTracking
    │   └── uiSlice.ts                      # loading, modals, sidebar
    │
    ├── 📁 hooks/
    │   ├── useAuth.ts                      # Auth state + login/logout helpers
    │   ├── useJob.ts                       # Job CRUD hooks
    │   ├── useGeolocation.ts               # Browser Geolocation API
    │   ├── useVoiceInput.ts                # Web Speech API hook
    │   ├── useWebSocket.ts                 # Socket.io connection hook
    │   ├── useNotification.ts              # FCM token + permission
    │   ├── useIndustry.ts                  # Industry switcher hook
    │   ├── useOffline.ts                   # Network status hook
    │   └── useMediaUpload.ts               # File upload + progress hook
    │
    ├── 📁 services/                        # API service functions
    │   ├── authService.ts
    │   ├── jobService.ts
    │   ├── technicianService.ts
    │   ├── aiService.ts
    │   ├── matchingService.ts
    │   ├── paymentService.ts
    │   ├── notificationService.ts
    │   ├── trackingService.ts
    │   ├── machineService.ts
    │   ├── vehicleService.ts
    │   ├── deviceService.ts
    │   ├── insuranceService.ts
    │   ├── marketplaceService.ts
    │   ├── wikiService.ts
    │   ├── videoService.ts
    │   └── userService.ts
    │
    ├── 📁 types/                           # TypeScript interfaces
    │   ├── auth.types.ts
    │   ├── job.types.ts
    │   ├── technician.types.ts
    │   ├── ai.types.ts
    │   ├── payment.types.ts
    │   ├── industry.types.ts
    │   ├── notification.types.ts
    │   └── api.types.ts                    # ApiResponse, PagedResponse
    │
    ├── 📁 locales/                         # i18next translation files
    │   ├── en.json
    │   ├── hi.json
    │   ├── kn.json
    │   ├── ta.json
    │   ├── te.json
    │   ├── ml.json
    │   ├── mr.json
    │   ├── gu.json
    │   └── bn.json
    │
    ├── 📁 components/
    │   │
    │   ├── 📁 ui/                          # shadcn/ui components
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── badge.tsx
    │   │   ├── dialog.tsx
    │   │   ├── sheet.tsx                   # Bottom sheet / side drawer
    │   │   ├── skeleton.tsx
    │   │   ├── toast.tsx
    │   │   ├── tabs.tsx
    │   │   ├── select.tsx
    │   │   ├── slider.tsx
    │   │   ├── avatar.tsx
    │   │   ├── progress.tsx
    │   │   ├── separator.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   └── tooltip.tsx
    │   │
    │   ├── 📁 layout/
    │   │   ├── Navbar.tsx                  # Top navigation
    │   │   ├── Sidebar.tsx                 # Desktop sidebar
    │   │   ├── BottomNav.tsx               # Mobile bottom navigation
    │   │   ├── Footer.tsx
    │   │   ├── PageLayout.tsx              # Page wrapper with padding
    │   │   └── AuthLayout.tsx              # Login/signup layout
    │   │
    │   ├── 📁 common/
    │   │   ├── LoadingSkeleton.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── SuccessAnimation.tsx        # Lottie success
    │   │   ├── IndustrySelector.tsx        # Industrial/Auto/Electronics switcher
    │   │   ├── LanguageSelector.tsx        # 9-language switcher
    │   │   ├── NotificationBell.tsx        # Unread count badge
    │   │   ├── SearchBar.tsx
    │   │   ├── OfflineBanner.tsx           # "You're offline" alert
    │   │   ├── ProtectedRoute.tsx          # Auth guard component
    │   │   ├── StarRating.tsx              # Interactive star rating
    │   │   └── IndustryBadge.tsx           # Colour-coded industry chip
    │   │
    │   ├── 📁 fault/
    │   │   ├── FaultReportForm.tsx         # Main fault report form
    │   │   ├── VoiceInputButton.tsx        # Web Speech API trigger
    │   │   ├── MediaUploadGrid.tsx         # Photo/video multi-upload
    │   │   ├── SoundRecorder.tsx           # Audio recording widget
    │   │   ├── AIDiagnosisCard.tsx         # Gemini result display
    │   │   ├── AIChatBot.tsx               # Follow-up questions chatbot
    │   │   ├── CostEstimateCard.tsx        # Min-max price display
    │   │   └── UrgencySelector.tsx
    │   │
    │   ├── 📁 technician/
    │   │   ├── TechnicianCard.tsx          # Ranked list item
    │   │   ├── TechnicianList.tsx          # Ranked list container
    │   │   ├── TechnicianProfile.tsx       # Full profile modal
    │   │   ├── TechnicianBadges.tsx        # Badge grid
    │   │   ├── MatchScoreBadge.tsx         # "92% match" indicator
    │   │   └── RatingStars.tsx
    │   │
    │   ├── 📁 tracking/
    │   │   ├── LiveTrackingMap.tsx         # Google Maps + moving marker
    │   │   ├── JobStatusStepper.tsx        # Step progress bar
    │   │   ├── ETADisplay.tsx              # "8 mins away" countdown
    │   │   ├── TechnicianInfoSheet.tsx     # Bottom sheet with tech info
    │   │   └── OTPShareCard.tsx            # Show OTP to technician
    │   │
    │   ├── 📁 dashboard/
    │   │   ├── QuickActionsGrid.tsx        # "Report Fault", "Book Service" etc.
    │   │   ├── ActiveJobBanner.tsx         # Ongoing job card
    │   │   ├── AssetHealthRow.tsx          # Health scores row
    │   │   ├── PredictionAlertCard.tsx     # AI prediction warning
    │   │   ├── StatsCards.tsx              # Total jobs, spend, savings
    │   │   └── RecentJobsList.tsx
    │   │
    │   ├── 📁 digital_twin/
    │   │   ├── DigitalTwinCard.tsx         # Asset health summary
    │   │   ├── HealthGauge.tsx             # Circular gauge (0–100%)
    │   │   ├── ComponentHealthGrid.tsx     # Per-component scores
    │   │   └── PredictionTimeline.tsx      # Upcoming maintenance dates
    │   │
    │   ├── 📁 insurance/
    │   │   ├── PolicyCard.tsx
    │   │   ├── ClaimForm.tsx
    │   │   ├── ClaimStatusStepper.tsx
    │   │   ├── WarrantyCard.tsx
    │   │   ├── WarrantyCountdown.tsx
    │   │   └── AMCCard.tsx
    │   │
    │   ├── 📁 marketplace/
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductGrid.tsx
    │   │   ├── CartDrawer.tsx
    │   │   ├── RefurbishedCard.tsx
    │   │   └── GradeChip.tsx              # A+/A/B/C grade display
    │   │
    │   ├── 📁 video/
    │   │   ├── VideoConsultCard.tsx        # Tier selection
    │   │   ├── VideoCallScreen.tsx         # Agora call UI
    │   │   ├── VideoControls.tsx           # Mute, flip, end
    │   │   └── AIAnnotationOverlay.tsx     # Canvas overlay on video
    │   │
    │   └── 📁 payment/
    │       ├── PaymentSummary.tsx          # Cost breakdown
    │       ├── WalletCard.tsx              # Balance display
    │       ├── PaymentMethodSelector.tsx   # UPI/card/wallet
    │       └── SubscriptionCard.tsx        # Plan details
    │
    └── 📁 pages/
        ├── LandingPage.tsx
        ├── LoginPage.tsx
        ├── SignupPage.tsx
        ├── OTPPage.tsx
        ├── OnboardingPage.tsx              # Industry setup
        ├── DashboardPage.tsx
        ├── ReportFaultPage.tsx
        ├── AIDiagnosisPage.tsx
        ├── SelectTechnicianPage.tsx
        ├── JobTrackingPage.tsx
        ├── JobHistoryPage.tsx
        ├── JobDetailsPage.tsx
        ├── RateJobPage.tsx
        ├── MachinesPage.tsx
        ├── MachineDetailsPage.tsx
        ├── AddMachinePage.tsx
        ├── VehiclesPage.tsx
        ├── VehicleDetailsPage.tsx
        ├── AddVehiclePage.tsx
        ├── DevicesPage.tsx
        ├── DeviceDetailsPage.tsx
        ├── AddDevicePage.tsx
        ├── DigitalTwinPage.tsx
        ├── InsurancePage.tsx
        ├── ClaimPage.tsx
        ├── WarrantyPage.tsx
        ├── AMCPage.tsx
        ├── MarketplacePage.tsx
        ├── ProductDetailsPage.tsx
        ├── CartPage.tsx
        ├── CheckoutPage.tsx
        ├── PaymentPage.tsx
        ├── WalletPage.tsx
        ├── SubscriptionPage.tsx
        ├── VideoConsultPage.tsx
        ├── WikiPage.tsx
        ├── WikiArticlePage.tsx
        ├── NotificationsPage.tsx
        ├── ProfilePage.tsx
        ├── SettingsPage.tsx
        ├── TermsPage.tsx
        ├── PrivacyPage.tsx
        └── 📁 errors/
            ├── NotFoundPage.tsx            # 404
            ├── ServerErrorPage.tsx         # 500
            └── OfflinePage.tsx             # No network
```

---

## 5. uptime-owner-app — Flutter

```
uptime-owner-app/
│
├── 📄 pubspec.yaml                         # Dependencies + assets
├── 📄 pubspec.lock
├── 📄 .env                                 # Not committed
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 analysis_options.yaml               # Dart linting rules
├── 📄 README.md
│
├── 📁 android/
│   ├── app/
│   │   ├── google-services.json            # Firebase config
│   │   ├── build.gradle                    # App-level Gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml         # Permissions + deep links
│   │       ├── kotlin/com/uptime/owner/
│   │       │   └── MainActivity.kt
│   │       └── res/
│   │           ├── drawable/               # App icons
│   │           └── values/                 # Colors, strings
│   └── build.gradle                        # Project-level Gradle
│
├── 📁 ios/
│   └── Runner/
│       ├── GoogleService-Info.plist        # Firebase config iOS
│       ├── Info.plist                      # Permissions + deep links
│       └── AppDelegate.swift
│
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── logo.png
│   │   ├── logo_dark.png
│   │   ├── logo_white.png
│   │   ├── onboarding_industrial.png
│   │   ├── onboarding_automobile.png
│   │   ├── onboarding_electronics.png
│   │   └── placeholder_avatar.png
│   ├── 📁 animations/                      # Lottie JSON
│   │   ├── success.json
│   │   ├── booking_confirmed.json
│   │   ├── ai_thinking.json
│   │   ├── technician_coming.json
│   │   ├── job_complete.json
│   │   ├── empty_state.json
│   │   └── offline.json
│   ├── 📁 icons/
│   │   ├── ic_industrial.svg
│   │   ├── ic_automobile.svg
│   │   └── ic_electronics.svg
│   └── 📁 translations/                    # ARB files
│       ├── app_en.arb
│       ├── app_hi.arb
│       ├── app_kn.arb
│       ├── app_ta.arb
│       ├── app_te.arb
│       ├── app_ml.arb
│       ├── app_mr.arb
│       ├── app_gu.arb
│       └── app_bn.arb
│
└── 📁 lib/
    │
    ├── 📄 main.dart                        # main() + ProviderScope
    ├── 📄 app.dart                         # MaterialApp + GoRouter
    │
    ├── 📁 core/
    │   ├── 📁 config/
    │   │   ├── app_config.dart             # Flavor-based config
    │   │   ├── router.dart                 # GoRouter all routes + deep links
    │   │   ├── theme.dart                  # Light/dark theme + tokens
    │   │   └── app_localizations.dart      # i18n setup
    │   │
    │   ├── 📁 constants/
    │   │   ├── api_endpoints.dart          # All API paths
    │   │   ├── app_strings.dart            # Non-translated strings
    │   │   ├── storage_keys.dart           # Hive box keys
    │   │   └── app_constants.dart          # Magic numbers, timeouts
    │   │
    │   ├── 📁 network/
    │   │   ├── dio_client.dart             # Dio instance + interceptors
    │   │   ├── auth_interceptor.dart       # JWT attach + refresh
    │   │   ├── error_interceptor.dart      # Error response handling
    │   │   ├── network_info.dart           # ConnectivityPlus wrapper
    │   │   └── websocket_client.dart       # WebSocket channel wrapper
    │   │
    │   ├── 📁 storage/
    │   │   ├── hive_service.dart           # Hive init + box getters
    │   │   ├── secure_storage.dart         # JWT in flutter_secure_storage
    │   │   ├── cache_service.dart          # Generic cache helpers
    │   │   └── sync_service.dart           # Offline sync on reconnect
    │   │
    │   ├── 📁 utils/
    │   │   ├── date_utils.dart
    │   │   ├── format_utils.dart           # Currency, phone formatting
    │   │   ├── location_utils.dart         # Coordinate helpers
    │   │   ├── media_utils.dart            # Image compress + EXIF strip
    │   │   ├── permission_utils.dart       # Runtime permissions
    │   │   └── validation_utils.dart       # Phone, email, form validators
    │   │
    │   └── 📁 errors/
    │       ├── failures.dart               # Failure sealed classes
    │       └── exceptions.dart             # Custom exception types
    │
    ├── 📁 shared/
    │   ├── 📁 widgets/
    │   │   ├── uptime_button.dart          # Primary + secondary + text variants
    │   │   ├── uptime_text_field.dart      # Styled input + validation
    │   │   ├── uptime_app_bar.dart         # Custom app bar
    │   │   ├── uptime_bottom_nav.dart      # 5-tab bottom nav
    │   │   ├── loading_shimmer.dart        # Shimmer placeholder
    │   │   ├── empty_state_widget.dart     # Lottie + message
    │   │   ├── error_widget.dart           # Error + retry button
    │   │   ├── success_animation.dart      # Lottie success overlay
    │   │   ├── industry_chip.dart          # Colour-coded industry
    │   │   ├── status_badge.dart           # Job status colour badge
    │   │   ├── star_rating.dart            # Interactive 1–5 stars
    │   │   ├── photo_viewer.dart           # Full-screen image viewer
    │   │   ├── confirmation_dialog.dart    # Reusable confirm modal
    │   │   ├── offline_banner.dart         # Top banner when offline
    │   │   └── cached_image.dart           # CachedNetworkImage wrapper
    │   │
    │   └── 📁 providers/
    │       ├── auth_provider.dart          # Auth state + token management
    │       ├── location_provider.dart      # GPS stream provider
    │       └── notification_provider.dart  # FCM + local notifications
    │
    ├── 📁 features/
    │   ├── 📁 splash/
    │   │   └── splash_screen.dart          # Logo + auth check redirect
    │   │
    │   ├── 📁 onboarding/
    │   │   ├── onboarding_screen.dart      # 3-slide intro
    │   │   ├── industry_setup_screen.dart  # Pick industry
    │   │   └── onboarding_provider.dart
    │   │
    │   ├── 📁 auth/
    │   │   ├── 📁 screens/
    │   │   │   ├── login_screen.dart
    │   │   │   ├── signup_screen.dart
    │   │   │   └── otp_screen.dart
    │   │   ├── 📁 providers/
    │   │   │   └── auth_state.dart
    │   │   └── 📁 services/
    │   │       └── auth_service.dart
    │   │
    │   ├── 📁 home/
    │   │   ├── 📁 screens/
    │   │   │   └── home_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── industry_selector_widget.dart
    │   │   │   ├── quick_action_grid.dart
    │   │   │   ├── active_job_card.dart
    │   │   │   ├── prediction_alert_card.dart
    │   │   │   ├── asset_health_row.dart
    │   │   │   ├── greeting_header.dart
    │   │   │   └── stats_row.dart
    │   │   └── 📁 providers/
    │   │       └── home_provider.dart
    │   │
    │   ├── 📁 fault_report/
    │   │   ├── 📁 screens/
    │   │   │   ├── fault_report_screen.dart
    │   │   │   ├── ai_diagnosis_screen.dart
    │   │   │   └── cost_estimate_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── voice_input_widget.dart
    │   │   │   ├── media_upload_widget.dart
    │   │   │   ├── sound_recorder_widget.dart
    │   │   │   ├── ai_diagnosis_card.dart
    │   │   │   ├── ai_chatbot_widget.dart
    │   │   │   └── urgency_selector.dart
    │   │   └── 📁 providers/
    │   │       └── fault_report_provider.dart
    │   │
    │   ├── 📁 booking/
    │   │   ├── 📁 screens/
    │   │   │   ├── technician_list_screen.dart
    │   │   │   ├── technician_profile_screen.dart
    │   │   │   └── booking_confirm_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── technician_card.dart
    │   │   │   ├── skill_match_bar.dart
    │   │   │   ├── distance_eta_chip.dart
    │   │   │   └── match_score_badge.dart
    │   │   └── 📁 providers/
    │   │       └── booking_provider.dart
    │   │
    │   ├── 📁 tracking/
    │   │   ├── 📁 screens/
    │   │   │   ├── live_tracking_screen.dart
    │   │   │   └── otp_share_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── tracking_map_widget.dart
    │   │   │   ├── job_status_stepper.dart
    │   │   │   ├── technician_info_bottom_sheet.dart
    │   │   │   ├── eta_display.dart
    │   │   │   └── call_message_buttons.dart
    │   │   └── 📁 providers/
    │   │       └── tracking_provider.dart
    │   │
    │   ├── 📁 job_history/
    │   │   ├── 📁 screens/
    │   │   │   ├── job_history_screen.dart
    │   │   │   ├── job_details_screen.dart
    │   │   │   └── rate_job_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── job_history_card.dart
    │   │   │   ├── service_certificate_widget.dart
    │   │   │   └── parts_used_list.dart
    │   │   └── 📁 providers/
    │   │       └── job_history_provider.dart
    │   │
    │   ├── 📁 assets/
    │   │   ├── 📁 screens/
    │   │   │   ├── assets_screen.dart      # Tab: machines/vehicles/devices
    │   │   │   ├── add_asset_screen.dart
    │   │   │   └── asset_details_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── asset_card.dart
    │   │   │   ├── health_score_gauge.dart
    │   │   │   └── service_history_list.dart
    │   │   └── 📁 providers/
    │   │       └── asset_provider.dart
    │   │
    │   ├── 📁 digital_twin/
    │   │   ├── 📁 screens/
    │   │   │   ├── digital_twin_screen.dart
    │   │   │   └── component_health_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── twin_health_card.dart
    │   │   │   ├── component_grid.dart
    │   │   │   ├── prediction_timeline.dart
    │   │   │   └── savings_calculator.dart
    │   │   └── 📁 providers/
    │   │       └── digital_twin_provider.dart
    │   │
    │   ├── 📁 insurance/
    │   │   ├── 📁 screens/
    │   │   │   ├── insurance_screen.dart
    │   │   │   ├── policy_details_screen.dart
    │   │   │   ├── file_claim_screen.dart
    │   │   │   ├── claim_tracker_screen.dart
    │   │   │   ├── warranty_screen.dart
    │   │   │   └── amc_screen.dart
    │   │   └── 📁 providers/
    │   │       └── insurance_provider.dart
    │   │
    │   ├── 📁 marketplace/
    │   │   ├── 📁 screens/
    │   │   │   ├── marketplace_screen.dart
    │   │   │   ├── product_details_screen.dart
    │   │   │   ├── cart_screen.dart
    │   │   │   └── refurbished_screen.dart
    │   │   └── 📁 providers/
    │   │       └── marketplace_provider.dart
    │   │
    │   ├── 📁 video_consult/
    │   │   ├── 📁 screens/
    │   │   │   ├── consult_booking_screen.dart
    │   │   │   └── video_call_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── video_controls.dart
    │   │   │   └── ai_annotation_overlay.dart
    │   │   └── 📁 providers/
    │   │       └── video_provider.dart
    │   │
    │   ├── 📁 payments/
    │   │   ├── 📁 screens/
    │   │   │   ├── payment_screen.dart
    │   │   │   ├── wallet_screen.dart
    │   │   │   └── subscription_screen.dart
    │   │   └── 📁 providers/
    │   │       └── payment_provider.dart
    │   │
    │   ├── 📁 wiki/
    │   │   ├── 📁 screens/
    │   │   │   ├── wiki_screen.dart
    │   │   │   └── wiki_article_screen.dart
    │   │   └── 📁 providers/
    │   │       └── wiki_provider.dart
    │   │
    │   ├── 📁 notifications/
    │   │   ├── 📁 screens/
    │   │   │   └── notifications_screen.dart
    │   │   └── 📁 widgets/
    │   │       └── notification_card.dart
    │   │
    │   └── 📁 profile/
    │       ├── 📁 screens/
    │       │   ├── profile_screen.dart
    │       │   └── settings_screen.dart
    │       ├── 📁 widgets/
    │       │   ├── profile_header.dart
    │       │   └── settings_tile.dart
    │       └── 📁 providers/
    │           └── profile_provider.dart
    │
    └── 📁 offline/
        ├── hive_boxes.dart                 # Box type registrations
        ├── offline_sync.dart               # Sync queue management
        └── cache_manager.dart              # Cache TTL management
```

---

## 6. uptime-tech-web — React

```
uptime-tech-web/
│
├── 📄 index.html
├── 📄 vite.config.ts
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
├── 📄 .env.development
├── 📄 .env.production
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 Dockerfile
├── 📄 nginx.conf
├── 📄 README.md
│
└── 📁 src/
    ├── 📄 main.tsx
    ├── 📄 App.tsx
    ├── 📄 router.tsx
    │
    ├── 📁 assets/
    │   └── 📁 images/
    │       ├── logo.svg
    │       └── empty-earnings.svg
    │
    ├── 📁 lib/
    │   ├── axios.ts
    │   ├── queryClient.ts
    │   └── utils.ts
    │
    ├── 📁 store/
    │   ├── index.ts
    │   ├── authSlice.ts
    │   └── uiSlice.ts
    │
    ├── 📁 services/
    │   ├── authService.ts
    │   ├── jobService.ts
    │   ├── earningsService.ts
    │   ├── badgeService.ts
    │   ├── wikiService.ts
    │   └── workshopService.ts
    │
    ├── 📁 types/
    │   ├── auth.types.ts
    │   ├── job.types.ts
    │   └── earnings.types.ts
    │
    ├── 📁 components/
    │   ├── 📁 layout/
    │   │   ├── TechSidebar.tsx
    │   │   ├── TechTopBar.tsx
    │   │   └── TechLayout.tsx
    │   ├── 📁 common/
    │   │   ├── StatCard.tsx
    │   │   ├── DataTable.tsx               # TanStack Table wrapper
    │   │   ├── LoadingSkeleton.tsx
    │   │   └── EmptyState.tsx
    │   ├── 📁 earnings/
    │   │   ├── EarningsChart.tsx           # Recharts line/bar
    │   │   ├── TransactionList.tsx
    │   │   └── WithdrawModal.tsx
    │   ├── 📁 jobs/
    │   │   ├── JobHistoryTable.tsx
    │   │   ├── JobDetailModal.tsx
    │   │   └── JobFilters.tsx
    │   ├── 📁 profile/
    │   │   ├── SkillSelector.tsx
    │   │   ├── DocumentUpload.tsx
    │   │   ├── AvailabilityCalendar.tsx
    │   │   └── ServiceAreaMap.tsx
    │   ├── 📁 badges/
    │   │   ├── BadgeCard.tsx
    │   │   ├── BadgeProgress.tsx
    │   │   └── BadgeCollection.tsx
    │   ├── 📁 workshop/
    │   │   ├── TeamTable.tsx
    │   │   ├── InventoryTable.tsx
    │   │   └── WorkshopStats.tsx
    │   └── 📁 analytics/
    │       ├── PerformanceChart.tsx
    │       ├── RatingTrend.tsx
    │       └── ComparisonChart.tsx
    │
    └── 📁 pages/
        ├── LoginPage.tsx
        ├── SignupPage.tsx
        ├── OTPPage.tsx
        ├── OnboardingPage.tsx
        ├── DashboardPage.tsx
        ├── JobHistoryPage.tsx
        ├── EarningsPage.tsx
        ├── BadgesPage.tsx
        ├── ProfilePage.tsx
        ├── SkillsPage.tsx
        ├── DocumentsPage.tsx
        ├── AvailabilityPage.tsx
        ├── AnalyticsPage.tsx
        ├── LearningCenterPage.tsx
        ├── WikiPage.tsx
        ├── WikiArticlePage.tsx
        ├── WorkshopPage.tsx
        ├── InventoryPage.tsx
        ├── SettingsPage.tsx
        ├── TermsPage.tsx
        └── PrivacyPage.tsx
```

---

## 7. uptime-technician-app — Flutter

```
uptime-technician-app/
│
├── 📄 pubspec.yaml                         # Same base + extra field packages
├── 📄 .gitignore
├── 📄 analysis_options.yaml
├── 📄 README.md
│
├── 📁 android/
│   ├── app/
│   │   ├── google-services.json
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml         # Foreground service + background location
│   │       └── kotlin/com/uptime/technician/
│   │           ├── MainActivity.kt
│   │           └── LocationForegroundService.kt  # Background GPS service
│   └── build.gradle
│
├── 📁 ios/
│   └── Runner/
│       ├── GoogleService-Info.plist
│       ├── Info.plist                      # Background location permissions
│       └── AppDelegate.swift
│
├── 📁 assets/                              # Same structure as owner app
│   ├── 📁 images/
│   ├── 📁 animations/
│   │   ├── job_accepted.json
│   │   ├── navigating.json
│   │   ├── job_complete.json
│   │   ├── badge_earned.json
│   │   └── empty_state.json
│   └── 📁 translations/                    # Same 9 language ARB files
│
└── 📁 lib/
    ├── 📄 main.dart
    ├── 📄 app.dart
    │
    ├── 📁 core/                            # Same as owner app
    ├── 📁 shared/
    │   ├── 📁 widgets/                     # Same base widgets +
    │   │   ├── job_timer_widget.dart       # 60-sec countdown display
    │   │   ├── arrival_button.dart         # Large "I've Arrived" button
    │   │   └── wakelock_widget.dart        # Keep screen on during job
    │   └── 📁 providers/
    │
    ├── 📁 features/
    │   ├── 📁 splash/
    │   ├── 📁 onboarding/
    │   │   ├── onboarding_screen.dart
    │   │   ├── skill_setup_screen.dart
    │   │   └── document_upload_screen.dart
    │   │
    │   ├── 📁 auth/
    │   │
    │   ├── 📁 home/
    │   │   ├── 📁 screens/
    │   │   │   └── tech_home_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── availability_toggle.dart
    │   │   │   ├── today_stats_row.dart
    │   │   │   ├── active_job_banner.dart
    │   │   │   ├── upcoming_jobs_list.dart
    │   │   │   └── earnings_preview_card.dart
    │   │   └── 📁 providers/
    │   │       └── home_provider.dart
    │   │
    │   ├── 📁 job_requests/
    │   │   ├── 📁 screens/
    │   │   │   ├── job_request_screen.dart  # Full-screen with countdown
    │   │   │   ├── job_request_details_screen.dart
    │   │   │   └── auction_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── job_request_card.dart
    │   │   │   ├── accept_decline_buttons.dart
    │   │   │   ├── auction_timer_widget.dart
    │   │   │   ├── auction_bonus_display.dart
    │   │   │   └── competing_techs_count.dart
    │   │   └── 📁 providers/
    │   │       └── job_request_provider.dart
    │   │
    │   ├── 📁 navigation/
    │   │   ├── 📁 screens/
    │   │   │   ├── navigation_screen.dart   # Google Maps turn-by-turn
    │   │   │   └── arrival_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── route_map_widget.dart
    │   │   │   ├── eta_bottom_sheet.dart
    │   │   │   ├── arrived_button.dart
    │   │   │   └── call_owner_fab.dart
    │   │   └── 📁 providers/
    │   │       └── navigation_provider.dart
    │   │
    │   ├── 📁 otp_verify/
    │   │   ├── 📁 screens/
    │   │   │   └── otp_entry_screen.dart
    │   │   └── 📁 widgets/
    │   │       └── otp_input_widget.dart    # Pinput package
    │   │
    │   ├── 📁 job_execution/
    │   │   ├── 📁 screens/
    │   │   │   ├── checklist_screen.dart
    │   │   │   ├── ai_copilot_screen.dart
    │   │   │   ├── parts_logging_screen.dart
    │   │   │   ├── live_stream_screen.dart  # Live video for owner
    │   │   │   └── job_complete_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── checklist_item_tile.dart
    │   │   │   ├── copilot_step_card.dart
    │   │   │   ├── copilot_photo_capture.dart
    │   │   │   ├── part_add_widget.dart
    │   │   │   ├── parts_summary_card.dart
    │   │   │   ├── before_after_photos.dart
    │   │   │   ├── signature_pad.dart       # signature package
    │   │   │   └── completion_animation.dart
    │   │   └── 📁 providers/
    │   │       └── job_execution_provider.dart
    │   │
    │   ├── 📁 earnings/
    │   │   ├── 📁 screens/
    │   │   │   ├── earnings_screen.dart
    │   │   │   └── withdrawal_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── earnings_chart.dart
    │   │   │   ├── transaction_tile.dart
    │   │   │   └── earnings_summary_card.dart
    │   │   └── 📁 providers/
    │   │       └── earnings_provider.dart
    │   │
    │   ├── 📁 badges/
    │   │   ├── 📁 screens/
    │   │   │   └── badges_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── badge_card.dart
    │   │   │   ├── badge_progress_bar.dart
    │   │   │   └── badge_earned_animation.dart
    │   │   └── 📁 providers/
    │   │       └── badge_provider.dart
    │   │
    │   ├── 📁 job_history/
    │   │   ├── 📁 screens/
    │   │   │   ├── job_history_screen.dart
    │   │   │   └── job_detail_screen.dart
    │   │   └── 📁 providers/
    │   │       └── job_history_provider.dart
    │   │
    │   ├── 📁 video_consult/
    │   │   ├── 📁 screens/
    │   │   │   └── video_answer_screen.dart
    │   │   ├── 📁 widgets/
    │   │   │   ├── annotation_tools.dart    # Draw arrows/circles on feed
    │   │   │   └── video_controls.dart
    │   │   └── 📁 providers/
    │   │       └── video_provider.dart
    │   │
    │   ├── 📁 wiki/
    │   ├── 📁 notifications/
    │   └── 📁 profile/
    │
    └── 📁 offline/
        ├── hive_boxes.dart
        ├── offline_sync.dart
        └── background_location.dart        # Queue GPS updates when offline
```

---

## 8. uptime-admin-web — React

```
uptime-admin-web/
│
├── 📄 index.html
├── 📄 vite.config.ts
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
├── 📄 .env.development
├── 📄 .env.production
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 Dockerfile
├── 📄 nginx.conf
├── 📄 README.md
│
└── 📁 src/
    ├── 📄 main.tsx
    ├── 📄 App.tsx
    ├── 📄 router.tsx
    │
    ├── 📁 lib/
    │   ├── axios.ts
    │   ├── queryClient.ts
    │   ├── socket.ts                       # Live dashboard WebSocket
    │   └── utils.ts
    │
    ├── 📁 store/
    │   ├── index.ts
    │   ├── authSlice.ts
    │   └── adminSlice.ts
    │
    ├── 📁 services/
    │   ├── authService.ts
    │   ├── technicianService.ts            # Verification queue
    │   ├── jobService.ts                   # Live jobs management
    │   ├── disputeService.ts
    │   ├── financeService.ts
    │   ├── analyticsService.ts
    │   ├── epidemicService.ts
    │   ├── notificationService.ts          # Mass notifications
    │   ├── settingsService.ts
    │   └── featureFlagService.ts
    │
    ├── 📁 types/
    │   ├── admin.types.ts
    │   ├── verification.types.ts
    │   └── analytics.types.ts
    │
    ├── 📁 components/
    │   ├── 📁 layout/
    │   │   ├── AdminSidebar.tsx
    │   │   ├── AdminTopBar.tsx
    │   │   └── AdminLayout.tsx
    │   ├── 📁 common/
    │   │   ├── AdminDataTable.tsx          # TanStack Table + filters
    │   │   ├── StatCard.tsx
    │   │   ├── AlertBanner.tsx
    │   │   ├── ConfirmModal.tsx
    │   │   └── LoadingSkeleton.tsx
    │   ├── 📁 verification/
    │   │   ├── VerificationQueue.tsx
    │   │   ├── DocumentViewer.tsx          # PDF/image viewer
    │   │   ├── VerificationActions.tsx     # Approve/reject buttons
    │   │   └── TechnicianDetailPanel.tsx
    │   ├── 📁 jobs/
    │   │   ├── LiveJobsMap.tsx             # React Leaflet + all pins
    │   │   ├── JobsTable.tsx
    │   │   └── InterventionPanel.tsx       # Admin force-complete/cancel
    │   ├── 📁 dispute/
    │   │   ├── DisputeCard.tsx
    │   │   ├── EvidenceViewer.tsx
    │   │   └── ResolutionPanel.tsx         # Verdict + amount
    │   ├── 📁 epidemic/
    │   │   ├── EpidemicAlert.tsx
    │   │   ├── EpidemicHeatmap.tsx         # Chart.js heatmap
    │   │   └── ResponseActions.tsx
    │   ├── 📁 finance/
    │   │   ├── RevenueChart.tsx
    │   │   ├── PayoutTable.tsx
    │   │   └── FinanceSummary.tsx
    │   ├── 📁 analytics/
    │   │   ├── GrowthChart.tsx
    │   │   ├── IndustryBreakdown.tsx
    │   │   └── HealthScoreGauge.tsx
    │   └── 📁 settings/
    │       ├── AIPromptEditor.tsx          # Edit Gemini prompts
    │       ├── MatchingWeightsSlider.tsx   # Adjust 40/60 weights
    │       ├── FeatureToggles.tsx          # Feature flags on/off
    │       └── CommissionRateEditor.tsx
    │
    └── 📁 pages/
        ├── LoginPage.tsx                   # 2FA + IP check
        ├── DashboardPage.tsx               # Live platform health
        ├── TechnicianListPage.tsx
        ├── VerificationQueuePage.tsx
        ├── OwnerListPage.tsx
        ├── LiveJobsPage.tsx
        ├── DisputesPage.tsx
        ├── EpidemicMonitorPage.tsx
        ├── SilentKillerAlertsPage.tsx
        ├── FinancePage.tsx
        ├── PayoutsPage.tsx
        ├── AnalyticsPage.tsx
        ├── MarketplacePage.tsx
        ├── WikiModerationPage.tsx
        ├── NotificationsPage.tsx           # Mass notification composer
        ├── AISettingsPage.tsx
        ├── PlatformSettingsPage.tsx
        └── AdminProfilePage.tsx
```

---

## 9. uptime-shared — TypeScript Package

```
uptime-shared/
│
├── 📄 package.json                         # @uptime/shared package config
├── 📄 tsconfig.json
├── 📄 .gitignore
├── 📄 README.md
│
└── 📁 src/
    ├── 📄 index.ts                         # Barrel exports
    │
    ├── 📁 types/
    │   ├── auth.types.ts                   # User, Token, Role enums
    │   ├── job.types.ts                    # Job, JobStatus, JobUrgency
    │   ├── technician.types.ts             # Technician, Skill, Badge
    │   ├── ai.types.ts                     # DiagnosisResult, CopilotStep
    │   ├── payment.types.ts                # Transaction, Wallet, Payout
    │   ├── notification.types.ts           # Notification, NotificationType
    │   ├── industry.types.ts               # Machine, Vehicle, Device
    │   ├── matching.types.ts               # MatchingScore, SurgePricing
    │   └── api.types.ts                    # ApiResponse<T>, PagedResponse<T>
    │
    ├── 📁 utils/
    │   ├── formatCurrency.ts               # ₹1,000 formatting
    │   ├── formatDate.ts                   # DD/MM/YYYY, relative time
    │   ├── formatPhone.ts                  # +91XXXXXXXXXX formatting
    │   ├── validatePhone.ts                # Indian phone validation
    │   ├── validateEmail.ts
    │   ├── calculateDistance.ts            # Haversine formula
    │   └── generateJobNumber.ts            # UPT-YYYY-XXXXX format
    │
    └── 📁 constants/
        ├── industries.ts                   # Industry enum + labels
        ├── jobStatuses.ts                  # Status enum + colours
        ├── errorCodes.ts                   # All error code strings
        ├── subscriptionPlans.ts            # Plan tier details
        └── apiRoutes.ts                    # All API path constants
```

---

## 10. uptime-docs — Documentation

```
uptime-docs/
│
├── 📄 README.md                            # Project overview + links
│
├── 📁 api/
│   ├── auth_api.md
│   ├── job_api.md
│   ├── ai_api.md
│   ├── matching_api.md
│   ├── payment_api.md
│   ├── notification_api.md
│   ├── tracking_api.md
│   ├── technician_api.md
│   ├── industry_api.md
│   ├── insurance_api.md
│   ├── marketplace_api.md
│   ├── wiki_api.md
│   ├── video_api.md
│   └── admin_api.md
│
├── 📁 database/
│   ├── schema_overview.md
│   ├── module_01_users.md
│   ├── module_02_technicians.md
│   ├── module_03_jobs.md
│   ├── module_04_ai.md
│   ├── module_05_matching.md
│   ├── module_06_payments.md
│   ├── module_07_ratings.md
│   ├── module_08_industry.md
│   ├── module_09_insurance.md
│   ├── module_10_marketplace.md
│   ├── module_11_notifications.md
│   ├── module_12_analytics.md
│   ├── module_13_wiki.md
│   └── module_14_admin.md
│
├── 📁 architecture/
│   ├── ARCHITECTURE.md                     # Full architecture doc
│   ├── system_diagram.png
│   ├── job_flow_diagram.png
│   └── matching_algorithm.md
│
├── 📁 user_guides/
│   ├── owner_guide.md
│   ├── technician_guide.md
│   └── admin_guide.md
│
├── 📁 setup/
│   ├── local_setup.md                      # Run everything locally
│   ├── environment_setup.md                # All API keys guide
│   ├── supabase_setup.md                   # DB + PostGIS setup
│   └── deployment_guide.md                 # Railway + Vercel deploy
│
├── 📁 testing/
│   ├── test_strategy.md
│   └── 📁 postman/
│       ├── UPTIME_Auth.postman_collection.json
│       ├── UPTIME_Jobs.postman_collection.json
│       ├── UPTIME_AI.postman_collection.json
│       ├── UPTIME_Payments.postman_collection.json
│       ├── UPTIME_Matching.postman_collection.json
│       └── UPTIME_Environment.postman_environment.json
│
└── 📁 report/
    ├── PRD.md                              # This file
    ├── ARCHITECTURE.md                     # Architecture doc
    ├── STRUCTURE.md                        # This file
    ├── UPTIME_Project_Report_v2.pdf        # Full project report PDF
    └── UPTIME_PBL_Presentation.pptx        # PBL presentation deck
```

---

## 11. Root Level Files

```
Each repository root must have:

📄 README.md
   → Project name + description
   → Prerequisites (Java/Node/Flutter version)
   → Local setup steps (numbered)
   → Environment variables needed
   → How to run tests
   → How to deploy

📄 .gitignore
   Backend:
     target/, *.class, .env, *.jar
     .idea/, *.iml, .DS_Store
   React:
     node_modules/, dist/, .env
     .env.local, .DS_Store
   Flutter:
     .dart_tool/, build/, .flutter-plugins
     .env, android/local.properties
     ios/Pods/, *.g.dart, *.freezed.dart

📄 .env.example
   → All required variables
   → Empty values (no real secrets)
   → Comments explaining each variable

📄 Dockerfile
   → Multi-stage build
   → Non-root user for security
   → Health check command

📄 .dockerignore
   → node_modules/, target/, .git/
   → .env files, test files

.github/
└── workflows/
    └── {service}.yml                       # CI/CD pipeline

.github/
└── pull_request_template.md:

## What does this PR do?
[Brief description of changes]

## Feature/Bug
- Feature name: ___
- Module: ___

## Checklist
- [ ] Code runs without errors locally
- [ ] Manually tested the feature
- [ ] No console errors
- [ ] API tested in Postman (if backend change)
- [ ] No .env secrets committed
- [ ] Follows naming conventions

## Screenshots (if UI change)
[Add screenshots here]

## Notes for reviewer
[Anything specific to check]
```

---

## 12. GitHub Actions Workflows

```
.github/workflows/

backend.yml:
  name: Backend CI/CD
  on:
    push:
      branches: ['**']
  jobs:
    test:
      runs-on: ubuntu-latest
      services:
        postgres:
          image: postgres:15
          env:
            POSTGRES_DB: uptime_test
            POSTGRES_PASSWORD: test
          ports: ['5432:5432']
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-java@v4
          with:
            java-version: '17'
            distribution: 'temurin'
        - name: Cache Maven
          uses: actions/cache@v3
          with:
            path: ~/.m2
            key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        - run: mvn test
        - run: mvn package -DskipTests
    
    deploy-staging:
      needs: test
      if: github.ref == 'refs/heads/develop'
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: railwayapp/cli@v3
          with:
            command: up --service backend-staging
          env:
            RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
    
    deploy-prod:
      needs: test
      if: github.ref == 'refs/heads/main'
      environment: production          # Requires manual approval
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: railwayapp/cli@v3
          with:
            command: up --service backend-prod
          env:
            RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

owner-web.yml:
  name: Owner Web CI/CD
  on:
    push:
      branches: ['**']
  jobs:
    lint-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm run lint
        - run: npm run type-check
    
    build:
      needs: lint-test
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'npm'
        - run: npm ci
        - run: npm run build
          env:
            VITE_API_URL: ${{ secrets.VITE_API_URL }}
            VITE_GOOGLE_MAPS_KEY: ${{ secrets.GOOGLE_MAPS_KEY }}
    
    deploy-staging:
      needs: build
      if: github.ref == 'refs/heads/develop'
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - run: npx vercel deploy --token ${{ secrets.VERCEL_TOKEN }}
    
    deploy-prod:
      needs: build
      if: github.ref == 'refs/heads/main'
      environment: production
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - run: npx vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}

flutter.yml:
  name: Flutter Build
  on:
    push:
      branches: [main, develop]
  jobs:
    analyze-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: subosito/flutter-action@v2
          with:
            flutter-version: '3.x'
        - run: flutter pub get
        - run: flutter analyze
        - run: flutter test
    
    build-owner-apk:
      needs: analyze-test
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          with:
            working-directory: uptime-owner-app
        - uses: subosito/flutter-action@v2
        - run: flutter build apk --flavor production
          working-directory: uptime-owner-app
        - uses: actions/upload-artifact@v3
          with:
            name: owner-release-apk
            path: uptime-owner-app/build/app/outputs/apk/production/release/
    
    build-tech-apk:
      needs: analyze-test
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          with:
            working-directory: uptime-technician-app
        - uses: subosito/flutter-action@v2
        - run: flutter build apk --flavor production
          working-directory: uptime-technician-app
        - uses: actions/upload-artifact@v3
          with:
            name: tech-release-apk
            path: uptime-technician-app/build/app/outputs/apk/production/release/
```

---

## 13. Docker Configuration

```
docker-compose.yml (organisation root):

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: uptime_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports: ['5432:5432']
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./uptime-backend/src/main/resources/db/migration:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL","pg_isready -U postgres"]
      interval: 10s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: uptime
      RABBITMQ_DEFAULT_PASS: ${RABBIT_PASSWORD}
    ports:
      - '5672:5672'
      - '15672:15672'
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  backend:
    build:
      context: ./uptime-backend
    ports: ['8080:8080']
    env_file: ./uptime-backend/.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
      rabbitmq:
        condition: service_started
    healthcheck:
      test: ["CMD","curl","-f","http://localhost:8080/actuator/health"]
      interval: 30s
      retries: 3

  owner-web:
    build:
      context: ./uptime-owner-web
    ports: ['3000:80']
    depends_on: [backend]

  tech-web:
    build:
      context: ./uptime-tech-web
    ports: ['3001:80']
    depends_on: [backend]

  admin-web:
    build:
      context: ./uptime-admin-web
    ports: ['3002:80']
    depends_on: [backend]

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  default:
    name: uptime_network
```

---

## 14. Environment Files

```
uptime-backend/.env.example:

# ── Supabase ──────────────────────────────
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
DB_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=your_db_password

# ── Redis (Upstash) ───────────────────────
UPSTASH_REDIS_URL=rediss://xxxxx.upstash.io
UPSTASH_REDIS_TOKEN=your_token

# ── RabbitMQ ──────────────────────────────
RABBIT_HOST=localhost
RABBIT_PORT=5672
RABBIT_USER=uptime
RABBIT_PASSWORD=your_password

# ── Google Gemini AI ──────────────────────
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash

# ── Google Maps ───────────────────────────
GOOGLE_MAPS_KEY=your_maps_key

# ── Razorpay ──────────────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# ── Twilio ────────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# ── SendGrid ──────────────────────────────
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@uptime.in
SENDGRID_FROM_NAME=UPTIME

# ── Cloudinary ────────────────────────────
CLOUDINARY_CLOUD_NAME=uptime
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=your_secret

# ── Agora ─────────────────────────────────
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_cert

# ── Firebase ──────────────────────────────
FIREBASE_PROJECT_ID=uptime-app
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

# ── JWT ───────────────────────────────────
JWT_SECRET=your_minimum_256_bit_secret_here
JWT_ACCESS_EXPIRY_MS=86400000
JWT_REFRESH_EXPIRY_MS=2592000000

# ── App ───────────────────────────────────
APP_ENV=development
APP_URL=http://localhost:8080
FRONTEND_URLS=http://localhost:3000,http://localhost:3001,http://localhost:3002

# ── Admin ─────────────────────────────────
ADMIN_IP_WHITELIST=127.0.0.1,::1


React apps .env.example:

VITE_API_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/ws
VITE_GOOGLE_MAPS_KEY=your_maps_key
VITE_RAZORPAY_KEY=rzp_test_xxxxx
VITE_AGORA_APP_ID=your_agora_id
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=uptime-app
VITE_APP_ENV=development
VITE_SENTRY_DSN=


Flutter lib/core/config/app_config.dart:

class AppConfig {
  static const _flavor = String.fromEnvironment(
    'FLAVOR', defaultValue: 'development'
  );

  static bool get isDev => _flavor == 'development';
  static bool get isStaging => _flavor == 'staging';
  static bool get isProd => _flavor == 'production';

  static String get apiUrl => switch (_flavor) {
    'production' => 'https://api.uptime.in/api/v1',
    'staging'    => 'https://staging-api.uptime.in/api/v1',
    _            => 'http://10.0.2.2:8080/api/v1',  // Android emulator
  };

  static String get wsUrl => switch (_flavor) {
    'production' => 'wss://api.uptime.in/ws',
    'staging'    => 'wss://staging-api.uptime.in/ws',
    _            => 'ws://10.0.2.2:8080/ws',
  };

  static const googleMapsKey = String.fromEnvironment('GOOGLE_MAPS_KEY');
  static const agoraAppId    = String.fromEnvironment('AGORA_APP_ID');
  static const razorpayKey   = String.fromEnvironment('RAZORPAY_KEY');
}
```

---

## 15. Database Migration Files

```
src/main/resources/db/migration/

V1__create_users_and_auth.sql:
  → CREATE EXTENSION IF NOT EXISTS postgis;
  → CREATE TYPE user_type AS ENUM (...)
  → CREATE TABLE users (...)
  → CREATE TABLE user_addresses (..., location geography(POINT,4326))
  → CREATE TABLE user_sessions (...)
  → CREATE TABLE otp_verifications (...)
  → CREATE TABLE refresh_tokens (...)
  → CREATE TABLE user_devices (...)
  → CREATE TABLE user_preferences (...)
  → CREATE TABLE referrals (...)
  → Indexes on all FK columns

V2__create_technicians.sql:
  → CREATE TABLE technicians (...)
  → CREATE TABLE technician_skills (...)
  → CREATE TABLE technician_documents (...)
  → CREATE TABLE technician_verification (...)
  → CREATE TABLE technician_locations (..., current_location geography(POINT,4326))
  → CREATE TABLE technician_availability (...)
  → CREATE TABLE technician_service_areas (...)
  → CREATE TABLE technician_statistics (...)
  → CREATE TABLE technician_badges (...)
  → CREATE TABLE technician_bank_accounts (...)

V3__create_jobs_and_workflow.sql:
  → CREATE TABLE jobs (..., owner_location geography(POINT,4326))
  → CREATE TABLE job_media (...)
  → CREATE TABLE job_status_history (...)
  → CREATE TABLE job_checklist (...)
  → CREATE TABLE job_checklist_items (...)
  → CREATE TABLE job_parts_used (...)
  → CREATE TABLE job_timeline (...)
  → CREATE TABLE job_cancellations (...)
  → CREATE TABLE job_disputes (...)
  → CREATE TABLE job_auction (...)
  → CREATE TABLE job_auction_bids (...)
  → CREATE TABLE job_otp_verifications (...)

V4__create_ai_and_diagnosis.sql:
  → CREATE TABLE ai_fault_diagnoses (...)
  → CREATE TABLE ai_sound_analyses (...)
  → CREATE TABLE ai_image_analyses (...)
  → CREATE TABLE digital_twins (...)
  → CREATE TABLE digital_twin_components (...)
  → CREATE TABLE repair_predictions (...)
  → CREATE TABLE ai_copilot_sessions (...)
  → CREATE TABLE ai_copilot_steps (...)
  → CREATE TABLE epidemic_detections (...)
  → CREATE TABLE epidemic_affected_users (...)
  → CREATE TABLE silent_killer_alerts (...)
  → CREATE TABLE ai_prompt_versions (...)

V5__create_matching.sql:
  → CREATE TABLE matching_requests (...)
  → CREATE TABLE matching_scores (...)
  → CREATE TABLE technician_dispatch_history (...)
  → CREATE TABLE surge_pricing (...)
  → CREATE TABLE live_location_tracking (...)
      PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at))
  → CREATE TABLE job_notifications_sent (...)

V6__create_payments.sql:
  → CREATE TABLE transactions (...)
  → CREATE TABLE wallet_transactions (...)
  → CREATE TABLE payouts (...)
  → CREATE TABLE subscription_plans (...)
  → CREATE TABLE subscriptions (...)
  → CREATE TABLE invoices (...)
  → CREATE TABLE gst_records (...)
  → CREATE TABLE refunds (...)
  → CREATE TABLE payment_methods (...)
  → CREATE TABLE platform_revenue (...)

V7__create_ratings.sql:
  → CREATE TABLE job_ratings (...)
  → CREATE TABLE rating_categories (...)
  → CREATE TABLE technician_trust_scores (...)
  → CREATE TABLE owner_trust_scores (...)
  → CREATE TABLE platform_nps (...)
  → CREATE TABLE review_reports (...)
  → CREATE TABLE rating_analytics (...)

V8__create_industry_specific.sql:
  → CREATE TABLE machines (...)
  → CREATE TABLE machine_service_history (...)
  → CREATE TABLE workshop_inventory (...)
  → CREATE TABLE vehicles (...)
  → CREATE TABLE vehicle_documents (...)
  → CREATE TABLE vehicle_service_history (...)
  → CREATE TABLE vehicle_fuel_logs (..., location geography(POINT,4326))
  → CREATE TABLE driver_safety_scores (...)
  → CREATE TABLE pre_purchase_scans (...)
  → CREATE TABLE vehicle_scan_details (...)
  → CREATE TABLE engine_fingerprints (...)
  → CREATE TABLE vehicle_mood_scores (...)
  → CREATE TABLE devices (...)
  → CREATE TABLE device_health_logs (...)
  → CREATE TABLE device_service_history (...)
  → CREATE TABLE smart_home_connections (...)
  → CREATE TABLE iot_sensor_readings (...)
      PARTITION BY RANGE (EXTRACT(MONTH FROM recorded_at))

V9__create_insurance.sql:
  → CREATE TABLE insurance_policies (...)
  → CREATE TABLE insurance_claims (..., incident_location geography(POINT,4326))
  → CREATE TABLE warranties (...)
  → CREATE TABLE amc_contracts (...)
  → CREATE TABLE extended_warranties (...)
  → CREATE TABLE job_micro_insurance (...)

V10__create_marketplace.sql:
  → CREATE TABLE marketplace_products (...)
  → CREATE TABLE marketplace_sellers (...)
  → CREATE TABLE marketplace_orders (...)
  → CREATE TABLE marketplace_order_items (...)
  → CREATE TABLE marketplace_refurbished (...)
  → CREATE TABLE spare_parts_requests (...)

V11__create_notifications.sql:
  → CREATE TABLE notifications (...)
  → CREATE TABLE notification_templates (...)
  → CREATE TABLE notification_preferences (...)
  → CREATE TABLE mass_notifications (...)
  → CREATE TABLE notification_analytics (...)
  → CREATE TABLE push_delivery_logs (...)

V12__create_analytics_and_logs.sql:
  → CREATE TABLE platform_analytics (...)
  → CREATE TABLE search_logs (...)
  → CREATE TABLE api_logs (...)
      PARTITION BY RANGE (EXTRACT(YEAR FROM created_at))
  → CREATE TABLE error_logs (...)
  → CREATE TABLE audit_logs (...)
  → CREATE TABLE user_activity_logs (...)
      PARTITION BY RANGE (EXTRACT(YEAR FROM created_at))
  → CREATE TABLE platform_health_scores (...)

V13__create_wiki.sql:
  → CREATE TABLE wiki_articles (...)
  → CREATE TABLE wiki_versions (...)
  → CREATE TABLE wiki_contributions (...)
  → CREATE TABLE wiki_votes (...)
  → CREATE TABLE wiki_comments (...)

V14__create_admin.sql:
  → CREATE TABLE admin_users (...)
  → CREATE TABLE admin_roles (...)
  → CREATE TABLE admin_permissions (...)
  → CREATE TABLE platform_settings (...)
  → CREATE TABLE feature_flags (...)
  → CREATE TABLE cookie_consents (...)
  → CREATE TABLE end_of_life_records (...)
  → CREATE TABLE nft_transactions (...)
  → CREATE TABLE carbon_credits (...)
  → CREATE TABLE referral_campaigns (...)
  → CREATE TABLE app_versions (...)
  → CREATE TABLE tamper_proof_verifications (...)
  → CREATE TABLE auction_bonus_history (...)
  → CREATE TABLE job_negotiations (...)
  → CREATE TABLE virtual_consultations (...)
  → CREATE TABLE job_live_streams (...)

V15__add_indexes_and_spatial.sql:
  → CREATE INDEX USING GIST on all geography columns
  → CREATE INDEX on all FK columns
  → CREATE INDEX on status, type, date columns
  → Full-text search index on wiki_articles

V16__add_triggers_and_views.sql:
  → Trigger: after_job_complete → update_tech_stats()
  → Trigger: after_rating_insert → update_rating_avg()
  → Trigger: audit_immutable → prevent_audit_modification()
  → View: v_active_jobs
  → View: v_technician_dashboard
  → View: v_platform_summary
  → Stored procedure: sp_calculate_match_score()

V17__seed_demo_data.sql:
  → 1 admin account
  → 3 owner accounts (1 per industry)
  → 5 verified technician accounts
  → 3 machines, 3 vehicles, 3 devices
  → 15 completed jobs (5 per industry)
  → 2 active in-progress jobs
  → 10 wiki articles
  → Subscription plans (4 tiers)
  → Notification templates (all types, EN + HI + KN)
```

---

## 16. AI Prompt Files

```
src/main/resources/prompts/

fault_triage_v1.txt:
  System: You are an expert repair technician AI...
  Task:   Analyse the provided fault description, images,
          and audio recordings and return a JSON diagnosis
  Output: {fault_category, urgency, confidence,
           estimated_cost_min, estimated_cost_max,
           skill_tags, diagnosis_text, safety_warnings,
           diy_possible}

sound_analysis_v1.txt:
  System: You are an acoustic fault analysis expert...
  Task:   Analyse the audio recording of the machine/vehicle
          and identify fault indicators from sound patterns
  Output: {fault_type, confidence, frequency_anomaly,
           severity, description, recommended_action}

image_analysis_v1.txt:
  System: You are a visual damage assessment expert...
  Task:   Analyse the images and identify visible damage,
          wear, contamination, or fault indicators
  Output: {damage_type, severity, affected_components,
           description, requires_immediate_attention}

copilot_step_v1.txt:
  System: You are an AI repair guide assistant...
  Task:   Generate the next repair step for the technician
          based on fault category and completed steps
  Output: {step_number, title, instruction,
           safety_warning, tool_needed, expected_result,
           photo_required}

negotiation_v1.txt:
  System: You are a fair pricing expert for repairs in India...
  Task:   Suggest a fair price range based on fault type,
          parts needed, labour time, and city
  Output: {min_fair_price, max_fair_price, breakdown,
           verdict, market_context}

prediction_v1.txt:
  System: You are a predictive maintenance specialist...
  Task:   Analyse the asset service history and predict
          the next likely failure and recommended service date
  Output: {predicted_fault, probability, estimated_date,
           recommended_action, estimated_cost}

epidemic_v1.txt:
  System: You are a fault pattern analyst...
  Task:   Analyse multiple fault reports for the same
          device model and determine if an epidemic exists
  Output: {is_epidemic, confidence, fault_pattern,
           affected_count, severity, recommended_response}

silent_killer_v1.txt:
  System: You are a home appliance safety expert...
  Task:   Analyse sensor readings and usage patterns
          to detect hidden safety hazards
  Output: {hazard_type, severity, confidence,
           immediate_action, technical_details}

pre_purchase_v1.txt:
  System: You are an independent vehicle inspection expert...
  Task:   Analyse the inspection checklist data, photos,
          and documents to generate a fair assessment
  Output: {overall_score, verdict, key_concerns,
           fair_price_estimate, recommendation}

wiki_extraction_v1.txt:
  System: You are a repair knowledge curator...
  Task:   Extract structured repair knowledge from this
          completed job record
  Output: {fault_category, root_cause, fix_steps[],
           tools_required[], parts_replaced[],
           estimated_cost_range, difficulty, success_tips}

translation_v1.txt:
  System: You are a multilingual translation expert
          specialising in technical repair terminology
          in Indian languages...
  Task:   Translate the following repair-related text
          to {target_language}. Maintain technical accuracy.
  Output: {translated_text, detected_language}

ocr_warranty_v1.txt:
  System: You are a document data extraction expert...
  Task:   Extract all warranty information from this
          warranty card image
  Output: {product_name, brand, model, serial_number,
           purchase_date, warranty_start, warranty_end,
           coverage_details, service_center_info}
```

---

## 17. Configuration Files

```
src/main/resources/application.yml:

spring:
  application:
    name: uptime-backend
  profiles:
    active: ${APP_ENV:development}
  
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
      connection-timeout: 30000
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: false
  
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  
  data:
    redis:
      url: ${UPSTASH_REDIS_URL}
      password: ${UPSTASH_REDIS_TOKEN}
      ssl:
        enabled: true
  
  rabbitmq:
    host: ${RABBIT_HOST:localhost}
    port: ${RABBIT_PORT:5672}
    username: ${RABBIT_USER:uptime}
    password: ${RABBIT_PASSWORD}
  
  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 100MB

server:
  port: 8080
  error:
    include-stacktrace: never
    include-message: always

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
  endpoint:
    health:
      show-details: when-authorized

logging:
  level:
    com.uptime: INFO
    org.springframework.security: WARN
    org.hibernate.SQL: WARN


tailwind.config.ts:

import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:  '#1A3C6E',
          teal:  '#00D4AA',
          dark:  '#0F172A',
          light: '#F8FAFC',
        },
        industry: {
          industrial: '#7C3AED',
          automobile: '#2563EB',
          electronics: '#0891B2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  },
  plugins: [],
} satisfies Config


analysis_options.yaml (Flutter):

include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_const_constructors: true
    prefer_const_literals_to_create_immutables: true
    avoid_print: true
    use_key_in_widget_constructors: true
    sized_box_for_whitespace: true
    avoid_unnecessary_containers: true
```

---

## File Count Summary

```
┌─────────────────────────────────────────────────────────┐
│  UPTIME — Complete File Count                           │
│                                                         │
│  uptime-backend/          ~280 Java files               │
│                            17 SQL migration files       │
│                            12 AI prompt text files      │
│                             7 YAML config files         │
│                                                         │
│  uptime-owner-web/        ~120 TypeScript/TSX files     │
│                             9 locale JSON files         │
│                             8 Lottie animation files    │
│                                                         │
│  uptime-owner-app/        ~130 Dart files               │
│                             9 ARB translation files     │
│                             7 Lottie JSON files         │
│                                                         │
│  uptime-tech-web/          ~70 TypeScript/TSX files     │
│                                                         │
│  uptime-technician-app/   ~110 Dart files               │
│                                                         │
│  uptime-admin-web/         ~75 TypeScript/TSX files     │
│                                                         │
│  uptime-shared/            ~20 TypeScript files         │
│                                                         │
│  uptime-docs/              ~40 Markdown files           │
│                             2 JSON Postman collections  │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  Total files:             ~900+ files                   │
│  Total repositories:        8                           │
│  Total platforms:           6                           │
│                                                         │
│  Nothing missing ✅                                     │
└─────────────────────────────────────────────────────────┘
```

---

*UPTIME — "Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*
