import { BadRequestException, Injectable } from '@nestjs/common';
import { ITreatmentTaskService } from '../domain/treatment-task-service.interface';
import { Treatment, TreatmentTasks } from '@/entities';
import { TreatmentTaskRepository } from '../domain/treatment-task.repository';
import {
  AssignTasksToTreatmentDto,
  CreateTreatmentTaskDto,
} from '../domain/dtos/create-treatment-task.dto';
import { TreatmentRepository } from '@/activities/treatments';
import { TaskRespository } from '@/activities/tasks';

@Injectable()
export class TreatmentTaskService implements ITreatmentTaskService {
  constructor(
    private readonly repository: TreatmentTaskRepository,
    private readonly treatmentRepository: TreatmentRepository,
    private readonly taskRepository: TaskRespository,
  ) {}

  async assignTasksToTreatment(
    payload: AssignTasksToTreatmentDto,
  ): Promise<TreatmentTasks[]> {
    const { treatmentId, tasks } = payload;

    // verificar que el tratamiento exista
    const treatmentExists = await this.treatmentRepository.exists([
      treatmentId,
    ]);

    if (!treatmentExists) {
      throw new BadRequestException(
        `El tratamiento con id "${treatmentId}" no existe`,
      );
    }

    // verificar que las tareas existan
    const taskIds = tasks.map(({ taskId }) => taskId);
    const tasksExists = await this.taskRepository.exists(taskIds);

    if (!tasksExists) {
      throw new BadRequestException(
        `Una o todas las tareas con id [${taskIds}] no existen`,
      );
    }

    // crear las asignaciones
    const newAssignments: CreateTreatmentTaskDto[] = tasks.map((assignmet) => ({
      ...assignmet,
      treatmentId,
    }));

    return await this.repository.createMany(newAssignments);
  }

  create(payload: CreateTreatmentTaskDto): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<Treatment[]> {
    throw new Error('Method not implemented.');
  }

  findOne<G>(id: G): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  update<G>(id: G, payload: CreateTreatmentTaskDto): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  remove<G>(id: G): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }
}
