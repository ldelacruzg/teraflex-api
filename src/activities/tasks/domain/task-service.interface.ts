import { Resource } from '@/shared/interfaces/resource.interface';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ITaskWithRelations } from './interfaces/task-with-relations.interface';

export interface ITaskService extends Resource<Task, CreateTaskDto> {
  // encontrar tarea con sus categorias y archivos
  findOneWithRelations(id: number): Promise<ITaskWithRelations>;
}
