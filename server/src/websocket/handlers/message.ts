import type { WebSocket, WebSocketServer } from 'ws';
import { handleEntry } from '@/websocket/auth/auth';
import { createGame, gameSession, joinGame, startGame } from '@/websocket/game';
import type { WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';

export const handleMessage = (wss: WebSocketServer, ws: WebSocket, msg: WSMessage): void => {
  switch (msg.type) {
    case COMMAND_TYPES.REG:
      handleEntry(ws, msg);
      break;
    case COMMAND_TYPES.CREATE_GAME:
      createGame(ws, msg);
      break;
    case COMMAND_TYPES.JOIN_GAME:
      joinGame(ws, msg, wss);
      break;
    case COMMAND_TYPES.START_GAME:
      startGame(msg, wss);
      break;
    case COMMAND_TYPES.ANSWER:
      gameSession(ws, msg, wss);
      break;
    default:
      console.error('Bad request');
  }
}
