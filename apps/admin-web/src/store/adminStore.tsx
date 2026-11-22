import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { TechnicianDocument } from '@uptime/shared';

export type Timeframe = '7D' | '30D' | '90D' | '1Y';
export type ClusterFilter = 'ALL' | 'Peenya' | 'Whitefield' | 'Bommasandra' | 'Chakan' | 'Sriperumbudur';

export interface AdminDispatch {
  id: string;
  plantName: string;
  cluster: Exclude<ClusterFilter, 'ALL'>;
  sector: 'Industrial' | 'Fleet & EV' | 'Power & UPS';
  asset: string;
  technician: string;
  etaMins: number;
  slaLimitMins: number;
  status: 'EN_ROUTE' | 'IN_PROGRESS' | 'SLA_RISK' | 'COMPLETED';
  escrowInr: number;
  createdAt: string;
}

export interface AdminTechRecord {
  id: number;
  name: string;
  cluster: Exclude<ClusterFilter, 'ALL'>;
  sector: 'Industrial' | 'Fleet & EV' | 'Power & UPS';
  level: 0 | 1 | 2 | 3;
  track: string;
  status: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  nftHash: string;
  shiftHours: number;
  fatigueLocked: boolean;
  rating: number;
  jobsCompleted: number;
}

export interface AdminPayout {
  id: string;
  jobId: string;
  technician: string;
  cluster: Exclude<ClusterFilter, 'ALL'>;
  grossInr: number;
  platformFeeInr: number;
  netPayoutInr: number;
  status: 'PENDING_ESCROW' | 'RELEASED';
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  category: 'KYC' | 'DISPATCH' | 'FINANCE' | 'ROSTER' | 'POLICY';
  timestamp: string;
}

export interface PlatformSettings {
  slaTargetMins: number;
  fatigueCapHours: number;
  escrowHoldHours: number;
  autoEscalateBreach: boolean;
  strictLotoCheck: boolean;
  platformFeePct: number;
}

interface AdminState {
  timeframe: Timeframe;
  cluster: ClusterFilter;
  dispatches: AdminDispatch[];
  kycQueue: TechnicianDocument[];
  technicians: AdminTechRecord[];
  payouts: AdminPayout[];
  auditLog: AuditEntry[];
  settings: PlatformSettings;
}

interface AdminStoreValue extends AdminState {
  setTimeframe: (tf: Timeframe) => void;
  setCluster: (c: ClusterFilter) => void;
  escalateDispatch: (id: string) => void;
  reassignDispatch: (id: string, newTech: string) => void;
  resolveDispatch: (id: string) => void;
  approveKycDoc: (docId: number) => void;
  rejectKycDoc: (docId: number, reason: string) => void;
  updateTechnicianTier: (id: number, level: 0 | 1 | 2 | 3) => void;
  toggleFatigueLock: (id: number) => void;
  setTechnicianStatus: (id: number, status: AdminTechRecord['status']) => void;
  releasePayout: (id: string) => void;
  updateSettings: (patch: Partial<PlatformSettings>) => void;
}

const STORAGE_KEY = 'uptime.admin.console.v1';

const INITIAL_DISPATCHES: AdminDispatch[] = [
  {
    id: 'JOB-9941',
    plantName: 'Apex Precision Tools',
    cluster: 'Peenya',
    sector: 'Industrial',
    asset: 'Siemens Sinumerik 828D CNC',
    technician: 'Raju Kumar Sharma',
    etaMins: 9,
    slaLimitMins: 15,
    status: 'EN_ROUTE',
    escrowInr: 11800,
    createdAt: '6 mins ago',
  },
  {
    id: 'JOB-9938',
    plantName: 'Karnataka EV Logistics',
    cluster: 'Whitefield',
    sector: 'Fleet & EV',
    asset: 'Tata Ace EV BMS Controller',
    technician: 'Syed Mahmood',
    etaMins: 14,
    slaLimitMins: 15,
    status: 'SLA_RISK',
    escrowInr: 8400,
    createdAt: '14 mins ago',
  },
  {
    id: 'JOB-9935',
    plantName: 'Deccan Semiconductor Fab',
    cluster: 'Bommasandra',
    sector: 'Power & UPS',
    asset: 'APC Galaxy 250kVA 3-Phase UPS',
    technician: 'Prakash Nair',
    etaMins: 11,
    slaLimitMins: 15,
    status: 'IN_PROGRESS',
    escrowInr: 18500,
    createdAt: '28 mins ago',
  },
  {
    id: 'JOB-9931',
    plantName: 'Bharat Forge Ancillary #4',
    cluster: 'Chakan',
    sector: 'Industrial',
    asset: 'Fanuc Robodrill α-D21MiB5',
    technician: 'Vikram Deshmukh',
    etaMins: 12,
    slaLimitMins: 15,
    status: 'COMPLETED',
    escrowInr: 14200,
    createdAt: '1 hr ago',
  },
  {
    id: 'JOB-9927',
    plantName: 'Southern Auto Components',
    cluster: 'Sriperumbudur',
    sector: 'Industrial',
    asset: 'Mazak VCN-530C Spindle Drive',
    technician: 'Karthik Subramanian',
    etaMins: 10,
    slaLimitMins: 15,
    status: 'COMPLETED',
    escrowInr: 16900,
    createdAt: '2 hrs ago',
  },
  {
    id: 'JOB-9922',
    plantName: 'Orion Cold-Chain Fleet',
    cluster: 'Whitefield',
    sector: 'Fleet & EV',
    asset: 'ThermoKing Reefer Compressor',
    technician: 'Ramesh Vishwakarma',
    etaMins: 13,
    slaLimitMins: 15,
    status: 'IN_PROGRESS',
    escrowInr: 9600,
    createdAt: '2 hrs ago',
  },
];

