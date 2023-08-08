import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyAssignmentsDto } from '@activity/controllers/assignment/dto/create-many-assignments.dto';
import { RemoveManyAssignmentDto } from '@activity/controllers/assignment/dto/remove-many-assigments.dto';
import { IAssignedTaskDetail } from '@activity/interfaces/assigned-task-detail.interface';
import { IAssignedTaskFileDetail } from '@activity/interfaces/assigned-task-file-detail.interface';
import { IChangeIsCompletedAssignment } from '@activity/interfaces/change-is-completed-assignment.interface';
import { ICreateAssignment } from '@activity/interfaces/create-assignment.interface';
import { Assignment } from '@entities/assignment.entity';
import { Task } from '@entities/task.entity';
import { User } from '@entities/user.entity';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { Repository } from 'typeorm';
import moment from 'moment';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // list all the tasks assigned to a pacient
  async getAssigmentTasksByUser(options: {
    userId: number;
    isCompleted?: boolean;
    last?: boolean;
  }) {
    const { userId, isCompleted, last } = options;

    // verify if the user exists and is a patient
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: RoleEnum.PATIENT,
    });

    // verify if the user exists
    if (!user) {
      throw new NotFoundException(`El paciente con Id "${userId}" no existe`);
    }

    // si "last" es undefined, se obtiene todas las tareas asignadas al paciente
    if (last === undefined || !last) {
      const tasks = await this.assignmentRepository.find({
        where: { userId, isCompleted },
        relations: ['task'],
      });

      return tasks.map((assignTask) => ({
        id: assignTask.id,
        createdAt: assignTask.createdAt,
        dueDate: assignTask.dueDate,
        isCompleted: assignTask.isCompleted,
        task: {
          id: assignTask.task.id,
          title: assignTask.task.title,
          description: assignTask.description,
          estimatedTime: assignTask.estimatedTime,
        },
      }));
    }

    // query the last assignments of the user
    const queryLastDate = await this.assignmentRepository
      .createQueryBuilder('assignment')
      .select('max(date(assignment.createdAt))', 'createdAt')
      .where('assignment.userId = :userId', { userId })
      .getRawOne<{ createdAt: Date }>();

    if (queryLastDate.createdAt === null) {
      return [];
    }

    // get the last and current date
    const lastDate = moment(queryLastDate.createdAt).format('YYYY-MM-DD');
    const currentDate = moment().tz('America/Guayaquil').format('YYYY-MM-DD');

    // query the assign tasks by userId
    const queryTasks = this.assignmentRepository
      .createQueryBuilder('assignment')
      .select([
        'assignment.id',
        'assignment.createdAt',
        'assignment.dueDate',
        'assignment.isCompleted',
        'assignment.estimatedTime',
        'assignment.description',
      ])
      .where('assignment.userId = :userId', { userId });

    if (isCompleted !== undefined) {
      queryTasks.andWhere('assignment.isCompleted = :isCompleted', {
        isCompleted,
      });
    }

    // add the last date and current date to the query
    queryTasks
      .andWhere('date(assignment.createdAt) = :lastDate', { lastDate })
      .andWhere('date(assignment.dueDate) >= :currentDate', { currentDate })
      .innerJoin('assignment.task', 'task')
      .addSelect(['task.id', 'task.title'])
      .getMany();

    // execute the query
    const assignTasks = await queryTasks.getMany();

    return assignTasks.map((assignTask) => ({
      id: assignTask.id,
      createdAt: assignTask.createdAt,
      dueDate: assignTask.dueDate,
      isCompleted: assignTask.isCompleted,
      task: {
        id: assignTask.task.id,
        title: assignTask.task.title,
        estimatedTime: assignTask.estimatedTime,
        description: assignTask.description,
      },
    }));
  }

  // get the task assignments of a user (detail)
  async getAssignedTaskDetails(options: {
    assignmentId: number;
  }): Promise<IAssignedTaskDetail> {
    const { assignmentId } = options;

    // verify if the assignment exists
    const assignment = await this.assignmentRepository.findOneBy({
      id: assignmentId,
    });

    if (!assignment) {
      throw new NotFoundException(
        `La asignación con Id "${assignmentId}" no existe`,
      );
    }

    // get the task assigned to the user
    const task = await this.taskRepository.findOne({
      where: { id: assignment.taskId },
      select: {
        id: true,
        title: true,
        tasksMultimedia: {
          id: true,
          link: {
            id: true,
            url: true,
            title: true,
            type: true,
          },
        },
      },
      relations: {
        tasksMultimedia: {
          link: true,
        },
      },
    });

    // get the files of the task
    const files: IAssignedTaskFileDetail[] = task.tasksMultimedia.map(
      ({ link }) => ({
        id: link.id,
        url: link.url,
        title: link.title,
        type: link.type,
      }),
    );

    // return the assignment
    return {
      assignmentId: assignment.id,
      taskId: task.id,
      title: task.title,
      description: assignment.description,
      estimatedTime: assignment.estimatedTime,
      isCompleted: assignment.isCompleted,
      createdAt: assignment.createdAt,
      dueDate: assignment.dueDate,
      files,
    };
  }

  // assign one or more tasks to a user
  async assignTasksToUser(
    userId: number,
    createManyAssignmentDto: CreateManyAssignmentsDto,
  ) {
    const { tasks, dueDate, createdById } = createManyAssignmentDto;

    // verify if the user exists and is a patient
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: RoleEnum.PATIENT,
    });

    if (!user) {
      throw new NotFoundException(`El paciente con Id "${userId}" no existe`);
    }

    // get the ids of the tasks
    const taskIds = tasks.map(({ id }) => id);

    // verify if the tasks exist
    const numTasksFound = await this.taskRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: taskIds })
      .getCount();

    if (numTasksFound !== taskIds.length) {
      throw new NotFoundException(
        `Una o todas de las tareas ["${taskIds}"] no existe`,
      );
    }

    // create the data to insert
    const dataAssignments: ICreateAssignment[] = tasks.map(
      ({ id: taskId, estimatedTime, description }) => ({
        userId,
        taskId,
        estimatedTime,
        description,
        dueDate,
        createdById,
      }),
    );

    // create the assignments
    return this.assignmentRepository
      .createQueryBuilder()
      .insert()
      .into(Assignment)
      .values(dataAssignments)
      .execute();
  }

  // Remove one or more tasks from a user
  async removeTasksFromUser(removeManyAssignmentDto: RemoveManyAssignmentDto) {
    const { assignmentIds } = removeManyAssignmentDto;

    // verify if the assignments exist
    const assignmentsFound = await this.assignmentRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: assignmentIds })
      .getMany();

    if (assignmentsFound.length !== assignmentIds.length) {
      throw new NotFoundException(
        assignmentIds.length > 1
          ? `Las asignaciones con Ids ["${assignmentIds}"] no existe`
          : `La asignación con Id ["${assignmentIds}"] no existe`,
      );
    }

    // verify if the assignments belong to the same user
    if (assignmentIds.length > 1) {
      const userId = assignmentsFound[0].userId;
      const assignmentsBelongToSameUser = assignmentsFound.every(
        (assignment) => assignment.userId === userId,
      );

      if (!assignmentsBelongToSameUser) {
        throw new NotFoundException(
          `Las asignaciones con Ids ["${assignmentIds}"] no pertenecen al mismo paciente`,
        );
      }
    }

    // remove the assignments
    return this.assignmentRepository
      .createQueryBuilder()
      .delete()
      .from(Assignment)
      .where('id IN (:...ids)', { ids: assignmentIds })
      .execute();
  }

  // change the isCompleted property of an assignment
  async changeIsCompletedAssignment(
    changeIsCompletedAssignment: IChangeIsCompletedAssignment,
  ) {
    const { assignmentId, userLoggedId } = changeIsCompletedAssignment;

    // verify if the assignment exists
    const assignmentFound = await this.assignmentRepository.findOneBy({
      id: assignmentId,
    });

    if (!assignmentFound) {
      throw new NotFoundException(
        `La asignación con Id "${assignmentId}" no existe`,
      );
    }

    // verify if the assignment belongs to the patient logged
    if (assignmentFound.userId !== userLoggedId) {
      throw new ForbiddenException(
        `La asignación con Id "${assignmentId}" no pertenece al paciente logueado`,
      );
    }

    // verify if the assignment task already is completed
    if (assignmentFound.isCompleted) {
      throw new BadRequestException('La tarea ya se encuentra completada');
    }

    // change the isCompleted property
    return this.assignmentRepository.update(
      { id: assignmentId },
      { isCompleted: true, updatedById: userLoggedId },
    );
  }
}
