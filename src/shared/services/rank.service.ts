import { Rank } from '@/gamification/leaderboards/domain/rank.enum';

export class RankService {
  static getNewRank(rankCurrent: Rank, type: 'down' | 'up' | 'equal'): Rank {
    const ranks = Object.values(Rank);
    const currentIndex = ranks.findIndex((rank) => rank === rankCurrent);

    if (type === 'up' && currentIndex < ranks.length - 1) {
      return ranks[currentIndex + 1];
    }

    if (type === 'down' && currentIndex > 0) {
      return ranks[currentIndex - 1];
    }

    return rankCurrent;
  }
}
