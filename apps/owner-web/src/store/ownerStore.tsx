import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  CART_COOKIE,
  getCookie,
  LANG_COOKIE,
  PLANT_COOKIE,
  readCookieConsent,
  saveCookieConsent,
  SECTOR_COOKIE,
  setFunctionalCookie,
  type CookieConsent,
} from '../lib/cookies';

export type SectorKind = 'INDUSTRIAL' | 'AUTOMOTIVE' | 'ELECTRONICS';

export interface PlantFacility {
  id: string;
  name: string;
  city: string;
  address: string;
  sector: SectorKind;
  assetSummary: string;
}

export interface ManagedAsset {
  id: string;
  category: 'MACHINE' | 'VEHICLE' | 'DEVICE';
  name: string;
  oem: string;
  model: string;
  serial: string;
  location: string;
  healthScore: number;
  status: 'NOMINAL' | 'WARNING' | 'IN_REPAIR';
  specs: string;
  lastService: string;
  acousticDb?: number;
  rulHours?: number;
}

export interface SparePart {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Bearings' | 'Electrical' | 'Fleet & DEF' | 'Drives & VFD' | 'Power & UPS';
  grade: 'OEM Genuine' | 'Refurbished A+';
  price: number;
  stock: number;
  eta: string;
  compatibleWith: string[];
  summary: string;
}

export interface CartItem {
  partId: string;
  qty: number;
}

export interface PartOrder {
  id: string;
  createdAt: string;
  poNumber: string;
  gate: string;
  deliverySpeed: 'EXPRESS_60M' | 'SCHEDULED';
  paymentMethod: 'WALLET' | 'ESCROW_UPI';
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'DISPATCHED' | 'DELIVERED';
}

export interface LocalJobRecord {
  id: number;
  jobNumber: string;
  industry: SectorKind;
  equipmentSummary: string;
  problemDescription: string;
  urgency: string;
  status: string;
  ownerAddress: string;
  ownerCity: string;
  createdAt: string;
  arrivalOtp: string;
  technicianName: string;
  technicianTier: string;
  technicianRating: number;
  etaMinutes: number;
  laborCharge: number;
  partsCharge: number;
  gstAmount: number;
  totalAmount: number;
  paid: boolean;
  ratedStars: number;
  workDoneSummary?: string;
}

export interface WarrantyClaim {
  id: string;
  jobNumber: string;
  assetName: string;
  symptom: string;
  createdAt: string;
  status: 'REVISIT_SCHEDULED' | 'UNDER_REVIEW';
}

export interface WalletTxn {
  id: string;
  date: string;
  title: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  ref: string;
}

