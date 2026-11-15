import type { HttpClient } from '../lib/http';
import type { AdminLoginStep1, AdminSession, AuthResponse, UserDTO } from '../types/models';

/** The kinds of account the backend knows. Sent as `userType` when verifying the phone code. */
export type AccountKind = 'OWNER' | 'TECHNICIAN';

export const authApi = {
  /** Step 1 of phone sign-in. In dev the code is always 123456 (nothing is sent). */
  sendOtp: (http: HttpClient, phone: string) =>
    http.post<unknown>('/api/v1/auth/send-otp', { phone, purpose: 'LOGIN' }, { auth: false }),

  /** Step 2. A new phone number silently creates an account with a placeholder name. */
  verifyOtp: (http: HttpClient, phone: string, otp: string, userType: AccountKind) =>
    http.post<AuthResponse>('/api/v1/auth/verify-otp', { phone, otp, purpose: 'LOGIN', userType }, { auth: false }),

  me: (http: HttpClient) => http.get<UserDTO>('/api/v1/auth/me'),

  logout: (http: HttpClient, refreshToken: string | null) =>
    http.post<unknown>('/api/v1/auth/logout', refreshToken ? { refreshToken } : undefined),

  /** Name, email, birth date, gender and industry. Used right after a new account is created. */
  updateProfile: (http: HttpClient, body: { fullName?: string; email?: string; dateOfBirth?: string; gender?: string; industryPreference?: string }) =>
    http.put<UserDTO>('/api/v1/users/me', body),

  adminLogin: (http: HttpClient, email: string, password: string) =>
    http.post<AdminLoginStep1>('/api/v1/admin/auth/login', { email, password }, { auth: false }),

  adminVerify2fa: (http: HttpClient, temp2faToken: string, totpCode: string) =>
    http.post<AdminSession>('/api/v1/admin/auth/verify-2fa', { temp2faToken, totpCode }, { auth: false }),
} as const;
