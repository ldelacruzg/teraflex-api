import { Resource } from '@/shared/interfaces/resource.interface';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from './task.entity';
import { UpdateResult } from 'typeorm';

export abstract class TaskRespository extends Resource<Task, CreateTaskDto> {
  // change status of task
  abstract changeStatus(options: {
    id: number;
    status: boolean;
    updatedById: number;
  }): Promise<UpdateResult>;

  // find tasks with categories by therapist
  abstract findTasksWithCategoriesByTherapist(
    therapistId: number,
    status?: boolean,
  ): Promise<Task[]>;

  abstract exists(ids: number[]): Promise<boolean>;
}
