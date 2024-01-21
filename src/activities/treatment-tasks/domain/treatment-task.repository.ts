import { Resource } from '@/shared/interfaces/resource.interface';
import { TreatmentTasks } from './treatment-tasks.entity';
import { CreateTreatmentTaskDto } from './dtos/create-treatment-task.dto';
import { IFindAssignedTasksByPatient } from './interfaces';
import { LinkRawOne } from './dtos/raw/multimedia.raw';
import { EntityManager } from 'typeorm';

export abstract class TreatmentTaskRepository extends Resource<
  TreatmentTasks,
  CreateTreatmentTaskDto
> {
  // actualizar la fecha de finalización de una asignación
  abstract updateAssignedTaskCompletion(
    assignmentId: number,
    options?: { tx?: EntityManager },
  ): Promise<void>;

  abstract findMultimediaByAssigment(
    assigmentId: number,
  ): Promise<LinkRawOne[]>;

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
