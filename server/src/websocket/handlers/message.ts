import type { WebSocket } from 'ws';
import { login } from '../auth/auth';
import type { WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';

export const handleMessage = (ws: WebSocket, msg: WSMessage): void => {
  switch (msg.type) {
    case COMMAND_TYPES.REG:
      login(ws, msg);
      break;
    case COMMAND_TYPES.CREATE_GAME:
      // createGame(ws);
      break;
    default:
      console.log('Bad request');
  }
}