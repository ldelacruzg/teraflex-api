import { Resource } from '@/shared/interfaces/resource.interface';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ITaskWithRelations } from './interfaces';

export interface ITaskService extends Resource<Task, CreateTaskDto> {
  findOneWithRelations(id: number): Promise<ITaskWithRelations>;
}
