import type { WebSocket } from 'ws';
import { PlayersStore } from '@/db/players.store';
import { getResStringify } from '@/utils';
import type { Player, WSMessage } from '@/types';
import { COMMAND_TYPES, MESSAGES } from '@/constants';

export const login = (ws: WebSocket, msg: WSMessage): void => {
  const playersStore = new PlayersStore();
  
  const { name, password } = msg.data;
  
  try {
    const player: Player = playersStore.login(name, password);
    
    const resData = {
      name,
      index: player.index,
      error: false,
      errorText: '',
    };
    
    ws.send(getResStringify(COMMAND_TYPES.REG, resData));
  } catch {
    const rejData = {
      name: name || '',
      index: -1,
      error: true,
      errorText: MESSAGES.invalidCreds,
    };
    
    ws.send(getResStringify(COMMAND_TYPES.REG, rejData));
  }
};
