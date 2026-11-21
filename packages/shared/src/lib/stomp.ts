/**
 * A very small STOMP sender over a plain browser WebSocket. The backend offers SockJS at /ws, and SockJS
 * also exposes a raw WebSocket at /ws/websocket, so no extra library is needed. We only ever SEND
 * location updates; owners read them with GET /tracking/{jobId}.
 */

/** http://host/ws becomes ws://host/ws/websocket (https becomes wss). */
export function toWebSocketUrl(wsUrl: string): string {
  const base = wsUrl.replace(/\/+$/, '').replace(/^http/i, 'ws');
  return base.endsWith('/websocket') ? base : `${base}/websocket`;
}

export function stompFrame(command: string, headers: Record<string, string>, body = ''): string {
  const head = Object.entries(headers)
    .map(([k, v]) => `${k}:${v}`)
    .join('\n');
  return `${command}\n${head}\n\n${body}\0`;
}

export interface LocationSender {
  send(lat: number, lng: number, etaMinutes: number): void;
  close(): void;
}

/** Opens a socket for one job. Failures are silent: tracking is a nice extra, never a blocker. */
export function openLocationSender(wsUrl: string, jobId: number): LocationSender {
  let ready = false;
  let closed = false;
  let ws: WebSocket | null = null;
  try {
    ws = new WebSocket(toWebSocketUrl(wsUrl));
    ws.onopen = () => ws?.send(stompFrame('CONNECT', { 'accept-version': '1.2', 'heart-beat': '0,0' }));
    ws.onmessage = (e) => {
      if (typeof e.data === 'string' && e.data.startsWith('CONNECTED')) ready = true;
    };
    ws.onerror = () => {
      ready = false;
    };
    ws.onclose = () => {
      ready = false;
    };
  } catch {
    ws = null;
  }
  return {
    send(lat, lng, etaMinutes) {
      if (!ws || closed || !ready || ws.readyState !== 1) return;
      ws.send(stompFrame('SEND', { destination: `/app/job/${jobId}/location`, 'content-type': 'application/json' }, JSON.stringify({ lat, lng, etaMinutes })));
    },
    close() {
      closed = true;
      try {
        ws?.close();
      } catch {
        /* nothing to do */
      }
    },
  };
}
