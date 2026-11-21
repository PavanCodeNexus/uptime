import type { HttpClient } from '../lib/http';
import type { Invoice, Job, Payment, TrackingPoint } from '../types/models';
import { stripSecrets } from './jobs';

/** Steps a technician takes on a job, from the backend's rules. */
export const workApi = {
  /** Needs verification level 2. The job number comes from the owner (there is no open-jobs list yet). */
  accept: async (http: HttpClient, id: number) => stripSecrets(await http.put<Job>(`/api/v1/jobs/${id}/accept`)),
  enRoute: async (http: HttpClient, id: number) => stripSecrets(await http.put<Job>(`/api/v1/jobs/${id}/enroute`)),
  arrive: async (http: HttpClient, id: number) => stripSecrets(await http.put<Job>(`/api/v1/jobs/${id}/arrive`)),
  /** The technician must be within 500 m of the job. A good code moves the job to IN_PROGRESS. */
  verifyOtp: async (http: HttpClient, id: number, otp: string, lat: number, lng: number) =>
    stripSecrets(await http.post<Job>(`/api/v1/jobs/${id}/otp-verify`, { otp, lat, lng })),
  addPart: (http: HttpClient, id: number, p: { partName: string; quantity: number; unitPrice: number; warrantyMonths?: number }) =>
    http.post<{ id: number; partName: string; totalPrice: number }>(`/api/v1/jobs/${id}/parts`, { ...p, unitPrice: String(p.unitPrice) }),
  complete: async (http: HttpClient, id: number, laborCharge: number, workDoneSummary: string) =>
    stripSecrets(await http.put<Job>(`/api/v1/jobs/${id}/complete`, { laborCharge: String(laborCharge), workDoneSummary })),
  dispute: (http: HttpClient, id: number, disputeType: string, description: string) =>
    http.post<{ id: number; status: string }>(`/api/v1/jobs/${id}/dispute`, { disputeType, description }),
} as const;

export const trackingApi = {
  /** Latest position. Until a technician sends one the backend answers with a fixed sample point. */
  get: (http: HttpClient, jobId: number) => http.get<TrackingPoint>(`/api/v1/tracking/${jobId}`),
} as const;

export const paymentsApi = {
  createOrder: (http: HttpClient, jobId: number, amount: number) =>
    http.post<Payment>('/api/v1/payments/create-order', { jobId, amount: String(amount) }),
  /** Without Razorpay keys the backend accepts the test values, so this completes in development. */
  verify: (http: HttpClient, razorpayOrderId: string, razorpayPaymentId?: string, razorpaySignature?: string) =>
    http.post<Payment>('/api/v1/payments/verify', {
      razorpayOrderId,
      ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
      ...(razorpaySignature ? { razorpaySignature } : {}),
    }),
  invoice: (http: HttpClient, jobId: number) => http.get<Invoice>(`/api/v1/payments/invoice/${jobId}`),
} as const;

export interface BlindRating {
  jobId: number;
  ownerSubmitted: boolean;
  techSubmitted: boolean;
  isRevealed: boolean;
  ownerStars?: number;
  techStars?: number;
}

export const ratingsApi = {
  submit: (http: HttpClient, jobId: number, role: 'OWNER' | 'TECHNICIAN', stars: number) =>
    http.post<BlindRating>('/api/v1/ratings/blind', { jobId, role, stars }),
  status: (http: HttpClient, jobId: number) => http.get<BlindRating>(`/api/v1/ratings/job/${jobId}/blind-status`),
} as const;

export interface Earnings {
  [key: string]: unknown;
}
export const earningsApi = {
  get: (http: HttpClient) => http.get<Earnings>('/api/v1/technicians/me/earnings'),
} as const;

/** What the technician can press next, from the job's status. */
export function nextWorkStep(status: string | undefined | null): 'ENROUTE' | 'ARRIVE' | 'OTP' | 'COMPLETE' | 'DONE' | 'NONE' {
  switch ((status ?? '').toUpperCase()) {
    case 'ACCEPTED':
      return 'ENROUTE';
    case 'EN_ROUTE':
      return 'ARRIVE';
    case 'ARRIVED':
      return 'OTP';
    case 'IN_PROGRESS':
      return 'COMPLETE';
    case 'COMPLETED':
      return 'DONE';
    default:
      return 'NONE';
  }
}

/** Great-circle distance in metres. Used to tell the technician how far they are from the job. */
export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
