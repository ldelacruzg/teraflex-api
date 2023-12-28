import { Resource } from '@/shared/interfaces/resource.interface';
import { TreatmentTasks } from './treatment-tasks.entity';
import { CreateTreatmentTaskDto } from './dtos/create-treatment-task.dto';
import { IFindAssignedTasksByPatient } from './interfaces';

export abstract class TreatmentTaskRepository extends Resource<
  TreatmentTasks,
  CreateTreatmentTaskDto
> {
  abstract findAssignedTaskDetails(
    assignmentId: number,
  ): Promise<TreatmentTasks>;

  abstract exists(ids: number[]): Promise<boolean>;

  abstract findAssignedTasksByPatient(
    options: IFindAssignedTasksByPatient,
  ): Promise<TreatmentTasks[]>;

  abstract createMany(
    payload: CreateTreatmentTaskDto[],
  ): Promise<TreatmentTasks[]>;
}
