import { Repository } from 'typeorm';
import { CreateTreatmentTaskDto } from '../domain/dtos/create-treatment-task.dto';
import { TreatmentTaskRepository } from '../domain/treatment-task.repository';
import { TreatmentTasks } from '../domain/treatment-tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IFindAssignedTasksByPatient } from '../domain/interfaces';

export class TreatmentTaskRepositoryTypeOrmPostgres
  implements TreatmentTaskRepository
{
  constructor(
    @InjectRepository(TreatmentTasks)
    private readonly repository: Repository<TreatmentTasks>,
  ) {}

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
