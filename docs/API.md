# UPTIME — Complete API Documentation

> **Version:** 1.0  
> **Base URL (Dev):** `http://localhost:8080/api/v1`  
> **Base URL (Prod):** `https://api.uptime.in/api/v1`  
> **WebSocket (Dev):** `ws://localhost:8080/ws`  
> **WebSocket (Prod):** `wss://api.uptime.in/ws`  
> **Auth:** Bearer JWT in `Authorization` header  
> **Format:** All requests/responses `Content-Type: application/json`  

---

## Table of Contents

1. [Standard Response Format](#1-standard-response-format)
2. [Error Codes Reference](#2-error-codes-reference)
3. [Auth Module](#3-auth-module)
4. [User Module](#4-user-module)
5. [Technician Module](#5-technician-module)
6. [Job Module](#6-job-module)
7. [AI Module](#7-ai-module)
8. [Matching Module](#8-matching-module)
9. [Payment Module](#9-payment-module)
10. [Tracking Module](#10-tracking-module)
11. [Rating Module](#11-rating-module)
12. [Notification Module](#12-notification-module)
13. [Industry Module — Machines](#13-industry-module--machines)
14. [Industry Module — Vehicles](#14-industry-module--vehicles)
15. [Industry Module — Devices](#15-industry-module--devices)
16. [Digital Twin Module](#16-digital-twin-module)
17. [Insurance Module](#17-insurance-module)
18. [Marketplace Module](#18-marketplace-module)
19. [Wiki Module](#19-wiki-module)
20. [Video Consultation Module](#20-video-consultation-module)
21. [Admin Module](#21-admin-module)
22. [WebSocket Events](#22-websocket-events)
23. [Technician Verification & KYC Module (TECHNICIAN_VERIFICATION.md)](#23-technician-verification--kyc-module)

---

## 1. Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "timestamp": "2026-10-13T10:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "content": [ ],
    "page": 0,
    "size": 20,
    "totalElements": 145,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  },
  "message": "OK",
  "timestamp": "2026-10-13T10:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "JOB_001",
    "message": "Job not found",
    "details": null
  },
  "timestamp": "2026-10-13T10:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "phone": "Enter valid 10-digit mobile number",
      "industry": "Industry is required"
    }
  },
  "timestamp": "2026-10-13T10:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### HTTP Status Codes Used

```
200 OK           → Successful GET, PUT, PATCH
201 Created      → Successful POST (new resource)
204 No Content   → Successful DELETE
400 Bad Request  → Validation error
401 Unauthorized → Missing/invalid/expired JWT
403 Forbidden    → Valid JWT but wrong role
404 Not Found    → Resource doesn't exist
409 Conflict     → Duplicate resource
422 Unprocessable→ Business rule violation
429 Too Many Req → Rate limit exceeded
500 Server Error → Unexpected server error
503 Unavailable  → External service down (AI, etc.)
```

---

## 2. Error Codes Reference

```
AUTH errors:
  AUTH_001 → Invalid OTP
  AUTH_002 → OTP expired
  AUTH_003 → Too many OTP attempts — locked 30 mins
  AUTH_004 → Invalid JWT token
  AUTH_005 → JWT token expired
  AUTH_006 → Unauthorised — insufficient role

JOB errors:
  JOB_001  → Job not found
  JOB_002  → Job already accepted by another technician
  JOB_003  → Cannot cancel — technician has arrived
  JOB_004  → Invalid job status transition
  JOB_005  → OTP verification failed
  JOB_006  → GPS location mismatch (>500m from job site)
  JOB_007  → Job already completed and locked

MATCHING errors:
  MATCH_001 → No technicians available in area
  MATCH_002 → All technicians declined
  MATCH_003 → Matching timeout — no acceptance in 30 mins
  MATCH_004 → Technician no longer available

PAYMENT errors:
  PAY_001   → Payment initiation failed
  PAY_002   → Payment verification failed
  PAY_003   → Insufficient wallet balance
  PAY_004   → Payout failed — verify bank details
  PAY_005   → Refund already processed
  PAY_006   → Job payment already completed

AI errors:
  AI_001    → Gemini API rate limit exceeded
  AI_002    → File too large for analysis (max 20MB)
  AI_003    → Unsupported file format
  AI_004    → AI service temporarily unavailable

VALIDATION errors:
  VAL_001   → Required field missing / validation failed
  VAL_002   → Invalid phone number format
  VAL_003   → Invalid file type
  VAL_004   → File size exceeds limit
  VAL_005   → Invalid coordinates
  VAL_006   → Invalid date range

RATE LIMIT errors:
  RATE_001  → Too many requests — slow down

RESOURCE errors:
  RES_001   → User not found
  RES_002   → Technician not found
  RES_003   → Asset not found
  RES_004   → Policy not found
  RES_005   → Product not found
```

---

## 3. Auth Module

**Base path:** `/api/v1/auth`  
**Authentication:** None required (public endpoints)

---

### POST `/auth/send-otp`

Send OTP to phone number for login or signup.

**Request:**
```json
{
  "phone": "9876543210",
  "purpose": "LOGIN"
}
```

**purpose values:** `LOGIN` | `SIGNUP` | `RESET`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "phone": "9876543210",
    "expiresInSeconds": 600,
    "maskedPhone": "98XXXXX210"
  },
  "message": "OTP sent successfully"
}
```

**Errors:** `AUTH_003` (locked), `VAL_002` (invalid phone), `RATE_001` (5 OTPs/hour exceeded)

---

### POST `/auth/verify-otp`

Verify OTP and receive JWT tokens.

**Request:**
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "purpose": "LOGIN",
  "deviceInfo": {
    "platform": "ANDROID",
    "deviceName": "Samsung Galaxy S23",
    "osVersion": "Android 14",
    "appVersion": "1.0.0"
  }
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "expiresIn": 86400,
    "tokenType": "Bearer",
    "isNewUser": false,
    "user": {
      "id": 12345,
      "fullName": "Ramesh Sharma",
      "phone": "9876543210",
      "userType": "OWNER",
      "industryPreference": "INDUSTRIAL",
      "profilePhotoUrl": "https://res.cloudinary.com/uptime/...",
      "isProfileComplete": true
    }
  },
  "message": "Login successful"
}
```

**Errors:** `AUTH_001` (wrong OTP), `AUTH_002` (expired), `AUTH_003` (locked)

---

### POST `/auth/signup`

Register a new user after OTP verification.

**Request:**
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "fullName": "Ramesh Sharma",
  "email": "ramesh@example.com",
  "industryPreference": "INDUSTRIAL",
  "userType": "OWNER",
  "referralCode": "UPT1234",
  "deviceInfo": {
    "platform": "ANDROID",
    "deviceName": "Samsung Galaxy S23",
    "osVersion": "Android 14",
    "appVersion": "1.0.0"
  }
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "expiresIn": 86400,
    "tokenType": "Bearer",
    "isNewUser": true,
    "user": {
      "id": 12346,
      "fullName": "Ramesh Sharma",
      "phone": "9876543210",
      "userType": "OWNER",
      "industryPreference": "INDUSTRIAL",
      "isProfileComplete": false
    }
  },
  "message": "Account created successfully"
}
```

**Errors:** `AUTH_001` (wrong OTP), `409` (phone already registered)

---

### POST `/auth/refresh-token`

Get new access token using refresh token.

**Request:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiJ9...",
    "refreshToken": "new-uuid-refresh-token",
    "expiresIn": 86400
  },
  "message": "Token refreshed"
}
```

**Errors:** `AUTH_004` (invalid), `AUTH_005` (expired)

---

### POST `/auth/logout`

Invalidate current session.

**Auth:** Required  
**Request:** Empty body `{}`

**Response `200`:**
```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

---

### GET `/auth/me`

Get current authenticated user info.

**Auth:** Required

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "fullName": "Ramesh Sharma",
    "phone": "9876543210",
    "email": "ramesh@example.com",
    "userType": "OWNER",
    "industryPreference": "INDUSTRIAL",
    "profilePhotoUrl": "https://res.cloudinary.com/...",
    "greenPointsBalance": 150,
    "carbonCreditsBalance": 2.50,
    "referralCode": "UPT1234",
    "createdAt": "2026-01-15T08:30:00Z"
  }
}
```

---

## 4. User Module

**Base path:** `/api/v1/users`  
**Auth:** Required (OWNER role)

---

### GET `/users/me`

Get full profile of logged-in user.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "fullName": "Ramesh Sharma",
    "phone": "9876543210",
    "email": "ramesh@example.com",
    "profilePhotoUrl": "https://res.cloudinary.com/...",
    "dateOfBirth": "1985-06-15",
    "gender": "MALE",
    "industryPreference": "INDUSTRIAL",
    "greenPointsBalance": 150,
    "carbonCreditsBalance": 2.50,
    "referralCode": "UPT1234",
    "preferredLanguage": "en",
    "isActive": true,
    "createdAt": "2026-01-15T08:30:00Z",
    "addresses": [
      {
        "id": 1,
        "label": "Factory",
        "addressLine1": "Plot 45, Industrial Area",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560058",
        "isDefault": true,
        "latitude": 12.9716,
        "longitude": 77.5946
      }
    ]
  }
}
```

---

### PUT `/users/me`

Update user profile.

**Request:**
```json
{
  "fullName": "Ramesh Kumar Sharma",
  "email": "ramesh.new@example.com",
  "dateOfBirth": "1985-06-15",
  "gender": "MALE",
  "industryPreference": "AUTOMOBILE",
  "preferredLanguage": "hi"
}
```

**Response `200`:** Updated user object (same as GET /users/me)

---

### POST `/users/me/photo`

Upload profile photo.

**Request:** `multipart/form-data`
```
file: [image file, max 5MB, JPG/PNG/WebP]
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "profilePhotoUrl": "https://res.cloudinary.com/uptime/..."
  },
  "message": "Photo updated"
}
```

---

### POST `/users/me/addresses`

Add a new address.

**Request:**
```json
{
  "label": "Home",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "isDefault": false
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "label": "Home",
    "addressLine1": "123 Main Street",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "isDefault": false
  }
}
```

---

### PUT `/users/me/addresses/{addressId}`

Update an existing address.

**Request:** Same fields as POST (all optional)

**Response `200`:** Updated address object

---

### DELETE `/users/me/addresses/{addressId}`

Delete an address.

**Response `204`:** No content

---

### GET `/users/me/preferences`

Get notification and app preferences.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "language": "en",
    "timezone": "Asia/Kolkata",
    "darkMode": false,
    "highContrast": false,
    "largeText": false,
    "dndEnabled": false,
    "dndStart": "22:00",
    "dndEnd": "07:00",
    "pushEnabled": true,
    "smsEnabled": false,
    "emailEnabled": true,
    "whatsappEnabled": false
  }
}
```

---

### PUT `/users/me/preferences`

Update preferences.

**Request:** Any subset of preference fields

**Response `200`:** Full updated preferences object

---

### GET `/users/me/data-export`

Export all personal data (PDPB compliance).

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "exportUrl": "https://res.cloudinary.com/uptime/exports/user_12345_export.zip",
    "expiresAt": "2026-10-20T10:30:00Z",
    "note": "Export link valid for 7 days"
  }
}
```

---

### POST `/users/me/delete`

Request account deletion (30-day process).

**Request:**
```json
{
  "reason": "No longer needed",
  "confirmDelete": true
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "deletionScheduledAt": "2026-11-13T10:30:00Z",
    "note": "Account will be deleted in 30 days. Login to cancel."
  }
}
```

---

## 5. Technician Module

**Base path:** `/api/v1/technicians`  
**Auth:** Required

---

### GET `/technicians/me`

Get technician's own profile.

**Auth:** TECHNICIAN role

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 67890,
    "fullName": "Raju Kumar",
    "phone": "9123456789",
    "profilePhotoUrl": "https://res.cloudinary.com/...",
    "industryType": "INDUSTRIAL",
    "experienceYears": 8.5,
    "bio": "Specialised in CNC and motor repair",
    "isAvailable": true,
    "verificationStatus": "APPROVED",
    "ratingAvg": 4.8,
    "totalJobsCompleted": 127,
    "walletBalance": 8230.00,
    "fatigueScore": 12.5,
    "isFatigueRestricted": false,
    "skills": [
      {
        "id": 1,
        "skillCategory": "motor_repair",
        "skillName": "Motor Bearing Replacement",
        "proficiency": "EXPERT",
        "yearsExperience": 6.0,
        "isCertified": true
      }
    ],
    "badges": [
      {
        "id": 1,
        "badgeName": "50 Jobs Champion",
        "badgeType": "MILESTONE",
        "badgeIconUrl": "https://res.cloudinary.com/...",
        "earnedAt": "2026-08-15T10:00:00Z"
      }
    ],
    "statistics": {
      "totalJobs": 127,
      "totalEarnings": 187500.00,
      "jobsThisMonth": 18,
      "earningsThisMonth": 26400.00,
      "acceptanceRate": 94.2,
      "completionRate": 99.1,
      "onTimeArrivalRate": 87.5
    }
  }
}
```

---

### PUT `/technicians/me`

Update technician profile.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "fullName": "Raju Kumar Singh",
  "bio": "Updated bio text",
  "experienceYears": 9.0,
  "preferredLanguage": "hi",
  "gstNumber": "29ABCDE1234F1Z5"
}
```

**Response `200`:** Updated technician object

---

### PUT `/technicians/me/availability`

Toggle online/offline status.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "isAvailable": true,
  "currentLatitude": 12.9716,
  "currentLongitude": 77.5946
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "updatedAt": "2026-10-13T10:30:00Z"
  },
  "message": "Status updated to Online"
}
```

---

### POST `/technicians/me/location`

Update current GPS location (called every 30s when online).

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "latitude": 12.9720,
  "longitude": 77.5950,
  "accuracyMeters": 5.2,
  "speedKmph": 35.5,
  "headingDegrees": 180.0,
  "batteryLevel": 72
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "updatedAt": "2026-10-13T10:30:05Z" }
}
```

---

### POST `/technicians/me/skills`

Add a new skill.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "skillCategory": "cnc_repair",
  "skillName": "CNC Machine Calibration",
  "proficiency": "INTERMEDIATE",
  "yearsExperience": 3.0,
  "isCertified": false
}
```

**Response `201`:** Created skill object with id

---

### DELETE `/technicians/me/skills/{skillId}`

Remove a skill.

**Response `204`:** No content

---

### POST `/technicians/me/documents`

Upload verification document.

**Auth:** TECHNICIAN role  
**Request:** `multipart/form-data`

```
documentType: AADHAAR | PAN | CERTIFICATE | PHOTO | GST
file: [document file, max 10MB, PDF/JPG/PNG]
documentNumber: (optional) document number
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "documentType": "AADHAAR",
    "documentUrl": "https://res.cloudinary.com/...",
    "isVerified": false,
    "uploadedAt": "2026-10-13T10:30:00Z"
  },
  "message": "Document uploaded. Under review."
}
```

---

### POST `/technicians/me/bank-account`

Add bank account for payouts.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "accountHolderName": "Raju Kumar",
  "accountNumber": "1234567890123456",
  "ifscCode": "SBIN0001234",
  "bankName": "State Bank of India",
  "accountType": "SAVINGS",
  "upiId": "raju@upi",
  "isPrimary": true
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "accountHolderName": "Raju Kumar",
    "accountNumberMasked": "XXXXXXXXXXXX3456",
    "ifscCode": "SBIN0001234",
    "bankName": "State Bank of India",
    "isPrimary": true,
    "isVerified": false
  },
  "message": "Bank account added. Verification pending."
}
```

---

### GET `/technicians/{id}/public`

Get public profile of a technician (for owners).

**Auth:** OWNER role

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 67890,
    "fullName": "Raju Kumar",
    "profilePhotoUrl": "https://res.cloudinary.com/...",
    "industryType": "INDUSTRIAL",
    "experienceYears": 8.5,
    "bio": "Specialised in CNC and motor repair",
    "ratingAvg": 4.8,
    "totalJobsCompleted": 127,
    "verificationStatus": "APPROVED",
    "skills": [ ],
    "badges": [ ],
    "recentReviews": [
      {
        "ownerName": "Ramesh S",
        "rating": 5,
        "review": "Excellent work, fixed quickly",
        "jobType": "Motor Repair",
        "date": "2026-10-01"
      }
    ]
  }
}
```

---

### GET `/technicians/me/earnings`

Get earnings summary and history.

**Auth:** TECHNICIAN role  
**Query params:** `period=WEEK|MONTH|YEAR&from=2026-10-01&to=2026-10-31`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "grossEarnings": 28450.00,
      "platformFee": 2845.00,
      "tdsDeducted": 284.50,
      "netEarnings": 25320.50,
      "walletBalance": 8230.00,
      "pendingPayout": 3200.00
    },
    "dailyBreakdown": [
      { "date": "2026-10-01", "amount": 1200.00, "jobs": 2 },
      { "date": "2026-10-02", "amount": 0.00, "jobs": 0 }
    ],
    "transactions": [
      {
        "id": 101,
        "type": "CREDIT",
        "amount": 900.00,
        "description": "Job UPT-2026-00234 completed",
        "jobNumber": "UPT-2026-00234",
        "date": "2026-10-01T14:30:00Z",
        "payoutStatus": "PROCESSED"
      }
    ]
  }
}
```

---

## 6. Job Module

**Base path:** `/api/v1/jobs`  
**Auth:** Required

---

### POST `/jobs`

Create a new job (fault report).

**Auth:** OWNER role  
**Request:** `multipart/form-data`

```
industry:         INDUSTRIAL | AUTOMOBILE | ELECTRONICS
assetId:          (optional) 12345
assetType:        MACHINE | VEHICLE | DEVICE
urgency:          LOW | MEDIUM | HIGH | CRITICAL
faultDescription: "The motor makes grinding noise..."
addressId:        1 (from user addresses)
scheduledAt:      (optional) "2026-10-14T09:00:00Z"
photos[]:         (optional) up to 10 image files
video:            (optional) 1 video file
audio:            (optional) 1 audio recording
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 999,
    "jobNumber": "UPT-2026-00999",
    "status": "POSTED",
    "industry": "INDUSTRIAL",
    "urgency": "HIGH",
    "ownerLocation": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "mediaUploaded": {
      "photos": 3,
      "video": false,
      "audio": true
    },
    "aiAnalysisPending": true,
    "createdAt": "2026-10-13T10:30:00Z"
  },
  "message": "Job created. AI analysis in progress."
}
```

---

### GET `/jobs`

Get list of jobs for current user.

**Auth:** OWNER (own jobs) | TECHNICIAN (assigned jobs)  
**Query params:**
```
status:   POSTED|MATCHED|EN_ROUTE|IN_PROGRESS|COMPLETED|CANCELLED
industry: INDUSTRIAL|AUTOMOBILE|ELECTRONICS
page:     0 (default)
size:     20 (default)
from:     2026-10-01
to:       2026-10-31
```

**Response `200`:** Paginated list of job summary objects

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 999,
        "jobNumber": "UPT-2026-00999",
        "status": "COMPLETED",
        "industry": "INDUSTRIAL",
        "urgency": "HIGH",
        "faultCategory": "Motor Bearing Failure",
        "technicianName": "Raju Kumar",
        "technicianPhoto": "https://res.cloudinary.com/...",
        "finalCost": 1050.00,
        "completedAt": "2026-10-13T16:00:00Z",
        "isRatedByOwner": true
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

### GET `/jobs/{id}`

Get full job details.

**Auth:** Owner of job | Assigned technician | Admin

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 999,
    "jobNumber": "UPT-2026-00999",
    "status": "COMPLETED",
    "industry": "INDUSTRIAL",
    "urgency": "HIGH",
    "jobType": "STANDARD",
    "owner": {
      "id": 12345,
      "fullName": "Ramesh Sharma",
      "phone": "9876543210",
      "profilePhotoUrl": "https://res.cloudinary.com/..."
    },
    "technician": {
      "id": 67890,
      "fullName": "Raju Kumar",
      "phone": "9123456789",
      "profilePhotoUrl": "https://res.cloudinary.com/...",
      "ratingAvg": 4.8
    },
    "asset": {
      "id": 1,
      "type": "MACHINE",
      "name": "CNC Lathe #1"
    },
    "ownerLocation": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "addressText": "Plot 45, Industrial Area, Bengaluru"
    },
    "faultDescription": "Motor makes grinding noise",
    "aiDiagnosis": {
      "faultCategory": "Motor Bearing Failure",
      "urgency": "HIGH",
      "confidence": 0.87,
      "estimatedCostMin": 800.00,
      "estimatedCostMax": 1500.00,
      "diagnosisText": "Classic bearing wear pattern...",
      "skillTags": ["motor_repair","bearing_replacement"],
      "safetyWarnings": ["disconnect_power_first"]
    },
    "media": [
      {
        "id": 1,
        "mediaType": "PHOTO",
        "mediaStage": "FAULT_REPORT",
        "url": "https://res.cloudinary.com/uptime/jobs/999/photo1.jpg",
        "thumbnailUrl": "https://res.cloudinary.com/uptime/jobs/999/thumb1.jpg"
      }
    ],
    "checklist": {
      "totalSteps": 8,
      "completedSteps": 8,
      "isComplete": true
    },
    "partsUsed": [
      {
        "partName": "Motor Capacitor",
        "brand": "L&T",
        "quality": "OEM",
        "quantity": 1,
        "unitCost": 320.00,
        "totalCost": 320.00,
        "warrantyMonths": 6
      }
    ],
    "financial": {
      "estimatedCostMin": 800.00,
      "estimatedCostMax": 1500.00,
      "labourCost": 700.00,
      "partsCost": 320.00,
      "gstAmount": 185.40,
      "finalCost": 1205.40,
      "platformCommission": 120.54,
      "technicianEarning": 1084.86,
      "surgePricing": false,
      "surgeMultiplier": 1.0
    },
    "timeline": [
      {
        "eventType": "JOB_CREATED",
        "eventTitle": "Job posted",
        "createdAt": "2026-10-13T10:00:00Z"
      },
      {
        "eventType": "AI_DIAGNOSIS_COMPLETE",
        "eventTitle": "AI diagnosis ready",
        "createdAt": "2026-10-13T10:00:08Z"
      },
      {
        "eventType": "TECHNICIAN_ACCEPTED",
        "eventTitle": "Raju Kumar accepted",
        "createdAt": "2026-10-13T10:05:00Z"
      }
    ],
    "certificateUrl": "https://res.cloudinary.com/uptime/certs/UPT-2026-00999.pdf",
    "hashValue": "a3f8c2d1e4b5...",
    "isTamperProofLocked": true,
    "isRatedByOwner": true,
    "isRatedByTech": true,
    "carbonCreditEarned": 0.50,
    "createdAt": "2026-10-13T10:00:00Z",
    "completedAt": "2026-10-13T16:00:00Z"
  }
}
```

