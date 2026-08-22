import type { WebSocketServer } from 'ws';
import { dbGames } from '@/db/games.store';
import { broadcast } from '@/websocket/broadcasts/broadcast';
import type { Game, PlayerResult } from '@/types';
import { COMMAND_TYPES } from '@/constants';

type QuestionResult = {
  questionIndex: number;
  correctIndex: number;
  playerResults: PlayerResult[];
};

export const sendQuestionResult = (wss: WebSocketServer, gameId: string, questionIndex: number) => {
  const game: Game | undefined = dbGames.getGameById(gameId);
  if (!game) {
    console.error('Game not found');
    return;
  }
  
  const questionResult: QuestionResult = {
    questionIndex,
    correctIndex: game.questions[questionIndex].correctIndex,
    playerResults: Array.from(game.playersResult.values()),
  };
  
  broadcast(wss, {
    type: COMMAND_TYPES.QUESTION_RESULT,
    data: questionResult,
    id: 0,
  });
};
