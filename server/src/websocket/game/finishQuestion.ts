import type { WebSocketServer } from 'ws';
import { dbGames } from '@/db/games.store';
import { broadcast, sendQuestionUpdate } from '@/websocket/broadcasts';
import { getPlayersScoreboard } from '@/services/getPlayersScoreboard';

import type { Game } from '@/types';
import { COMMAND_TYPES, GAME_STATUS, RESULT_DELAY } from '@/constants';

export const finishQuestion = (wss: WebSocketServer, gameId: string): void => {
  const game: Game | undefined = dbGames.getGameById(gameId);
  if (!game) {
    console.error('Game not found');
    return;
  }
  
  if (game.status === GAME_STATUS.FINISHED) {
    return;
  }
  
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = undefined;
  }
  
  game.status = game.currentQuestion < game.questions.length - 1 ? GAME_STATUS.PROGRESS : GAME_STATUS.FINISHED;
  game.players.forEach((p) => {
    p.hasAnswered = false;
    p.answerTime = undefined;
    p.answeredCorrectly = undefined;
  });
  
  if (game.status === GAME_STATUS.FINISHED) {
    game.questionTimer = setTimeout(() => {
      broadcast(wss, {
        type: COMMAND_TYPES.GAME_FINISHED,
        data: {
          scoreboard: getPlayersScoreboard(game.players),
        },
        id: 0,
      });
      
      clearTimeout(game.questionTimer);
      game.questionTimer = undefined;
    }, RESULT_DELAY);
  } else {
    game.currentQuestion += 1;
    
    sendQuestionUpdate(wss, game.questions, game.currentQuestion);
  }
};
