import { Treatment, TreatmentTasks } from '@/entities';
import { Resource } from '@/shared/interfaces/resource.interface';
import {
  AssignTasksToTreatmentDto,
  CreateTreatmentTaskDto,
} from './dtos/create-treatment-task.dto';
import { IFindAssignedTasksByPatient } from './interfaces';
import { AssignedTaskFullDetailDto } from './dtos/assigned-task-detail.dto';

export interface ITreatmentTaskService
  extends Resource<Treatment, CreateTreatmentTaskDto> {
  getMultimediasByAssigment(assignmentId: number): Promise<MultimediaDto[]>;

  getAssignedTaskDetails(
    assignmentId: number,
  ): Promise<AssignedTaskFullDetailDto>;

  assignTasksToTreatment(
    payload: AssignTasksToTreatmentDto,
  ): Promise<TreatmentTasks[]>;

  getAssignedTasksByPatient(
    options: IFindAssignedTasksByPatient,
  ): Promise<TreatmentTasks[]>;
}
