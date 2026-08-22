import type { WebSocket } from 'ws';
import { dbPlayers, type PlayersStore } from '@/db/players.store';
import { dbClients, type ClientsStore } from '@/websocket/clients.store';
import { getResStringify } from '@/utils';
import type { Player, WSMessage } from '@/types';
import { COMMAND_TYPES, MESSAGES } from '@/constants';

export const handleEntry = (ws: WebSocket, msg: WSMessage): void => {
  const playersStore: PlayersStore = dbPlayers;
  const users: ClientsStore = dbClients;
  
  const { name, password } = msg.data;
  
  try {
    const player: Player = playersStore.login(name, password, ws);
    
    const resData = {
      name,
      index: player.index,
      error: false,
      errorText: '',
    };
    
    ws.send(getResStringify(COMMAND_TYPES.REG, resData));
    users.setUser(ws, resData.index);
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
