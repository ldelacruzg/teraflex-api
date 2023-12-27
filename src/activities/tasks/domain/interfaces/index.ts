import { Category, Link } from '@/entities';
import { Task } from '../task.entity';

export interface ITaskWithRelations {
  task: Task;
  categories: Category[];
  links: Link[];
}
