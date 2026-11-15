import { createAuthSession, createHttpClient, createTokenStore } from '@uptime/shared';
import { env } from './env';

/** Access token in memory, refresh token in localStorage (so a page reload keeps you signed in). */
export const tokens = createTokenStore({ namespace: 'uptime.owner', mode: 'persistent' });

// `session` is defined below; onSessionExpired only runs later, after both exist.
export const http = createHttpClient({
  baseUrl: env.apiBaseUrl,
  tokens,
  refreshPath: '/api/v1/auth/refresh-token',
  // A failed refresh signs the person out; the route guard then shows the login page.
  onSessionExpired: () => session.expire(),
});

export const session = createAuthSession({ http, tokens, kind: 'OWNER' });
