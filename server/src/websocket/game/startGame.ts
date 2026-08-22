import type { WebSocketServer } from 'ws';
import { dbGames, type GamesStore } from '@/db/games.store';
import { sendQuestionUpdate } from './sendQuestionUpdate';
import type { Game, WSMessage } from '@/types';
import { GAME_STATUS } from '@/constants';

export const startGame = (msg: WSMessage, wss: WebSocketServer): void => {
  const gamesStore: GamesStore = dbGames;
  const { gameId } = msg.data;
  
  const game: Game | undefined = gamesStore.getGameById(gameId);
  if (!game) {
    console.error('Game not found');
    return;
  }
  
  game.status = GAME_STATUS.PROGRESS;
  
  sendQuestionUpdate(wss, game.questions, game.currentQuestion);
};
