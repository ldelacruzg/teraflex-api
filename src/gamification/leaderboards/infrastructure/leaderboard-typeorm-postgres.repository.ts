import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaderboardDto } from '../domain/dtos/create-learderboard.dto';
import { Leaderboard } from '../domain/leaderboard.entity';
import { LeaderboardRepository } from '../domain/leaderboard.repository';
import { EntityManager, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { PatientLeaderboard } from '@/entities';
import { FormatDateService } from '@/shared/services/format-date.service';
import { Rank } from '../domain/rank.enum';

export class LeaderboardRepositoryTypeOrmPostgres
  implements LeaderboardRepository
{
  constructor(
    @InjectRepository(Leaderboard)
    private readonly repository: Repository<Leaderboard>,
    @InjectRepository(PatientLeaderboard)
    private readonly patientLeaderboardRepository: Repository<PatientLeaderboard>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}
  async getWeeklyExperience(pLeaderboardId: number): Promise<number> {
    const query = await this.patientLeaderboardRepository
      .createQueryBuilder('pl')
      .select('pl.experience')
      .where('pl.id = :pLeaderboardId', { pLeaderboardId })
      .getOne();

    return query.experience;
  }

  async updatePatientExperienceInLeaderboard(
    pLeaderboardId: number,
    experience: number,
    options?: { tx?: EntityManager },
  ): Promise<void> {
    const queryRunner = options?.tx || this.patientLeaderboardRepository;

    await queryRunner
      .createQueryBuilder()
      .update(PatientLeaderboard)
      .set({ experience: () => `experience + ${experience}` })
      .where('id = :pLeaderboardId', { pLeaderboardId })
      .execute();
  }

  createPatientInLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<PatientLeaderboard> {
    return this.patientLeaderboardRepository.save({
      patientId,
      leaderboardId,
    });
  }

  findPatientInLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<PatientLeaderboard> {
    return this.patientLeaderboardRepository
      .createQueryBuilder('pl')
      .where('pl.patientId = :patientId', { patientId })
      .andWhere('pl.leaderboardId = :leaderboardId', { leaderboardId })
      .getOne();
  }

  verifyPatientBelongsToLeaderboard(
    patientId: number,
    leaderboardId: number,
  ): Promise<boolean> {
    return this.patientLeaderboardRepository
      .createQueryBuilder('pl')
      .where('pl.patientId = :patientId', { patientId })
      .andWhere('pl.leaderboardId = :leaderboardId', { leaderboardId })
      .getExists();
  }

  findCurrentLeaderboardByRank(rank: Rank): Promise<Leaderboard> {
    const rangeDate = FormatDateService.getCurrentDateRange();

    return this.repository
      .createQueryBuilder('l')
      .where('l.rank = :rank', { rank })
      .andWhere('l.startDate = :startDate', { startDate: rangeDate.start })
      .andWhere('l.endDate = :endDate', { endDate: rangeDate.end })
      .getOne();
  }

  create(payload: CreateLeaderboardDto): Promise<Leaderboard> {
    const leaderboard = new Leaderboard();
    leaderboard.rank = payload.rank;

    return this.repository.save(leaderboard);
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