const INITIAL_KYC: TechnicianDocument[] = [
  {
    id: 8841,
    technicianId: 401,
    docType: 'AADHAAR',
    docNumberMasked: 'XXXX-XXXX-4829',
    issuerName: 'UIDAI e-KYC • Track B Senior',
    verificationStatus: 'PENDING',
    createdAt: '2026-11-22T08:12:00Z',
  },
  {
    id: 8842,
    technicianId: 405,
    docType: 'ITI_NCVT_CERT',
    docNumberMasked: 'CEA-KA-2024-9182',
    issuerName: 'CEA Karnataka Electrical Board • 415V',
    verificationStatus: 'PENDING',
    createdAt: '2026-11-22T09:05:00Z',
  },
  {
    id: 8843,
    technicianId: 412,
    docType: 'PAN',
    docNumberMasked: 'ABCDE1234F',
    issuerName: 'Income Tax Dept • Sec 194C TDS',
    verificationStatus: 'PENDING',
    createdAt: '2026-11-22T09:45:00Z',
  },
  {
    id: 8844,
    technicianId: 418,
    docType: 'SAFETY_PERMIT',
    docNumberMasked: 'LOTO-415V-7741',
    issuerName: 'DGFASLI Industrial Safety Board',
    verificationStatus: 'PENDING',
    createdAt: '2026-11-22T10:20:00Z',
  },
];

const INITIAL_TECHS: AdminTechRecord[] = [
  {
    id: 401,
    name: 'Raju Kumar Sharma',
    cluster: 'Peenya',
    sector: 'Industrial',
    level: 2,
    track: 'CNC & Siemens Drives',
    status: 'VERIFIED',
    nftHash: '0x88f2...a91c',
    shiftHours: 6.2,
    fatigueLocked: false,
    rating: 4.9,
    jobsCompleted: 142,
  },
  {
    id: 405,
    name: 'Ramesh K. Vishwakarma',
    cluster: 'Whitefield',
    sector: 'Fleet & EV',
    level: 1,
    track: 'Commercial EV & BMS',
    status: 'VERIFIED',
    nftHash: '0x31b0...e44a',
    shiftHours: 4.5,
    fatigueLocked: false,
    rating: 4.8,
    jobsCompleted: 64,
  },
  {
    id: 409,
    name: 'Suresh Gowda',
    cluster: 'Bommasandra',
    sector: 'Industrial',
    level: 2,
    track: 'Hydraulics & PLC',
    status: 'VERIFIED',
    nftHash: '0x41c9...d02e',
    shiftHours: 12.0,
    fatigueLocked: true,
    rating: 4.7,
    jobsCompleted: 118,
  },
  {
    id: 412,
    name: 'Syed Mahmood',
    cluster: 'Whitefield',
    sector: 'Power & UPS',
    level: 3,
    track: '415V Master Electrical',
    status: 'VERIFIED',
    nftHash: '0x9b14...f77a',
    shiftHours: 3.1,
    fatigueLocked: false,
    rating: 5.0,
    jobsCompleted: 215,
  },
  {
    id: 418,
    name: 'Vikram Deshmukh',
    cluster: 'Chakan',
    sector: 'Industrial',
    level: 3,
    track: 'Fanuc & Robotics',
    status: 'VERIFIED',
    nftHash: '0x6d02...c18b',
    shiftHours: 5.4,
    fatigueLocked: false,
    rating: 4.9,
    jobsCompleted: 176,
  },
  {
    id: 423,
    name: 'Karthik Subramanian',
    cluster: 'Sriperumbudur',
    sector: 'Power & UPS',
    level: 2,
    track: 'Cleanroom UPS & Drives',
    status: 'PENDING',
    nftHash: 'Pending Mint',
    shiftHours: 2.0,
    fatigueLocked: false,
    rating: 4.6,
    jobsCompleted: 39,
  },
];

