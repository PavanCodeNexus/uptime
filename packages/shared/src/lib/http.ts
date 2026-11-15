/**
 * The one HTTP client every screen uses (through the functions in api/).
 *
 * What it does for you:
 *  1. Adds  Authorization: Bearer <token>  to each request.
 *  2. Unwraps the backend envelope, so you get `data` back and never see { success, data }.
 *  3. Turns every failure into an ApiError with a plain-language message.
 *  4. If the access token has expired, refreshes it ONCE and repeats the request.
 *     Refresh tokens work only once on the backend, so simultaneous requests share a single refresh.
 *
 * Built on the browser's own fetch, so it needs no extra package.
 */
import type { ApiEnvelope } from '../types/api';
import { ApiError } from './errors';
import type { TokenStore } from './tokens';

export interface HttpClientOptions {
  /** For example http://localhost:8080 (no trailing slash needed). */
  baseUrl: string;
  tokens: TokenStore;
  /**
   * Path of the refresh endpoint, for example /api/v1/auth/refresh-token.
   * Use null for the admin app, which has no refresh endpoint.
   */
  refreshPath?: string | null;
  /** Called when the session cannot be saved (refresh failed or not possible). Send the user to login. */
  onSessionExpired?: () => void;
  /** Request timeout. Default 20 seconds. */
  timeoutMs?: number;
  /** Only for tests. */
  fetchImpl?: typeof fetch;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** A plain object is sent as JSON. FormData is sent as multipart (for photo uploads). */
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /**
   * Set false for public endpoints (send-otp, verify-otp, admin login, health).
   * They never get a token attached and never trigger a refresh.
   */
  auth?: boolean;
}

export interface HttpClient {
  readonly baseUrl: string;
  request<T>(path: string, opts?: RequestOptions): Promise<T>;
  get<T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
  put<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
  del<T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T>;
}

/**
 * The backend answers an expired or missing token with 401, or with an empty 403 (the Spring default).
 * A 403 that carries a real error code (for example AUTH_006 "forbidden") is a permission problem,
 * and refreshing would not help.
 */
function looksLikeExpiredSession(status: number, envelope: ApiEnvelope<unknown> | null): boolean {
  if (status === 401) return true;
  if (status !== 403) return false;
  const code = envelope?.error?.code;
  return !code || code === 'AUTH_004' || code === 'AUTH_005';
}

async function readEnvelope(res: Response): Promise<ApiEnvelope<unknown> | null> {
  try {
    const text = await res.text();
    if (!text) return null;
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as ApiEnvelope<unknown>) : null;
  } catch {
    return null;
  }
}

export function createHttpClient(options: HttpClientOptions): HttpClient {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetchImpl = options.fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const timeoutMs = options.timeoutMs ?? 20_000;
  const { tokens } = options;

  let refreshing: Promise<boolean> | null = null;

  async function rawFetch(url: string, init: RequestInit, outer?: AbortSignal): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
    const onOuterAbort = () => controller.abort(outer?.reason);
    outer?.addEventListener('abort', onOuterAbort);
    try {
      return await fetchImpl(url, { ...init, signal: controller.signal });
    } catch (e) {
      if (outer?.aborted) throw e; // the caller cancelled on purpose; let it through untouched
      if (controller.signal.aborted) throw new ApiError('TIMEOUT', 0);
      throw new ApiError('NETWORK', 0);
    } finally {
      clearTimeout(timer);
      outer?.removeEventListener('abort', onOuterAbort);
    }
  }

  async function doRefresh(): Promise<boolean> {
    const refreshToken = tokens.getRefresh();
    if (!options.refreshPath || !refreshToken) return false;
    try {
      const res = await rawFetch(baseUrl + options.refreshPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const env = (await readEnvelope(res)) as ApiEnvelope<{ accessToken?: string; refreshToken?: string }> | null;
      const data = env?.data;
      if (!env?.success || !data?.accessToken) return false;
      tokens.set({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? refreshToken });
      return true;
    } catch {
      return false;
    }
  }

  /** All callers that need a refresh at the same moment wait on the same one. */
  function refreshOnce(): Promise<boolean> {
    if (!refreshing) {
      refreshing = doRefresh().finally(() => {
        refreshing = null;
      });
    }
    return refreshing;
  }

  function buildInit(opts: RequestOptions): RequestInit {
    const headers: Record<string, string> = { Accept: 'application/json', ...opts.headers };
    let body: BodyInit | undefined;
    if (opts.body !== undefined) {
      if (typeof FormData !== 'undefined' && opts.body instanceof FormData) {
        body = opts.body; // the browser sets the multipart boundary itself
      } else {
        headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
        body = JSON.stringify(opts.body);
      }
    }
    if (opts.auth !== false && !headers.Authorization) {
      const access = tokens.getAccess();
      if (access) headers.Authorization = `Bearer ${access}`;
    }
    return { method: opts.method ?? 'GET', headers, body };
  }

  async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const url = baseUrl + (path.startsWith('/') ? path : `/${path}`);

    let res = await rawFetch(url, buildInit(opts), opts.signal);
    let envelope = await readEnvelope(res);

    if (opts.auth !== false && !res.ok && looksLikeExpiredSession(res.status, envelope)) {
      const refreshed = await refreshOnce();
      if (refreshed) {
        // Repeat the request with the NEW token (drop any old Authorization header so it is rebuilt).
        const retryHeaders = { ...opts.headers };
        delete retryHeaders.Authorization;
        res = await rawFetch(url, buildInit({ ...opts, headers: retryHeaders }), opts.signal);
        envelope = await readEnvelope(res);
      }
      if (!refreshed || (!res.ok && looksLikeExpiredSession(res.status, envelope))) {
        tokens.clear();
        options.onSessionExpired?.();
        throw new ApiError('AUTH_005', res.status, envelope?.error?.message);
      }
    }

    if (!res.ok || envelope?.success === false) {
      const code = envelope?.error?.code ?? (res.status === 429 ? 'RATE_001' : `HTTP_${res.status}`);
      throw new ApiError(code, res.status, envelope?.error?.message, envelope?.error?.details);
    }
    return envelope?.data as T;
  }

  return {
    baseUrl,
    request,
    get: (path, o) => request(path, { ...o, method: 'GET' }),
    post: (path, body, o) => request(path, { ...o, method: 'POST', body }),
    put: (path, body, o) => request(path, { ...o, method: 'PUT', body }),
    del: (path, o) => request(path, { ...o, method: 'DELETE' }),
  };
}
