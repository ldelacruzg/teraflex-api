import { CreateCategoryDto } from '@/activities/controllers/category/dto/create-category.dto';
import { UpdateTaskDto } from '@/activities/tasks/domain/dtos/update-task.dto';
import { Category } from '@/entities';
import { Resource } from '@/shared/interfaces/resource.interface';

export abstract class CategoryRepository extends Resource<
  Category,
  CreateCategoryDto
> {
  abstract updateTaskWithRelations(options: {
    missingCategories: number[];
    newsCategories: number[];
    taskId: number;
    createdById: number;
    payload: UpdateTaskDto;
  }): Promise<any>;

  abstract exists(ids: number[]): Promise<boolean>;
  abstract findTaskCategories(taskId: number): Promise<Category[]>;
}
