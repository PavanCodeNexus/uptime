import { friendlyMessage } from '../constants/errors';

/**
 * The one error type screens deal with. `message` is already plain language and safe to show.
 * `code` is the backend code (AUTH_001, JOB_006 ...) or one we add: NETWORK, TIMEOUT, HTTP_<status>.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  /** The raw message the backend sent, for logs and for unknown codes. Do not show it blindly. */
  readonly serverMessage?: string;

  constructor(code: string, status: number, serverMessage?: string, details?: unknown) {
    super(friendlyMessage(code, serverMessage));
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.serverMessage = serverMessage;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/** For validation errors (VAL_001) the backend sends field messages in `details` as { field: message }. */
export function fieldErrors(e: unknown): Record<string, string> {
  if (isApiError(e) && e.code === 'VAL_001' && e.details && typeof e.details === 'object') {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(e.details as Record<string, unknown>)) {
      if (typeof v === 'string') out[k] = v;
    }
    return out;
  }
  return {};
}

/** Turns anything thrown into a message that is safe to show. */
export function errorMessage(e: unknown): string {
  if (isApiError(e)) return e.message;
  return friendlyMessage('UNKNOWN');
}
