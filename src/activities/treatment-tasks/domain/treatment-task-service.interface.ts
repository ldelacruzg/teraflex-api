import { Treatment, TreatmentTasks } from '@/entities';
import { Resource } from '@/shared/interfaces/resource.interface';
import {
  AssignTasksToTreatmentDto,
  CreateTreatmentTaskDto,
} from './dtos/create-treatment-task.dto';

export interface ITreatmentTaskService
  extends Resource<Treatment, CreateTreatmentTaskDto> {
  assignTasksToTreatment(
    payload: AssignTasksToTreatmentDto,
  ): Promise<TreatmentTasks[]>;
}