export interface AppNotification {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface PlantProfile {
  companyName: string;
  gstin: string;
  udyamNumber: string;
  coordinatorName: string;
  emergencyPhone: string;
  email: string;
  smsAlerts: boolean;
  whatsappAlerts: boolean;
  emailAlerts: boolean;
}

export const PLANTS: PlantFacility[] = [
  {
    id: 'peenya-1',
    name: 'Apex Tools • Peenya Plant #1 (HQ)',
    city: 'Bengaluru',
    address: 'Plot 42, Peenya Industrial Estate, Phase 2',
    sector: 'INDUSTRIAL',
    assetSummary: '28 CNC & Lathes',
  },
  {
    id: 'whitefield-hub',
    name: 'Karnataka Logistics • Whitefield Hub',
    city: 'Bengaluru',
    address: 'EPIP Logistics Park, Whitefield Main Rd',
    sector: 'AUTOMOTIVE',
    assetSummary: '54 Fleet Vehicles',
  },
  {
    id: 'ecity-farm',
    name: 'Vidyut Cleanroom • E-City Facility',
    city: 'Bengaluru',
    address: 'Phase 1, Electronics City Hosur Rd',
    sector: 'ELECTRONICS',
    assetSummary: '14 UPS & SMT Units',
  },
];

export const SPARE_PARTS_CATALOG: SparePart[] = [
  {
    id: 'sp-skf-7210',
    sku: 'SKF-7210-ACD',
    name: 'Angular Contact Spindle Bearing (7210 ACD/P4A)',
    brand: 'SKF Precision',
    category: 'Bearings',
    grade: 'OEM Genuine',
    price: 4850,
    stock: 18,
    eta: '45 min from Peenya Depot',
    compatibleWith: ['Siemens Sinumerik 828D', 'Haas VF-2 Vertical Mill', 'Mazak Quick Turn 250'],
    summary: 'Super-precision 25° contact angle bearing engineered for 12,000 RPM CNC main spindles with QR hologram verification.',
  },
  {
    id: 'sp-sie-3rt',
    sku: 'SIE-3RT2026-1AP00',
    name: 'SIRIUS 415V 3-Phase Power Contactor (25A AC-3)',
    brand: 'Siemens',
    category: 'Electrical',
    grade: 'OEM Genuine',
    price: 2390,
    stock: 34,
    eta: '40 min from Peenya Depot',
    compatibleWith: ['Siemens Sinumerik 828D', 'L&T 200T Hydraulic Press', 'Kirloskar 250kVA Transformer'],
    summary: 'Heavy-duty 3-pole industrial relay contactor for 415V motor starters and CNC breaker protection.',
  },
  {
    id: 'sp-bosch-def',
    sku: 'BOS-0444021024',
    name: 'BS-VI AdBlue DEF Dosing Injector Module',
    brand: 'Bosch Mobility',
    category: 'Fleet & DEF',
    grade: 'OEM Genuine',
    price: 6200,
    stock: 11,
    eta: '55 min from Whitefield Hub',
    compatibleWith: ['Tata Prima 5530.S BS-VI', 'BharatBenz 1923C Rigid'],
    summary: 'Factory-calibrated SCR urea dosing nozzle with high-temp Viton seals for commercial BS-VI diesel trucks.',
  },
  {
    id: 'sp-abb-vfd',
    sku: 'ABB-ACS580-11KW',
    name: 'ACS580 11kW 415V Variable Frequency Drive',
    brand: 'ABB Drives',
    category: 'Drives & VFD',
    grade: 'OEM Genuine',
    price: 28900,
    stock: 5,
    eta: '60 min from Bommasandra Depot',
    compatibleWith: ['Haas VF-2 Vertical Mill', 'L&T 200T Hydraulic Press'],
    summary: 'All-compatible 3-phase vector control drive with integrated harmonic choke and safe torque off (STO).',
  },
  {
    id: 'sp-epcos-cap',
    sku: 'EPC-B25667-25KVAR',
    name: 'PhaseCap 440V 25kVAR Power Factor Capacitor',
    brand: 'TDK EPCOS',
    category: 'Power & UPS',
    grade: 'OEM Genuine',
    price: 3650,
    stock: 22,
    eta: '50 min from E-City Depot',
    compatibleWith: ['APC Symmetra PX 40kVA UPS', 'Kirloskar 250kVA Transformer'],
    summary: 'Self-healing dry-type MKP capacitor with overpressure disconnector for cleanroom power panels.',
  },
  {
    id: 'sp-gates-belt',
    sku: 'GAT-PCGT-14M',
    name: 'PolyChain GT Carbon Spindle Timing Belt',
    brand: 'Gates Industrial',
    category: 'Bearings',
    grade: 'Refurbished A+',
    price: 1950,
    stock: 29,
    eta: '45 min from Peenya Depot',
    compatibleWith: ['Mazak Quick Turn 250', 'Haas VF-2 Vertical Mill'],
    summary: 'High-torque polyurethane belt with carbon tensile cords rated for zero-slip CNC spindle transmission.',
  },
];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
] as const;

