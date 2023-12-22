import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaderboardDto } from '../domain/dtos/create-learderboard.dto';
import { Leaderboard } from '../domain/leaderboard.entity';
import { LeaderboardRepository } from '../domain/leaderboard.repository';
import { Repository } from 'typeorm';

export class LeaderboardRepositoryTypeOrmPostgres
  implements LeaderboardRepository
{
  constructor(
    @InjectRepository(Leaderboard)
    private readonly repository: Repository<Leaderboard>,
  ) {}

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
