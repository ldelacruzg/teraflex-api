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
import { PatientRepository } from '@/gamification/patients';
import { IFindAssignedTasksByPatient } from '../domain/interfaces';
import { AssignedTaskFullDetailDto } from '../domain/dtos/assigned-task-detail.dto';
import { TreatmentTasksMapper } from './mappers';

@Injectable()
export class TreatmentTaskService implements ITreatmentTaskService {
  constructor(
    private readonly repository: TreatmentTaskRepository,
    private readonly treatmentRepository: TreatmentRepository,
    private readonly taskRepository: TaskRespository,
    private readonly patientRepository: PatientRepository,
  ) {}

  async getAssignedTaskDetails(
    assignmentId: number,
  ): Promise<AssignedTaskFullDetailDto> {
    // validar que la asignación existe
    const assignmentExists = this.repository.exists([assignmentId]);

    if (!assignmentExists) {
      throw new BadRequestException(
        `La asignación con id [${assignmentId}] no existe`,
      );
    }

    const assignedTask = await this.repository.findAssignedTaskDetails(
      assignmentId,
    );

    return TreatmentTasksMapper.toAssignedTaskFullDetail(assignedTask);
  }

  async getAssignedTasksByPatient(options: IFindAssignedTasksByPatient) {
    const { patientId } = options;

    // verificar que existe el paciente
    const patientExists = await this.patientRepository.exists([patientId]);

    if (!patientExists) {
      throw new BadRequestException(
        `El paciente con id [${patientId}] no existe`,
      );
    }

    return this.repository.findAssignedTasksByPatient(options);
  }

  async assignTasksToTreatment(
    payload: AssignTasksToTreatmentDto,
  ): Promise<TreatmentTasks[]> {
    const { treatmentId, tasks } = payload;

    // verificar que el tratamiento exista y esta activo
    const treatmentExists = await this.treatmentRepository.existsAndIsActive(
      treatmentId,
    );

    if (!treatmentExists) {
      throw new BadRequestException(
        `El tratamiento con id "${treatmentId}" no existe o no esta activo`,
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