---

### PUT `/jobs/{id}/status`

Update job status.

**Auth:** TECHNICIAN (assigned) | ADMIN

**Request:**
```json
{
  "status": "IN_PROGRESS",
  "notes": "Started repair work"
}
```

**Valid transitions:**
```
ACCEPTED    → EN_ROUTE      (tech taps Navigate)
EN_ROUTE    → ARRIVED       (after OTP verification)
ARRIVED     → IN_PROGRESS   (tech starts work)
IN_PROGRESS → COMPLETED     (tech completes + owner confirms)
Any         → CANCELLED      (with cancellation reason)
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "newStatus": "IN_PROGRESS",
    "updatedAt": "2026-10-13T13:00:00Z"
  }
}
```

**Errors:** `JOB_004` (invalid transition), `JOB_007` (locked)

---

### POST `/jobs/{id}/media`

Upload media during job execution.

**Auth:** TECHNICIAN (assigned) | OWNER  
**Request:** `multipart/form-data`

```
mediaType:  PHOTO | VIDEO | AUDIO | DOCUMENT
mediaStage: DURING_REPAIR | BEFORE | AFTER | CERTIFICATE
file:       [file]
```

**Response `201`:** Created media object with URL

---

### POST `/jobs/{id}/otp-verify`

Verify technician arrival with OTP + GPS.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "otp": "123456",
  "techLatitude": 12.9718,
  "techLongitude": 77.5948
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "gpsVerified": true,
    "distanceMeters": 45.2,
    "jobStatus": "ARRIVED",
    "verifiedAt": "2026-10-13T13:00:00Z"
  },
  "message": "Arrival verified. You may begin work."
}
```

**Errors:** `JOB_005` (wrong OTP), `JOB_006` (GPS too far)

---

### POST `/jobs/{id}/complete`

Mark job as complete (technician action).

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "finalLabourCost": 700.00,
  "techNotes": "Replaced motor capacitor. Machine running smooth.",
  "ownerSignatureUrl": "https://res.cloudinary.com/uptime/sigs/999.png"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "jobNumber": "UPT-2026-00999",
    "status": "COMPLETED",
    "finalCost": 1205.40,
    "hashValue": "a3f8c2d1e4b5...",
    "isTamperProofLocked": true,
    "certificateUrl": "https://res.cloudinary.com/uptime/certs/UPT-2026-00999.pdf",
    "carbonCreditEarned": 0.50,
    "completedAt": "2026-10-13T16:00:00Z"
  },
  "message": "Job completed and locked."
}
```

