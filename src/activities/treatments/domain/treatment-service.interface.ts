import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';
import {
  IFindAllTreatmentTasksOptions,
  IFindAllTreatmentsOptions,
} from './interfaces';
import { AssignedTaskDetailDto } from '@/activities/treatment-tasks/domain/dtos/assigned-task-detail.dto';

export interface ITreatmentService
  extends Resource<Treatment, CreateTreatmentDto> {
  findAllTreatmentTasks(
    options: IFindAllTreatmentTasksOptions,
  ): Promise<AssignedTaskDetailDto[]>;

  findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
}
