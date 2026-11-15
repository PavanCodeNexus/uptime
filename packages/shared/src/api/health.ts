import type { HealthData } from '../types/api';
import type { HttpClient } from '../lib/http';

/** GET /api/v1/health. Public, so no token is sent. */
export function getHealth(http: HttpClient): Promise<HealthData> {
  return http.get<HealthData>('/api/v1/health', { auth: false });
}
