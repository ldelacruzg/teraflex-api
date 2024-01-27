import { Resource } from '@/shared/interfaces/resource.interface';
import { Leaderboard } from './leaderboard.entity';
import { CreateLeaderboardDto } from './dtos/create-learderboard.dto';
import { Rank } from './rank.enum';
import { PatientLeaderboard } from '@/entities';
import { EntityManager } from 'typeorm';
import { SummaryLastParticipationRaw } from './raw/summary-last-participation.raw';

export abstract class LeaderboardRepository extends Resource<
  Leaderboard,
  CreateLeaderboardDto
> {
  // encontrar el resumen de la última participación del paciente
  abstract findSummaryLastParticipation(
    patientId: number,
  ): Promise<SummaryLastParticipationRaw>;

  // encontrar la última participación del paciente
  abstract findLastParticipation(
    patientId: number,
  ): Promise<PatientLeaderboard>;

  // encontrar la tabla de clasificación del rango actual del paciente de la semana actual
  abstract findCurrentWeekPatientLeaderboard(
    patientId: number,
  ): Promise<PatientLeaderboard>;

  // obtener el total de puntos de experiencia obtenidos en la semana
  abstract getTotalWeeklyExperience(pLeaderboardId: number): Promise<number>;

  // actualizar la suma de experiencia de un paciente en la tabla de clasificación
  abstract updatePatientExperienceInLeaderboard(
    pLeaderboardId: number,
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