---

### POST `/jobs/{id}/parts`

Log parts used during repair.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "parts": [
    {
      "partName": "Motor Capacitor",
      "partNumber": "CAP-220UF-450V",
      "brand": "L&T",
      "quality": "OEM",
      "quantity": 1,
      "unitCost": 320.00,
      "warrantyMonths": 6,
      "marketplaceProductId": null
    }
  ]
}
```

**Response `201`:** List of created part records

---

### POST `/jobs/{id}/dispute`

Raise a dispute on a completed job.

**Auth:** OWNER | TECHNICIAN

**Request:**
```json
{
  "disputeType": "QUALITY",
  "description": "Motor stopped working again after 2 days",
  "claimedAmount": 1205.40,
  "evidenceUrls": [
    "https://res.cloudinary.com/uptime/evidence/1.jpg"
  ]
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "disputeNumber": "DIS-2026-00123",
    "status": "OPEN",
    "createdAt": "2026-10-15T10:00:00Z"
  },
  "message": "Dispute raised. Admin will review in 48 hours."
}
```

---

### POST `/jobs/{id}/cancel`

Cancel a job.

**Auth:** OWNER | TECHNICIAN | ADMIN

**Request:**
```json
{
  "reasonCode": "TECH_NOT_ARRIVING",
  "reasonText": "Technician not responding"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "status": "CANCELLED",
    "cancellationFee": 0.00,
    "refundAmount": 0.00
  }
}
```

**Errors:** `JOB_003` (cannot cancel after arrival)

---

### GET `/jobs/{id}/checklist`

Get AI-generated repair checklist.

**Auth:** Assigned technician | Owner | Admin

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 50,
    "jobId": 999,
    "totalSteps": 8,
    "completedSteps": 3,
    "isComplete": false,
    "items": [
      {
        "id": 1,
        "stepNumber": 1,
        "title": "Power off and lockout",
        "instruction": "Turn off main power switch...",
        "photoRequired": true,
        "photoUrl": "https://res.cloudinary.com/...",
        "isCompleted": true,
        "completedAt": "2026-10-13T13:05:00Z"
      }
    ]
  }
}
```

---

### PUT `/jobs/{id}/checklist/items/{itemId}`

