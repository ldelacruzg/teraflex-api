import { Injectable } from '@nestjs/common';
import { ILeaderboardService } from '../domain/leaderboard-service.interface';
import { CreateLeaderboardDto } from '../domain/dtos/create-learderboard.dto';
import { Leaderboard } from '../domain/leaderboard.entity';
import { LeaderboardRepository } from '../domain/leaderboard.repository';

@Injectable()
export class LeaderboardService implements ILeaderboardService {
  constructor(private readonly repository: LeaderboardRepository) {}

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
