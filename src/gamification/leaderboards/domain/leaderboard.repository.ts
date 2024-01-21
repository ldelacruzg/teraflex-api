import { Resource } from '@/shared/interfaces/resource.interface';
import { Leaderboard } from './leaderboard.entity';
import { CreateLeaderboardDto } from './dtos/create-learderboard.dto';
import { Rank } from './rank.enum';
import { PatientLeaderboard } from '@/entities';
import { EntityManager } from 'typeorm';

export abstract class LeaderboardRepository extends Resource<
  Leaderboard,
  CreateLeaderboardDto
> {
  // actualizar la suma de experiencia de un paciente en la tabla de clasificación
  abstract updatePatientExperienceInLeaderboard(
    patientId: number,
    leaderboardId: number,
    experience: number,
    options?: { tx?: EntityManager },
  ): Promise<void>;

  // crear un registro de paciente en la tabla de clasificación
  abstract createPatientInLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<PatientLeaderboard>;

  // obtener el paciente en la tabla de clasificación
  abstract findPatientInLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<PatientLeaderboard>;

  // verificar que el paciente pertenece a un tabla de clasificación
  abstract verifyPatientBelongsToLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<boolean>;

  // obtener la tabla de clasificación por el rango
  abstract findCurrentLeaderboardByRank(rank: Rank): Promise<Leaderboard>;
}
