import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskService } from '../domain/task-service.interface';
import { CreateTaskDto } from '../domain/dtos/create-task.dto';
import { Task } from '../domain/task.entity';
import { TaskRespository } from '../domain/task.repository';
import { CategoryRepository } from '@/activities/repositories/category/category.respository';
import { MultimediaRepository } from '@/multimedia/services/multimedia.repository';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    private readonly repository: TaskRespository,
    private readonly categoryRepository: CategoryRepository,
    private readonly multimediaRepository: MultimediaRepository,
  ) {}

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
    throw new Error('Method not implemented.');
  }

  update(id: number, payload: CreateTaskDto): Promise<Task> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Task> {
    throw new Error('Method not implemented.');
  }
}
