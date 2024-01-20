import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaderboardDto } from '../domain/dtos/create-learderboard.dto';
import { Leaderboard } from '../domain/leaderboard.entity';
import { LeaderboardRepository } from '../domain/leaderboard.repository';
import { EntityManager, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Patient } from '@/entities';
import { FormatDateService } from '@/shared/services/format-date.service';

export class LeaderboardRepositoryTypeOrmPostgres
  implements LeaderboardRepository
{
  constructor(
    @InjectRepository(Leaderboard)
    private readonly repository: Repository<Leaderboard>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}
  patientRankLeaderboardExists(patientId: number): Promise<boolean> {
    const rangeDate = FormatDateService.getCurrentDateRange();

    return this.entityManager.transaction(async (tx) => {
      const patient = await tx.findOne(Patient, { where: { id: patientId } });
      return await tx
        .createQueryBuilder(Leaderboard, 'l')
        .where('l.rank = :rank', { rank: patient.rank })
        .andWhere('l.startDate = :startDate', { startDate: rangeDate.start })
        .andWhere('l.endDate = :endDate', { endDate: rangeDate.end })
        .getExists();
    });
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
