import { Category, Task, TaskCategory } from '@/entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CategoryRepository } from './category.respository';
import { CreateCategoryDto } from '@/activities/controllers/category/dto/create-category.dto';
import { UpdateTaskDto } from '@/activities/tasks/domain/dtos/update-task.dto';

export class CategoryRepositoryTypeOrmPostgres implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
    @InjectRepository(TaskCategory)
    private readonly taskCategory: Repository<TaskCategory>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async updateTaskWithRelations(options: {
    missingCategories: number[];
    newsCategories: number[];
    taskId: number;
    createdById: number;
    payload: UpdateTaskDto;
  }) {
    const { missingCategories, newsCategories, taskId, createdById, payload } =
      options;
    return this.entityManager.transaction(async (tx) => {
      // Eliminar las categorias faltantes
      if (missingCategories.length > 0) {
        const deleteTaskCategory = missingCategories.map((categoryId) => ({
          taskId,
          categoryId,
        }));

        for (const criteria of deleteTaskCategory) {
          await tx.delete(TaskCategory, criteria);
        }
      }

      // Crear los regitros en la tabla relacionada (TaskCategory)
      if (newsCategories.length > 0) {
        const inputTasksCategories = newsCategories.map((categoryId) => ({
          taskId,
          categoryId,
          createdById,
        }));

        const tasksCategories = this.taskCategory.create(inputTasksCategories);
        await tx.save(tasksCategories);
      }

      // Actualiza y devuelve los datos de la tarea
      delete payload.categories;
      return await tx.update(Task, taskId, payload);
    });
  }

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
