import { randomUUID } from 'node:crypto';
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
  
  isPlayerExist(name: string) {
    if (this.getPlayerByName(name)) {
      console.info(`Player ${name} already exist!`);
      console.log('From check: ', this.players);
      
      return true;
    }
    return false;
  }
  
  private register(name: string, password: string): Player {
    if (this.isPlayerExist(name)) {
      console.log('From signIn: ', this.players);
      return this.login(name, password);
    }
    
    const newPlayerId: string = randomUUID();
    const newPlayer: Player = { name, index: newPlayerId, score: 0 };
    
    this.players.push(newPlayer);
    console.log('Players', this.players);
    
    return newPlayer;
  }
  
  login(name: string, password: string): Player {
    const registeredPlayer: Player | undefined = this.getPlayerByName(name);
    console.log('From logIn: ', this.players);
    
    if (!registeredPlayer) {
      return this.register(name, password);
    }
    
    // if (registeredPlayer && registeredPlayer.password !== password) {
    //   console.info(MESSAGES.invalidCreds);
    //   return null;
    // }
    
    return registeredPlayer;
  }
}

export const db = new PlayersStore();
