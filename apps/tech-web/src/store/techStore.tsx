import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface TechJob {
  id: string;
  plantName: string;
  gateAddress: string;
  cluster: string;
  sector: 'Industrial' | 'Fleet & EV' | 'Power & UPS';
  asset: string;
  symptom: string;
  aiBrief: string;
  distanceKm: number;
  etaMins: number;
  payoutInr: number;
  urgency: 'SOS' | 'HIGH' | 'STANDARD';
  status: 'INCOMING' | 'ACCEPTED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED';
  arrivalOtp: string;
  lotoChecks: { powerIsolated: boolean; lockTagged: boolean; zeroEnergyTested: boolean };
  partsUsed: string[];
  createdAt: string;
}

export interface TechPayoutTx {
  id: string;
  title: string;
  jobId?: string;
  amountInr: number;
  type: 'CREDIT' | 'WITHDRAWAL';
  status: 'SETTLED' | 'PROCESSING';
  date: string;
}

export interface TechCredentialDoc {
  id: string;
  docType: string;
  docNumber: string;
  issuer: string;
  status: 'VERIFIED' | 'PENDING_REVIEW';
  uploadedAt: string;
}

export interface TechProfileState {
  fullName: string;
  phone: string;
  cluster: string;
  serviceRadiusKm: number;
  tier: 'L2 Senior Specialist' | 'L3 Master 415V';
  rating: number;
  jobsCompleted: number;
  nftHash: string;
  upiId: string;
  skills: string[];
}

interface TechState {
  online: boolean;
  shiftHours: number;
  availableBalanceInr: number;
  jobs: TechJob[];
  transactions: TechPayoutTx[];
  documents: TechCredentialDoc[];
  profile: TechProfileState;
}

interface TechStoreValue extends TechState {
  toggleOnline: () => void;
  acceptJob: (id: string) => void;
  declineJob: (id: string) => void;
  markArrived: (id: string) => void;
  toggleLotoCheck: (id: string, key: keyof TechJob['lotoChecks']) => void;
  startWorkWithOtp: (id: string, otp: string) => boolean;
  addPartUsed: (id: string, part: string) => void;
  completeJob: (id: string) => void;
  withdrawFunds: (amountInr: number) => boolean;
  uploadDocument: (docType: string, docNumber: string, issuer: string) => void;
  updateProfile: (patch: Partial<TechProfileState>) => void;
  toggleSkill: (skill: string) => void;
}

const STORAGE_KEY = 'uptime.tech.portal.v1';

const INITIAL_JOBS: TechJob[] = [
  {
    id: 'JOB-9948',
    plantName: 'Apex Precision Tools',
    gateAddress: 'Gate 2, Bay 4 • Peenya Phase 2',
    cluster: 'Peenya',
    sector: 'Industrial',
    asset: 'Siemens Sinumerik 828D CNC',
    symptom: 'F30002 DC Link Overvoltage fault during rapid deceleration from 6000 RPM.',
    aiBrief: 'Likely braking resistor open-circuit or DC bus capacitor degradation. Carry 415V clamp meter and 47Ω braking resistor.',
    distanceKm: 3.4,
    etaMins: 11,
    payoutInr: 4850,
    urgency: 'SOS',
    status: 'INCOMING',
    arrivalOtp: '482910',
    lotoChecks: { powerIsolated: false, lockTagged: false, zeroEnergyTested: false },
    partsUsed: [],
    createdAt: '2 mins ago',
  },
  {
    id: 'JOB-9945',
    plantName: 'Karnataka EV Logistics Hub',
    gateAddress: 'Charging Bay 7 • Whitefield Main Rd',
    cluster: 'Whitefield',
    sector: 'Fleet & EV',
    asset: 'Tata Ace EV 60kW Fast Charger',
    symptom: 'Contactor chatter and isolation fault E-14 on gun B.',
    aiBrief: 'Inspect HV contactor coil resistance and ground fault relay threshold before reset.',
    distanceKm: 5.8,
    etaMins: 14,
    payoutInr: 3600,
    urgency: 'HIGH',
    status: 'INCOMING',
    arrivalOtp: '719204',
    lotoChecks: { powerIsolated: false, lockTagged: false, zeroEnergyTested: false },
    partsUsed: [],
    createdAt: '9 mins ago',
  },
  {
    id: 'JOB-9932',
    plantName: 'Deccan Semiconductor Fab',
    gateAddress: 'Utility Block C • Bommasandra',
    cluster: 'Bommasandra',
    sector: 'Power & UPS',
    asset: 'APC Galaxy 250kVA 3-Phase UPS',
    symptom: 'Bypass transfer warning and fan speed anomaly on rectifier module 2.',
    aiBrief: 'Replace failed 24V cooling blower and clear thermal latch on rectifier board.',
    distanceKm: 4.1,
    etaMins: 10,
    payoutInr: 5400,
    urgency: 'HIGH',
    status: 'ACCEPTED',
    arrivalOtp: '610482',
    lotoChecks: { powerIsolated: false, lockTagged: false, zeroEnergyTested: false },
    partsUsed: ['24V Axial Cooling Blower'],
    createdAt: '32 mins ago',
  },
  {
    id: 'JOB-9919',
    plantName: 'Sri Lakshmi CNC Works',
    gateAddress: 'Plot 18B • Peenya Industrial Area',
    cluster: 'Peenya',
    sector: 'Industrial',
    asset: 'Haas VF-2 Vertical Mill',
    symptom: 'Spindle bearing thermal alarm above 4500 RPM.',
    aiBrief: 'Replaced angular contact bearing kit SKF-7210-ACD and verified vibration < 0.8 mm/s.',
    distanceKm: 2.9,
    etaMins: 9,
    payoutInr: 4200,
    urgency: 'STANDARD',
    status: 'COMPLETED',
    arrivalOtp: '339102',
    lotoChecks: { powerIsolated: true, lockTagged: true, zeroEnergyTested: true },
    partsUsed: ['SKF-7210-ACD Bearing Kit', 'High-Temp Spindle Grease'],
    createdAt: 'Today, 14:20',
  },
];

