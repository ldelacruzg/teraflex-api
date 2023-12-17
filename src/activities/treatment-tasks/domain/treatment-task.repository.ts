import { Resource } from '@/shared/interfaces/resource.interface';
import { TreatmentTasks } from './treatment-tasks.entity';
import { CreateTreatmentTaskDto } from './dtos/create-treatment-task.dto';

export abstract class TreatmentTaskRepository extends Resource<
  TreatmentTasks,
  CreateTreatmentTaskDto
> {
  abstract createMany(
    payload: CreateTreatmentTaskDto[],
  ): Promise<TreatmentTasks[]>;
}
