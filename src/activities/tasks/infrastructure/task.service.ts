import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskService } from '../domain/task-service.interface';
import { CreateTaskDto } from '../domain/dtos/create-task.dto';
import { Task } from '../domain/task.entity';
import { TaskRespository } from '../domain/task.repository';
import { CategoryRepository } from '@/activities/repositories/category/category.respository';
import { MultimediaRepository } from '@/multimedia/services/multimedia.repository';
import { ITaskWithRelations } from '../domain/interfaces';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    private readonly repository: TaskRespository,
    private readonly categoryRepository: CategoryRepository,
    private readonly multimediaRepository: MultimediaRepository,
  ) {}

  async findOneWithRelations(id: number): Promise<ITaskWithRelations> {
    // Obtener tarea
    const task = await this.repository.findOne(id);
    if (!task) {
      throw new BadRequestException(`La tarea con id [${id}] no existe`);
    }

    const [categories, links] = await Promise.all([
      this.categoryRepository.findTaskCategories(id),
      this.multimediaRepository.findTaskMultimedia(id),
    ]);

    return {
      task,
      categories,
      links,
    };
  }

  async create(payload: CreateTaskDto): Promise<Task> {
    const { categoryIds, fileIds } = payload;
    // verificar que las categorias existen
    const existsCategories = await this.categoryRepository.exists(categoryIds);
    if (!existsCategories) {
      throw new BadRequestException(
        `Una o todas las categorias con id [${categoryIds}] no existe`,
      );
    }

    // verificar que los archivos existen
    const existsFiles = await this.multimediaRepository.exists(fileIds);
    if (fileIds.length > 0 && !existsFiles) {
      throw new BadRequestException(
        `Uno o todos los archivos con id [${fileIds}] no existe`,
      );
    }

    return this.repository.create(payload);
  }

  findAll(): Promise<Task[]> {
    return this.repository.findAll();
  }

  findOne(id: number): Promise<Task> {
    return this.repository.findOne(id);
  }

  update(id: number, payload: CreateTaskDto): Promise<Task> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Task> {
    throw new Error('Method not implemented.');
  }
}
