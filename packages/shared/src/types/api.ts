/**
 * Every backend reply is wrapped in the same envelope (see ApiResponse.java):
 *   success: { success: true,  data: ..., message: "OK", timestamp }
 *   failure: { success: false, error: { code, message, details? }, timestamp }
 * The HTTP client in lib/http.ts unwraps this so screens only ever see `data`.
 */
export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiErrorPayload;
  timestamp?: string;
}

/** The health endpoint returns a small free-form object. */
export type HealthData = Record<string, unknown>;
