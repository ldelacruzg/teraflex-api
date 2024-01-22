import { EntityManager, Repository } from 'typeorm';
import { CreateTreatmentTaskDto } from '../domain/dtos/create-treatment-task.dto';
import { TreatmentTaskRepository } from '../domain/treatment-task.repository';
import { TreatmentTasks } from '../domain/treatment-tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IFindAssignedTasksByPatient } from '../domain/interfaces';
import { LinkRawOne } from '../domain/dtos/raw/multimedia.raw';
import moment from 'moment-timezone';
import { Inject } from '@nestjs/common';
import { LeaderboardRepository } from '@/gamification/leaderboards';
import { PatientRepository } from '@/gamification/patients';
import { FormatDateService } from '@/shared/services/format-date.service';
import { Environment } from '@/shared/constants/environment';

export class TreatmentTaskRepositoryTypeOrmPostgres
  implements TreatmentTaskRepository
{
  constructor(
    @InjectRepository(TreatmentTasks)
    private readonly repository: Repository<TreatmentTasks>,
    @Inject(LeaderboardRepository)
    private readonly leaderboardRepository: LeaderboardRepository,
    @Inject(PatientRepository)
    private readonly patientRepository: PatientRepository,
    @Inject(EntityManager)
    private readonly entityManager: EntityManager,
  ) {}
  async getTotalWeeklyAssignedTasks(patientId: number): Promise<number> {
    const { end, start } = FormatDateService.getCurrentDateRange();

    const numAssignedTask = await this.repository
      .createQueryBuilder('a')
      .innerJoin('a.treatment', 't')
      .where('t.patientId = :patientId', { patientId })
      .andWhere('date(a.assignmentDate) BETWEEN :start AND :end', {
        start,
        end,
      })
      .getCount();

    return numAssignedTask;
  }

  async getTotalCompletedAssignedTasksHistory(
    patientId: number,
  ): Promise<number> {
    const numAssigedTaskCompleted = await this.repository
      .createQueryBuilder('a')
      .innerJoin('a.treatment', 't')
      .where('t.patientId = :patientId', { patientId })
      .andWhere('a.performanceDate IS NOT NULL')
      .getCount();

    return numAssigedTaskCompleted;
  }

  async getTotalAssignedTasksHistory(patientId: number): Promise<number> {
    const numAssignedTask = await this.repository
      .createQueryBuilder('a')
      .innerJoin('a.treatment', 't')
      .where('t.patientId = :patientId', { patientId })
      .getCount();

    return numAssignedTask;
  }

  async getWeeklyExperience(patientId: number): Promise<number> {
    const numAssignedTask = await this.getTotalWeeklyAssignedTasks(patientId);
    return numAssignedTask * Environment.AMOUNT_EXPERIENCE_PER_TASK_PERFORMED;
  }

  async finishAssignedTask(
    assignmentId: number,
    patientId: number,
    pLeaderboardId: number,
    experience: number,
    flexicoins: number,
  ) {
    await this.entityManager.transaction(async (tx) => {
      await Promise.all([
        // actualizar la suma de experiencia (patient_leaderboard)
        this.leaderboardRepository.updatePatientExperienceInLeaderboard(
          pLeaderboardId,
          experience,
          { tx },
        ),

        // actualizar la suma de experiencia y flexicoins (patient)
        this.patientRepository.updateExperience(patientId, experience, { tx }),
        this.patientRepository.updateFlexicoins(patientId, flexicoins, { tx }),

        // actualizar fecha de realización de la tarea (treatment_tasks)
        this.updateAssignedTaskCompletion(assignmentId, { tx }),
      ]);
    });
  }

  async updateAssignedTaskCompletion(
    assignmentId: number,
    options?: { tx?: EntityManager },
  ): Promise<void> {
    const queryRunner = options?.tx || this.repository;

    await queryRunner
      .createQueryBuilder()
      .update(TreatmentTasks)
      .set({ performanceDate: moment().format() })
      .where('id = :assignmentId', { assignmentId })
      .execute();
  }

  async findMultimediaByAssigment(assigmentId: number): Promise<LinkRawOne[]> {
    const query = await this.repository
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.task', 'tsk')
      .innerJoinAndSelect('tsk.tasksMultimedia', 'tm')
      .innerJoinAndSelect('tm.link', 'l')
      .innerJoinAndSelect('l.createdBy', 'u')
      .select([
        'l.id',
        'l.title',
        'l.description',
        'l.url',
        'l.status',
        'l.type',
        "concat(u.firstName, ' ', u.lastName) as therapist",
      ])
      .where('a.id = :assigmentId', { assigmentId })
      .getRawMany();

    return query as LinkRawOne[];
  }

  async findAssignedTaskDetails(assignmentId: number): Promise<TreatmentTasks> {
    const query = await this.repository
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.task', 'tsk')
      .innerJoinAndSelect('tsk.tasksMultimedia', 'tm')
      .innerJoinAndSelect('tm.link', 'l')
      .where('a.id = :assignmentId', { assignmentId })
      .getOne();

    return query;
  }

  async exists(ids: number[]): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('a')
      .where('a.id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }

  async findAssignedTasksByPatient(
    options: IFindAssignedTasksByPatient,
  ): Promise<TreatmentTasks[]> {
    const { patientId, taskDone, treatmentActive } = options;

    const query = this.repository
      .createQueryBuilder('a')
      .innerJoinAndSelect('treatments', 't', 't.id = a.treatmentId')
      .where('t.patientId = :patientId', { patientId });

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

  createMany(payload: CreateTreatmentTaskDto[]): Promise<TreatmentTasks[]> {
    return this.repository.save(payload);
  }

  create(payload: CreateTreatmentTaskDto): Promise<TreatmentTasks> {
    return this.repository.save(payload);
  }

  findAll(): Promise<TreatmentTasks[]> {
    throw new Error('Method not implemented.');
  }

  async findOne(id: number): Promise<TreatmentTasks> {
    const treatmentTask = this.repository.findOne({
      where: { id },
    });

    return treatmentTask;
  }

  update<G>(id: G, payload: CreateTreatmentTaskDto): Promise<TreatmentTasks> {
    throw new Error('Method not implemented.');
  }

  remove<G>(id: G): Promise<TreatmentTasks> {
    throw new Error('Method not implemented.');
  }
}
