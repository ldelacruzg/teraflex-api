import { Resource } from '@/shared/interfaces/resource.interface';
import { Leaderboard } from './leaderboard.entity';
import { CreateLeaderboardDto } from './dtos/create-learderboard.dto';
import { CurrentWeekLeaderboardRow } from './dtos/current-leaderboard';

export interface ILeaderboardService
  extends Resource<Leaderboard, CreateLeaderboardDto> {
  // obtener la tabla de clasificación actual por paciente
  getCurrentWeekLeaderboardByPatient(
    patientId: number,
  ): Promise<CurrentWeekLeaderboardRow[]>;
}
