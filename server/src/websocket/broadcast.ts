import WebSocket, { type WebSocketServer } from 'ws';

export const broadcast = (wss: WebSocketServer, message: unknown): void => {
  const data = JSON.stringify(message);
  
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
};

export type GameBroadcast = typeof broadcast;
