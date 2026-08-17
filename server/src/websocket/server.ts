import { type WebSocket, WebSocketServer } from 'ws';
import { handleMessage } from './handlers/message';
import type { WSMessage } from '@/types';

export const createWebSocketServer = (port: number) => {
  const wss = new WebSocketServer(
    { port },
    () => console.log(`WebSocket server started on ${port} port`),
  );
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    
    ws.on('message', (data) => {
      const message: WSMessage = JSON.parse(data.toString());

      console.log('Received:', message);
      handleMessage(ws, message);
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  return wss;
}