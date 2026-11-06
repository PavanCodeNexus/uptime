export type IndustryType = 'INDUSTRIAL' | 'AUTOMOBILE' | 'ELECTRONICS';

export type ResolutionPathType = 'AI_COPILOT' | 'VIDEO_CONSULT' | 'DIRECT_BOOKING';

export type VerificationLevel = 0 | 1 | 2 | 3;

export type VerificationTrack = 'CERTIFIED' | 'EXPERIENCED_USTAD';

export interface UserDTO {
  id: number;
  fullName: string;
  email?: string;
  phone: string;
  phoneVerified: boolean;
  profilePhotoUrl?: string;
  userType: 'OWNER' | 'TECHNICIAN' | 'ADMIN';
  industryPreference: IndustryType;
  greenPointsBalance: number;
  carbonCreditsBalance: number;
  referralCode: string;
}

export interface TechnicianDTO {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  industryType: IndustryType;
  verificationLevel: VerificationLevel;
  isProvisional: boolean; // L2-P Track B Ustad
  provisionalCompletedJobs: number;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'PROVISIONAL' | 'VERIFIED' | 'REJECTED';
  isOnline: boolean;
  isAvailable: boolean;
  isFatigueRestricted: boolean;
  fatigueScore: number;
  fatigueResetAt?: string;
  ratingAvg: number;
  jobsCompleted: number;
}

export interface JobDTO {
  id: number;
  jobNumber: string;
  ownerId: number;
  technicianId?: number;
  industry: IndustryType;
  equipmentSummary: string;
  problemDescription: string;
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
  status: string;
  resolutionPath: ResolutionPathType;
  videoConsultFeeCredited: boolean;
  videoConsultCreditAmount: number;
  laborCharge: number;
  partsCharge: number;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
  recordHash?: string;
  isLocked: boolean;
}
