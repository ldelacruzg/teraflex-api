import { Repository } from 'typeorm';
import { CreateTreatmentTaskDto } from '../domain/dtos/create-treatment-task.dto';
import { TreatmentTaskRepository } from '../domain/treatment-task.repository';
import { TreatmentTasks } from '../domain/treatment-tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class TreatmentTaskRepositoryTypeOrmPostgres
  implements TreatmentTaskRepository
{
  constructor(
    @InjectRepository(TreatmentTasks)
    private readonly repository: Repository<TreatmentTasks>,
  ) {}

  createMany(payload: CreateTreatmentTaskDto[]): Promise<TreatmentTasks[]> {
    return this.repository.save(payload);
  }

  create(payload: CreateTreatmentTaskDto): Promise<TreatmentTasks> {
    return this.repository.save(payload);
  }

  findAll(): Promise<TreatmentTasks[]> {
    throw new Error('Method not implemented.');
  }

  findOne<G>(id: G): Promise<TreatmentTasks> {
    throw new Error('Method not implemented.');
  }

  update<G>(id: G, payload: CreateTreatmentTaskDto): Promise<TreatmentTasks> {
    throw new Error('Method not implemented.');
  }

  remove<G>(id: G): Promise<TreatmentTasks> {
    throw new Error('Method not implemented.');
  }
}