Mark a checklist item as complete.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "isCompleted": true,
  "photoUrl": "https://res.cloudinary.com/uptime/jobs/999/step1.jpg",
  "notes": "Power disconnected and tagged"
}
```

**Response `200`:** Updated checklist item

---

## 7. AI Module

**Base path:** `/api/v1/ai`  
**Auth:** Required

---

### POST `/ai/diagnose`

Submit fault for AI diagnosis (Gemini).

**Auth:** OWNER role  
**Note:** Usually called automatically after job creation. Can also be called manually.

**Request:**
```json
{
  "jobId": 999,
  "industry": "INDUSTRIAL",
  "assetType": "MACHINE",
  "description": "Motor making grinding noise when started",
  "language": "en",
  "mediaUrls": [
    "https://res.cloudinary.com/uptime/jobs/999/photo1.jpg",
    "https://res.cloudinary.com/uptime/jobs/999/sound1.mp3"
  ]
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "faultCategory": "Motor Bearing Failure",
    "urgency": "HIGH",
    "confidence": 0.87,
    "estimatedCostMin": 800.00,
    "estimatedCostMax": 1500.00,
    "estimatedTimeHours": 2.5,
    "skillTags": ["motor_repair", "bearing_replacement"],
    "requiredTools": ["bearing_puller", "multimeter"],
    "diagnosisText": "Based on the sound recording and description, the motor shows classic signs of bearing wear. The high-frequency grinding noise indicates outer race damage.",
    "safetyWarnings": ["disconnect_power_before_work"],
    "diyPossible": false,
    "diyInstructions": null,
    "geminiModel": "gemini-1.5-flash",
    "promptVersion": "v1",
    "tokensUsed": 1240,
    "responseTimeMs": 2340,
    "isFallback": false
  }
}
```

**Errors:** `AI_001` (rate limit), `AI_004` (unavailable)

---

### POST `/ai/sound-analysis`

Analyse machine/vehicle sound recording.

**Auth:** OWNER | TECHNICIAN  
**Request:** `multipart/form-data`

```
audioFile:  [MP3/WAV/M4A, max 20MB]
industry:   INDUSTRIAL | AUTOMOBILE | ELECTRONICS
assetType:  MACHINE | VEHICLE | DEVICE
assetId:    (optional) 12345
jobId:      (optional) 999
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "faultType": "Bearing Failure",
    "severity": "HIGH",
    "confidence": 0.82,
    "frequencyAnomaly": "Grinding at 2400-2800 Hz",
    "description": "FFT analysis shows characteristic bearing failure pattern...",
    "recommendedAction": "Immediate bearing replacement required",
    "audioUrl": "https://res.cloudinary.com/uptime/sounds/999.mp3"
  }
}
```

---

### GET `/ai/copilot/{jobId}`

Get current AI copilot step for active job.

**Auth:** TECHNICIAN (assigned)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "sessionId": 50,
    "jobId": 999,
    "currentStep": 3,
    "totalSteps": 8,
    "step": {
      "id": 3,
      "stepNumber": 3,
      "title": "Check capacitor voltage",
      "instruction": "Use multimeter red probe on + terminal...",
      "safetyWarning": "High voltage present. Use insulated probes.",
      "toolNeeded": "Multimeter",
      "expectedResult": "Reading: 320–350V DC",
      "photoRequired": true
    }
  }
}
```

---

### POST `/ai/copilot/{jobId}/next`

Advance to next copilot step.

**Auth:** TECHNICIAN (assigned)

**Request:**
```json
{
  "currentStepId": 3,
  "photoUrl": "https://res.cloudinary.com/uptime/jobs/999/step3.jpg",
  "notes": "Reading was 310V — slightly low"
}
```

**Response `200`:** Next step object (same format as GET copilot)

---

### POST `/ai/negotiate`

Get AI price negotiation advice.

**Auth:** OWNER | TECHNICIAN

**Request:**
```json
{
  "jobId": 999,
  "faultCategory": "Motor Bearing Failure",
  "industry": "INDUSTRIAL",
  "city": "Bengaluru",
  "technicianAskedPrice": 2000.00,
  "ownerOfferedPrice": 800.00,
  "partsRequired": ["motor_bearing", "capacitor"]
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "minFairPrice": 900.00,
    "maxFairPrice": 1400.00,
    "breakdown": {
      "labourEstimate": 600.00,
      "partsEstimate": 450.00,
      "marketAvg": 1050.00
    },
    "verdict": "TECH_SLIGHTLY_HIGH",
    "marketContext": "Average for this repair in Bengaluru is ₹900–₹1,400",
    "recommendation": "Suggest ₹1,100 as fair middle ground"
  }
}
```

---

### POST `/ai/translate`

Translate repair-related text between Indian languages.

**Auth:** Required

**Request:**
```json
{
  "text": "Motor bearing needs replacement",
  "targetLanguage": "hi",
  "sourceLanguage": "en",
  "context": "FAULT_DESCRIPTION"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "translatedText": "मोटर बेयरिंग को बदलने की जरूरत है",
    "sourceLanguage": "en",
    "targetLanguage": "hi"
  }
}
```

---

## 8. Matching Module

**Base path:** `/api/v1/matching`  
**Auth:** Required

---

### POST `/matching/request`

Trigger matching for a job.

**Auth:** OWNER role

**Request:**
```json
{
  "jobId": 999,
  "searchRadiusKm": 20.0,
  "preferredTechnicianId": null
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "requestId": 500,
    "jobId": 999,
    "techsFound": 8,
    "topTechnicians": [
      {
        "technicianId": 67890,
        "fullName": "Raju Kumar",
        "profilePhotoUrl": "https://res.cloudinary.com/...",
        "ratingAvg": 4.8,
        "totalJobs": 127,
        "matchScore": 92.5,
        "distanceKm": 2.3,
        "etaMins": 8,
        "estimatedCostMin": 800.00,
        "estimatedCostMax": 1400.00,
        "skillMatchTags": ["motor_repair","bearing_replacement"],
        "verificationStatus": "APPROVED",
        "currentLocation": {
          "latitude": 12.9520,
          "longitude": 77.5800
        }
      }
    ],
    "surgeActive": false,
    "surgeMultiplier": 1.0
  }
}
```

---

### GET `/matching/{jobId}/results`

Get ranked technician list for a job.

**Auth:** OWNER role

**Response `200`:** Same format as POST /matching/request data

---

### POST `/matching/{jobId}/select`

Owner selects a technician to book.

**Auth:** OWNER role

**Request:**
```json
{
  "technicianId": 67890
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "jobStatus": "MATCHED",
    "technicianId": 67890,
    "technicianName": "Raju Kumar",
    "etaMins": 8,
    "notificationSent": true
  },
  "message": "Technician notified. Waiting for acceptance."
}
```

---

### POST `/matching/{jobId}/respond`

Technician accepts or declines a job.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "action": "ACCEPT",
  "currentLatitude": 12.9520,
  "currentLongitude": 77.5800
}
```

**action values:** `ACCEPT` | `DECLINE`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "action": "ACCEPT",
    "jobStatus": "ACCEPTED",
    "ownerLocation": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "addressText": "Plot 45, Industrial Area"
    },
    "etaMins": 8,
    "routeUrl": "https://maps.google.com/..."
  },
  "message": "Job accepted. Navigate to owner location."
}
```

---

### GET `/matching/{jobId}/auction`

Get auction status for a job.

**Auth:** TECHNICIAN | OWNER

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "auctionId": 100,
    "jobId": 999,
    "baseAmount": 1000.00,
    "currentBonus": 150.00,
    "totalAmount": 1150.00,
    "techsCompeting": 4,
    "techsNotified": 12,
    "status": "ACTIVE",
    "endsAt": "2026-10-13T10:45:00Z",
    "secondsRemaining": 240
  }
}
```

---

## 9. Payment Module

**Base path:** `/api/v1/payments`  
**Auth:** Required

---

### POST `/payments/initiate`

Initiate payment for a completed job.

**Auth:** OWNER role

**Request:**
```json
{
  "jobId": 999,
  "paymentMethod": "UPI",
  "useWalletBalance": false
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "transactionId": 5001,
    "razorpayOrderId": "order_Abc123XYZ",
    "amount": 1205.40,
    "amountPaise": 120540,
    "currency": "INR",
    "razorpayKey": "rzp_test_xxxxx",
    "prefill": {
      "contact": "9876543210",
      "email": "ramesh@example.com"
    }
  }
}
```

---

### POST `/payments/verify`

Verify payment after Razorpay checkout.

**Auth:** OWNER role

**Request:**
```json
{
  "razorpayOrderId": "order_Abc123XYZ",
  "razorpayPaymentId": "pay_Def456UVW",
  "razorpaySignature": "hmac_signature_here",
  "jobId": 999
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "transactionId": 5001,
    "status": "CAPTURED",
    "amount": 1205.40,
    "invoiceUrl": "https://res.cloudinary.com/uptime/invoices/INV-2026-05001.pdf",
    "message": "Payment successful. Invoice sent to email."
  }
}
```

---

### POST `/payments/webhook/razorpay`

Razorpay webhook handler. Called by Razorpay servers.

**Auth:** None (HMAC-SHA256 signature in header)  
**Header:** `X-Razorpay-Signature: hmac_value`

**Request:** Raw JSON from Razorpay

**Response `200`:** Empty (always respond 200 to Razorpay)

---

### GET `/payments/wallet`

Get wallet balance and transaction history.

**Auth:** TECHNICIAN role  
**Query:** `page=0&size=20`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "balance": 8230.00,
    "pendingPayout": 3200.00,
    "transactions": [
      {
        "id": 201,
        "type": "CREDIT",
        "amount": 900.00,
        "balanceAfter": 8230.00,
        "description": "Job UPT-2026-00999",
        "payoutStatus": "PENDING",
        "payoutEligibleAt": "2026-10-14T16:00:00Z",
        "createdAt": "2026-10-13T16:00:00Z"
      }
    ]
  }
}
```

---

### POST `/payments/withdraw`

