import { Resource } from '@/shared/interfaces/resource.interface';
import { Leaderboard } from './leaderboard.entity';
import { CreateLeaderboardDto } from './dtos/create-learderboard.dto';
import { Rank } from './rank.enum';

export abstract class LeaderboardRepository extends Resource<
  Leaderboard,
  CreateLeaderboardDto
> {
  // verificar que el paciente pertenece a un tabla de clasificación
  abstract verifyPatientBelongsToLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<boolean>;

  // obtener la tabla de clasificación por el rango
  abstract findCurrentLeaderboardByRank(rank: Rank): Promise<Leaderboard>;
}
