import type { HttpClient } from '../lib/http';
import type { CopilotStep, CreateJobRequest, CreateJobResponse, DiagnosisResult, Job, MatchCandidate, ResolutionPath } from '../types/models';

/**
 * The backend puts a hash of the arrival code on every Job (`arrivalOtp`). It is useless to a screen and
 * must never be shown or logged, so it is removed the moment a job arrives from the server.
 */
export function stripSecrets<T extends object>(job: T): T {
  const { arrivalOtp: _hidden, ...rest } = job as T & { arrivalOtp?: unknown };
  return rest as T;
}

export const jobsApi = {
  list: async (http: HttpClient) => (await http.get<Job[]>('/api/v1/jobs')).map(stripSecrets),

  get: async (http: HttpClient, id: number | string) => stripSecrets(await http.get<Job>(`/api/v1/jobs/${id}`)),

  /** Creates the job. The reply carries the arrival code ONCE; the caller must store it on the device. */
  create: async (http: HttpClient, body: CreateJobRequest): Promise<CreateJobResponse> => {
    const res = await http.post<CreateJobResponse>('/api/v1/jobs', body);
    return { ...res, job: stripSecrets(res.job) };
  },

  /** Sets the status that matches the path: MATCHING, COPILOT_ACTIVE or VIDEO_ACTIVE. */
  choosePath: async (http: HttpClient, id: number, resolutionPath: ResolutionPath) =>
    stripSecrets(await http.post<Job>(`/api/v1/jobs/${id}/choose-path`, { resolutionPath })),

  escalate: async (http: HttpClient, id: number, targetPath: ResolutionPath, reason: string) =>
    stripSecrets(await http.post<Job>(`/api/v1/jobs/${id}/escalate`, { targetPath, reason })),
} as const;

export const matchingApi = {
  candidates: (http: HttpClient, jobId: number) => http.get<MatchCandidate[]>(`/api/v1/matching/jobs/${jobId}/candidates`),
} as const;

export const aiApi = {
  /** Today the backend answers with a fixed sample unless a Gemini key is set. `fallbackUsed` says which. */
  diagnose: (http: HttpClient, industry: string, description: string) =>
    http.post<DiagnosisResult>('/api/v1/ai/diagnose', { industry, description }),

  copilotStart: (http: HttpClient, jobId: number) => http.post<CopilotStep>(`/api/v1/ai/copilot/${jobId}`),

  copilotNext: (http: HttpClient, jobId: number, stepNumber: number) =>
    http.post<CopilotStep>(`/api/v1/ai/copilot/${jobId}/next`, { stepNumber }),
} as const;

/**
 * The diagnosis says FIELD_TECH when a technician is needed; the job API calls that DIRECT_BOOKING.
 * Returns undefined for anything unknown so the owner chooses for themselves.
 */
export function pathFromRecommendation(recommended: string | undefined | null): ResolutionPath | undefined {
  switch ((recommended ?? '').toUpperCase()) {
    case 'AI_COPILOT':
      return 'AI_COPILOT';
    case 'FIELD_TECH':
    case 'DIRECT_BOOKING':
      return 'DIRECT_BOOKING';
    case 'VIDEO_CONSULT':
      return 'VIDEO_CONSULT';
    default:
      return undefined;
  }
}
