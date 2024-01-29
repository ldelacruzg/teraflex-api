import { Injectable, NotFoundException } from '@nestjs/common';
import { ILeaderboardService } from '../domain/leaderboard-service.interface';
import { CreateLeaderboardDto } from '../domain/dtos/create-learderboard.dto';
import { Leaderboard } from '../domain/leaderboard.entity';
import { LeaderboardRepository } from '../domain/leaderboard.repository';
import { LeaderboardMapper } from './mappers/leaderboard.mapper';
import { CurrentWeekLeaderboardRow } from '../domain/dtos/current-leaderboard';

@Injectable()
export class LeaderboardService implements ILeaderboardService {
  constructor(private readonly repository: LeaderboardRepository) {}
  async getCurrentWeekLeaderboardByPatient(
    patientId: number,
  ): Promise<CurrentWeekLeaderboardRow[]> {
    // verificar si el paciente pertece a la tabla de clasificación actual
    const pLeaderboard =
      await this.repository.findCurrentWeekPatientLeaderboard(patientId);

    if (!pLeaderboard) {
      throw new NotFoundException(
        'El paciente aún no pertenece a una tabla de clasificación',
      );
    }

    // obtener el rango del paciente
    const { rank } = await this.repository.findOne(pLeaderboard.leaderboardId);

    // obtener la tabla de clasificación actual
    const leaderboard = await this.repository.findCurrentWeekLeaderboard(rank);
    return LeaderboardMapper.toCurrentLeaderboardRaw(leaderboard);
  }

  create(payload: CreateLeaderboardDto): Promise<Leaderboard> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<Leaderboard[]> {
    throw new Error('Method not implemented.');
  }

  findOne<G>(id: G): Promise<Leaderboard> {
    throw new Error('Method not implemented.');
  }

  update<G>(id: G, payload: CreateLeaderboardDto): Promise<Leaderboard> {
    throw new Error('Method not implemented.');
  }

  remove<G>(id: G): Promise<Leaderboard> {
    throw new Error('Method not implemented.');
  }
}
