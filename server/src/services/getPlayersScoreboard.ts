import type { Player } from '@/types';

interface ScoreboardData extends Pick<Player, 'name' | 'score'> {
  rank: number;
}

export const getPlayersScoreboard = (players: Player[]): ScoreboardData[] => {
  const boardData: Omit<ScoreboardData, 'rank'>[] = players.map((player: Player) => {
    const { name, score } = player;
    return { name, score };
  });
  
  const sortedPlayers: Omit<ScoreboardData, 'rank'>[] = boardData.sort((a, b) => b.score - a.score);
  
  return sortedPlayers.map((player, index): ScoreboardData => {
    return {
      ...player,
      rank: index + 1,
    };
  });
};
