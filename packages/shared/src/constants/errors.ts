/**
 * Turns the backend's error codes (ErrorCodes.java) into plain-language messages.
 * Screens show these, never the raw code or a stack trace.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  AUTH_001: 'That code is not correct. Check it and try again.',
  AUTH_002: 'That code has expired. Ask for a new one.',
  AUTH_003: 'Too many wrong attempts. Try again in 30 minutes.',
  AUTH_004: 'Your session is not valid. Please sign in again.',
  AUTH_005: 'Your session has expired. Please sign in again.',
  AUTH_006: 'You do not have permission to do that.',
  AUTH_010: 'Admin sign-in is not allowed from this network.',

  TECH_001: 'We could not find that technician.',
  TECH_002: 'You are resting after a long shift. You can accept jobs again when the rest period ends.',

  JOB_001: 'We could not find that job.',
  JOB_004: 'That step is not allowed for this job right now.',
  JOB_005: 'That arrival code is not correct.',
  JOB_006: 'You are too far from the job location. Move within 500 metres and try again.',
  JOB_007: 'This job is completed and locked. It can no longer be changed.',

  KYC_001: 'Your consent is needed to continue.',
  KYC_002: 'We could not read that identity data. Please try again.',
  KYC_003: 'You must be 18 or older.',
  KYC_004: 'This identity is already registered with another account.',
  KYC_005: 'That document link has expired. Open the document again.',
  KYC_006: 'Please wait before retaking the skill test.',
  KYC_007: 'Your verification level is too low for this. Finish verification first.',
  KYC_008: 'This trade needs a licence. Choose the licence track.',

  VAL_001: 'Please check the highlighted fields.',
  FILE_001: 'That file type is not allowed.',
  RES_001: 'We could not find what you asked for.',
  AI_001: 'The AI assistant is unavailable right now. Please try again shortly.',
  VID_001: 'Video consultation is coming soon. Try AI Copilot or book a technician.',
  PAY_001: 'The payment did not go through. Please try again.',
  SERVER_001: 'Something went wrong on our side. Please try again.',
  RATE_001: 'Too many requests. Please wait a minute and try again.',

  // Added by the frontend (not sent by the backend)
  NETWORK: 'Cannot reach the server. Check your connection and that the backend is running.',
  TIMEOUT: 'The server took too long to answer. Please try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

/**
 * Picks the message to show. Known codes use our wording. Unknown codes fall back to the
 * message the backend sent (if any), then to a generic line.
 */
export function friendlyMessage(code?: string, serverMessage?: string): string {
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  if (serverMessage && serverMessage.trim()) return serverMessage;
  return ERROR_MESSAGES.UNKNOWN as string;
}
