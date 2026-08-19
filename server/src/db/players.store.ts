import { randomUUID } from 'node:crypto';
import type { WebSocket } from 'ws';
import type { Player } from '@/types';

export class PlayersStore {
  players: Player[];
  
  constructor() {
    this.players = [];
  }
  
  getPlayersList() {
    return this.players;
  }
  
  private getPlayerByName(name: unknown): Player | undefined {
    if (typeof name !== 'string' || !name.trim().length) {
      return;
    }
    
    return this.players.find(
      (player) => player.name === name,
    );
  }
  
  getPlayerByIndex(index: unknown): Player | undefined {
    if (typeof index !== 'string' || !index.trim().length) {
      return;
    }
    
    return this.players.find(
      (player) => player.index === index,
    );
  }
  
  isPlayerExist(name: string): boolean {
    if (this.getPlayerByName(name)) {
      console.info(`Player ${name} already exist!`);
      return true;
    }
    return false;
  }
  
  private register(name: string, password: string, ws: WebSocket): Player {
    if (this.isPlayerExist(name)) {
      return this.login(name, password, ws);
    }
    
    const newPlayerId: string = randomUUID();
    const newPlayer: Player = { name, index: newPlayerId, score: 0, ws };
    
    this.players.push(newPlayer);
    return newPlayer;
  }
  
  login(name: string, password: string, ws: WebSocket): Player {
    const registeredPlayer: Player | undefined = this.getPlayerByName(name);
    
    if (!registeredPlayer) {
      return this.register(name, password, ws);
    }
    
    return registeredPlayer;
  }
}

export const dbPlayers = new PlayersStore();
