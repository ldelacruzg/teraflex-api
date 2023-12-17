import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from '../domain/dtos/create-task.dto';
import { Task } from '../domain/task.entity';
import { TaskRespository } from '../domain/task.repository';
import { EntityManager, Repository } from 'typeorm';
import { TaskCategory, TaskMultimedia } from '@/entities';
import { CreateTaskCategoryDto } from '../domain/dtos/create-task-category.dto';
import { CreateTaskLinkDto } from '../domain/dtos/create-task-link.dto';

export class TaskRepositoryTypeOrmPostgres implements TaskRespository {
  constructor(
    @InjectRepository(Task) private readonly task: Repository<Task>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async exists(ids: number[]): Promise<boolean> {
    const count = await this.task
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }

  async create(payload: CreateTaskDto): Promise<Task> {
    return await this.entityManager.transaction(async (tx) => {
      // Crear nueva tarea
      const newTask = await tx.save(Task, payload);
      const { id: taskId } = newTask;

      // Asociar categorias
      const { categoryIds, createdById } = payload;
      const taskCategories: CreateTaskCategoryDto[] = categoryIds.map(
        (categoryId) => ({
          taskId,
          categoryId,
          createdById,
        }),
      );
      await tx.save(TaskCategory, taskCategories);

      // Asociar archivos
      const { fileIds } = payload;
      if (fileIds.length > 0) {
        const taskMultimedia: CreateTaskLinkDto[] = fileIds.map((linkId) => ({
          taskId,
          linkId,
          createdById,
        }));

        await tx.save(TaskMultimedia, taskMultimedia);
      }

      // Retornar tarea creada
      return newTask;
    });
  }

  findAll(tx?: EntityManager): Promise<Task[]> {
    if (tx) return tx.find(Task);
    return this.task.find();
  }

  findOne(id: number, tx?: any): Promise<Task> {
    throw new Error('Method not implemented.');
  }

  update(id: number, payload: CreateTaskDto, tx?: any): Promise<Task> {
    throw new Error('Method not implemented.');
  }

  remove(id: number, tx?: any): Promise<Task> {
    throw new Error('Method not implemented.');
  }
}
