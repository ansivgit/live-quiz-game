import type { WebSocketServer } from 'ws';
import { dbGames, type GamesStore } from '@/db/games.store';
import type { Game, Question, WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';
import { broadcast } from '@/websocket/broadcast';

interface StartGamePayload extends Omit<Question, 'correctIndex'> {
  questionNumber: number;
  totalQuestions: number;
}

export const startGame = (msg: WSMessage, wss: WebSocketServer): void => {
  const gamesStore: GamesStore = dbGames;
  const { gameId } = msg.data;
  
  const game: Game | undefined = gamesStore.getGameById(gameId);
  if (!game) {
    console.error('Game not found');
    return;
  }
  
  const { questions } = game;
  
  try {
    const resData: StartGamePayload = {
      questionNumber: game.currentQuestion + 1,
      totalQuestions: questions.length,
      text: questions[game.currentQuestion].text,
      options: questions[game.currentQuestion].options,
      timeLimitSec: questions[game.currentQuestion].timeLimitSec,
    };
    
    broadcast(wss, {
      type: COMMAND_TYPES.QUESTION,
      data: resData,
      id: 0,
    });
  } catch {
    console.error('Game could not start');
    return;
  }
};