Request wallet withdrawal to bank.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "amount": 5000.00,
  "bankAccountId": 3
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "payoutId": 300,
    "payoutNumber": "PAY-2026-00300",
    "amount": 5000.00,
    "tdsAmount": 50.00,
    "netAmount": 4950.00,
    "status": "INITIATED",
    "estimatedArrival": "2026-10-14T11:00:00Z"
  },
  "message": "Withdrawal initiated. Arrives by 11 AM tomorrow."
}
```

---

### GET `/payments/invoices/{jobId}`

Get invoice for a job.

**Auth:** OWNER | TECHNICIAN (job parties)

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-2026-05001",
    "jobNumber": "UPT-2026-00999",
    "invoiceDate": "2026-10-13",
    "ownerName": "Ramesh Sharma",
    "technicianName": "Raju Kumar",
    "items": [
      { "description": "Labour charges", "amount": 700.00 },
      { "description": "Motor Capacitor (OEM)", "amount": 320.00 }
    ],
    "subtotal": 1020.00,
    "gst": {
      "cgst": 91.80,
      "sgst": 91.80,
      "total": 183.60
    },
    "total": 1203.60,
    "invoiceUrl": "https://res.cloudinary.com/uptime/invoices/INV-2026-05001.pdf",
    "hashValue": "sha256hash",
    "isTamperProofLocked": true
  }
}
```

---

### GET `/payments/subscriptions`

Get available subscription plans.

**Auth:** OWNER role

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "planName": "FREE",
      "displayName": "Free Plan",
      "priceMonthly": 0.00,
      "jobsPerMonth": 2,
      "machinesLimit": 3,
      "aiCallsLimit": 10,
      "priorityMatching": false,
      "videoConsults": 0
    },
    {
      "id": 2,
      "planName": "BASIC",
      "displayName": "Basic Plan",
      "priceMonthly": 299.00,
      "jobsPerMonth": 5,
      "machinesLimit": 10,
      "aiCallsLimit": 50,
      "priorityMatching": false,
      "videoConsults": 1
    },
    {
      "id": 3,
      "planName": "STANDARD",
      "displayName": "Standard Plan",
      "priceMonthly": 799.00,
      "jobsPerMonth": 15,
      "machinesLimit": 25,
      "aiCallsLimit": 150,
      "priorityMatching": true,
      "videoConsults": 3
    },
    {
      "id": 4,
      "planName": "PREMIUM",
      "displayName": "Premium Plan",
      "priceMonthly": 1499.00,
      "jobsPerMonth": null,
      "machinesLimit": null,
      "aiCallsLimit": null,
      "priorityMatching": true,
      "videoConsults": 10
    }
  ]
}
```

---

## 10. Tracking Module

**Base path:** `/api/v1/tracking`  
**Auth:** Required  
**Real-time:** See WebSocket section (Section 22)

---

### GET `/tracking/{jobId}`

Get current tracking session info.

**Auth:** Owner of job | Assigned tech | Admin

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "technicianId": 67890,
    "technicianName": "Raju Kumar",
    "technicianPhone": "9123456789",
    "technicianPhoto": "https://res.cloudinary.com/...",
    "currentLocation": {
      "latitude": 12.9620,
      "longitude": 77.5870,
      "updatedAt": "2026-10-13T12:55:00Z"
    },
    "ownerLocation": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "etaMins": 6,
    "distanceKm": 1.8,
    "jobStatus": "EN_ROUTE",
    "isLive": true
  }
}
```

---

### POST `/tracking/{jobId}/location`

Update technician location during job (REST fallback if WebSocket fails).

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "latitude": 12.9680,
  "longitude": 77.5910,
  "accuracyMeters": 4.5,
  "speedKmph": 28.0,
  "batteryLevel": 68
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "etaMins": 4,
    "updatedAt": "2026-10-13T12:57:00Z"
  }
}
```

---

## 11. Rating Module

**Base path:** `/api/v1/ratings`  
**Auth:** Required

---

### POST `/ratings/jobs/{jobId}`

Submit rating for a completed job.

**Auth:** OWNER (rates tech) | TECHNICIAN (rates owner)

**Request:**
```json
{
  "ratingFor": "TECHNICIAN",
  "overallRating": 4.5,
  "reviewText": "Excellent work! Fixed quickly and cleanly.",
  "categoryRatings": [
    { "category": "PUNCTUALITY", "score": 5.0 },
    { "category": "QUALITY",     "score": 4.5 },
    { "category": "BEHAVIOUR",   "score": 5.0 },
    { "category": "CLEANLINESS", "score": 4.0 }
  ]
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "ratingId": 800,
    "jobId": 999,
    "ratingFor": "TECHNICIAN",
    "overallRating": 4.5,
    "isBlind": true,
    "note": "Rating will be visible after both parties rate"
  }
}
```

---

### GET `/ratings/technicians/{techId}`

Get technician's ratings and reviews.

**Auth:** Required  
**Query:** `page=0&size=10`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "technicianId": 67890,
    "ratingAvg": 4.8,
    "totalRatings": 127,
    "distribution": {
      "5": 89,
      "4": 28,
      "3": 7,
      "2": 2,
      "1": 1
    },
    "categoryAverages": {
      "PUNCTUALITY": 4.7,
      "QUALITY": 4.9,
      "BEHAVIOUR": 4.8,
      "CLEANLINESS": 4.6
    },
    "reviews": [
      {
        "ownerName": "Ramesh S",
        "rating": 5.0,
        "reviewText": "Excellent work!",
        "jobType": "Motor Bearing Repair",
        "date": "2026-10-01"
      }
    ]
  }
}
```

---

## 12. Notification Module

**Base path:** `/api/v1/notifications`  
**Auth:** Required

---

### GET `/notifications`

Get notifications for current user.

**Query:** `page=0&size=20&unreadOnly=false`

**Response `200`:** Paginated list of notifications

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 3001,
        "type": "JOB_ACCEPTED",
        "title": "Technician Accepted!",
        "body": "Raju Kumar accepted your job. ETA: 8 minutes",
        "isRead": false,
        "referenceType": "JOB",
        "referenceId": 999,
        "deepLinkUrl": "/dashboard/tracking/999",
        "createdAt": "2026-10-13T10:05:00Z"
      }
    ],
    "unreadCount": 3,
    "totalElements": 45,
    "page": 0,
    "hasNext": true
  }
}
```

---

### PUT `/notifications/{id}/read`

Mark a notification as read.

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": 3001, "isRead": true }
}
```

---

### PUT `/notifications/read-all`

Mark all notifications as read.

**Response `200`:**
```json
{
  "success": true,
  "data": { "markedRead": 3 }
}
```

---

### POST `/notifications/register-device`

Register device FCM token for push notifications.

**Auth:** Required

**Request:**
```json
{
  "fcmToken": "FCM_TOKEN_STRING_HERE",
  "platform": "ANDROID",
  "deviceName": "Samsung Galaxy S23",
  "appVersion": "1.0.0"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "deviceId": 200, "registered": true }
}
```

---

## 13. Industry Module — Machines

**Base path:** `/api/v1/industry/machines`  
**Auth:** OWNER role

---

### POST `/industry/machines`

Add a new machine.

**Request:**
```json
{
  "machineName": "CNC Lathe #1",
  "machineType": "CNC_LATHE",
  "brand": "DMG Mori",
  "modelNumber": "CTX-500",
  "serialNumber": "DMG20190045",
  "purchaseYear": 2019,
  "purchaseCost": 850000.00,
  "locationInFactory": "Shop Floor A, Bay 3",
  "addressId": 1,
  "photoUrl": null
}
```

**Response `201`:** Created machine object with id

---

### GET `/industry/machines`

List all machines for current user.

**Response `200`:** List of machine summary objects

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "machineName": "CNC Lathe #1",
      "machineType": "CNC_LATHE",
      "brand": "DMG Mori",
      "currentStatus": "OPERATIONAL",
      "healthScore": 87.5,
      "lastRepairAt": "2026-10-13T16:00:00Z",
      "nextServiceDue": "2026-11-15T00:00:00Z",
      "totalRepairs": 12,
      "totalRepairCost": 45000.00
    }
  ]
}
```

---

### GET `/industry/machines/{id}`

Get full machine details.

**Response `200`:** Full machine object with service history

---

### PUT `/industry/machines/{id}`

Update machine details.

**Response `200`:** Updated machine object

---

### DELETE `/industry/machines/{id}`

Soft delete a machine.

**Response `204`:** No content

---

### GET `/industry/machines/{id}/service-history`

Get machine service history.

**Query:** `page=0&size=10`

**Response `200`:** Paginated list of service history records

---

## 14. Industry Module — Vehicles

**Base path:** `/api/v1/industry/vehicles`  
**Auth:** OWNER role

---

### POST `/industry/vehicles`

Add a new vehicle.

**Request:**
```json
{
  "registrationNumber": "KA01AB1234",
  "vehicleType": "CAR",
  "brand": "Maruti Suzuki",
  "model": "Swift Dzire",
  "variant": "ZXi",
  "manufactureYear": 2022,
  "purchaseDate": "2022-03-15",
  "fuelType": "PETROL",
  "transmission": "MANUAL",
  "color": "Pearl Arctic White",
  "currentOdometerKm": 28500
}
```

**Response `201`:** Created vehicle object

---

### GET `/industry/vehicles`

List all vehicles.

**Response `200`:** List of vehicle summaries with health/mood scores

---

### GET `/industry/vehicles/{id}`

Full vehicle details with all documents, history, fuel logs.

---

### GET `/industry/vehicles/{id}/mood-score`

Get today's vehicle mood score.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "moodScore": 88.5,
    "moodStatus": "HAPPY",
    "engineScore": 92.0,
    "tyreScore": 85.0,
    "batteryScore": 94.0,
    "brakeScore": 88.0,
    "fuelSystemScore": 90.0,
    "electricalScore": 87.0,
    "weatherFactor": 0.95,
    "aiRecommendation": "Safe to drive. Check tyre pressure this week.",
    "tripRecommendation": "Good for highway driving today.",
    "recordedDate": "2026-10-13"
  }
}
```

