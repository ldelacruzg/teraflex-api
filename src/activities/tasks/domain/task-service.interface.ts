import { Resource } from '@/shared/interfaces/resource.interface';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';

export interface ITaskService extends Resource<Task, CreateTaskDto> {}
