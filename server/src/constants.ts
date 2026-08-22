export const MESSAGES = {
  playerExist: 'Player already exist!',
  invalidCreds: 'Incorrect auth or password',
  playerNotFound: 'Player not found',
  gameNotCreated: 'Game not created',
};

export const COMMAND_TYPES = {
  REG: 'reg',
  CREATE_GAME: 'create_game',
  GAME_CREATED: 'game_created',
  JOIN_GAME: 'join_game',
  GAME_JOINED: 'game_joined',
  PLAYER_JOINED: 'player_joined',
  UPDATE_PLAYERS: 'update_players',
  START_GAME: 'start_game',
  QUESTION: 'question',
  ANSWER: 'answer',
  ANSWER_ACCEPTED: 'answer_accepted',
  QUESTION_RESULT: 'question_result',
  GAME_FINISHED: 'game_finished',
};

export const GAME_STATUS = {
  WAITING: 'waiting',
  PROGRESS: 'in_progress',
  FINISHED: 'finished',
} as const;

export const QUESTION_POINTS = 100;

export const RESULT_DELAY = 5000;
