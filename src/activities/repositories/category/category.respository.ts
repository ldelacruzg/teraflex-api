import { CreateCategoryDto } from '@/activities/controllers/category/dto/create-category.dto';
import { Category } from '@/entities';
import { Resource } from '@/shared/interfaces/resource.interface';

export abstract class CategoryRepository extends Resource<
  Category,
  CreateCategoryDto
> {
  abstract exists(ids: number[]): Promise<boolean>;
  abstract findTaskCategories(taskId: number): Promise<Category[]>;
}
