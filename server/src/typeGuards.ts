import type { Game } from '@/types';

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
