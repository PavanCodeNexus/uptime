/**
 * One place that understands every spelling the backend uses for job status, urgency and industry.
 * (The backend mixes CREATED/POSTED, NORMAL/LOW..CRITICAL and AUTOMOTIVE/AUTOMOBILE.)
 */
import type { ResolutionPath } from '../types/models';

export type Tone = 'neutral' | 'info' | 'warning' | 'purple' | 'success' | 'danger' | 'orange';

export interface StatusInfo {
  label: string;
  tone: Tone;
  /** Hex from docs/DESIGN.md status colors, for dots and stepper markers. */
  color: string;
}

export const JOB_STATUS: Record<string, StatusInfo> = {
  CREATED: { label: 'Posted', tone: 'neutral', color: '#64748B' },
  POSTED: { label: 'Posted', tone: 'neutral', color: '#64748B' },
  AI_ANALYZED: { label: 'Analysed', tone: 'neutral', color: '#64748B' },
  COPILOT_ACTIVE: { label: 'AI Copilot', tone: 'info', color: '#2563EB' },
  VIDEO_ACTIVE: { label: 'Video consult', tone: 'info', color: '#2563EB' },
  MATCHING: { label: 'Finding a technician', tone: 'info', color: '#2563EB' },
  ACCEPTED: { label: 'Accepted', tone: 'info', color: '#2563EB' },
  EN_ROUTE: { label: 'On the way', tone: 'warning', color: '#D97706' },
  ARRIVED: { label: 'Arrived', tone: 'warning', color: '#D97706' },
  IN_PROGRESS: { label: 'In progress', tone: 'purple', color: '#7C3AED' },
  COMPLETED: { label: 'Completed', tone: 'success', color: '#16A34A' },
  CANCELLED: { label: 'Cancelled', tone: 'danger', color: '#DC2626' },
  DISPUTED: { label: 'Disputed', tone: 'orange', color: '#EA580C' },
};

const UNKNOWN_STATUS: StatusInfo = { label: 'Unknown', tone: 'neutral', color: '#64748B' };

export function jobStatusInfo(status: string | undefined | null): StatusInfo {
  if (!status) return UNKNOWN_STATUS;
  return JOB_STATUS[status.toUpperCase()] ?? { ...UNKNOWN_STATUS, label: status };
}

/** The steps the owner tracker shows, in order. */
export const TRACKER_STEPS = ['CREATED', 'MATCHING', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'] as const;

/**
 * Where a status sits on the tracker (0-based), or -1 if it is off the main path
 * (cancelled, disputed). Statuses that happen before matching map to the first steps.
 */
export function trackerIndex(status: string | undefined | null): number {
  if (!status) return -1;
  const s = status.toUpperCase();
  if (s === 'POSTED' || s === 'AI_ANALYZED') return 0;
  if (s === 'COPILOT_ACTIVE' || s === 'VIDEO_ACTIVE') return 0;
  return (TRACKER_STEPS as readonly string[]).indexOf(s);
}

export interface IndustryInfo {
  /** The value we SEND to the backend. Technician skills use AUTOMOTIVE, so matching needs the same text. */
  value: 'INDUSTRIAL' | 'AUTOMOTIVE' | 'ELECTRONICS';
  label: string;
  /** Hex from docs/DESIGN.md. */
  color: string;
  examples: string;
}

export const INDUSTRIES: readonly IndustryInfo[] = [
  { value: 'INDUSTRIAL', label: 'Industrial', color: '#7C3AED', examples: 'CNC, compressor, boiler, hydraulics' },
  { value: 'AUTOMOTIVE', label: 'Automobile', color: '#2563EB', examples: 'Truck, tractor, car, two-wheeler, EV' },
  { value: 'ELECTRONICS', label: 'Electronics', color: '#0891B2', examples: 'AC, refrigerator, PCB, appliances' },
];

/** Accepts AUTOMOBILE (docs and enum) as well as AUTOMOTIVE (code defaults). Returns undefined if unknown. */
export function normalizeIndustry(value: string | undefined | null): IndustryInfo['value'] | undefined {
  if (!value) return undefined;
  const v = value.toUpperCase();
  if (v === 'AUTOMOBILE') return 'AUTOMOTIVE';
  return INDUSTRIES.find((i) => i.value === v)?.value;
}

export function industryInfo(value: string | undefined | null): IndustryInfo | undefined {
  const v = normalizeIndustry(value);
  return INDUSTRIES.find((i) => i.value === v);
}

export const URGENCIES = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
] as const;

export const RESOLUTION_PATHS: ReadonlyArray<{ value: ResolutionPath; label: string; available: boolean }> = [
  { value: 'AI_COPILOT', label: 'Fix it with AI Copilot', available: true },
  { value: 'VIDEO_CONSULT', label: 'Video consultation', available: false },
  { value: 'DIRECT_BOOKING', label: 'Book a technician', available: true },
];