const INITIAL_ASSETS: ManagedAsset[] = [
  {
    id: 'M-101',
    category: 'MACHINE',
    name: 'Siemens Sinumerik 828D CNC',
    oem: 'Siemens',
    model: '828D V4.9 • 5-Axis',
    serial: 'SIE-828D-99412',
    location: 'Peenya Plant #1 • Bay 2',
    healthScore: 76,
    status: 'IN_REPAIR',
    specs: '415V 3-Phase • 12,000 RPM Spindle • 18.5 kW',
    lastService: '12 Nov 2026',
    acousticDb: 84.2,
    rulHours: 18,
  },
  {
    id: 'M-102',
    category: 'MACHINE',
    name: 'Haas VF-2 Vertical Mill',
    oem: 'Haas Automation',
    model: 'VF-2SS Super-Speed',
    serial: 'HAS-VF2-44021',
    location: 'Peenya Plant #1 • Bay 4',
    healthScore: 84,
    status: 'WARNING',
    specs: '415V 3-Phase • 12,000 RPM • 22.4 kW Vector Drive',
    lastService: '02 Nov 2026',
    acousticDb: 74.6,
    rulHours: 64,
  },
  {
    id: 'M-103',
    category: 'MACHINE',
    name: 'Mazak Quick Turn 250 Lathe',
    oem: 'Yamazaki Mazak',
    model: 'QT-250MSY',
    serial: 'MZK-250-77102',
    location: 'Peenya Plant #1 • Bay 1',
    healthScore: 96,
    status: 'NOMINAL',
    specs: '415V 3-Phase • 4,000 RPM Turning Center',
    lastService: '18 Nov 2026',
    acousticDb: 61.0,
    rulHours: 840,
  },
  {
    id: 'V-304',
    category: 'VEHICLE',
    name: 'Tata Prima 5530.S BS-VI',
    oem: 'Tata Motors',
    model: 'Prima 5530.S Tractor',
    serial: 'MAT448210K8N09122',
    location: 'Whitefield Hub • Lane 3',
    healthScore: 93,
    status: 'NOMINAL',
    specs: 'Cummins ISBe 6.7L • 0 Active OBD-II DTCs • DEF 78%',
    lastService: '15 Nov 2026',
    acousticDb: 68.4,
    rulHours: 510,
  },
  {
    id: 'V-308',
    category: 'VEHICLE',
    name: 'Ashok Leyland Dost EV',
    oem: 'Switch Mobility',
    model: 'IeV4 Cargo Van',
    serial: 'MB1AA22E8PR00419',
    location: 'Whitefield Hub • Bay EV-2',
    healthScore: 98,
    status: 'NOMINAL',
    specs: 'LiFePO4 32.2 kWh • SoC 88% • Thermal Nominal',
    lastService: '19 Nov 2026',
    acousticDb: 52.1,
    rulHours: 1120,
  },
  {
    id: 'D-502',
    category: 'DEVICE',
    name: 'APC Symmetra PX 40kVA UPS',
    oem: 'Schneider Electric',
    model: 'Symmetra PX 40kW',
    serial: 'APC-PX40-66219',
    location: 'E-City Facility • Server Room A',
    healthScore: 99,
    status: 'NOMINAL',
    specs: '415V In / 230V Out • THD 1.8% • 42 min Backup',
    lastService: '10 Nov 2026',
    acousticDb: 54.0,
    rulHours: 1450,
  },
];

