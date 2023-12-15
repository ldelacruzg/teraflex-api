import { Resource } from '@/shared/interfaces/resource.interface';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from './task.entity';

export abstract class TaskRespository extends Resource<Task, CreateTaskDto> {}
