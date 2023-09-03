import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from '@activities/controllers/task/dto/create-task.dto';
import { UpdateTaskDto } from '@activities/controllers/task/dto/update-task.dto';
import { ICreateTaskCategory } from '@activities/interfaces/create-task-category.interface';
import { ICreateTaskMultimedia } from '@activities/interfaces/create-task-multimedia.interface';
import { Category } from '@entities/category.entity';
import { Link } from '@entities/link.entity';
import { TaskCategory } from '@entities/task-category.entity';
import { TaskMultimedia } from '@entities/task-multimedia.entity';
import { Task } from '@entities/task.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taksRepository: Repository<Task>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async getAllTasks(options: {
    userId?: number;
    status?: boolean;
    isPublic?: boolean;
  }) {
    const { userId, status, isPublic } = options;

    // create query builder and select fields
    const query = await this.taksRepository
      .createQueryBuilder('task')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.estimatedTime',
        'task.status',
        'task.isPublic',
        'task.createdAt',
        'task.updatedAt',
      ])
      .innerJoinAndSelect('task.tasksCategories', 'tasksCategories');

    // if userId exists, add where clause
    if (userId) {
      query.where('task.createdById = :userId', { userId });
    }

    // get all public tasks
    if (isPublic !== undefined) {
      query.orWhere('task.isPublic = :isPublic', { isPublic: true });
    }

    // if status exists, add where clause
    if (status !== undefined) {
      query.andWhere('task.status = :status', { status });
    }

    // order by the date of creation
    query.orderBy('task.createdAt', 'DESC');

    // get tasks
    const tasks = await query.getMany();

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

  async getTask(id: number) {
    // Consulta la tarea por Id
    const task = await this.entityManager.findOne(Task, {
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        estimatedTime: true,
        isPublic: true,
        createdBy: {
          id: true,
          firstName: true,
          lastName: true,
        },
        tasksCategories: {
          id: true,
          category: {
            id: true,
            name: true,
          },
        },
        tasksMultimedia: {
          id: true,
          link: {
            id: true,
            title: true,
            url: true,
            type: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        tasksCategories: {
          category: true,
        },
        tasksMultimedia: {
          link: true,
        },
        createdBy: true,
      },
    });

    // Verifica si no existe la categoria
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    // Se obtiene las categorias de la tarea
    const categories = task.tasksCategories.map(({ category }) => category);

    // Se obtiene los archivos de la tarea
    const files = task.tasksMultimedia.map(({ link }) => link);

    // Devolver la tarea encontrada
    delete task.tasksCategories;
    delete task.tasksMultimedia;
    return {
      ...task,
      categories,
      files,
    };
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { categoryIds, fileIds, createdById } = createTaskDto;

    // Consulta las categorias
    const categoriesCount = await this.categoryRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: categoryIds })
      .getCount();

    // Verifica si existen las categorias
    if (categoryIds.length !== categoriesCount) {
      throw new BadRequestException(
        `Una o todas las categorias con ["${categoryIds}"] no existe`,
      );
    }

    // Consulta los archivos
    const anyFiles = fileIds.length > 0;
    if (anyFiles) {
      const filesCount = await this.linkRepository
        .createQueryBuilder()
        .where('id IN (:...ids)', { ids: fileIds })
        .getCount();

      // Verifica si existen los archivos
      if (fileIds.length !== filesCount) {
        throw new BadRequestException(
          `Uno o todos los archivos con ["${fileIds}"] no existe`,
        );
      }
    }

    // Crea y devuelve una nueva tarea
    return this.entityManager.transaction(async (transaction) => {
      // Crear la tarea
      const task = transaction.create(Task, createTaskDto);
      const savedTask = await transaction.save(task);

      // Crear los regitros en la tabla relacionada (TaskCategory)
      const inputTasksCategories: ICreateTaskCategory[] = categoryIds.map(
        (categoryId) => ({
          taskId: savedTask.id,
          categoryId,
          createdById,
        }),
      );

      const tasksCategories = transaction.create(
        TaskCategory,
        inputTasksCategories,
      );
      await transaction.save(tasksCategories);

      // Crear los registros en la tabla relacionada (TaskMultimedia)
      if (anyFiles) {
        const inputTasksMultimedia: ICreateTaskMultimedia[] = fileIds.map(
          (linkId) => ({
            linkId,
            taskId: savedTask.id,
            createdById,
          }),
        );

        const tasksMultimedia = transaction.create(
          TaskMultimedia,
          inputTasksMultimedia,
        );
        await transaction.save(tasksMultimedia);
      }

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

  async deleteTask(data: { id: number; updatedById: number }) {
    const { id, updatedById } = data;

    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    // cambia el estado de la tarea como "eliminada" (false)
    return this.taksRepository.update({ id }, { status: false, updatedById });
  }
}
