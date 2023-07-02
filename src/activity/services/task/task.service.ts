import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateTaskCategoryDto } from 'src/activity/controllers/task/dto/create-task-category.dto';
import { CreateTaskDto } from 'src/activity/controllers/task/dto/create-task.dto';
import { UpdateTaskDto } from 'src/activity/controllers/task/dto/update-task.dto';
import { Category } from 'src/entities/category.entity';
import { TaskCategory } from 'src/entities/task-category.entity';
import { Task } from 'src/entities/task.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taksRepository: Repository<Task>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async getAllTasks() {
    return this.taksRepository.find();
  }

  async getTask(id: number) {
    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la categoria
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    // Devolver la tarea encontrada
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { categories, createdById } = createTaskDto;

    // Consulta las categorias
    const categoriesCount = await this.categoryRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: categories })
      .getCount();

    // Verifica si existen las categorias
    if (categories.length !== categoriesCount) {
      throw new BadRequestException(
        `Una o todas de las categorias ["${categories}"] no existe`,
      );
    }

    // Crea y devuelve una nueva tarea
    return this.entityManager.transaction(async (transaction) => {
      // Crear la tarea
      const task = this.taksRepository.create(createTaskDto);
      const savedTask = await transaction.save(task);

      // Crear los regitros en la tabla relacionada (TaskCategory)
      const inputTasksCategories: CreateTaskCategoryDto[] = categories.map(
        (categoryId) => ({
          taskId: savedTask.id,
          categoryId,
          createdById,
        }),
      );

      const tasksCategories =
        this.taskCategoryRepository.create(inputTasksCategories);
      await transaction.save(tasksCategories);

      // Devuelve la tarea creada
      return savedTask;
    });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const { categories, updatedById } = updateTaskDto;

    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    let missingCategories: number[];
    let newsCategories: number[];

    if (categories.length > 0) {
      // Se obtienen las categorias actuales de la tarea
      const tasksCategories = await this.taskCategoryRepository.findBy({
        taskId: id,
      });

      // Categorias actuales, faltantes y nuevos
      // Las categorias actuales de la tarea
      const currentTasksCategories = tasksCategories.map(
        (taskCategory) => taskCategory.categoryId,
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
        // Consulta las categorias
        const categoriesCount = await this.categoryRepository
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: newsCategories })
          .getCount();

        // Verifica si existen las categorias
        if (newsCategories.length !== categoriesCount) {
          throw new BadRequestException(
            `Una o todas de las categorias ["${categories}"] no existe`,
          );
        }
      }
    }

    return this.entityManager.transaction(async (transaction) => {
      // Eliminar las categorias faltantes
      if (missingCategories.length > 0) {
        const deleteTaskCategory = missingCategories.map((categoryId) => ({
          taskId: id,
          categoryId,
        }));

        for (const criteria of deleteTaskCategory) {
          await transaction.delete(TaskCategory, criteria);
        }
      }

      // Crear los regitros en la tabla relacionada (TaskCategory)
      if (newsCategories.length > 0) {
        const inputTasksCategories = newsCategories.map((categoryId) => ({
          taskId: id,
          categoryId,
          createdById: updatedById,
        }));

        const tasksCategories =
          this.taskCategoryRepository.create(inputTasksCategories);
        await transaction.save(tasksCategories);
      }

      // Actualiza y devuelve los datos de la tarea
      delete updateTaskDto.categories;
      return await transaction.update(Task, { id }, updateTaskDto);
    });
  }

  async deleteTask(id: number) {
    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    return this.entityManager.transaction(async (transaction) => {
      // Se obtienen las categorias actuales de la tarea
      const tasksCategories = await this.taskCategoryRepository.findBy({
        taskId: id,
      });

      // Las categorias actuales de la tarea solo ids
      const currentTasksCategories = tasksCategories.map(
        (taskCategory) => taskCategory.categoryId,
      );

      const deleteTaskCategory = currentTasksCategories.map((categoryId) => ({
        taskId: id,
        categoryId,
      }));

      for (const criteria of deleteTaskCategory) {
        await transaction.delete(TaskCategory, criteria);
      }

      // Devuelve la tarea eliminada
      return await transaction.delete(Task, { id });
    });
  }

  private retrieveEntityProperties() {
    const taskMetadata = this.entityManager.connection.getMetadata(Task);

    const properties = taskMetadata.columns.map(
      (column) => column.propertyName,
    );

    return properties;
  }
}
