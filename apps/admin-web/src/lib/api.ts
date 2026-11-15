import { createAuthSession, createHttpClient, createTokenStore } from '@uptime/shared';
import { env } from './env';

/** Admin tokens live in sessionStorage only (closing the tab signs out) and there is no refresh endpoint. */
export const tokens = createTokenStore({ namespace: 'uptime.admin', mode: 'session' });

// `session` is defined below; onSessionExpired only runs later, after both exist.
export const http = createHttpClient({
  baseUrl: env.apiBaseUrl,
  tokens,
  refreshPath: null,
  // When the 30-minute token ends, the admin is sent back to the login page by the route guard.
  onSessionExpired: () => session.expire(),
});

export const session = createAuthSession({ http, tokens, kind: 'ADMIN' });
