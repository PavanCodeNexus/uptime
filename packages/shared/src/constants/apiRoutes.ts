export const API_ROUTES = {
  AUTH_SEND_OTP: '/api/v1/auth/send-otp',
  AUTH_VERIFY_OTP: '/api/v1/auth/verify-otp',
  AUTH_ME: '/api/v1/auth/me',
  ADMIN_LOGIN: '/api/v1/admin/auth/login',
  ADMIN_VERIFY_2FA: '/api/v1/admin/auth/verify-2fa',
  AI_DIAGNOSE: '/api/v1/ai/diagnose',
  AI_SOUND: '/api/v1/ai/analyze-sound',
  AI_COPILOT: '/api/v1/ai/copilot-step',
  JOBS: '/api/v1/jobs',
  MATCHING_CANDIDATES: (jobId: number) => `/api/v1/matching/jobs/${jobId}/candidates`,
  TECH_KYC_STATUS: '/api/v1/technicians/me/verification-status',
  TECH_FATIGUE: '/api/v1/technicians/me/fatigue',
} as const;

export const REGULATED_TRADES = [
  'HV_ELECTRICIAN',
  'BOILER_OPERATOR',
  'COMMERCIAL_HVAC_GAS',
] as const;
