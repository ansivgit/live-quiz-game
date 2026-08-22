import type { WebSocket, WebSocketServer } from 'ws';
import { dbGames, type GamesStore } from '@/db/games.store';
import { dbPlayers, type PlayersStore } from '@/db/players.store';
import { type ClientsStore, dbClients } from '@/websocket/clients.store';
import { finishQuestion } from './finishQuestion';
import { sendQuestionResult } from './sendQuestionResult';
import { getResStringify } from '@/utils';

import type { Game, Player, PlayerResult, Question, WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';

// type QuestionResult = {
//   questionIndex: number;
//   correctIndex: number;
//   playerResults: PlayerResult[];
// };

const QUESTION_POINTS = 100;

export const gameSession = (ws: WebSocket, msg: WSMessage, wss: WebSocketServer): void => {
  const clientsStore: ClientsStore = dbClients;
  const gamesStore: GamesStore = dbGames;
  const playersStore: PlayersStore = dbPlayers;
  
  const { gameId, questionIndex, answerIndex } = msg.data;
  
  if (typeof questionIndex !== 'number' || typeof answerIndex !== 'number' || typeof gameId !== 'string') {
    return;
  }
  
  const userId: string | null = clientsStore.getUser(ws);
  const game: Game | undefined = gamesStore.getGameById(gameId);
  
  if (!userId || !game) {
    console.error('Player or game not found');
    return;
  }
  
  const player: Player | undefined = game.players.find((player: Player) => player.index === userId);
  if (!player) {
    console.error('Player not found');
    return;
  }
  
  const question: Question | undefined = game.questions[questionIndex];
  if (!question) {
    return;
  }
  
  try {
    const resData = {
      questionIndex,
    };
    
    ws.send(getResStringify(COMMAND_TYPES.ANSWER_ACCEPTED, resData));
    
    player.hasAnswered = true;
    player.answeredCorrectly = answerIndex === question.correctIndex;
    
    const points = player.answeredCorrectly ? QUESTION_POINTS : 0;
    player.score = playersStore.updateScore(player.index, points);
    
    // game.currentQuestion = questionIndex;
    
    game.questionTimer = setTimeout(() => {
      finishQuestion(wss, gameId, questionIndex);
    }, question.timeLimitSec * 1000);
    
    const playerResult: PlayerResult = {
      name: player.name,
      answered: player.hasAnswered,
      correct: player.answeredCorrectly,
      pointsEarned: points,
      totalScore: player.score,
    };
    
    game.playersResult.set(ws, playerResult);
    
    // console.log('🚀 session ~ game.players: ', game.players);
    if (game.players.every((p: Player) => p.hasAnswered)) {
      clearTimeout(game.questionTimer);
      game.questionTimer = undefined;
      
      sendQuestionResult(wss, gameId, questionIndex);
      
      game.questionTimer = setTimeout(() => {
        finishQuestion(wss, gameId, questionIndex);
      }, 7000);
    }
  } catch {
    console.error('Something wrong with answers, try later');
    return;
  }
};
