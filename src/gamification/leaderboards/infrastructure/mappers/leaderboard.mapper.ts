import { CurrentWeekLeaderboardRow } from '../../domain/dtos/current-leaderboard';
import { CurrentWeekLeaderboardRowRaw } from '../../domain/raw/current-leaderboard.raw';

export class LeaderboardMapper {
  static toCurrentLeaderboardRaw(
    leaderboard: CurrentWeekLeaderboardRowRaw[],
  ): CurrentWeekLeaderboardRow[] {
    return leaderboard.map((l) => ({
      patientId: l.patient_id,
      firstName: l.first_name,
      lastName: l.last_name,
      qtyTasks: Number(l.qty_tasks),
      qtyTasksCompleted: Number(l.qty_tasks_completed),
      accuracy: Number(l.accuracy),
    }));
  }
}
