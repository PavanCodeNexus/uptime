import type { HttpClient } from '../lib/http';
import type { Technician } from '../types/models';

/** A document a technician uploaded. The private storage path the backend also sends is deliberately left out. */
export interface TechnicianDocument {
  id: number;
  technicianId: number;
  docType: string;
  /** Only the last 4 digits. Full 12-digit Aadhaar numbers are refused by the backend (DPDP Act). */
  docNumberMasked?: string;
  issuerName?: string;
  fileSha256?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  verifiedBy?: number;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
}

export interface TechnicianSkill {
  id: number;
  technicianId: number;
  industry: string;
  category: string;
  skillName: string;
  proficiency: string;
  isCertified: boolean;
}

export interface VerificationStatus {
  technicianId: number;
  verificationStatus: string;
  verificationLevel: number;
  isProvisional: boolean;
  provisionalCompletedJobs: number;
  identityVerification: { status?: string } & Record<string, unknown>;
  tradeVerifications: unknown[];
  documentsCount: number;
}

export interface AdminDashboard {
  totalUsers: number;
  totalTechnicians: number;
  totalJobs: number;
  pendingKycDocuments: number;
}

/** Document kinds the upload screen offers. The backend accepts any text up to 50 letters. */
export const DOC_TYPES = [
  { value: 'AADHAAR', label: 'Aadhaar (last 4 digits only)' },
  { value: 'PAN', label: 'PAN card' },
  { value: 'ITI_NCVT_CERT', label: 'ITI / NCVT certificate' },
  { value: 'CERTIFICATE', label: 'Other trade certificate' },
  { value: 'PHOTO', label: 'Photo' },
] as const;

export function docTypeLabel(value: string): string {
  return DOC_TYPES.find((d) => d.value === value)?.label.replace(/ \(.*\)$/, '') ?? value.replace(/_/g, ' ').toLowerCase();
}

/** Strips the private storage fields so a screen cannot show or log them by accident. */
export function cleanDocument<T extends object>(doc: T): T {
  const { docUrl: _a, storageRef: _b, ...rest } = doc as T & { docUrl?: unknown; storageRef?: unknown };
  return rest as T;
}

export const techApi = {
  me: (http: HttpClient) => http.get<Technician>('/api/v1/technicians/me'),

  updateProfile: (http: HttpClient, body: { bio?: string; experienceYears?: number; serviceRadiusKm?: number; upiId?: string; emergencyContactName?: string; emergencyContactPhone?: string }) =>
    http.put<Technician>('/api/v1/technicians/me', body),

  /** Both flags are always sent: the backend reads a missing one as false. */
  setAvailability: (http: HttpClient, isOnline: boolean, isAvailable: boolean) =>
    http.put<Technician>('/api/v1/technicians/me/availability', { isOnline, isAvailable }),

  setLocation: (http: HttpClient, lat: number, lng: number) => http.put<Technician>('/api/v1/technicians/me/location', { lat, lng }),

  skills: (http: HttpClient) => http.get<TechnicianSkill[]>('/api/v1/technicians/me/skills'),

  addSkill: (http: HttpClient, body: { industry: string; category: string; skillName: string; proficiency: string; isCertified: boolean }) =>
    http.post<TechnicianSkill>('/api/v1/technicians/me/skills', body),

  deleteSkill: (http: HttpClient, id: number) => http.del<{ deleted: boolean }>(`/api/v1/technicians/me/skills/${id}`),

  verificationStatus: (http: HttpClient) => http.get<VerificationStatus>('/api/v1/technicians/me/verification-status'),

  /** The file travels as base64 text inside JSON. Leave `fileBase64` out to record a document with no file (dev only). */
  uploadDocument: async (http: HttpClient, body: { docType: string; docNumberMasked?: string; issuerName?: string; fileBase64?: string }) =>
    cleanDocument(await http.post<TechnicianDocument>('/api/v1/technicians/me/documents', body)),

  upiPennyDrop: (http: HttpClient, upiId: string) => http.post<{ status?: string }>('/api/v1/technicians/me/kyc/upi-penny-drop', { upiId }),
} as const;

export const adminApi = {
  dashboard: (http: HttpClient) => http.get<AdminDashboard>('/api/v1/admin/dashboard'),

  pendingDocuments: async (http: HttpClient) => (await http.get<TechnicianDocument[]>('/api/v1/admin/technicians/pending-kyc')).map(cleanDocument),

  reviewDocument: async (http: HttpClient, technicianId: number, docId: number, status: 'VERIFIED' | 'REJECTED', rejectionReason?: string) =>
    cleanDocument(
      await http.put<TechnicianDocument>(`/api/v1/admin/technicians/${technicianId}/documents/${docId}/review`, {
        status,
        ...(rejectionReason ? { rejectionReason } : {}),
      }),
    ),

  /** Sets the level (0 to 3) and status. Level 2 or more lets the technician accept jobs. */
  verifyTechnician: (http: HttpClient, technicianId: number, verificationLevel: number, verificationStatus: string, reason?: string) =>
    http.put<Technician>(`/api/v1/admin/technicians/${technicianId}/verify`, {
      verificationLevel,
      verificationStatus,
      ...(reason ? { reason } : {}),
    }),

  technician: (http: HttpClient, id: number) => http.get<Technician>(`/api/v1/technicians/${id}/public`),
} as const;

/** Can this technician be matched and accept jobs? (Level 2+, from AdminService and JobService.) */
export function canAcceptJobs(t: Pick<Technician, 'verificationLevel' | 'isFatigueRestricted'>): boolean {
  return t.verificationLevel >= 2 && !t.isFatigueRestricted;
}

/** File to base64 (the part after the comma). Browser only. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error('Could not read that file.'));
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.readAsDataURL(file);
  });
}
