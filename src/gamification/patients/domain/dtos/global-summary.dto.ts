import { Rank } from '@/gamification/leaderboards/domain/rank.enum';

export class GlobalSummaryDto {
  flexicoins: number;
  experience: number;
  rank: Rank;
  qtyTasksHistory: number;
  qtyTasksCompletedHistory: number;
  qtyTasksWeekly: number;
  qtyTasksCompletedWeekly: number;
}