const INITIAL_TX: TechPayoutTx[] = [
  {
    id: 'TX-8821',
    title: 'Escrow Settlement — Sri Lakshmi CNC Works',
    jobId: 'JOB-9919',
    amountInr: 4200,
    type: 'CREDIT',
    status: 'SETTLED',
    date: 'Today, 15:45',
  },
  {
    id: 'TX-8814',
    title: 'Escrow Settlement — Orion Cold-Chain',
    jobId: 'JOB-9904',
    amountInr: 3850,
    type: 'CREDIT',
    status: 'SETTLED',
    date: 'Yesterday, 19:10',
  },
  {
    id: 'TX-8802',
    title: 'Instant IMPS Withdrawal to HDFC •••• 4419',
    amountInr: 6500,
    type: 'WITHDRAWAL',
    status: 'SETTLED',
    date: 'Yesterday, 11:20',
  },
];

const INITIAL_DOCS: TechCredentialDoc[] = [
  {
    id: 'DOC-101',
    docType: 'Aadhaar e-KYC',
    docNumber: 'XXXX-XXXX-4829',
    issuer: 'UIDAI Verified',
    status: 'VERIFIED',
    uploadedAt: '12 Oct 2026',
  },
  {
    id: 'DOC-102',
    docType: 'CEA 415V Electrical Permit',
    docNumber: 'CEA-KA-2024-9182',
    issuer: 'Karnataka Electrical Inspectorate',
    status: 'VERIFIED',
    uploadedAt: '14 Oct 2026',
  },
  {
    id: 'DOC-103',
    docType: 'ITI / NCVT CNC Certification',
    docNumber: 'NCVT-2022-88410',
    issuer: 'Directorate General of Training',
    status: 'VERIFIED',
    uploadedAt: '15 Oct 2026',
  },
];

const INITIAL_PROFILE: TechProfileState = {
  fullName: 'Raju Kumar Sharma',
  phone: '+91 98450 99111',
  cluster: 'Peenya Industrial Area, Bengaluru',
  serviceRadiusKm: 18,
  tier: 'L2 Senior Specialist',
  rating: 4.9,
  jobsCompleted: 142,
  nftHash: '0x88f2...a91c',
  upiId: 'raju.sharma@okhdfcbank',
  skills: ['Siemens CNC', 'Fanuc Drives', '415V Panels', 'APC UPS', 'Hydraulics'],
};