---

### POST `/industry/vehicles/{id}/fuel-log`

Log a fuel fill-up.

**Request:**
```json
{
  "fuelType": "PETROL",
  "quantity": 40.5,
  "unit": "LITRES",
  "costPerUnit": 102.5,
  "totalCost": 4151.25,
  "odometerReading": 28500,
  "fuelStation": "BPCL Majestic",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "filledAt": "2026-10-13T08:30:00Z"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 100,
    "mileageKmpl": 18.2,
    "totalCost": 4151.25,
    "adulterationFlag": false
  }
}
```

---

### POST `/industry/vehicles/{id}/scan-request`

Request pre-purchase vehicle inspection.

**Request:**
```json
{
  "scanType": "STANDARD",
  "vehicleRegistration": "MH01CD5678",
  "vehicleBrand": "Honda",
  "vehicleModel": "City",
  "askingPrice": 650000.00,
  "preferredDate": "2026-10-15T10:00:00Z",
  "locationAddressId": 1
}
```

**Response `201`:** Created scan request with assigned technician

---

## 15. Industry Module — Devices

**Base path:** `/api/v1/industry/devices`  
**Auth:** OWNER role

---

### POST `/industry/devices`

Add a new device.

**Request:**
```json
{
  "deviceCategory": "SMARTPHONE",
  "deviceType": "PERSONAL_ELECTRONICS",
  "brand": "Samsung",
  "model": "Galaxy S23",
  "variant": "256GB",
  "serialNumber": "R58N123456",
  "imeiNumber": "352789101234567",
  "purchaseDate": "2023-02-15",
  "purchaseCost": 74999.00,
  "color": "Phantom Black",
  "storageGb": 256,
  "ramGb": 8,
  "osType": "ANDROID",
  "osVersion": "Android 13",
  "roomLocation": "Office Desk",
  "isSmartDevice": false
}
```

**Response `201`:** Created device object

---

### GET `/industry/devices`

List all devices with health scores.

---

### GET `/industry/devices/{id}/health`

Get device health log history.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "deviceId": 50,
    "currentHealthScore": 78.5,
    "batteryHealth": 82.0,
    "storageUsedPercent": 65.0,
    "silentKillerRiskScore": 2.5,
    "electricityConsumptionWatts": 145.0,
    "recentLogs": [
      {
        "logType": "SMART_HOME",
        "healthScore": 78.5,
        "anomalyDetected": false,
        "loggedAt": "2026-10-13T10:00:00Z"
      }
    ]
  }
}
```

---

### POST `/industry/devices/{id}/smart-home`

Connect device to smart home platform.

**Request:**
```json
{
  "platform": "GOOGLE_HOME",
  "platformUserId": "google_user_123",
  "accessToken": "oauth_access_token",
  "refreshToken": "oauth_refresh_token",
  "tokenExpiresAt": "2026-11-13T10:00:00Z",
  "syncFrequencyMins": 15
}
```

**Response `201`:** Created smart home connection

---

## 16. Digital Twin Module

**Base path:** `/api/v1/twins`  
**Auth:** OWNER role

---

### GET `/twins/{assetType}/{assetId}`

Get digital twin for an asset.

**assetType values:** `machine` | `vehicle` | `device`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "assetId": 1,
    "assetType": "MACHINE",
    "assetName": "CNC Lathe #1",
    "healthScore": 87.5,
    "healthStatus": "GOOD",
    "totalRepairs": 12,
    "totalRepairCost": 45000.00,
    "totalDowntimeHours": 28.5,
    "components": [
      {
        "id": 1,
        "componentName": "Main Motor",
        "componentType": "ELECTRICAL",
        "healthScore": 82.0,
        "lastReplacedAt": "2025-06-15T00:00:00Z",
        "estimatedLifeMonths": 36,
        "monthsRemaining": 20
      }
    ],
    "predictions": [
      {
        "predictedFault": "Spindle Bearing Wear",
        "probability": 0.76,
        "predictedDate": "2026-11-28",
        "estimatedCost": 4500.00,
        "recommendedAction": "Schedule preventive bearing inspection"
      }
    ],
    "healthHistory": [
      { "date": "2026-10-01", "score": 89.0 },
      { "date": "2026-10-13", "score": 87.5 }
    ],
    "savingsFromPreventive": 12400.00,
    "lastUpdatedAt": "2026-10-13T16:00:00Z"
  }
}
```

---

## 17. Insurance Module

**Base path:** `/api/v1/insurance`  
**Auth:** OWNER role

---

### GET `/insurance/policies`

List all insurance policies.

**Response `200`:** List of policy summaries

---

### POST `/insurance/claims`

File an insurance claim.

**Request:**
```json
{
  "policyId": 20,
  "jobId": 999,
  "claimType": "BREAKDOWN_REPAIR",
  "description": "Motor failure — repair cost ₹1,205",
  "incidentDate": "2026-10-13",
  "incidentLatitude": 12.9716,
  "incidentLongitude": 77.5946,
  "claimedAmount": 1205.40,
  "evidenceUrls": [
    "https://res.cloudinary.com/uptime/evidence/1.jpg"
  ]
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "claimNumber": "CLM-2026-00500",
    "status": "FILED",
    "aiVerdict": "VALID",
    "aiConfidence": 0.89,
    "estimatedSettlement": "5–7 business days"
  }
}
```

---

### GET `/insurance/claims/{claimId}`

Get claim status.

**Response `200`:** Full claim object with status + AI verdict

---

### POST `/insurance/warranties/scan`

OCR scan a warranty card to add warranty.

**Request:** `multipart/form-data`

```
warrantyCardImage: [JPG/PNG, max 5MB]
deviceId:          (optional) 50
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 30,
    "productName": "Samsung Galaxy S23",
    "brand": "Samsung",
    "serialNumber": "R58N123456",
    "purchaseDate": "2023-02-15",
    "warrantyStart": "2023-02-15",
    "warrantyEnd": "2024-02-14",
    "status": "EXPIRED",
    "aiExtractedData": { }
  }
}
```

---

## 18. Marketplace Module

**Base path:** `/api/v1/marketplace`  
**Auth:** Required

---

### GET `/marketplace/products`

Search and browse products.

**Query:**
```
q:        search query
category: SPARE_PART|TOOL|CONSUMABLE|REFURBISHED
quality:  OEM|COMPATIBLE|REFURBISHED
brand:    brand name filter
minPrice: 100
maxPrice: 5000
page:     0
size:     20
```

**Response `200`:** Paginated list of products

---

### GET `/marketplace/products/{id}`

Get full product details.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 700,
    "productName": "Motor Capacitor 220uF 450V",
    "productType": "SPARE_PART",
    "category": "electrical_components",
    "brand": "L&T",
    "modelCompatibility": ["ABB M2AA", "Siemens 1LA"],
    "partNumber": "LT-CAP-220UF-450V",
    "quality": "OEM",
    "description": "Genuine L&T capacitor for industrial motors",
    "images": ["https://res.cloudinary.com/..."],
    "price": 450.00,
    "discountedPrice": 380.00,
    "stockQuantity": 45,
    "warrantyMonths": 12,
    "avgRating": 4.6,
    "totalSold": 312,
    "seller": {
      "id": 5,
      "sellerName": "TechParts India",
      "sellerType": "AUTHORIZED_DEALER",
      "avgRating": 4.7,
      "isVerified": true
    }
  }
}
```

---

### POST `/marketplace/orders`

Place an order.

**Request:**
```json
{
  "deliveryAddressId": 1,
  "deliveryType": "EXPRESS",
  "jobId": 999,
  "items": [
    {
      "productId": 700,
      "quantity": 2
    }
  ]
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD-2026-00800",
    "status": "PLACED",
    "subtotal": 760.00,
    "deliveryCharge": 49.00,
    "gstAmount": 145.62,
    "totalAmount": 954.62,
    "estimatedDelivery": "2026-10-15T18:00:00Z"
  }
}
```

---

### POST `/marketplace/spare-parts/request`

Request a specific part not in catalogue.

**Request:**
```json
{
  "partName": "Servo Motor Encoder",
  "partNumber": "ENC-1024-PPR",
  "deviceBrand": "Fanuc",
  "deviceModel": "A06B-0205-B100",
  "description": "Need encoder for Fanuc servo motor",
  "maxBudget": 8000.00,
  "urgency": "HIGH"
}
```

**Response `201`:** Created spare parts request

---

## 19. Wiki Module

**Base path:** `/api/v1/wiki`  
**Auth:** Required (read), TECHNICIAN/ADMIN (write)

---

### GET `/wiki/articles`

Search and browse wiki articles.

**Query:**
```
q:        search query (full-text search)
industry: INDUSTRIAL|AUTOMOBILE|ELECTRONICS
fault:    fault category filter
difficulty: EASY|MEDIUM|HARD|PROFESSIONAL
page:     0
size:     20
```

**Response `200`:** Paginated list of article summaries

---

### GET `/wiki/articles/{slug}`

Get full wiki article.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 100,
    "title": "How to Replace CNC Motor Bearings",
    "slug": "how-to-replace-cnc-motor-bearings",
    "industry": "INDUSTRIAL",
    "deviceBrand": null,
    "faultCategory": "Motor Bearing Failure",
    "difficulty": "HARD",
    "estimatedCostMin": 800.00,
    "estimatedCostMax": 1500.00,
    "estimatedTimeMins": 150,
    "successRate": 87.5,
    "toolsRequired": ["bearing_puller", "multimeter"],
    "partsRequired": ["motor_bearing_6205", "grease_ep2"],
    "fixSteps": [
      {
        "step": 1,
        "title": "Isolate power",
        "instruction": "Turn off and lockout main power...",
        "safetyWarning": "Use LOTO procedure",
        "toolNeeded": "LOTO kit"
      }
    ],
    "safetyWarnings": ["Disconnect power before starting"],
    "isDiySafe": false,
    "monsoonSpecific": false,
    "powerQualityNote": "Check voltage fluctuation before repair",
    "viewsCount": 1240,
    "helpfulCount": 890,
    "isVerified": true,
    "isAutoGenerated": true,
    "language": "en"
  }
}
```

