import type { WebSocket, WebSocketServer } from 'ws';
import { dbGames, type GamesStore } from '@/db/games.store';
import { dbPlayers, type PlayersStore } from '@/db/players.store';
import { broadcast } from '@/websocket/broadcast';
import { type ClientsStore, dbClients } from '@/websocket/clients.store';
import { getResStringify } from '@/utils';

import type { Game, Player, StartGameData, WSMessage } from '@/types';
import { COMMAND_TYPES } from '@/constants';

export const joinGame = (ws: WebSocket, msg: WSMessage, wss: WebSocketServer): void => {
  const clientsStore: ClientsStore = dbClients;
  const gamesStore: GamesStore = dbGames;
  const playersStore: PlayersStore = dbPlayers;
  
  //! add code validation (assignment)
  const { code } = msg.data;
  
  const joinedUserId: string | null = clientsStore.getUser(ws);
  if (!joinedUserId) {
    console.error('Unable to create game - joined user not found')
    throw new Error();
  }
  
  const joinedPlayer: Player | undefined = playersStore.getPlayerByIndex(joinedUserId);
  const game: Game | undefined = gamesStore.getGameByCode(code);
  
  if (!game || !joinedUserId || !joinedPlayer) {
    console.error('Game or user not found');
    return;
  }
  
  try {
    const resData: StartGameData = {
      gameId: game.id,
    };
    
    game.players.push(joinedPlayer);
    ws.send(getResStringify(COMMAND_TYPES.GAME_JOINED, resData));
    
    const currentPlayersData = game.players.map((player: Player) => {
      const { name, index, score } = player;
      return { name, index, score };
    })
    
    broadcast(wss, {
      type: COMMAND_TYPES.PLAYER_JOINED,
      data: { playerName: joinedPlayer.name, playerCount: game.players.length },
      id: 0,
    });
    
    broadcast(wss, {
      type: COMMAND_TYPES.UPDATE_PLAYERS,
      data: currentPlayersData,
      id: 0,
    });
  } catch {
    console.error('Player could not join game');
    const rejData = {
      gameId: null,
    };
    
    ws.send(getResStringify(COMMAND_TYPES.GAME_JOINED, rejData));
  }
};
