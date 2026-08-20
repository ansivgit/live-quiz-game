import type { WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { dbGames, type GamesStore } from '@/db/games.store';
import { dbQuestions, type QuestionsStore } from '@/db/questions.store';
import { type ClientsStore, dbClients } from '@/websocket/clients.store';
import { generateCode, getResStringify } from '@/utils';

import type { Game, JoinGameData, StartGameData, WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';

export const createGame = (ws: WebSocket, msg: WSMessage): void => {
  const questionsStore: QuestionsStore = dbQuestions;
  const clientsStore: ClientsStore = dbClients;
  const gamesStore: GamesStore = dbGames;
  
  //! add questions validation (assignment)
  const { questions } = msg.data;
  
  const hostUserId: string | null = clientsStore.getUser(ws);
  if (!hostUserId) {
    throw new Error('Unable to create game - host not found');
  }
  
  try {
    questionsStore.add(questions);
    
    const gameId: string = randomUUID();
    const code: string = generateCode();
    
    const createdGame: Game = {
      id: gameId,
      code,
      hostId: hostUserId,
      questions,
      players: [],
      currentQuestion: 0,
      status: 'waiting',
    };
    
    gamesStore.add(createdGame);
    
    const createdData: StartGameData & JoinGameData = {
      gameId,
      code,
    };
    
    ws.send(getResStringify(COMMAND_TYPES.GAME_CREATED, createdData));
  } catch {
    console.error('Can not create game');
    
    const rejData = {
      gameId: null,
      code: null,
    };
    
    ws.send(getResStringify(COMMAND_TYPES.GAME_CREATED, rejData));
  }
};
