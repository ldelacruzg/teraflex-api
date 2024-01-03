import { EntityManager, Repository } from 'typeorm';
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
  TreatmentRawOne,
  TreatmentRawOneDto,
  TreatmentTypeOrmPostgresMapper,
} from './mappers/treatment-typeorm-postgres.mapper';

export class TreatmentRepositoryTypeOrmPostgres implements TreatmentRepository {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatment: Repository<Treatment>,
    @InjectRepository(TreatmentTasks)
    private readonly treatmentTasks: Repository<TreatmentTasks>,
  ) {}

  findTasks(
    treatmentId: number,
    options?: Omit<IFindAllTreatmentTasksOptions, 'treatmentId'>,
  ): Promise<TreatmentTasks[]> {
    const { taskDone, treatmentActive } = options;

    const query = this.treatmentTasks
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.task', 'tsk')
      .innerJoin('a.treatment', 't')
      .where('t.id = :treatmentId', { treatmentId });

    if (taskDone !== undefined) {
      query.andWhere(
        taskDone
          ? 'a.performanceDate IS NOT NULL'
          : 'a.performanceDate IS NULL',
      );
    }

    if (treatmentActive !== undefined) {
      query.andWhere('t.isActive = :isActive', { isActive: treatmentActive });
    }

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
      query.select(['t.id', 't.title']);
      query.addSelect(
        (subQuery) =>
          subQuery
            .select('count(*)', 'numberTasks')
            .from(TreatmentTasks, 'tt')
            .where('tt.treatmentId = t.id'),
        'numberTasks',
      );

      query.addSelect(
        (subQuery) =>
          subQuery
            .select('count(*)', 'completedTasks')
            .from(TreatmentTasks, 'tt')
            .where('tt.treatmentId = t.id')
            .andWhere('tt.performanceDate IS NOT NULL'),
        'completedTasks',
      );

      query.addSelect(
        (subQuery) =>
          subQuery
            .select('count(*)', 'pendingTasks')
            .from(TreatmentTasks, 'tt')
            .where('tt.treatmentId = t.id')
            .andWhere('tt.performanceDate IS NULL'),
        'pendingTasks',
      );
    }

    if (patientId) {
      query.where('t.patientId = :patientId', { patientId });
    }

    if (treatmentActive !== undefined) {
      query.andWhere('t.isActive = :isActive', { isActive: treatmentActive });
    }

    return isSubQuery
      ? TreatmentTypeOrmPostgresMapper.fromRawMany(await query.getRawMany())
      : query.getMany();
  }

  findOne(id: number, tx?: any): Promise<Treatment> {
    throw new Error('Method not implemented.');
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
