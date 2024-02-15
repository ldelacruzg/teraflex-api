import { Brackets, EntityManager, Repository, UpdateResult } from 'typeorm';
import { Treatment } from '../domain/treatment.entity';
import { TreatmentRepository } from '../domain/treatment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';
import {
  IFindAllTreatmentTasksOptions,
  IFindAllTreatmentsOptions,
} from '../domain/interfaces';
import { TreatmentTasks } from '@/entities';
import {
  TreatmentRawOneDto,
} from './mappers/treatment-typeorm-postgres.mapper';
import moment from 'moment-timezone';
import { TreatmentSummary } from '../domain/dtos/treatment-summary.dto';

export class TreatmentRepositoryTypeOrmPostgres implements TreatmentRepository {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatment: Repository<Treatment>,
    @InjectRepository(TreatmentTasks)
    private readonly treatmentTasks: Repository<TreatmentTasks>,
  ) {}
  toggleActive(treatmentId: number): Promise<UpdateResult> {
    return this.treatment
      .createQueryBuilder()
      .update(Treatment)
      .set({ isActive: () => 'NOT "is_active"' })
      .where('id = :id', { id: treatmentId })
      .returning('*')
      .execute();
  }

  findTreatmentSummary(treatmentId: number): Promise<TreatmentSummary> {
    return this.treatment
      .createQueryBuilder('t')
      .select(['t.id AS id', 't.title as title'])
      .addSelect('COUNT(tt.id)::integer', 'numberTasks')
      .addSelect('COUNT(tt.performance_date)::integer', 'completedTasks')
      .addSelect(`COUNT(CASE WHEN date(now() AT TIME ZONE 'America/Guayaquil') > tt.expiration_date AND tt.performance_date IS NULL THEN tt.id END)::integer`, 'overdueTasks')
      .addSelect(`COUNT(CASE WHEN date(now() AT TIME ZONE 'America/Guayaquil') <= tt.expiration_date AND tt.performance_date IS NULL THEN tt.id END)::integer`, 'pendingTasks')
      .leftJoin('t.treatmentTasks', 'tt')
      .where('t.id = :id', { id: treatmentId })
      .groupBy('t.id')
      .addGroupBy('t.title')
      .getRawOne<TreatmentSummary>();
  }

  finishTreatment(treatmentId: number): Promise<UpdateResult> {
    const today = moment().tz('America/Guayaquil').format('YYYY-MM-DD');

    return this.treatment
      .createQueryBuilder()
      .update(Treatment)
      .set({ isActive: false, endDate: today })
      .where('id = :id', { id: treatmentId })
      .returning('*')
      .execute();
  }

  findTasks(
    treatmentId: number,
    options?: Omit<IFindAllTreatmentTasksOptions, 'treatmentId'>,
  ): Promise<TreatmentTasks[]> {
    const { completedTasks, pendingTasks, expiredTasks } = options;
    const params = [completedTasks, pendingTasks, expiredTasks];
    const paramsValid = params.every(
      (value) => typeof value === 'boolean' && !value,
    );

    const query = this.treatmentTasks
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.task', 'tsk')
      .innerJoinAndSelect('a.treatment', 't')
      .where('a.treatmentId = :treatmentId', { treatmentId })
      .andWhere(
        new Brackets((qb) => {
          if (paramsValid) {
            qb.where('1=2');
            return;
          }

          if (completedTasks !== undefined && completedTasks) {
            qb.andWhere('a.performanceDate IS NOT NULL');
          }

          if (pendingTasks !== undefined && pendingTasks) {
            qb.orWhere(
              'a.performanceDate IS NULL AND a.expirationDate >= CURRENT_DATE',
            );
          }

          if (expiredTasks !== undefined && expiredTasks) {
            qb.orWhere(
              'a.performanceDate IS NULL AND a.expirationDate < CURRENT_DATE',
            );
          }
        }),
      )
      .orderBy('a.assignmentDate', 'DESC')
      .addOrderBy('a.performanceDate', 'DESC', 'NULLS FIRST');

    return query.getMany();
  }

  existsAndIsActive(id: number): Promise<boolean> {
    const result = this.treatment
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .andWhere('t.isActive = :isActive', { isActive: true })
      .getExists();

    return result;
  }

  async exists(ids: number[]): Promise<boolean> {
    const count = await this.treatment
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }

  create(payload: CreateTreatmentDto, tx?: EntityManager): Promise<Treatment> {
    if (tx) return tx.save(Treatment, payload);
    return this.treatment.save(payload);
  }

  async findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
  async findAll(
    options?: IFindAllTreatmentsOptions,
  ): Promise<Treatment[] | TreatmentRawOneDto[]> {
    const { patientId, treatmentActive, tasksNumber } = options;
    const query = this.treatment.createQueryBuilder('t');
    const isSubQuery = tasksNumber !== undefined && tasksNumber;

    if (isSubQuery) {
      query.select(['t.id AS id', 't.title as title']);
      query.addSelect('COUNT(tt.id)::integer', 'numberTasks');
      query.addSelect('COUNT(tt.performance_date)::integer', 'completedTasks');
      query.addSelect(`COUNT(CASE WHEN date(now() AT TIME ZONE 'America/Guayaquil') > tt.expiration_date AND tt.performance_date IS NULL THEN tt.id END)::integer`, 'overdueTasks');
      query.addSelect(`COUNT(CASE WHEN date(now() AT TIME ZONE 'America/Guayaquil') <= tt.expiration_date AND tt.performance_date IS NULL THEN tt.id END)::integer`, 'pendingTasks');
      query.leftJoin('t.treatmentTasks', 'tt');
    }

    if (patientId) {
      query.where('t.patientId = :patientId', { patientId });
    }

    if (treatmentActive !== undefined) {
      query.andWhere('t.isActive = :isActive', { isActive: treatmentActive });
    }

    if (isSubQuery) {
      query.groupBy('t.id')
        .addGroupBy('t.title');
    }

    query.orderBy('t.startDate', 'DESC');

    return isSubQuery
      ? query.getRawMany<TreatmentRawOneDto>()
      : query.getMany();
  }

  findOne(id: number): Promise<Treatment> {
    return this.treatment.findOne({
      where: { id },
    });
  }

  update(
    id: number,
    payload: CreateTreatmentDto,
    tx?: any,
  ): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  remove(id: number, tx?: any): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }
}