---

### POST `/wiki/articles/{id}/vote`

Vote on article helpfulness.

**Request:**
```json
{
  "voteType": "HELPFUL"
}
```

**voteType values:** `HELPFUL` | `NOT_HELPFUL`

**Response `200`:**
```json
{
  "success": true,
  "data": { "helpfulCount": 891, "notHelpfulCount": 45 }
}
```

---

## 20. Video Consultation Module

**Base path:** `/api/v1/consultations`  
**Auth:** Required

---

### POST `/consultations`

Book a virtual consultation.

**Auth:** OWNER role

**Request:**
```json
{
  "industry": "ELECTRONICS",
  "assetId": 50,
  "assetType": "DEVICE",
  "consultationType": "FULL_DIAGNOSIS",
  "preferredTime": "2026-10-13T15:00:00Z",
  "faultDescription": "AC not cooling properly"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "consultationId": 200,
    "consultationType": "FULL_DIAGNOSIS",
    "feeCharged": 199.00,
    "technician": {
      "id": 67890,
      "fullName": "Suresh Electronics",
      "ratingAvg": 4.9,
      "speciality": "AC & Refrigeration"
    },
    "agoraChannel": "consult_200_abc123",
    "agoraTokenOwner": "agora_rtc_token_...",
    "scheduledAt": "2026-10-13T15:00:00Z",
    "callStatus": "SCHEDULED"
  }
}
```

---

### POST `/consultations/{id}/frame-analysis`

Submit video frame for AI annotation during live call.

**Auth:** OWNER role  
**Request:** `multipart/form-data`

```
frame: [JPEG image, max 1MB]
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "annotations": [
      {
        "x": 120,
        "y": 85,
        "width": 200,
        "height": 150,
        "label": "Condenser coil — dust buildup detected",
        "severity": "MEDIUM"
      }
    ],
    "aiDiagnosis": "Condenser coil requires cleaning...",
    "processingTimeMs": 1200
  }
}
```

---

### PUT `/consultations/{id}/outcome`

Record consultation outcome.

**Auth:** TECHNICIAN role

**Request:**
```json
{
  "outcome": "VISIT_NEEDED",
  "remoteFixDescription": null,
  "visitBooked": true
}
```

**outcome values:** `FIXED_REMOTELY` | `VISIT_NEEDED` | `INCONCLUSIVE`

**Response `200`:** Updated consultation object

---

## 21. Admin Module

**Base path:** `/api/v1/admin`  
**Auth:** ADMIN | SUPER_ADMIN role only (except public login/2FA endpoints)

---

### POST `/admin/auth/login`

Step 1 of Admin Authentication. Validates email and BCrypt password. Admins never use SMS OTP. Returns a short-lived temporary 2FA token (valid for 5 minutes) that permits only TOTP verification. Account locks for 30 minutes after 5 consecutive failed attempts. (IP whitelist disabled in dev profile).

**Auth:** Public (Unauthenticated)

**Request:**
```json
{
  "email": "admin@uptime.in",
  "password": "SecureAdminPassword123!"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "tempToken": "eyJhbGciOiJSUzI1NiJ9.temp_2fa_token...",
    "expiresIn": 300,
    "requires2FA": true,
    "user": {
      "id": 1,
      "email": "admin@uptime.in",
      "fullName": "System Administrator",
      "role": "SUPER_ADMIN"
    }
  },
  "message": "Credentials verified. Please enter 6-digit TOTP from authenticator app."
}
```

**Errors:**
- `AUTH_001` (401): Invalid email or password
- `AUTH_003` (423): Account locked after 5 failed attempts (try again in 30 minutes)
- `AUTH_010` (403): IP address not whitelisted (production profile)

---

### POST `/admin/auth/verify-2fa`

Step 2 of Admin Authentication. Exchanges temporary 2FA token and 6-digit TOTP code for full Admin Access & Refresh tokens. Returned Admin JWT is valid for 30 minutes.

**Auth:** Bearer `<tempToken>` (Temporary 2FA token)

**Request:**
```json
{
  "totpCode": "583921"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiJ9.admin_access_token...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440001",
    "tokenType": "Bearer",
    "expiresIn": 1800,
    "user": {
      "id": 1,
      "email": "admin@uptime.in",
      "fullName": "System Administrator",
      "role": "SUPER_ADMIN"
    }
  },
  "message": "Admin authenticated successfully."
}
```

**Errors:**
- `AUTH_001` (401): Invalid or expired TOTP code
- `AUTH_004` (401): Invalid or expired temporary 2FA token
- `AUTH_003` (423): Too many invalid 2FA attempts; temp token invalidated

---

### GET `/admin/dashboard`

Get live platform dashboard stats.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "activeJobs": 23,
    "onlineTechs": 145,
    "jobsToday": 78,
    "revenueToday": 87500.00,
    "platformHealthScore": 92.5,
    "pendingVerifications": 12,
    "openDisputes": 3,
    "activeEpidemics": 1,
    "dqMessages": 0,
    "recentAlerts": [
      {
        "type": "EPIDEMIC",
        "message": "Samsung Galaxy S23 heating issue — 52 reports",
        "severity": "HIGH",
        "createdAt": "2026-10-13T09:00:00Z"
      }
    ]
  }
}
```

---

### GET `/admin/technicians/pending`

Get technicians pending verification.

**Query:** `page=0&size=20&industry=INDUSTRIAL`

**Response `200`:** Paginated list of pending technician verifications

---

### PUT `/admin/technicians/{id}/verify`

Approve or reject technician.

**Request:**
```json
{
  "action": "APPROVE",
  "rejectionReason": null
}
```

**action values:** `APPROVE` | `REJECT` | `REQUEST_RESUBMIT`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "technicianId": 67890,
    "verificationStatus": "APPROVED",
    "emailSent": true,
    "smsSent": true
  }
}
```

---

### GET `/admin/disputes`

Get all open disputes.

**Query:** `status=OPEN&page=0&size=20`

**Response `200`:** Paginated list of disputes with job details

---

### PUT `/admin/disputes/{id}/resolve`

Resolve a dispute.

**Request:**
```json
{
  "verdict": "REFUND_OWNER",
  "adminVerdict": "Quality of repair was inadequate based on evidence",
  "resolutionAmount": 1205.40
}
```

**verdict values:** `REFUND_OWNER` | `RELEASE_TO_TECH` | `PARTIAL_REFUND`

**Response `200`:** Resolved dispute object

---

### GET `/admin/epidemics`

Get active epidemic detections.

**Response `200`:** List of active epidemics with affected user counts

---

### POST `/admin/notifications/mass`

Send mass notification to users.

**Request:**
```json
{
  "title": "Service Update",
  "body": "UPTIME will be under maintenance on 15 Oct 2-4 AM",
  "targetAudience": "ALL",
  "targetIndustry": null,
  "targetCity": null,
  "languages": ["en", "hi", "kn"],
  "channels": ["PUSH", "EMAIL"],
  "scheduledAt": null
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "notificationId": 9001,
    "status": "SENT",
    "totalRecipients": 12450,
    "sentAt": "2026-10-13T10:30:00Z"
  }
}
```

---

### GET `/admin/feature-flags`

Get all feature flags.

**Response `200`:** List of all feature flags with current status

---

### PUT `/admin/feature-flags/{slug}`

Toggle a feature flag.

**Request:**
```json
{
  "isEnabled": true,
  "rolloutPercentage": 50
}
```

**Response `200`:** Updated feature flag

---

### GET `/admin/analytics`

Get platform analytics.

**Query:** `period=DAILY&from=2026-10-01&to=2026-10-13&industry=ALL`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 1240,
    "completedJobs": 1180,
    "cancelledJobs": 60,
    "completionRate": 95.2,
    "avgJobDurationMins": 142,
    "totalRevenue": 1450000.00,
    "platformCommission": 145000.00,
    "avgJobValue": 1169.35,
    "newOwners": 145,
    "newTechnicians": 23,
    "topCities": [
      { "city": "Bengaluru", "jobs": 450 },
      { "city": "Mumbai", "jobs": 320 }
    ],
    "topFaultCategories": [
      { "fault": "Motor Bearing Failure", "count": 145 }
    ],
    "industryBreakdown": {
      "INDUSTRIAL": 520,
      "AUTOMOBILE": 480,
      "ELECTRONICS": 240
    }
  }
}
```

---

## 22. WebSocket Events

**Connection URL:** `wss://api.uptime.in/ws`  
**Protocol:** STOMP over WebSocket  
**Auth:** JWT in STOMP CONNECT frame