const INITIAL_PAYOUTS: AdminPayout[] = [
  {
    id: 'PAY-7012',
    jobId: 'JOB-9931',
    technician: 'Vikram Deshmukh',
    cluster: 'Chakan',
    grossInr: 14200,
    platformFeeInr: 1704,
    netPayoutInr: 12496,
    status: 'PENDING_ESCROW',
    createdAt: 'Today, 21:14',
  },
  {
    id: 'PAY-7011',
    jobId: 'JOB-9927',
    technician: 'Karthik Subramanian',
    cluster: 'Sriperumbudur',
    grossInr: 16900,
    platformFeeInr: 2028,
    netPayoutInr: 14872,
    status: 'PENDING_ESCROW',
    createdAt: 'Today, 19:48',
  },
  {
    id: 'PAY-7008',
    jobId: 'JOB-9918',
    technician: 'Syed Mahmood',
    cluster: 'Whitefield',
    grossInr: 22400,
    platformFeeInr: 2688,
    netPayoutInr: 19712,
    status: 'RELEASED',
    createdAt: 'Today, 16:05',
  },
  {
    id: 'PAY-7004',
    jobId: 'JOB-9911',
    technician: 'Raju Kumar Sharma',
    cluster: 'Peenya',
    grossInr: 11500,
    platformFeeInr: 1380,
    netPayoutInr: 10120,
    status: 'RELEASED',
    createdAt: 'Yesterday, 18:30',
  },
];

const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: 'AUD-104',
    actor: 'Operations Lead',
    action: 'Released ₹19,712 escrow payout PAY-7008 to Syed Mahmood',
    category: 'FINANCE',
    timestamp: '22 mins ago',
  },
  {
    id: 'AUD-103',
    actor: 'System Guard',
    action: 'Applied 8h fatigue rest lock to Suresh Gowda (#409) at 12.0h shift limit',
    category: 'ROSTER',
    timestamp: '1 hr ago',
  },
  {
    id: 'AUD-102',
    actor: 'KYC Reviewer',
    action: 'Verified CEA 415V electrical permit for Vikram Deshmukh (#418)',
    category: 'KYC',
    timestamp: '2 hrs ago',
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  slaTargetMins: 15,
  fatigueCapHours: 12,
  escrowHoldHours: 24,
  autoEscalateBreach: true,
  strictLotoCheck: true,
  platformFeePct: 12,
};