const INITIAL_JOBS: LocalJobRecord[] = [
  {
    id: 9821,
    jobNumber: 'JOB-9821',
    industry: 'INDUSTRIAL',
    equipmentSummary: 'Siemens Sinumerik 828D CNC Spindle',
    problemDescription: 'High-frequency 84.2 dB vibration on main spindle above 4,000 RPM with 415V drive overcurrent alarm.',
    urgency: 'CRITICAL',
    status: 'EN_ROUTE',
    ownerAddress: 'Plot 42, Peenya Industrial Estate, Phase 2, Bay 2',
    ownerCity: 'Bengaluru',
    createdAt: '2026-11-22T09:15:00Z',
    arrivalOtp: '884192',
    technicianName: 'Ramesh K. Vishwakarma',
    technicianTier: 'L2 Senior Specialist',
    technicianRating: 4.88,
    etaMinutes: 8,
    laborCharge: 3500,
    partsCharge: 4850,
    gstAmount: 1503,
    totalAmount: 9853,
    paid: false,
    ratedStars: 0,
  },
  {
    id: 9794,
    jobNumber: 'JOB-9794',
    industry: 'AUTOMOTIVE',
    equipmentSummary: 'Tata Prima 5530.S BS-VI DEF Injector',
    problemDescription: 'OBD-II DTC P20EE SCR NOx efficiency fault and limp-mode torque derate on NH-48.',
    urgency: 'HIGH',
    status: 'COMPLETED',
    ownerAddress: 'EPIP Logistics Park, Whitefield',
    ownerCity: 'Bengaluru',
    createdAt: '2026-11-18T14:40:00Z',
    arrivalOtp: '519044',
    technicianName: 'Syed Mahmood',
    technicianTier: 'L3 Master Specialist',
    technicianRating: 4.96,
    etaMinutes: 0,
    laborCharge: 1800,
    partsCharge: 3700,
    gstAmount: 990,
    totalAmount: 6490,
    paid: true,
    ratedStars: 5,
    workDoneSummary: 'Replaced Bosch BS-VI DEF injector module, flushed dosing line, cleared DTCs and verified road load.',
  },
  {
    id: 9752,
    jobNumber: 'JOB-9752',
    industry: 'ELECTRONICS',
    equipmentSummary: 'APC Symmetra PX 40kVA UPS Capacitor Bank',
    problemDescription: 'Elevated ripple voltage on Phase-B DC bus and preventative capacitor bank replacement.',
    urgency: 'NORMAL',
    status: 'COMPLETED',
    ownerAddress: 'Phase 1, Electronics City',
    ownerCity: 'Bengaluru',
    createdAt: '2026-11-11T11:20:00Z',
    arrivalOtp: '302811',
    technicianName: 'Anil Hegde',
    technicianTier: 'L2 Power Electronics',
    technicianRating: 4.91,
    etaMinutes: 0,
    laborCharge: 4200,
    partsCharge: 7830,
    gstAmount: 2165,
    totalAmount: 14195,
    paid: true,
    ratedStars: 5,
    workDoneSummary: 'Installed new EPCOS 440V capacitor bank, verified 1.8% THD under 80% load bank test.',
  },
];

const INITIAL_TXNS: WalletTxn[] = [
  { id: 'TXN-901', date: '20 Nov 2026', title: 'Corporate Auto-Refill via NEFT', type: 'CREDIT', amount: 50000, ref: 'UTR994812031' },
  { id: 'TXN-902', date: '18 Nov 2026', title: 'Escrow Settlement — JOB-9794 (Tata Prima)', type: 'DEBIT', amount: 6490, ref: 'ESC-9794' },
  { id: 'TXN-903', date: '15 Nov 2026', title: 'UPTIME Pro Pass Monthly Subscription', type: 'DEBIT', amount: 999, ref: 'PRO-202611' },
];

const INITIAL_NOTIFS: AppNotification[] = [
  {
    id: 'N-1',
    severity: 'CRITICAL',
    title: 'Specialist En-Route for JOB-9821',
    body: 'Ramesh K. (L2 Senior) is 1.1 km from Peenya Plant #1 (ETA 8 mins). Share Arrival OTP only at plant gate.',
    createdAt: '5 mins ago',
    read: false,
    link: '/jobs/9821',
  },
  {
    id: 'N-2',
    severity: 'WARNING',
    title: 'Acoustic FFT Drift on Haas VF-2 Mill',
    body: 'Digital Twin detected 74.6 dB bearing harmonic increase. Estimated remaining useful life: 64 operating hours.',
    createdAt: '1 hour ago',
    read: false,
    link: '/digital-twin',
  },
  {
    id: 'N-3',
    severity: 'INFO',
    title: '18% GST ITC Invoice Ready for JOB-9794',
    body: 'Tax invoice #INV-2026-9794 (₹6,490 incl. CGST/SGST) is ready for your accounting ledger.',
    createdAt: '2 days ago',
    read: true,
    link: '/jobs/9794',
  },
];

const INITIAL_PROFILE: PlantProfile = {
  companyName: 'Apex Precision Tools Pvt Ltd',
  gstin: '29AAACA1234A1Z5',
  udyamNumber: 'UDYAM-KR-03-0184921',
  coordinatorName: 'Pavan B C',
  emergencyPhone: '+91 98450 88210',
  email: 'ops@apextools.in',
  smsAlerts: true,
  whatsappAlerts: true,
  emailAlerts: true,
};

