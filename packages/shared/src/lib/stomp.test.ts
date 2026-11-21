import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stompFrame, toWebSocketUrl } from './stomp';

test('toWebSocketUrl swaps the scheme and adds /websocket', () => {
  assert.equal(toWebSocketUrl('http://localhost:8080/ws'), 'ws://localhost:8080/ws/websocket');
  assert.equal(toWebSocketUrl('https://api.example.com/ws/'), 'wss://api.example.com/ws/websocket');
  assert.equal(toWebSocketUrl('ws://x/ws/websocket'), 'ws://x/ws/websocket');
});

test('stompFrame ends with a null byte and has a blank line before the body', () => {
  const f = stompFrame('SEND', { destination: '/app/x' }, '{"a":1}');
  assert.equal(f, 'SEND\ndestination:/app/x\n\n{"a":1}\0');
});
