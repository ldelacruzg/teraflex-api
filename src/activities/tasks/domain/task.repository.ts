import { Resource } from '@/shared/interfaces/resource.interface';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from './task.entity';

export abstract class TaskRespository extends Resource<Task, CreateTaskDto> {
  // find tasks with categories by therapist
  abstract findTasksWithCategoriesByTherapist(
    therapistId: number,
    status?: boolean,
  ): Promise<Task[]>;

  abstract exists(ids: number[]): Promise<boolean>;
}
