import type { WebSocketServer } from 'ws';
import { dbGames } from '@/db/games.store';
import { getPlayersScoreboard } from '@/services/getPlayersScoreboard';
import { broadcast } from '@/websocket/broadcast';
import { sendQuestionUpdate } from './sendQuestionUpdate';
import { sendQuestionResult } from './sendQuestionResult';

import type { Game } from '@/types';
import { COMMAND_TYPES, GAME_STATUS } from '@/constants';

// type QuestionResult = {
//   questionIndex: number;
//   correctIndex: number;
//   playerResults: PlayerResult[];
// };

export const finishQuestion = (wss: WebSocketServer, gameId: string, questionIndex: number): void => {
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
  
  game.status = questionIndex < game.questions.length - 1 ? GAME_STATUS.PROGRESS : GAME_STATUS.FINISHED;
  game.players.forEach((p) => {
    p.hasAnswered = false;
    p.answerTime = undefined;
    p.answeredCorrectly = undefined;
  });
  
  if (game.status === GAME_STATUS.FINISHED) {
    // console.log(555555);
    sendQuestionResult(wss, gameId, game.currentQuestion);
    
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
    }, 7000);
  } else {
    game.currentQuestion = questionIndex + 1;
    console.log('🚀 session-bottom ~ count: ', questionIndex);
    sendQuestionUpdate(wss, game.questions, game.currentQuestion);
  }
};
