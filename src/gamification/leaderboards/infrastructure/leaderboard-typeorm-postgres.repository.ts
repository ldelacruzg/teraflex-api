import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaderboardDto } from '../domain/dtos/create-learderboard.dto';
import { Leaderboard } from '../domain/leaderboard.entity';
import { LeaderboardRepository } from '../domain/leaderboard.repository';
import { EntityManager, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { PatientLeaderboard, TreatmentTasks } from '@/entities';
import { FormatDateService } from '@/shared/services/format-date.service';
import { Rank } from '../domain/rank.enum';
import { SummaryLastParticipationRaw } from '../domain/raw/summary-last-participation.raw';

export class LeaderboardRepositoryTypeOrmPostgres
  implements LeaderboardRepository
{
  constructor(
    @InjectRepository(Leaderboard)
    private readonly repository: Repository<Leaderboard>,
    @InjectRepository(PatientLeaderboard)
    private readonly patientLeaderboardRepository: Repository<PatientLeaderboard>,
    @InjectRepository(TreatmentTasks)
    private readonly treatmentTaskRepository: Repository<TreatmentTasks>,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}
  async findSummaryLastParticipation(
    patientId: number,
  ): Promise<SummaryLastParticipationRaw> {
    //const lastParticipation = await this.findLastParticipation(patientId);

    // obtener los ptos de exp de los pacientes en la última participación del paciente actual
    const queryExp = this.patientLeaderboardRepository
      .createQueryBuilder('pl')
      .select(['pl.patientId as patient_id', 'pl.experience as experience'])
      .where(
        `date(joining_date at time zone 'GMT-5') between '2024-01-22' and '2024-01-28'`,
        {},
      );

    // obtener los ptos de exp objetivo y realizados de los pacientes
    const queryExpGoal = this.treatmentTaskRepository
      .createQueryBuilder('tt')
      .select([
        't.patientId as patient_id',
        'count(*) * 15 as exp_goal',
        'pl.experience as exp_made',
      ])
      .innerJoin('tt.treatment', 't')
      .leftJoin(`(${queryExp.getQuery()})`, 'pl', 'pl.patient_id = t.patientId')
      .where(
        `date(tt.assignment_date at time zone 'GMT-5') between '2024-01-22' and '2024-01-28'`,
        {},
      )
      .groupBy('t.patientId')
      .addGroupBy('pl.experience');

    // obtener el porcentaje de cumplimiento de los pacientes
    const queryExpPercentage = this.entityManager
      .createQueryBuilder()
      .select([
        '*',
        'round(sq.exp_made::numeric / sq.exp_goal::numeric, 4) as accuracy',
      ])
      .from(`(${queryExpGoal.getQuery()})`, 'sq')
      .orderBy('accuracy', 'DESC', 'NULLS LAST');

    const mainQuery = this.entityManager
      .createQueryBuilder()
      .select([
        'row_number() over (order by pp.accuracy desc nulls last) as position',
        '*',
      ])
      .from(`(${queryExpPercentage.getQuery()})`, 'pp')
      .where('patient_id = 4', {});

    return mainQuery.getRawOne<SummaryLastParticipationRaw>();
  }

  findLastParticipation(patientId: number): Promise<PatientLeaderboard> {
    const query = this.patientLeaderboardRepository
      .createQueryBuilder('pl')
      .where('pl.patientId = :patientId', { patientId })
      .orderBy(`date(pl.joining_date at time zone 'GMT-5')`, 'DESC');

    return query.getOne();
  }

  findCurrentWeekPatientLeaderboard(
    patientId: number,
  ): Promise<PatientLeaderboard> {
    const { end, start } = FormatDateService.getCurrentDateRange();
    const query = this.patientLeaderboardRepository
      .createQueryBuilder('pl')
      .where(
        `date(pl.joining_date at time zone 'GTM-5') between :start and :end`,
        { start, end },
      )
      .andWhere('pl.patientId = :patientId', { patientId });

    return query.getOne();
  }

  async getTotalWeeklyExperience(pLeaderboardId: number): Promise<number> {
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
