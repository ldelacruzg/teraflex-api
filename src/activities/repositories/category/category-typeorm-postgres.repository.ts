import { Category, TaskCategory } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from './category.respository';
import { CreateCategoryDto } from '@/activities/controllers/category/dto/create-category.dto';

export class CategoryRepositoryTypeOrmPostgres implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
    @InjectRepository(TaskCategory)
    private readonly taskCategory: Repository<TaskCategory>,
  ) {}

  async findTaskCategories(taskId: number): Promise<Category[]> {
    const taskCategories = await this.taskCategory.find({ where: { taskId } });
    const categoryIds = taskCategories.map(
      (taskCategory) => taskCategory.categoryId,
    );

    if (categoryIds.length === 0) return [];

    const categories = await this.category
      .createQueryBuilder()
      .where('id IN (:...categoryIds)', { categoryIds })
      .getMany();

    return categories;
  }

  async exists(ids: number[]) {
    if (ids.length === 0) return true;

    const count = await this.category
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }

  create(payload: CreateCategoryDto): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  findOne(id: number): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  update(id: number, payload: CreateCategoryDto): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Category> {
    throw new Error('Method not implemented.');
  }
}
