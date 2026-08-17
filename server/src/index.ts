import { createWebSocketServer } from './websocket/server';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

createWebSocketServer(PORT);