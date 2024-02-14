import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';
import {
  IFindAllTreatmentTasksOptions,
  IFindAllTreatmentsOptions,
} from './interfaces';
import { AssignedTaskDetailDto } from '@/activities/treatment-tasks/domain/dtos/assigned-task-detail.dto';
import { UpdateResult } from 'typeorm';

export interface ITreatmentService
  extends Resource<Treatment, CreateTreatmentDto> {
  finishTreatment(treatmentId: number): Promise<UpdateResult>;

  findAllTreatmentTasks(
    options: IFindAllTreatmentTasksOptions,
  ): Promise<AssignedTaskDetailDto[]>;

  findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
}
