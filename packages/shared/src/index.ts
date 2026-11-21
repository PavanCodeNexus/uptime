// Web-app shared code (Phase 0 onwards).
export * from './types/api';
export * from './types/models';
export * from './constants/errors';
export * from './constants/job';
export * from './lib/errors';
export * from './lib/tokens';
export * from './lib/http';
export * from './lib/format';
export * from './api/health';
export * from './api/auth';
export * from './api/jobs';
export * from './api/technicians';
export * from './api/jobflow';
export * from './lib/stomp';
export * from './lib/arrivalCode';
export * from './auth/session';
export * from './auth/AuthProvider';
export * from './ui/kit';
export * from './ui/JobBits';
export * from './ui/TrackingCard';
export * from './ui/PhoneLoginPage';
export * from './ui/AdminLoginPage';
export * from './ui/SignedInHome';
export * from './ui/useTheme';
export * from './ui/BackendStatusPage';

// Teammate contract files (kept as they were). Only names that do not clash with the files above are
// re-exported here; the rest can be imported by path, e.g. '@uptime/shared/src/types/AllTypes'.
export { API_ROUTES, REGULATED_TRADES } from './constants/apiRoutes';
export { formatCurrencyInr, containsFullAadhaarNumber } from './utils/formatters';
export type { IndustryType, VerificationLevel, VerificationTrack, TechnicianDTO, JobDTO } from './types/AllTypes';
export type { ApiResponse, PagedResponse } from './types/api.types';