function loadInitialState(): AdminState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AdminState>;
      return {
        timeframe: parsed.timeframe ?? '30D',
        cluster: parsed.cluster ?? 'ALL',
        dispatches: parsed.dispatches ?? INITIAL_DISPATCHES,
        kycQueue: parsed.kycQueue ?? INITIAL_KYC,
        technicians: parsed.technicians ?? INITIAL_TECHS,
        payouts: parsed.payouts ?? INITIAL_PAYOUTS,
        auditLog: parsed.auditLog ?? INITIAL_AUDIT,
        settings: { ...INITIAL_SETTINGS, ...(parsed.settings ?? {}) },
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    timeframe: '30D',
    cluster: 'ALL',
    dispatches: INITIAL_DISPATCHES,
    kycQueue: INITIAL_KYC,
    technicians: INITIAL_TECHS,
    payouts: INITIAL_PAYOUTS,
    auditLog: INITIAL_AUDIT,
    settings: INITIAL_SETTINGS,
  };
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota
    }
  }, [state]);

  function appendAudit(prev: AdminState, category: AuditEntry['category'], action: string): AuditEntry[] {
    const entry: AuditEntry = {
      id: `AUD-${Math.floor(200 + Math.random() * 799)}`,
      actor: 'Admin Console',
      action,
      category,
      timestamp: 'Just now',
    };
    return [entry, ...prev.auditLog].slice(0, 20);
  }

  const value: AdminStoreValue = {
    ...state,
    setTimeframe: (timeframe) => setState((prev) => ({ ...prev, timeframe })),
    setCluster: (cluster) => setState((prev) => ({ ...prev, cluster })),
    escalateDispatch: (id) =>
      setState((prev) => ({
        ...prev,
        dispatches: prev.dispatches.map((d) =>
          d.id === id ? { ...d, status: 'EN_ROUTE', etaMins: Math.max(5, d.etaMins - 4) } : d,
        ),
        auditLog: appendAudit(prev, 'DISPATCH', `Priority escalated dispatch ${id} — ETA reduced by 4 mins`),
      })),
    reassignDispatch: (id, newTech) =>
      setState((prev) => ({
        ...prev,
        dispatches: prev.dispatches.map((d) =>
          d.id === id ? { ...d, technician: newTech, status: 'EN_ROUTE', etaMins: 8 } : d,
        ),
        auditLog: appendAudit(prev, 'DISPATCH', `Reassigned ${id} to specialist ${newTech}`),
      })),
    resolveDispatch: (id) =>
      setState((prev) => ({
        ...prev,
        dispatches: prev.dispatches.map((d) => (d.id === id ? { ...d, status: 'COMPLETED' } : d)),
        auditLog: appendAudit(prev, 'DISPATCH', `Marked dispatch ${id} resolved & closed`),
      })),
    approveKycDoc: (docId) =>
      setState((prev) => {
        const doc = prev.kycQueue.find((d) => d.id === docId);
        return {
          ...prev,
          kycQueue: prev.kycQueue.filter((d) => d.id !== docId),
          auditLog: appendAudit(
            prev,
            'KYC',
            `Approved KYC document #${docId}${doc ? ` (${doc.docType} for Tech #${doc.technicianId})` : ''}`,
          ),
        };
      }),
    rejectKycDoc: (docId, reason) =>
      setState((prev) => ({
        ...prev,
        kycQueue: prev.kycQueue.filter((d) => d.id !== docId),
        auditLog: appendAudit(prev, 'KYC', `Rejected KYC document #${docId}: "${reason}"`),
      })),
    updateTechnicianTier: (id, level) =>
      setState((prev) => {
        const tech = prev.technicians.find((t) => t.id === id);
        return {
          ...prev,
          technicians: prev.technicians.map((t) => (t.id === id ? { ...t, level, status: 'VERIFIED' } : t)),
          auditLog: appendAudit(prev, 'ROSTER', `Updated ${tech?.name ?? `#${id}`} to Level ${level}`),
        };
      }),
    toggleFatigueLock: (id) =>
      setState((prev) => {
        const tech = prev.technicians.find((t) => t.id === id);
        const nextLock = !(tech?.fatigueLocked ?? false);
        return {
          ...prev,
          technicians: prev.technicians.map((t) =>
            t.id === id ? { ...t, fatigueLocked: nextLock, shiftHours: nextLock ? 12.0 : 0.0 } : t,
          ),
          auditLog: appendAudit(
            prev,
            'ROSTER',
            `${nextLock ? 'Applied 8h fatigue rest lock to' : 'Cleared fatigue lock for'} ${tech?.name ?? `#${id}`}`,
          ),
        };
      }),
    setTechnicianStatus: (id, status) =>
      setState((prev) => {
        const tech = prev.technicians.find((t) => t.id === id);
        return {
          ...prev,
          technicians: prev.technicians.map((t) => (t.id === id ? { ...t, status } : t)),
          auditLog: appendAudit(prev, 'ROSTER', `Changed status of ${tech?.name ?? `#${id}`} to ${status}`),
        };
      }),
    releasePayout: (id) =>
      setState((prev) => {
        const payout = prev.payouts.find((p) => p.id === id);
        return {
          ...prev,
          payouts: prev.payouts.map((p) => (p.id === id ? { ...p, status: 'RELEASED' } : p)),
          auditLog: appendAudit(
            prev,
            'FINANCE',
            `Released escrow payout ${id}${payout ? ` (₹${payout.netPayoutInr.toLocaleString('en-IN')} to ${payout.technician})` : ''}`,
          ),
        };
      }),
    updateSettings: (patch) =>
      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
        auditLog: appendAudit(prev, 'POLICY', `Updated platform operational thresholds`),
      })),
  };

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used inside AdminStoreProvider');
  return ctx;
}
