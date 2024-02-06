import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ITaskService } from '../domain/task-service.interface';
import { CreateTaskDto } from '../domain/dtos/create-task.dto';
import { Task } from '../domain/task.entity';
import { TaskRespository } from '../domain/task.repository';
import { CategoryRepository } from '@/activities/repositories/category/category.respository';
import { MultimediaRepository } from '@/multimedia/services/multimedia.repository';
import { ITaskWithRelations } from '../domain/interfaces';
import { UpdateTaskDto } from '../domain/dtos/update-task.dto';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    private readonly repository: TaskRespository,
    private readonly categoryRepository: CategoryRepository,
    private readonly multimediaRepository: MultimediaRepository,
  ) {}
  async deleteTask(data: { id: number; updatedById: number }) {
    const { id, updatedById } = data;

    // Consulta la tarea por Id
    const task = await this.repository.findOne(id);

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con id (${id}) no existe`);
    }

    // cambia el estado de la tarea como "eliminada" (false)
    return this.repository.changeStatus({
      id,
      status: false,
      updatedById,
    });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const { categories, updatedById } = updateTaskDto;

    // Consulta la tarea por Id
    const task = await this.repository.findOne(id);

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con Id (${id}) no existe`);
    }

    let missingCategories: number[];
    let newsCategories: number[];

    if (categories.length > 0) {
      // Se obtienen las categorias actuales de la tarea
      const tasksCategories = await this.categoryRepository.findTaskCategories(
        id,
      );

      // Categorias actuales, faltantes y nuevos
      // Las categorias actuales de la tarea
      const currentTasksCategories = tasksCategories.map(
        (taskCategory) => taskCategory.id,
      );

      // Se obtiene las categorias faltantes de la tarea (eliminar)
      missingCategories = currentTasksCategories.filter(
        (categoryId) => !categories.includes(categoryId),
      );

      // Se obtienen las categorias nuevas de la tarea (agregar)
      newsCategories = categories.filter(
        (categoryId) => !currentTasksCategories.includes(categoryId),
      );

      if (newsCategories.length > 0) {
        // Verifica si existen las categorias
        const categoriesExists = await this.categoryRepository.exists(
          newsCategories,
        );

        if (!categoriesExists) {
          throw new BadRequestException(
            `Una o todas de las categorias [${categories}] no existen`,
          );
        }
      }
    }

    return this.categoryRepository.updateTaskWithRelations({
      missingCategories,
      newsCategories,
      taskId: id,
      createdById: updatedById,
      payload: updateTaskDto,
    });
  }

  async getAllTasks(options: { userId?: number; status?: boolean }) {
    const { userId, status } = options;

    // get tasks
    const tasks = await this.repository.findTasksWithCategoriesByTherapist(
      userId,
      status,
    );

    // return tasks
    return tasks.map((task) => {
      const categoryIds = task.tasksCategories.map(
        ({ categoryId }) => categoryId,
      );

      delete task.tasksCategories;
      return {
        ...task,
        categoryIds,
      };
    });
  }

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
