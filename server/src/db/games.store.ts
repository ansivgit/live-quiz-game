import { isCreateGamePayload } from '@/services/typeGuards';
import type { Game } from '@/types';

export class GamesStore {
  games: Game[];
  
  constructor() {
    this.games = [];
  }
  
  getGamesList() {
    return this.games;
  }
  
  getGameByCode(code: unknown): Game | undefined {
    if (typeof code !== 'string' || !code.trim().length) {
      return;
    }
    
    return this.games.find(
      (game) => game.code === code,
    );
  }
  
  getGameById(gameId: unknown): Game | undefined {
    if (typeof gameId !== 'string' || !gameId.trim().length) {
      return;
    }
    
    return this.games.find(
      (game) => game.id === gameId,
    );
  }
  
  add(newGame: Game): Game {
    if (!isCreateGamePayload(newGame)) {
      console.error('Game mast be created game');
      throw new Error();
    }
    
    this.games.push(newGame);
    
    return newGame;
  }
}

export const dbGames = new GamesStore();