interface PersistedState {
  assets: ManagedAsset[];
  localJobs: LocalJobRecord[];
  cart: CartItem[];
  orders: PartOrder[];
  claims: WarrantyClaim[];
  amcPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  walletBalance: number;
  autoRefill: boolean;
  proPassActive: boolean;
  txns: WalletTxn[];
  notifications: AppNotification[];
  profile: PlantProfile;
}

const STORAGE_KEY = 'uptime_owner_web_state_v1';

function loadPersisted(): PersistedState {
  const defaults: PersistedState = {
    assets: INITIAL_ASSETS,
    localJobs: INITIAL_JOBS,
    cart: [],
    orders: [],
    claims: [],
    amcPlan: 'PRO',
    walletBalance: 48500,
    autoRefill: true,
    proPassActive: true,
    txns: INITIAL_TXNS,
    notifications: INITIAL_NOTIFS,
    profile: INITIAL_PROFILE,
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<PersistedState>) };
  } catch {
    return defaults;
  }
}

interface OwnerStoreValue extends PersistedState {
  activePlant: PlantFacility;
  setActivePlantId: (id: string) => void;
  activeSector: SectorKind;
  setActiveSector: (s: SectorKind) => void;
  language: string;
  setLanguage: (lang: string) => void;
  cookieConsent: CookieConsent | null;
  cookieModalOpen: boolean;
  setCookieModalOpen: (open: boolean) => void;
  updateCookieConsent: (c: { functional: boolean; analytics: boolean }) => void;
  // Actions
  addAsset: (asset: Omit<ManagedAsset, 'id'>) => ManagedAsset;
  addLocalJob: (input: {
    industry: SectorKind;
    equipmentSummary: string;
    problemDescription: string;
    urgency: string;
    ownerAddress: string;
    ownerCity: string;
    estimatedMin?: number;
    estimatedMax?: number;
    technicianName?: string;
  }) => LocalJobRecord;
  advanceLocalJobStatus: (jobId: number, status: string) => void;
  payLocalJob: (jobId: number, useWallet: boolean) => void;
  rateLocalJob: (jobId: number, stars: number) => void;
  addToCart: (partId: string) => void;
  updateCartQty: (partId: string, qty: number) => void;
  removeFromCart: (partId: string) => void;
  placeOrder: (opts: { poNumber: string; gate: string; deliverySpeed: 'EXPRESS_60M' | 'SCHEDULED'; paymentMethod: 'WALLET' | 'ESCROW_UPI' }) => PartOrder | null;
  fileWarrantyClaim: (input: { jobNumber: string; assetName: string; symptom: string }) => WarrantyClaim;
  setAmcPlan: (plan: 'BASIC' | 'PRO' | 'ENTERPRISE') => void;
  addWalletFunds: (amount: number) => void;
  toggleAutoRefill: () => void;
  toggleProPass: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (patch: Partial<PlantProfile>) => void;
  cartCount: number;
  unreadNotifications: number;
}

const OwnerStoreContext = createContext<OwnerStoreValue | null>(null);

