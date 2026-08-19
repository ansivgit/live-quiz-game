import type { WebSocket } from 'ws';

export class ClientsStore {
  users: WeakMap<WebSocket, string>;
  
  constructor() {
    this.users = new WeakMap<WebSocket, string>();
  }
  
  setUser(ws: WebSocket, userId: string) {
    this.users.set(ws, userId);
  }
  
  getUser(ws: WebSocket): string | null {
    return this.users.get(ws) ?? null;
  }
  
  remove(ws: WebSocket): void {
    this.users.delete(ws);
  }
}

export const dbClients = new ClientsStore();