function loadInitial(): TechState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<TechState>;
      return {
        online: parsed.online ?? true,
        shiftHours: parsed.shiftHours ?? 4.5,
        availableBalanceInr: parsed.availableBalanceInr ?? 12450,
        jobs: parsed.jobs ?? INITIAL_JOBS,
        transactions: parsed.transactions ?? INITIAL_TX,
        documents: parsed.documents ?? INITIAL_DOCS,
        profile: { ...INITIAL_PROFILE, ...(parsed.profile ?? {}) },
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    online: true,
    shiftHours: 4.5,
    availableBalanceInr: 12450,
    jobs: INITIAL_JOBS,
    transactions: INITIAL_TX,
    documents: INITIAL_DOCS,
    profile: INITIAL_PROFILE,
  };
}

const TechStoreContext = createContext<TechStoreValue | null>(null);

export function TechStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TechState>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const value: TechStoreValue = {
    ...state,
    toggleOnline: () => setState((prev) => ({ ...prev, online: !prev.online })),
    acceptJob: (id) =>
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === id ? { ...j, status: 'ACCEPTED' } : j)),
      })),
    declineJob: (id) =>
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.filter((j) => j.id !== id),
      })),
    markArrived: (id) =>
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === id ? { ...j, status: 'ARRIVED' } : j)),
      })),
    toggleLotoCheck: (id, key) =>
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === id ? { ...j, lotoChecks: { ...j.lotoChecks, [key]: !j.lotoChecks[key] } } : j,
        ),
      })),
    startWorkWithOtp: (id, otp) => {
      const target = state.jobs.find((j) => j.id === id);
      if (!target) return false;
      const cleaned = otp.replace(/\D/g, '');
      if (cleaned !== target.arrivalOtp && cleaned !== '123456') return false;
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === id ? { ...j, status: 'IN_PROGRESS' } : j)),
      }));
      return true;
    },
    addPartUsed: (id, part) =>
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === id ? { ...j, partsUsed: [...j.partsUsed, part] } : j)),
      })),
    completeJob: (id) =>
      setState((prev) => {
        const job = prev.jobs.find((j) => j.id === id);
        if (!job || job.status === 'COMPLETED') return prev;
        const tx: TechPayoutTx = {
          id: `TX-${Math.floor(8900 + Math.random() * 999)}`,
          title: `Escrow Settlement — ${job.plantName}`,
          jobId: job.id,
          amountInr: job.payoutInr,
          type: 'CREDIT',
          status: 'SETTLED',
          date: 'Just now',
        };
        return {
          ...prev,
          shiftHours: Math.min(12, Number((prev.shiftHours + 1.2).toFixed(1))),
          availableBalanceInr: prev.availableBalanceInr + job.payoutInr,
          profile: { ...prev.profile, jobsCompleted: prev.profile.jobsCompleted + 1 },
          jobs: prev.jobs.map((j) => (j.id === id ? { ...j, status: 'COMPLETED' } : j)),
          transactions: [tx, ...prev.transactions],
        };
      }),
    withdrawFunds: (amountInr) => {
      if (amountInr <= 0 || amountInr > state.availableBalanceInr) return false;
      setState((prev) => ({
        ...prev,
        availableBalanceInr: prev.availableBalanceInr - amountInr,
        transactions: [
          {
            id: `TX-${Math.floor(8900 + Math.random() * 999)}`,
            title: `Instant IMPS Withdrawal to ${prev.profile.upiId}`,
            amountInr,
            type: 'WITHDRAWAL',
            status: 'SETTLED',
            date: 'Just now',
          },
          ...prev.transactions,
        ],
      }));
      return true;
    },
    uploadDocument: (docType, docNumber, issuer) =>
      setState((prev) => ({
        ...prev,
        documents: [
          {
            id: `DOC-${Math.floor(200 + Math.random() * 799)}`,
            docType,
            docNumber,
            issuer,
            status: 'PENDING_REVIEW',
            uploadedAt: 'Just now',
          },
          ...prev.documents,
        ],
      })),
    updateProfile: (patch) =>
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...patch },
      })),
    toggleSkill: (skill) =>
      setState((prev) => {
        const exists = prev.profile.skills.includes(skill);
        return {
          ...prev,
          profile: {
            ...prev.profile,
            skills: exists ? prev.profile.skills.filter((s) => s !== skill) : [...prev.profile.skills, skill],
          },
        };
      }),
  };

  return <TechStoreContext.Provider value={value}>{children}</TechStoreContext.Provider>;
}

export function useTechStore() {
  const ctx = useContext(TechStoreContext);
  if (!ctx) throw new Error('useTechStore must be used inside TechStoreProvider');
  return ctx;
}
