import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssignmentDto } from 'src/activity/controllers/assignment/dto/create-assigment.dto';
import { CreateManyAssignmentsDto } from 'src/activity/controllers/assignment/dto/create-many-assignments.dto';
import { RemoveManyAssignmentDto } from 'src/activity/controllers/assignment/dto/remove-many-assigments.dto';
import { Assignment } from 'src/entities/assignment.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { Repository } from 'typeorm';

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
  async listTasksByUser(userId: number) {
    // verify if the user exists and is a patient
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: RoleEnum.PATIENT,
    });

    // verify if the user exists
    if (!user) {
      throw new NotFoundException(`El paciente con Id "${userId}" no existe`);
    }

    // get the tasks assigned to the user
    const tasks = await this.assignmentRepository.find({
      where: { userId },
      relations: ['task'],
    });

    return tasks;
  }

  // assign one or more tasks to a user
  async assignTasksToUser(createManyAssignmentDto: CreateManyAssignmentsDto) {
    const { userId, taskIds } = createManyAssignmentDto;

    // verify if the user exists and is a patient
    const user = await this.userRepository.findOneBy({
      id: userId,
      role: RoleEnum.PATIENT,
    });

    if (!user) {
      throw new NotFoundException(`El paciente con Id "${userId}" no existe`);
    }

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
    const dataAssignments: CreateAssignmentDto[] = taskIds.map((taskId) => ({
      ...createManyAssignmentDto,
      taskId,
    }));

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
        `Una o todas de las asignaciones ["${assignmentIds}"] no existe`,
      );
    }

    // verify if the assignments belong to the same user
    const userId = assignmentsFound[0].userId;
    const assignmentsBelongToSameUser = assignmentsFound.every(
      (assignment) => assignment.userId === userId,
    );

    if (!assignmentsBelongToSameUser) {
      throw new NotFoundException(
        `Una o todas de las asignaciones ["${assignmentIds}"] no pertenecen al mismo paciente`,
      );
    }

    // remove the assignments
    return this.assignmentRepository
      .createQueryBuilder()
      .delete()
      .from(Assignment)
      .where('id IN (:...ids)', { ids: assignmentIds })
      .execute();
  }
}
