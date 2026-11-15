/**
 * Shapes of the JSON the backend sends, written from the Java classes.
 * Rules used here:
 *  - The backend omits null fields (default-property-inclusion: non_null), so nullable fields are optional.
 *  - Dates and times arrive as ISO-8601 strings. Money (BigDecimal) arrives as a JSON number.
 *  - Field names are the Java field names, not the database column names (e.g. Job.problemDescription).
 */

export type UserType = 'OWNER' | 'TECHNICIAN' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserDTO {
  id: number;
  fullName: string;
  email?: string;
  phone: string;
  phoneVerified?: boolean;
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  /** Plain string on the wire. Compare with the UserType values. */
  userType: string;
  industryPreference?: string;
  greenPointsBalance?: number;
  carbonCreditsBalance?: number;
  referralCode?: string;
  createdAt?: string;
}

export interface UserAddress {
  id: number;
  userId: number;
  label?: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  createdAt?: string;
}

export interface AddressCreateRequest {
  label: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  /**
   * AuthResponse.java declares `boolean isNewUser`. With Lombok + Jackson the JSON key is
   * most likely `newUser`. We accept both until the first real run settles it (see isNewUser()).
   */
  newUser?: boolean;
  isNewUser?: boolean;
  user: UserDTO;
}

/** Reads the "is this a brand new account" flag whichever way the backend spells it. */
export function isNewUser(res: Pick<AuthResponse, 'newUser' | 'isNewUser'>): boolean {
  return res.newUser ?? res.isNewUser ?? false;
}

export interface AdminLoginStep1 {
  temp2faToken: string;
  expiresInSeconds: number;
  requires2fa: boolean;
  message?: string;
}

export interface AdminSession {
  accessToken: string;
  expiresInSeconds: number;
  admin: { id: number; email: string; fullName: string; role: string };
}

/**
 * A job. NOTE: the backend also sends `arrivalOtp` (a bcrypt hash of the arrival code).
 * It is deliberately NOT declared here. Screens must never show or log it.
 */
export interface Job {
  id: number;
  jobNumber: string;
  ownerId: number;
  technicianId?: number;
  industry: string;
  equipmentSummary?: string;
  problemDescription?: string;
  problemCategory?: string;
  urgency: string;
  /** See constants/job.ts. The backend uses a few spellings (CREATED, POSTED, ...). */
  status: string;
  resolutionPath?: string;
  pathChosenAt?: string;
  copilotAttempted: boolean;
  videoConsultAttempted: boolean;
  escalatedFromPath?: string;
  escalationReason?: string;
  videoConsultFeeCredited: boolean;
  videoConsultCreditAmount?: number;
  aiEstimatedCostMin?: number;
  aiEstimatedCostMax?: number;
  ownerLat: number;
  ownerLng: number;
  ownerAddress?: string;
  ownerCity?: string;
  acceptedAt?: string;
  enRouteAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  otpVerified: boolean;
  otpVerifiedAt?: string;
  arrivalGpsLat?: number;
  arrivalGpsLng?: number;
  laborCharge: number;
  partsCharge: number;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
  workDoneSummary?: string;
  recordHash?: string;
  isLocked: boolean;
  lockedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobRequest {
  industry: string;
  equipmentSummary: string;
  problemDescription: string;
  problemCategory?: string;
  urgency?: string;
  resolutionPath?: ResolutionPath;
  ownerLat: number;
  ownerLng: number;
  ownerAddress?: string;
  ownerCity?: string;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
}

export interface CreateJobResponse {
  job: Job;
  /** Shown to the owner ONCE. No endpoint returns it again, so the app must keep it on the device. */
  arrivalOtpPlaintextForOwner: string;
}

export type ResolutionPath = 'DIRECT_BOOKING' | 'AI_COPILOT' | 'VIDEO_CONSULT';

export interface JobPartsUsed {
  id: number;
  jobId: number;
  partName: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warrantyMonths?: number;
}

export interface JobDispute {
  id: number;
  jobId: number;
  raisedBy: number;
  disputeType: string;
  description: string;
  status: string;
}

export interface Technician {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  industryType: string;
  kycStatus: string;
  verificationStatus: string;
  /** 0 to 3. A technician needs 2 or more to accept jobs. */
  verificationLevel: number;
  isProvisional: boolean;
  provisionalCompletedJobs: number;
  experienceYears?: number;
  bio?: string;
  serviceRadiusKm?: number;
  currentLat?: number;
  currentLng?: number;
  isOnline: boolean;
  isAvailable: boolean;
  isOnJob: boolean;
  ratingAvg: number;
  ratingCount: number;
  jobsCompleted: number;
  fatigueScore: number;
  consecutiveJobsCount: number;
  hoursWorkedToday: number;
  isFatigueRestricted: boolean;
  fatigueResetAt?: string;
  walletBalance: number;
  totalEarned: number;
  upiId?: string;
}

/** One row from GET /matching/jobs/{id}/candidates. No name or distance: fetch the public profile for those. */
export interface MatchCandidate {
  technicianId: number;
  verificationLevel: number;
  isProvisional: boolean;
  ratingAvg: number;
  score: number;
}

/** POST /ai/diagnose today returns a fixed sample, flagged by fallbackUsed. */
export interface DiagnosisResult {
  industry?: string;
  predictedCause: string;
  confidenceScore: number;
  severity: string;
  diyPossible: boolean;
  estimatedDurationMin: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  recommendedPath: string;
  safetyWarnings: string[];
  fallbackUsed: boolean;
}

/** Read from GeminiService.getCopilotStep. */
export interface CopilotStep {
  jobId: number;
  stepNumber: number;
  title: string;
  instruction: string;
  safetyWarning: string;
  canResolveNow: boolean;
  suggestEscalationToVideo: boolean;
}

/** WebSocket payload on /topic/job/{id}/location and the REST fallback GET /tracking/{id}. */
export interface TrackingPoint {
  jobId: number;
  lat: number;
  lng: number;
  etaMinutes: number;
  timestamp: string;
}

export type PaymentStatus = 'INITIATED' | 'CAPTURED' | 'RELEASED' | 'REFUNDED' | 'FAILED';

export interface Payment {
  id: number;
  transactionNumber?: string;
  jobId: number;
  payerId?: number;
  payeeId?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus | string;
  createdAt?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  jobId: number;
  ownerId: number;
  technicianId?: number;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  issuedAt?: string;
}
