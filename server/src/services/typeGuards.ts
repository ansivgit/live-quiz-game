import type { Game, Player } from '@/types';

export const isCreateGamePayload = (value: Game): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  
  return (
    typeof value?.id === 'string'
    && typeof value?.code === 'string'
    && typeof value?.hostId === 'string'
    && Array.isArray(value?.questions)
    && Array.isArray(value?.players)
    && typeof value?.currentQuestion === 'number'
    && (
      value?.status === 'waiting'
      || value?.status === 'in_progress'
      || value?.status === 'finished'
    )
  );
};

export const isPlayer = (value: Player): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  
  return (
    typeof value.index === 'string'
    && typeof value.name === 'string'
    && typeof value.score === 'number'
    && (typeof value.ws === 'object' || typeof value.ws === 'undefined')
    && (typeof value.hasAnswered === 'boolean' || typeof value.hasAnswered === 'undefined')
    && (typeof value.answerTime === 'number'|| typeof value.answerTime === 'undefined')
    && (typeof value.answeredCorrectly === 'boolean' || typeof value.answeredCorrectly === 'undefined')
  );
};
