import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';
import {
  IFindAllTreatmentTasksOptions,
  IFindAllTreatmentsOptions,
} from './interfaces';
import { AssignedTaskDetailDto } from '@/activities/treatment-tasks/domain/dtos/assigned-task-detail.dto';
import { UpdateResult } from 'typeorm';
import { TreatmentSummary } from './dtos/treatment-summary.dto';
import { UpdateTreatmentDto } from './dtos/update-treatment.dto';

export interface ITreatmentService
  extends Resource<Treatment, CreateTreatmentDto | UpdateTreatmentDto> {
  updateTreatment(
    treatmentId: number,
    payload: UpdateTreatmentDto,
  ): Promise<UpdateResult>;
  
  toggleActive(treatmentId: number): Promise<UpdateResult>;

  finishTreatment(treatmentId: number): Promise<UpdateResult>;

  getTreatmentSummary(treatmentId: number): Promise<TreatmentSummary>;

  findAllTreatmentTasks(
    options: IFindAllTreatmentTasksOptions,
  ): Promise<AssignedTaskDetailDto[]>;

  findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
}