### Connection

```javascript
// JavaScript (React)
import { Client } from '@stomp/stompjs';

const stompClient = new Client({
  brokerURL: 'wss://api.uptime.in/ws',
  connectHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
  onConnect: () => {
    console.log('WebSocket connected');
  },
});
stompClient.activate();
```

```dart
// Flutter
final channel = WebSocketChannel.connect(
  Uri.parse('wss://api.uptime.in/ws'),
  headers: {'Authorization': 'Bearer $accessToken'},
);
```

---

### Subscribe: Live Location Updates

**Topic:** `/topic/job/{jobId}/location`  
**Subscribers:** Job owner, Admin

**Message payload:**
```json
{
  "jobId": 999,
  "technicianId": 67890,
  "latitude": 12.9680,
  "longitude": 77.5910,
  "speedKmph": 35.0,
  "headingDegrees": 90.0,
  "etaMins": 4,
  "distanceKm": 1.2,
  "timestamp": "2026-10-13T12:57:00Z"
}
```

---

### Subscribe: Job Status Changes

**Topic:** `/topic/job/{jobId}/status`  
**Subscribers:** Job owner, Assigned technician

**Message payload:**
```json
{
  "jobId": 999,
  "newStatus": "ARRIVED",
  "previousStatus": "EN_ROUTE",
  "message": "Raju Kumar has arrived at your location",
  "timestamp": "2026-10-13T13:00:00Z"
}
```

---

### Subscribe: Auction Updates

**Topic:** `/topic/auction/{jobId}`  
**Subscribers:** All notified technicians

**Message payload:**
```json
{
  "auctionId": 100,
  "jobId": 999,
  "currentBonus": 200.00,
  "totalAmount": 1200.00,
  "techsCompeting": 5,
  "secondsRemaining": 120,
  "timestamp": "2026-10-13T10:42:00Z"
}
```

---

### Subscribe: Personal Notifications

**Topic:** `/user/queue/notifications`  
**Subscribers:** Individual user (private queue)

**Message payload:**
```json
{
  "notificationId": 3001,
  "type": "JOB_ACCEPTED",
  "title": "Technician Accepted!",
  "body": "Raju Kumar accepted your job. ETA: 8 minutes",
  "deepLinkUrl": "/dashboard/tracking/999",
  "timestamp": "2026-10-13T10:05:00Z"
}
```

---

### Publish: Technician Location Update

**Destination:** `/app/tracking/update`  
**Publisher:** Technician app (sends every 5 seconds)

**Message payload:**
```json
{
  "jobId": 999,
  "latitude": 12.9680,
  "longitude": 77.5910,
  "accuracyMeters": 4.5,
  "speedKmph": 35.0,
  "headingDegrees": 90.0,
  "batteryLevel": 68,
  "timestamp": "2026-10-13T12:57:05Z"
}
```

---

### Subscribe: Admin Live Feed

**Topic:** `/topic/admin/live`  
**Subscribers:** Admin users only

**Message payload:**
```json
{
  "activeJobs": 23,
  "onlineTechs": 145,
  "newAlert": {
    "type": "SILENT_KILLER",
    "message": "Samsung AC refrigerant leak detected — Owner ID 12345",
    "severity": "HIGH"
  },
  "timestamp": "2026-10-13T10:30:10Z"
}
```

---

## Appendix — Query Parameter Summary

```
Pagination (all list endpoints):
  page:  int (0-based, default 0)
  size:  int (default 20, max 100)

Date filtering:
  from: ISO 8601 date  (e.g. 2026-10-01)
  to:   ISO 8601 date  (e.g. 2026-10-31)

Common filters:
  status:    job/claim/payout status enum
  industry:  INDUSTRIAL|AUTOMOBILE|ELECTRONICS
  period:    WEEK|MONTH|YEAR|CUSTOM

Sorting (where supported):
  sort:   field name (e.g. createdAt)
  order:  ASC|DESC (default DESC)

Search:
  q:     full-text search query string
```

---

*UPTIME API Documentation — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*

---

## Addendum — New Endpoints for User-Controlled Flow (v1.1)

### POST `/jobs/{id}/choose-path`

Owner selects their resolution path after AI diagnosis.

**Auth:** OWNER role

**Request:**
```json
{
  "path": "COPILOT",
  "skipReason": null
}
```

**path values:**
```
COPILOT  → Owner wants to try AI self-repair
VIDEO    → Owner wants video consultation
BOOK     → Owner wants to book technician directly
SKIP     → Owner skips AI result, goes to tech list
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "chosenPath": "COPILOT",
    "nextScreen": "AI_COPILOT",
    "nextUrl": "/ai/copilot/999",
    "estimatedCost": 0.00,
    "message": "AI Copilot started. Follow the steps carefully."
  }
}
```

---

### POST `/jobs/{id}/escalate`

Escalate from current path to next level.

**Auth:** OWNER role

**Request:**
```json
{
  "fromPath": "COPILOT",
  "toPath": "VIDEO",
  "escalationReason": "Could not complete step 4"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "previousPath": "COPILOT",
    "newPath": "VIDEO",
    "nextScreen": "VIDEO_CONSULT_BOOKING",
    "copilotStepsCompleted": 3,
    "message": "Escalated to Video Consultation."
  }
}
```

---

### GET `/jobs/{id}/path-status`

Get current path status for a job.

**Auth:** OWNER | TECHNICIAN | ADMIN

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "jobId": 999,
    "currentPath": "VIDEO",
    "pathHistory": [
      {
        "path": "COPILOT",
        "startedAt": "2026-10-13T10:05:00Z",
        "endedAt": "2026-10-13T10:25:00Z",
        "outcome": "ESCALATED",
        "stepsCompleted": 3
      },
      {
        "path": "VIDEO",
        "startedAt": "2026-10-13T10:26:00Z",
        "endedAt": null,
        "outcome": null,
        "stepsCompleted": null
      }
    ],
    "isResolved": false,
    "totalTimeSpentMins": 21
  }
}
```


---

## 23. Technician Verification & KYC Module

> **Specification Reference:** Full protocol detailed in [TECHNICIAN_VERIFICATION.md](file:///F:/uptime/TECHNICIAN_VERIFICATION.md). Implements tiered verification (L0-L3), Aadhaar QR/e-KYC, 3D liveness selfie, trade skill tests, provisional onboarding, reference checks, and signed 5-minute KYC document URLs.

## 9. API (add to API.md)

### Technician side (role TECHNICIAN)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/technicians/me/verification` | Level, per-trade status, pending items, next step |
| POST | `/api/v1/technicians/me/kyc/consent` | Save consent (text version) before identity check |
| POST | `/api/v1/technicians/me/kyc/identity/start` | Start identity check (method: AADHAAR_QR / MANUAL_ID) |
| POST | `/api/v1/technicians/me/kyc/identity/confirm` | Submit QR payload or ID image; returns result only |
| POST | `/api/v1/technicians/me/kyc/selfie` | Selfie + liveness proof; returns PASS / REVIEW / FAIL |
| POST | `/api/v1/technicians/me/documents` | **Extend existing**: `docCategory`, `documentType`, `issuer`, `expiresAt`, file |
| DELETE | `/api/v1/technicians/me/documents/{id}` | Withdraw an unapproved document |
| POST | `/api/v1/technicians/me/skills/{tradeCode}/test/start` | Start skill test (returns questions) |
| POST | `/api/v1/technicians/me/skills/{tradeCode}/test/submit` | Submit answers (+ practical video ref) |
| POST | `/api/v1/technicians/me/references` | Add a reference (name, phone, relationship) |
| POST | `/api/v1/technicians/me/bank-account/verify` | Penny-drop verification (mock in demo) |

### Admin side (role ADMIN with KYC_REVIEWER permission)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/admin/technicians/pending` | **Extend existing**: filter by kycStatus, trade, flag |
| GET | `/api/v1/admin/technicians/{id}/kyc` | Full KYC case: identity result, face check, documents, tests, references |
| GET | `/api/v1/admin/technicians/{id}/documents/{docId}/view` | Short-lived signed URL (5 min). Every call is audited |
| PUT | `/api/v1/admin/technicians/{id}/documents/{docId}/review` | APPROVE / REJECT with `reasonCode` |
| PUT | `/api/v1/admin/technicians/{id}/skills/{tradeCode}/verify` | Grant L2 / L2-P / L3 for a trade (or reject) |
| PUT | `/api/v1/admin/technicians/{id}/references/{refId}` | Record reference call outcome |
| PUT | `/api/v1/admin/technicians/{id}/verify` | **Extend existing**: final decision + level; sends SMS/push |
| PUT | `/api/v1/admin/technicians/{id}/suspend` | Suspend / revoke (reason required) |
| GET | `/api/v1/admin/trade-licenses` / `PUT .../{id}` | Manage licence requirement table |

```
Rejection reason codes: BLURRY, WRONG_DOCUMENT, NAME_MISMATCH, EXPIRED, FACE_MISMATCH,
                        UNDERAGE, DUPLICATE_IDENTITY, FORGERY_SUSPECTED, INCOMPLETE, OTHER
Error codes: KYC_001 consent missing | KYC_002 identity failed | KYC_003 underage |
             KYC_004 face mismatch | KYC_005 test cool-down | KYC_006 max attempts |
             KYC_007 document expired | KYC_008 level too low for this trade
```

---