export function OwnerStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadPersisted());
  const [cookieConsent, setCookieConsent] = useState<CookieConsent | null>(() => readCookieConsent());
  const [cookieModalOpen, setCookieModalOpen] = useState(false);

  const [plantId, setPlantId] = useState<string>(() => getCookie(PLANT_COOKIE) ?? PLANTS[0].id);
  const [activeSector, setSectorState] = useState<SectorKind>(() => {
    const saved = getCookie(SECTOR_COOKIE);
    if (saved === 'INDUSTRIAL' || saved === 'AUTOMOTIVE' || saved === 'ELECTRONICS') return saved;
    return 'INDUSTRIAL';
  });
  const [language, setLangState] = useState<string>(() => getCookie(LANG_COOKIE) ?? 'en');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors.
    }
  }, [state]);

  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const unreadNotifications = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setFunctionalCookie(CART_COOKIE, String(cartCount), 30);
  }, [cartCount, cookieConsent]);

  const activePlant = PLANTS.find((p) => p.id === plantId) ?? PLANTS[0];

  function setActivePlantId(id: string) {
    setPlantId(id);
    setFunctionalCookie(PLANT_COOKIE, id, 90);
  }

  function setActiveSector(s: SectorKind) {
    setSectorState(s);
    setFunctionalCookie(SECTOR_COOKIE, s, 90);
  }

  function setLanguage(lang: string) {
    setLangState(lang);
    setFunctionalCookie(LANG_COOKIE, lang, 180);
  }

  function updateCookieConsent(c: { functional: boolean; analytics: boolean }) {
    const saved = saveCookieConsent(c);
    setCookieConsent(saved);
    if (saved.functional) {
      setFunctionalCookie(PLANT_COOKIE, plantId, 90);
      setFunctionalCookie(SECTOR_COOKIE, activeSector, 90);
      setFunctionalCookie(LANG_COOKIE, language, 180);
      setFunctionalCookie(CART_COOKIE, String(cartCount), 30);
    }
  }

  function pushNotif(n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
    const entry: AppNotification = {
      ...n,
      id: `N-${Date.now()}`,
      createdAt: 'Just now',
      read: false,
    };
    setState((prev) => ({ ...prev, notifications: [entry, ...prev.notifications] }));
  }

  function addAsset(asset: Omit<ManagedAsset, 'id'>): ManagedAsset {
    const prefix = asset.category === 'MACHINE' ? 'M' : asset.category === 'VEHICLE' ? 'V' : 'D';
    const created: ManagedAsset = { ...asset, id: `${prefix}-${Math.floor(200 + Math.random() * 700)}` };
    setState((prev) => ({ ...prev, assets: [created, ...prev.assets] }));
    pushNotif({
      severity: 'INFO',
      title: `Asset Registered: ${created.name}`,
      body: `${created.oem} ${created.model} added to ${created.location} with QR asset tag ${created.id}.`,
      link: '/assets',
    });
    return created;
  }

  function addLocalJob(input: {
    industry: SectorKind;
    equipmentSummary: string;
    problemDescription: string;
    urgency: string;
    ownerAddress: string;
    ownerCity: string;
    estimatedMin?: number;
    estimatedMax?: number;
    technicianName?: string;
  }): LocalJobRecord {
    const id = Math.floor(9850 + Math.random() * 140);
    const otp = String(Math.floor(100000 + Math.random() * 899999));
    const estBase = input.estimatedMin && input.estimatedMax ? Math.round((input.estimatedMin + input.estimatedMax) / 2) : 6500;
    const labor = Math.round(estBase * 0.45);
    const parts = Math.round(estBase * 0.55);
    const gst = Math.round((labor + parts) * 0.18);
    const created: LocalJobRecord = {
      id,
      jobNumber: `JOB-${id}`,
      industry: input.industry,
      equipmentSummary: input.equipmentSummary,
      problemDescription: input.problemDescription,
      urgency: input.urgency,
      status: 'EN_ROUTE',
      ownerAddress: input.ownerAddress || activePlant.address,
      ownerCity: input.ownerCity || activePlant.city,
      createdAt: new Date().toISOString(),
      arrivalOtp: otp,
      technicianName: input.technicianName ?? 'Ramesh K. Vishwakarma',
      technicianTier: 'L2 Senior Specialist',
      technicianRating: 4.88,
      etaMinutes: input.urgency === 'CRITICAL' ? 11 : 22,
      laborCharge: labor,
      partsCharge: parts,
      gstAmount: gst,
      totalAmount: labor + parts + gst,
      paid: false,
      ratedStars: 0,
    };
    setState((prev) => ({ ...prev, localJobs: [created, ...prev.localJobs] }));
    pushNotif({
      severity: 'CRITICAL',
      title: `Technician Dispatched — ${created.jobNumber}`,
      body: `${created.technicianName} accepted your ${created.equipmentSummary} breakdown. ETA ${created.etaMinutes} mins.`,
      link: `/jobs/${created.id}`,
    });
    return created;
  }

  function advanceLocalJobStatus(jobId: number, status: string) {
    setState((prev) => ({
      ...prev,
      localJobs: prev.localJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status,
              etaMinutes: status === 'ARRIVED' || status === 'IN_PROGRESS' || status === 'COMPLETED' ? 0 : j.etaMinutes,
              workDoneSummary:
                status === 'COMPLETED'
                  ? j.workDoneSummary ?? `Completed diagnostic repair and verified nominal operating parameters for ${j.equipmentSummary}.`
                  : j.workDoneSummary,
            }
          : j,
      ),
    }));
  }

  function payLocalJob(jobId: number, useWallet: boolean) {
    setState((prev) => {
      const target = prev.localJobs.find((j) => j.id === jobId);
      if (!target || target.paid) return prev;
      const newBalance = useWallet ? Math.max(0, prev.walletBalance - target.totalAmount) : prev.walletBalance;
      const txn: WalletTxn = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        date: 'Today',
        title: `Escrow Payment — ${target.jobNumber}`,
        type: 'DEBIT',
        amount: target.totalAmount,
        ref: useWallet ? 'WALLET-ESCROW' : 'RZP-ESCROW',
      };
      return {
        ...prev,
        walletBalance: newBalance,
        txns: [txn, ...prev.txns],
        localJobs: prev.localJobs.map((j) => (j.id === jobId ? { ...j, paid: true } : j)),
      };
    });
    pushNotif({
      severity: 'INFO',
      title: `Escrow Payment Confirmed for JOB-${jobId}`,
      body: 'Funds are safely held in escrow and your 18% GST ITC invoice has been issued.',
      link: `/jobs/${jobId}`,
    });
  }

  function rateLocalJob(jobId: number, stars: number) {
    setState((prev) => ({
      ...prev,
      localJobs: prev.localJobs.map((j) => (j.id === jobId ? { ...j, ratedStars: stars } : j)),
    }));
  }

  function addToCart(partId: string) {
    setState((prev) => {
      const exists = prev.cart.find((c) => c.partId === partId);
      const cart = exists ? prev.cart.map((c) => (c.partId === partId ? { ...c, qty: c.qty + 1 } : c)) : [...prev.cart, { partId, qty: 1 }];
      return { ...prev, cart };
    });
  }

  function updateCartQty(partId: string, qty: number) {
    setState((prev) => ({
      ...prev,
      cart: qty <= 0 ? prev.cart.filter((c) => c.partId !== partId) : prev.cart.map((c) => (c.partId === partId ? { ...c, qty } : c)),
    }));
  }

  function removeFromCart(partId: string) {
    setState((prev) => ({ ...prev, cart: prev.cart.filter((c) => c.partId !== partId) }));
  }

  function placeOrder(opts: { poNumber: string; gate: string; deliverySpeed: 'EXPRESS_60M' | 'SCHEDULED'; paymentMethod: 'WALLET' | 'ESCROW_UPI' }): PartOrder | null {
    if (state.cart.length === 0) return null;
    const items = state.cart
      .map((c) => {
        const part = SPARE_PARTS_CATALOG.find((p) => p.id === c.partId);
        return part ? { name: part.name, qty: c.qty, price: part.price } : null;
      })
      .filter((x): x is { name: string; qty: number; price: number } => x !== null);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryFee = opts.deliverySpeed === 'EXPRESS_60M' && !state.proPassActive ? 250 : 0;
    const gst = Math.round((subtotal + deliveryFee) * 0.18);
    const total = subtotal + deliveryFee + gst;
    const order: PartOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 89999)}`,
      createdAt: 'Just now',
      poNumber: opts.poNumber || `PO-${new Date().getFullYear()}-042`,
      gate: opts.gate,
      deliverySpeed: opts.deliverySpeed,
      paymentMethod: opts.paymentMethod,
      items,
      subtotal,
      gst,
      total,
      status: 'DISPATCHED',
    };
    setState((prev) => ({
      ...prev,
      cart: [],
      orders: [order, ...prev.orders],
      walletBalance: opts.paymentMethod === 'WALLET' ? Math.max(0, prev.walletBalance - total) : prev.walletBalance,
      txns: [
        {
          id: `TXN-${Date.now().toString().slice(-4)}`,
          date: 'Today',
          title: `OEM Spare Parts Order ${order.id}`,
          type: 'DEBIT',
          amount: total,
          ref: order.poNumber,
        },
        ...prev.txns,
      ],
    }));
    pushNotif({
      severity: 'INFO',
      title: `Spare Parts Order Dispatched (${order.id})`,
      body: `Delivering to ${order.gate}. ${opts.deliverySpeed === 'EXPRESS_60M' ? '60-min express courier assigned.' : 'Scheduled depot delivery confirmed.'}`,
      link: '/marketplace',
    });
    return order;
  }

  function fileWarrantyClaim(input: { jobNumber: string; assetName: string; symptom: string }): WarrantyClaim {
    const claim: WarrantyClaim = {
      id: `CLM-${Math.floor(4000 + Math.random() * 5000)}`,
      jobNumber: input.jobNumber,
      assetName: input.assetName,
      symptom: input.symptom,
      createdAt: 'Just now',
      status: 'REVISIT_SCHEDULED',
    };
    setState((prev) => ({ ...prev, claims: [claim, ...prev.claims] }));
    pushNotif({
      severity: 'WARNING',
      title: `Zero-Fee Warranty Revisit Claim ${claim.id}`,
      body: `Priority revisit approved for ${claim.assetName} under your 30-Day Repair Warranty.`,
      link: '/protection',
    });
    return claim;
  }

  function setAmcPlan(plan: 'BASIC' | 'PRO' | 'ENTERPRISE') {
    setState((prev) => ({ ...prev, amcPlan: plan }));
    pushNotif({
      severity: 'INFO',
      title: `AMC Contract Tier Updated to ${plan}`,
      body: 'Your quarterly preventive maintenance calendar and SLA commitments have been updated.',
      link: '/protection',
    });
  }

  function addWalletFunds(amount: number) {
    const txn: WalletTxn = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      date: 'Today',
      title: 'Corporate Wallet Top-Up (UPI / IMPS)',
      type: 'CREDIT',
      amount,
      ref: `UPI${Math.floor(100000 + Math.random() * 899999)}`,
    };
    setState((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
      txns: [txn, ...prev.txns],
    }));
    pushNotif({
      severity: 'INFO',
      title: `Wallet Credited ₹${amount.toLocaleString('en-IN')}`,
      body: 'Available immediately for 1-click emergency dispatch and OEM spare parts checkout.',
      link: '/wallet',
    });
  }

  function toggleAutoRefill() {
    setState((prev) => ({ ...prev, autoRefill: !prev.autoRefill }));
  }

  function toggleProPass() {
    setState((prev) => ({ ...prev, proPassActive: !prev.proPassActive }));
  }

  function markNotificationRead(id: string) {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }

  function markAllNotificationsRead() {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }

  function updateProfile(patch: Partial<PlantProfile>) {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }

  return (
    <OwnerStoreContext.Provider
      value={{
        ...state,
        activePlant,
        setActivePlantId,
        activeSector,
        setActiveSector,
        language,
        setLanguage,
        cookieConsent,
        cookieModalOpen,
        setCookieModalOpen,
        updateCookieConsent,
        addAsset,
        addLocalJob,
        advanceLocalJobStatus,
        payLocalJob,
        rateLocalJob,
        addToCart,
        updateCartQty,
        removeFromCart,
        placeOrder,
        fileWarrantyClaim,
        setAmcPlan,
        addWalletFunds,
        toggleAutoRefill,
        toggleProPass,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
        cartCount,
        unreadNotifications,
      }}
    >
      {children}
    </OwnerStoreContext.Provider>
  );
}

export function useOwnerStore() {
  const ctx = useContext(OwnerStoreContext);
  if (!ctx) throw new Error('useOwnerStore must be used inside <OwnerStoreProvider>.');
  return ctx;
}
