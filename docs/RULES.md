# UPTIME — Coding Rules & Constraints

> **For:** AI Coding Agents & All Team Members  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Read this BEFORE writing any code.**  
> **These rules are NON-NEGOTIABLE.**  

---

## Table of Contents

1. [General Rules](#1-general-rules)
2. [Project Structure Rules](#2-project-structure-rules)
3. [Spring Boot Rules](#3-spring-boot-rules)
4. [Database Rules](#4-database-rules)
5. [React Rules](#5-react-rules)
6. [Flutter Rules](#6-flutter-rules)
7. [API Rules](#7-api-rules)
8. [Security Rules](#8-security-rules)
9. [AI Integration Rules](#9-ai-integration-rules)
10. [Git Rules](#10-git-rules)
11. [Naming Conventions](#11-naming-conventions)
12. [What NEVER To Do](#12-what-never-to-do)

---

## 1. General Rules

```
RULE G-01: Read before writing
  Before creating ANY file, read the relevant
  document first:
  → New Spring Boot endpoint  → Read API.md
  → New DB table              → Read DATABASE.md
  → New React screen          → Read DESIGN.md
  → Any code                  → Read CODING_STANDARDS.md

RULE G-02: One task at a time
  Complete one feature fully before starting next.
  Never leave half-finished code in any branch.

RULE G-03: No hardcoded values
  ALL config goes in application.yml or .env
  NEVER hardcode:
    API keys, passwords, URLs, port numbers,
    timeout values, retry counts

RULE G-04: No dead code
  Never commit commented-out code blocks.
  Delete unused code. Git history keeps old versions.

RULE G-05: Match the existing pattern
  If a pattern already exists in the codebase,
  follow it exactly.
  Never invent a new pattern without team discussion.

RULE G-06: Every feature needs a test
  No feature is "done" without at least one test.
  Backend: JUnit test
  Frontend: at minimum a smoke test

RULE G-07: Error handling is mandatory
  Every API call must handle errors.
  Every async operation must have a catch block.
  Silent failures are FORBIDDEN.

RULE G-08: Logging is mandatory
  Every service method logs entry + exit at DEBUG.
  Every error logs at ERROR with context.
  Never log sensitive data (passwords, tokens, PII).
```

---

## 2. Project Structure Rules

```
RULE S-01: Correct repository
  Code goes in the correct repo:
  Backend code     → uptime-backend/
  Owner web        → uptime-owner-web/
  Owner app        → uptime-owner-app/
  Tech web         → uptime-tech-web/
  Tech app         → uptime-technician-app/
  Admin web        → uptime-admin-web/
  Shared types     → uptime-shared/
  Docs             → uptime-docs/

RULE S-02: Correct module
  Backend code goes in its correct module:
  Auth code        → modules/auth/
  Job code         → modules/job/
  AI code          → modules/ai/
  Payment code     → modules/payment/
  (etc. — 14 modules total, see STRUCTURE.md)

RULE S-03: One class per file (Java)
  One Java class/interface per file.
  File name = class name exactly.

RULE S-04: Feature folder structure (Flutter)
  Every Flutter feature follows:
  features/{name}/
    screens/     → Screen widgets
    widgets/     → Feature-specific widgets
    providers/   → Riverpod providers
    services/    → API call functions

RULE S-05: Component folder structure (React)
  Every React component in correct folder:
  components/ui/       → shadcn/ui base components
  components/layout/   → Navigation, sidebar, footer
  components/common/   → Reusable across features
  components/{feature}/→ Feature-specific components
  pages/               → Route-level page components

RULE S-06: No circular imports
  modules/auth/ must NOT import from modules/job/
  modules/job/ can import from modules/auth/ (for user)
  If circular dependency found → extract to common/
```

---

## 3. Spring Boot Rules

## 3. Spring Boot Rules

### RULE SB-00: Matching & Fatigue Policy
Technicians with is_fatigue_restricted = TRUE MUST be filtered out directly in the database query (WHERE ... AND is_fatigue_restricted = FALSE). The ScoringEngine must NEVER receive or process a fatigued technician. Do NOT use score = 0 or subtract penalty points (-50) because a zero/penalized score can still appear in ranked candidate lists by mistake. Retain fatigue_score in the database so the restricted technician can view their rest-period notice and return countdown on their dashboard.

```
RULE B-01: Every module has these exact files
  {Name}Controller.java   → HTTP endpoints only
  {Name}Service.java      → Interface
  {Name}ServiceImpl.java  → Business logic
  {Name}Repository.java   → JPA interface
  {Name}Entity.java       → DB mapping
  {Name}DTO.java          → Response DTO
  {Name}Request.java      → Request DTO
  {Name}Mapper.java       → MapStruct mapper

RULE B-02: Controllers are thin
  Controller does ONLY:
  → Validate request (@Valid)
  → Call service method
  → Return ResponseEntity
  ZERO business logic in controllers.

  ✅ CORRECT:
  @PostMapping
  public ResponseEntity<?> createJob(
      @Valid @RequestBody JobCreateRequest request) {
    JobDTO job = jobService.createJob(request);
    return ResponseEntity.status(201)
      .body(ApiResponse.success(job));
  }

  ❌ WRONG:
  @PostMapping
  public ResponseEntity<?> createJob(...) {
    // Querying DB directly in controller
    Job job = jobRepository.save(...);
    // Business logic in controller
    if (job.getUrgency().equals("CRITICAL")) { ... }
  }

RULE B-03: Services contain all business logic
  ALL business rules go in ServiceImpl.
  Services call repositories.
  Services call other services (injected via @Autowired).
  Services NEVER access HttpServletRequest directly.

RULE B-04: Every endpoint has @PreAuthorize
  NO endpoint without role check:

  ✅ CORRECT:
  @PreAuthorize("hasRole('OWNER')")
  @PostMapping("/jobs")

  ❌ WRONG:
  @PostMapping("/jobs")  // No auth check!

  Exceptions (public endpoints only):
  /auth/send-otp
  /auth/verify-otp
  /auth/signup
  /api/v1/health
  /swagger-ui/**

RULE B-05: Always use @Valid on request DTOs
  ✅ CORRECT:
  public ResponseEntity<?> create(
      @Valid @RequestBody JobCreateRequest req)

  ❌ WRONG:
  public ResponseEntity<?> create(
      @RequestBody JobCreateRequest req)  // No @Valid!

RULE B-06: Always use @Transactional on write methods
  Every service method that writes to DB:
  @Transactional
  public JobDTO createJob(JobCreateRequest req) { ... }

  Read-only methods:
  @Transactional(readOnly = true)
  public JobDTO getJob(Long id) { ... }

RULE B-07: Never return entities directly
  ALWAYS convert to DTO before returning.
  Entities contain sensitive fields + lazy-load issues.

  ✅ CORRECT:
  return jobMapper.toDTO(job);

  ❌ WRONG:
  return job;  // Raw entity to controller

RULE B-08: Always use Optional properly
  ✅ CORRECT:
  Job job = jobRepository.findById(id)
    .orElseThrow(() ->
      new ResourceNotFoundException("JOB_001",
        "Job not found: " + id));

  ❌ WRONG:
  Job job = jobRepository.findById(id).get();
  // .get() without checking throws NoSuchElementException

RULE B-09: Async methods with @Async
  Long operations (AI calls, emails, notifications)
  MUST be @Async to not block HTTP thread:

  @Async
  @Transactional
  public CompletableFuture<DiagnosisDTO>
      analyseAsync(Long jobId) { ... }

RULE B-10: Cache with correct TTL
  Every @Cacheable must specify TTL in RedisConfig.
  Never cache without TTL (memory leak risk).

  Existing cache names + TTLs (in CacheNames.java):
  "user_profile"      → 15 minutes
  "nearby_techs"      → 2 minutes
  "ai_diagnosis"      → 10 minutes
  "subscription_plans"→ 60 minutes
  "wiki_articles"     → 30 minutes

RULE B-11: All DB queries via JPA only
  NEVER use:
    EntityManager directly (unless absolutely needed)
    JDBC Template for CRUD
    String-concatenated SQL queries

  ALWAYS use:
    Spring Data JPA method names
    @Query with named parameters
    JPA Specifications for complex filters

RULE B-12: Soft deletes everywhere
  User-facing entities NEVER hard delete.
  Set deleted_at = NOW() instead.
  All queries must filter: WHERE deleted_at IS NULL

  ✅ CORRECT:
  @Query("SELECT j FROM Job j WHERE j.id = :id
         AND j.deletedAt IS NULL")

  ❌ WRONG:
  jobRepository.deleteById(id); // Hard delete!
```

---

## 4. Database Rules

```
RULE D-01: Never modify DB schema manually
  ALL schema changes via Flyway migration files.
  Never run ALTER TABLE directly on Supabase dashboard.
  New migration = new V{N}__ file.

RULE D-02: Migration files are immutable
  Once a migration file is committed and run,
  NEVER modify it.
  If you made a mistake → create a new migration
  to fix it.

RULE D-03: Migration naming convention
  V{number}__{description}.sql
  Number must be sequential.
  Description: lowercase, underscores.

  ✅ CORRECT:
  V18__add_vehicle_scan_table.sql
  V19__add_index_on_jobs_status.sql

  ❌ WRONG:
  V18_add_table.sql       (single underscore)
  V18__AddTable.sql       (camelCase)
  fix_migration.sql       (no version number)

RULE D-04: Every new table needs these columns
  id          BIGSERIAL PRIMARY KEY
  created_at  TIMESTAMPTZ DEFAULT NOW()
  updated_at  TIMESTAMPTZ

  User-facing tables also need:
  deleted_at  TIMESTAMPTZ  (soft delete)

RULE D-05: Every FK column needs an index
  ✅ CORRECT:
  CREATE INDEX idx_jobs_owner_id ON jobs(owner_id);
  CREATE INDEX idx_jobs_tech_id ON jobs(technician_id);

  ❌ WRONG:
  -- Add FK but forget index (slow queries!)

RULE D-06: Money columns use DECIMAL(10,2)
  NEVER use FLOAT or DOUBLE for money.
  Floating point causes rounding errors.

  ✅ CORRECT: amount DECIMAL(10,2)
  ❌ WRONG:   amount FLOAT

RULE D-07: Timestamps use TIMESTAMPTZ
  Always store UTC timezone.
  Convert to local timezone in frontend only.

  ✅ CORRECT: created_at TIMESTAMPTZ DEFAULT NOW()
  ❌ WRONG:   created_at TIMESTAMP (no timezone!)

RULE D-08: Geospatial columns use PostGIS
  ✅ CORRECT:
  location geography(POINT, 4326)
  CREATE INDEX idx_loc ON table USING GIST(location);

  ❌ WRONG:
  latitude  DECIMAL(10,7)   (no spatial queries!)
  longitude DECIMAL(10,7)

RULE D-09: Flexible arrays use JSONB
  ✅ CORRECT: skill_tags JSONB DEFAULT '[]'
  ❌ WRONG:   skill_tags VARCHAR (comma-separated — terrible!)
  ❌ WRONG:   separate join table for simple string arrays

RULE D-10: Status columns use VARCHAR not ENUM
  PostgreSQL ENUMs are hard to alter.
  Use VARCHAR with CHECK constraint or validate in app.

  ✅ CORRECT:
  status VARCHAR(20) NOT NULL DEFAULT 'POSTED'

  ❌ WRONG:
  CREATE TYPE job_status AS ENUM ('POSTED','COMPLETED');
  -- Adding new value requires ALTER TYPE (breaks some ORMs)
```

---

## 5. React Rules

```
RULE R-01: TypeScript strictly typed
  NO 'any' type allowed anywhere.
  Every variable, prop, and function must be typed.

  ✅ CORRECT:
  const [jobs, setJobs] = useState<JobDTO[]>([]);
  const handleClick = (jobId: number): void => { }

  ❌ WRONG:
  const [jobs, setJobs] = useState<any>([]);
  const handleClick = (jobId) => { }

RULE R-02: React Query for ALL server state
  NEVER use useState + useEffect for data fetching.
  ALL API calls go through React Query.

  ✅ CORRECT:
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getJobs(filters),
  });

  ❌ WRONG:
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    jobService.getJobs().then(setJobs);
  }, []);

RULE R-03: Redux only for global app state
  Redux stores ONLY:
  → authSlice: user, token, role
  → jobSlice: activeJob, activeJobId
  → notificationSlice: unreadCount
  → uiSlice: loading, modals, sidebar
  → industrySlice: selectedIndustry

  NOT in Redux:
  → Server data (use React Query)
  → Form state (use React Hook Form)
  → Component-local state (use useState)

RULE R-04: All forms use React Hook Form + Zod
  ✅ CORRECT:
  const schema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/),
  });
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  ❌ WRONG:
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  // Manual validation — don't do this

RULE R-05: Always handle loading + error states
  Every component that fetches data must show:
  → Loading: <LoadingSkeleton />
  → Error: <ErrorState /> with retry button
  → Empty: <EmptyState />
  → Data: actual content

  ✅ CORRECT:
  if (isLoading) return <JobListSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data?.length) return <EmptyState />;
  return <JobList jobs={data} />;

RULE R-06: Tailwind only — no inline styles
  ✅ CORRECT:
  <div className="p-4 bg-white rounded-xl shadow-sm">

  ❌ WRONG:
  <div style={{ padding: 16, background: 'white' }}>

  Exception: Dynamic values only
  <div style={{ width: `${percentage}%` }}>

RULE R-07: Images via CachedImage component
  Never use raw <img> tags for user content.
  Always use Cloudinary transformation URLs.

  ✅ CORRECT:
  <img
    src={`${cloudinaryUrl}/w_200,h_200,c_fill,f_webp/${id}`}
    loading="lazy"
    alt={description}
  />

RULE R-08: Protected routes wrapped in AuthGuard
  Every dashboard route wrapped:
  <AuthGuard>
    <DashboardPage />
  </AuthGuard>

RULE R-09: i18next for ALL user-facing strings
  ZERO hardcoded English strings in JSX.

  ✅ CORRECT:
  const { t } = useTranslation();
  <button>{t('common.bookNow')}</button>

  ❌ WRONG:
  <button>Book Now</button>

RULE R-10: Axios instance — never raw fetch
  ALL HTTP calls use the configured axios instance.
  The instance handles: JWT, refresh, error logging.

  ✅ CORRECT:
  import api from '@/lib/axios';
  const res = await api.post('/jobs', data);

  ❌ WRONG:
  const res = await fetch('/api/v1/jobs', {
    headers: { Authorization: `Bearer ${token}` }
  });
```

---

## 6. Flutter Rules

```
RULE F-01: Riverpod for ALL state
  NEVER use setState for anything beyond local UI.
  NEVER use Provider (old package).
  ALWAYS use Riverpod 2.x.

  ✅ CORRECT:
  final jobsProvider = FutureProvider.autoDispose
    .family<List<JobDTO>, JobFilter>((ref, filter) {
    return ref.read(jobServiceProvider).getJobs(filter);
  });

  ❌ WRONG:
  setState(() { jobs = newJobs; });
  // or ChangeNotifier

RULE F-02: go_router for ALL navigation
  NEVER use Navigator.push() directly.
  ALWAYS use context.push() or context.go().

  ✅ CORRECT:
  context.push('/tracking/$jobId');
  context.go('/home');

  ❌ WRONG:
  Navigator.push(context,
    MaterialPageRoute(builder: (_) => TrackingScreen()));

RULE F-03: Dio for ALL HTTP calls
  NEVER use http package.
  ALWAYS use the configured Dio instance from
  core/network/dio_client.dart.

  ✅ CORRECT:
  final dio = ref.read(dioClientProvider);
  final response = await dio.post('/jobs', data: body);

  ❌ WRONG:
  import 'package:http/http.dart' as http;
  final response = await http.post(...);

RULE F-04: Const constructors everywhere
  Every widget that doesn't change = const.
  This prevents unnecessary rebuilds.

  ✅ CORRECT:
  const SizedBox(height: 16),
  const Text('Book Now'),
  const LoadingSpinner(),

  ❌ WRONG:
  SizedBox(height: 16),   // Missing const
  Text('Book Now'),       // Missing const

RULE F-05: ListView.builder not ListView
  NEVER use ListView(children: [...]) for dynamic lists.
  ALWAYS use ListView.builder for performance.

  ✅ CORRECT:
  ListView.builder(
    itemCount: jobs.length,
    itemBuilder: (ctx, i) => JobCard(job: jobs[i]),
  )

  ❌ WRONG:
  ListView(children: jobs.map((j) => JobCard(j)).toList())

RULE F-06: CachedNetworkImage for all images
  NEVER use Image.network() directly.

  ✅ CORRECT:
  CachedNetworkImage(
    imageUrl: tech.profilePhotoUrl,
    placeholder: (ctx, url) => const AvatarSkeleton(),
    errorWidget: (ctx, url, err) => const DefaultAvatar(),
  )

  ❌ WRONG:
  Image.network(tech.profilePhotoUrl)

RULE F-07: Tokens in flutter_secure_storage only
  NEVER store JWT in SharedPreferences or Hive.
  ALWAYS use flutter_secure_storage.

  ✅ CORRECT:
  await secureStorage.write(key: 'access_token', value: token);

  ❌ WRONG:
  prefs.setString('token', token); // SharedPreferences!
  box.put('token', token);         // Hive — not encrypted!

RULE F-08: Handle offline state explicitly
  Every screen that needs network must check connectivity.
  Show OfflineBanner if no network.
  Show cached data when available.

  ✅ CORRECT:
  final isOnline = ref.watch(connectivityProvider);
  if (!isOnline) return const OfflineBanner();

RULE F-09: Minimum touch target 48×48px
  EVERY tappable widget must be at least 48×48px.

  ✅ CORRECT:
  SizedBox(
    width: 48, height: 48,
    child: IconButton(icon: Icon(Icons.close), ...),
  )

  ❌ WRONG:
  GestureDetector(child: Icon(Icons.close, size: 16))
  // Too small to tap accurately

RULE F-10: ARB files for ALL strings
  ZERO hardcoded strings in any widget.

  ✅ CORRECT:
  Text(AppLocalizations.of(context)!.bookNow)

  ❌ WRONG:
  Text('Book Now')
```

---

## 7. API Rules

```
RULE A-01: Standard response format always
  EVERY endpoint returns ApiResponse<T> format:
  {
    "success": true/false,
    "data": {...},
    "message": "...",
    "timestamp": "...",
    "requestId": "..."
  }

  NEVER return raw objects or plain strings.

RULE A-02: Correct HTTP status codes
  201 for new resource created (POST)
  200 for successful GET/PUT/PATCH
  204 for successful DELETE
  400 for validation errors
  401 for auth errors
  403 for permission errors
  404 for not found
  409 for conflicts (duplicate)
  422 for business rule violations
  429 for rate limit
  500 for server errors

RULE A-03: Paginated endpoints always accept page + size
  All list endpoints must support:
  ?page=0&size=20
  Default: page=0, size=20, max size=100

RULE A-04: Versioning in URL
  All endpoints under /api/v1/
  Never remove a v1 endpoint — add v2 for breaking changes.

RULE A-05: Swagger annotation on every endpoint
  ✅ CORRECT:
  @Operation(summary = "Create new job",
    description = "Owner posts a fault report")
  @ApiResponse(responseCode = "201",
    description = "Job created successfully")
  @PostMapping

RULE A-06: Never expose internal IDs in URLs where security matters
  OK for jobs: /jobs/999 (jobs are not secret)
  NOT OK for: /admin/999 (use slug or UUID for admin)

RULE A-07: Input sanitisation before AI
  Strip all prompt injection attempts before
  sending user input to Gemini.
  Max 1000 characters for user-provided text in prompts.
```

---

## 8. Security Rules

```
RULE SEC-01: NEVER commit secrets
  .env files are in .gitignore.
  API keys go in GitHub Secrets.
  Any accidental commit → rotate key immediately.

RULE SEC-02: NEVER log sensitive data
  Never log:
  → Passwords or hashes
  → OTP values
  → JWT tokens
  → Card numbers
  → Bank account numbers
  → Aadhaar numbers
  → API keys

RULE SEC-03: NEVER use hardcoded credentials
  ❌ WRONG:
  String apiKey = "AIzaSy...";  // NEVER!

  ✅ CORRECT:
  @Value("${gemini.api-key}")
  private String geminiApiKey;

RULE SEC-04: Every new endpoint needs rate limiting
  Default: 100 req/min per user
  Sensitive endpoints: set lower in RateLimitFilter
  New public endpoints: ALWAYS rate limited.

RULE SEC-05: Validate all file uploads
  Check: MIME type + magic bytes + file size.
  Never skip magic bytes check.
  Never trust Content-Type header alone.

RULE SEC-06: Parameterised queries only
  NEVER concatenate user input into SQL.
  Always use @Param in @Query.
  Always use JPA method names.

RULE SEC-07: HTTPS everywhere
  Never allow HTTP in production.
  Never send tokens over HTTP.
  All external API calls use HTTPS.

RULE SEC-08: Minimum privilege
  Each service account has minimum permissions needed.
  No "superuser" accounts except actual super admins.
  Supabase service key used only in backend.
```

---

## 9. AI Integration Rules

```
RULE AI-01: Always handle Gemini failure gracefully
  AI failure must NEVER block the main flow.
  If Gemini fails → set isFallback=true, continue.

  ✅ CORRECT:
  try {
    diagnosis = geminiService.analyse(input);
  } catch (AIServiceException e) {
    log.warn("AI failed, using fallback: {}", e.getMessage());
    diagnosis = DiagnosisDTO.fallback(industry);
  }
  // Job creation continues regardless

  ❌ WRONG:
  // Throwing exception that blocks job creation

RULE AI-02: Sanitise user input before prompts
  Strip: ```, Ignore, System:, Human:, Assistant:
  Limit: max 1000 characters
  Label clearly as untrusted input in prompt.

RULE AI-03: Load prompts from files, not hardcoded
  ✅ CORRECT:
  String prompt = promptManager.getActivePrompt("fault_triage");

  ❌ WRONG:
  String prompt = "You are an expert..."; // Hardcoded!

RULE AI-04: Always specify JSON output in prompt
  End every Gemini prompt with:
  "Respond ONLY with valid JSON. No markdown, no explanation."

RULE AI-05: Parse response defensively
  Always wrap JSON.parse in try-catch.
  Always check for required fields after parse.
  Never assume Gemini returned correct structure.

  ✅ CORRECT:
  try {
    DiagnosisResponse resp = objectMapper
      .readValue(geminiOutput, DiagnosisResponse.class);
    if (resp.getFaultCategory() == null)
      return DiagnosisDTO.fallback(industry);
    return mapper.toDTO(resp);
  } catch (JsonParseException e) {
    log.error("Failed to parse Gemini response");
    return DiagnosisDTO.fallback(industry);
  }

RULE AI-06: Track token usage
  Log tokens_used for every Gemini call.
  Alert if monthly usage approaches free tier limit.
  Gemini free tier: 1,000,000 tokens/month.

RULE AI-07: Async AI calls via RabbitMQ
  Long AI operations (diagnosis, prediction) must be
  queued via RabbitMQ — never block HTTP request.
  Return job_id immediately, push result via WebSocket.
```

---

## 10. Git Rules

```
RULE GIT-01: Branch naming
  Format: feature/{your-name}/{description}
  ✅ CORRECT:
    feature/pavan/ai-fault-triage
    feature/member2/razorpay-integration
    feature/member3/flutter-home-screen
    fix/pavan/otp-expiry-bug
  ❌ WRONG:
    main, develop, test, new-branch, my-feature

RULE GIT-02: Commit message format
  Format: {type}: {short description}
  Types: feat | fix | docs | style | test | chore

  ✅ CORRECT:
    feat: add Gemini sound analysis endpoint
    fix: correct JWT expiry calculation
    docs: update API docs for jobs module
    test: add ScoringEngine unit tests
    chore: update Spring Boot to 3.2.5

  ❌ WRONG:
    "fixed stuff"
    "WIP"
    "asdfgh"
    "final final v2"

RULE GIT-03: Never push to main or develop directly
  Always create feature branch.
  Always create PR.
  PR requires 1 approval (Pavan).
  CI must pass before merge.

RULE GIT-04: Never commit .env files
  Check .gitignore before every commit.
  If accidentally committed:
  1. Remove from git: git rm --cached .env
  2. Rotate all exposed API keys immediately
  3. Force push to remove from history

RULE GIT-05: PR size limit
  Maximum 400 lines changed per PR.
  Larger changes → split into multiple PRs.
  Reviewers can't effectively review 2000+ line PRs.

RULE GIT-06: Pull before push
  Always git pull origin develop before pushing.
  Resolve conflicts locally before PR.

RULE GIT-07: No binary files in git
  Images → Cloudinary
  PDFs → Cloudinary
  .env → not committed
  IDE files (.idea, .vscode) → .gitignore

RULE GIT-08: Tag releases
  Every production deployment gets a tag:
  v1.0.0 → major feature
  v1.0.1 → bug fix
  v1.1.0 → minor feature
  Semantic versioning: MAJOR.MINOR.PATCH
```

---

## 11. Naming Conventions

```
JAVA (Spring Boot):
  Classes:      PascalCase        JobServiceImpl
  Methods:      camelCase         createJob()
  Variables:    camelCase         jobId, ownerName
  Constants:    UPPER_SNAKE_CASE  MAX_RETRY_COUNT
  Packages:     lowercase         com.uptime.modules.job
  DB entities:  {Name}.java       Job.java, User.java
  DTOs:         {Name}DTO.java     JobDTO.java
  Requests:     {Name}Request.java JobCreateRequest.java
  Services:     {Name}Service.java JobService.java (interface)
                {Name}ServiceImpl  JobServiceImpl.java (impl)

TYPESCRIPT (React):
  Components:   PascalCase        JobCard.tsx, LiveTrackingMap.tsx
  Hooks:        camelCase + use   useAuth.ts, useJob.ts
  Services:     camelCase + Service  jobService.ts
  Types:        PascalCase + DTO  JobDTO, UserDTO
  Constants:    UPPER_SNAKE_CASE  MAX_FILE_SIZE
  CSS classes:  kebab-case (Tailwind handles this)
  Files:        PascalCase for components, camelCase for utils

DART (Flutter):
  Classes:      PascalCase        JobCard, HomeScreen
  Methods:      camelCase         createJob(), fetchData()
  Variables:    camelCase         jobId, isLoading
  Constants:    camelCase (dart)  maxRetryCount
  Files:        snake_case        job_card.dart, home_screen.dart
  Providers:    camelCase + Provider  jobListProvider
  Screens:      PascalCase + Screen   HomeScreen
  Widgets:      PascalCase + Widget   JobCardWidget

DATABASE:
  Tables:       snake_case        jobs, job_parts_used
  Columns:      snake_case        owner_id, created_at
  Indexes:      idx_{table}_{col} idx_jobs_owner_id
  FK indexes:   idx_{table}_{col} idx_jobs_tech_id
  Migrations:   V{N}__{desc}.sql  V18__add_vehicle_scan.sql

API:
  Endpoints:    kebab-case        /api/v1/fault-reports
  JSON keys:    camelCase         jobId, ownerName, faultCategory
  Query params: camelCase         page, size, fromDate
  Path params:  camelCase         {jobId}, {technicianId}
```

---

## 12. What NEVER To Do

```
❌ NEVER hardcode API keys in source code
❌ NEVER commit .env files to git
❌ NEVER use 'any' type in TypeScript
❌ NEVER use setState for server data in React
❌ NEVER use Navigator.push() in Flutter
❌ NEVER return raw entities from controllers
❌ NEVER write SQL string concatenation
❌ NEVER use FLOAT for money columns
❌ NEVER modify existing Flyway migration files
❌ NEVER hard-delete user-facing records (use soft delete)
❌ NEVER log passwords, tokens, or PII
❌ NEVER create an endpoint without @PreAuthorize
❌ NEVER use ListView (use ListView.builder)
❌ NEVER use Image.network (use CachedNetworkImage)
❌ NEVER store JWT in SharedPreferences or Hive
❌ NEVER block the HTTP thread for AI/email/notifications
❌ NEVER let AI failure crash the main job flow
❌ NEVER hardcode text strings in JSX or widgets
❌ NEVER use inline styles in React (use Tailwind)
❌ NEVER push directly to main or develop branch
❌ NEVER merge a PR without CI passing
❌ NEVER leave TODO comments in production code
❌ NEVER use .get() on Optional without orElseThrow
❌ NEVER create a new module pattern without team discussion
❌ NEVER use ENUM type in PostgreSQL (use VARCHAR)
❌ NEVER skip Bean Validation on request DTOs
❌ NEVER forget to add index on FK columns
❌ NEVER use TIMESTAMP without timezone (use TIMESTAMPTZ)
❌ NEVER accept user-controlled URLs in backend
❌ NEVER trust Content-Type header alone for file uploads
❌ NEVER skip the magic bytes check on uploads
❌ NEVER expose Supabase service key to frontend
❌ NEVER call Gemini API synchronously in HTTP request
❌ NEVER create duplicate code — extract to shared utility
❌ NEVER ship a feature without at least one test
```

---

## Quick Reference Card

```
Starting a new feature?
  1. git checkout develop && git pull
  2. git checkout -b feature/your-name/feature-name
  3. Read relevant docs (API.md, DATABASE.md, etc.)
  4. Follow the module pattern (Controller→Service→Repo)
  5. Write the code + tests
  6. git add . && git commit -m "feat: description"
  7. git push origin feature/your-name/feature-name
  8. Create PR on GitHub → assign Pavan as reviewer

Something not in these rules?
  → Follow the existing pattern in the codebase
  → If no pattern exists → ask team before inventing one
  → When in doubt → simpler is better
```

---

*UPTIME Coding Rules — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*
