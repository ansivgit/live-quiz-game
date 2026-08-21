import type { WebSocket, WebSocketServer } from 'ws';
import { dbGames, type GamesStore } from '@/db/games.store';
import { dbPlayers, type PlayersStore } from '@/db/players.store';
import { type ClientsStore, dbClients } from '@/websocket/clients.store';
import { getResStringify } from '@/utils';

import type { Game, Player, PlayerResult, Question, WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';
import { broadcast, type GameBroadcast } from '@/websocket/broadcast';

type QuestionResult = {
  questionIndex: number;
  correctIndex: number;
  playerResults: PlayerResult[];
};

const QUESTION_POINTS = 100;

export const gameSession = (ws: WebSocket, msg: WSMessage, wss: WebSocketServer): void => {
  const clientsStore: ClientsStore = dbClients;
  const gamesStore: GamesStore = dbGames;
  const playersStore: PlayersStore = dbPlayers;
  
  const { gameId, questionIndex, answerIndex } = msg.data;
  
  if (typeof questionIndex !== 'number' || typeof answerIndex !== 'number') {
    return;
  }
  
  const userId: string | null = clientsStore.getUser(ws);
  const game: Game | undefined = gamesStore.getGameById(gameId);
  
  if (!userId || !game) {
    console.error('Player or game not found');
    return;
  }
  
  const player: Player | undefined = playersStore.getPlayerByIndex(userId);
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
    
    game.currentQuestion = questionIndex;
    
    game.questionTimer = setTimeout(() => {
      finishQuestion(game, broadcast, 'timeout');
    }, question.timeLimitSec * 1000);
    
    const playerResult: PlayerResult = {
      name: player.name,
      answered: player.hasAnswered,
      correct: player.answeredCorrectly,
      pointsEarned: points,
      totalScore: player.score + points,
    };
    
    game.playersResult.set(ws, playerResult);
    console.log('🚀 session ~ currentQuestion - end: ', game.currentQuestion);
    
    const finishQuestion = (game: Game, broadcast: GameBroadcast, reason?: string) => {
      if (game.status === 'finished') {
        return;
      }
      
      const questionResult: QuestionResult = {
        questionIndex,
        correctIndex: question.correctIndex,
        playerResults: Array.from(game.playersResult.values()),
      };
      
      clearTimeout(game.questionTimer);
      game.questionTimer = undefined;
      
      broadcast(wss, {
        type: COMMAND_TYPES.QUESTION_RESULT,
        data: questionResult,
        id: 0,
      });
      
      game.currentQuestion = game.currentQuestion + 1;
      game.status = questionIndex === game.questions.length - 1 ? 'finished' : 'in_progress';
      
      if (game.status === 'finished') {
        broadcast(wss, {
          type: COMMAND_TYPES.GAME_FINISHED,
          data: {
            scoreboard: [],
          },
          id: 0,
        });
      } else {
        console.log('🚀 session-bottom ~ currentQuestion: ', game.currentQuestion);
        const resData = {
          questionNumber: game.currentQuestion + 1,
          totalQuestions: game.questions.length,
          text: game.questions[game.currentQuestion].text,
          options: game.questions[game.currentQuestion].options,
          timeLimitSec: game.questions[game.currentQuestion].timeLimitSec,
        };
        
        broadcast(wss, {
          type: COMMAND_TYPES.QUESTION,
          data: resData,
          id: 0,
        });
      }
    };
  } catch {
    console.error('Something wrong with answers, try later');
    return;
  }
};
