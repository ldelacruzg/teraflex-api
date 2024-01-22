import { Resource } from '@/shared/interfaces/resource.interface';
import { TreatmentTasks } from './treatment-tasks.entity';
import { CreateTreatmentTaskDto } from './dtos/create-treatment-task.dto';
import { IFindAssignedTasksByPatient } from './interfaces';
import { LinkRawOne } from './dtos/raw/multimedia.raw';
import { EntityManager } from 'typeorm';

export abstract class TreatmentTaskRepository extends Resource<
  TreatmentTasks,
  CreateTreatmentTaskDto
> {
  // obtener el total de tareas asignadas completadas en toda la historia
  abstract getTotalCompletedAssignedTasksHistory(
    patientId: number,
  ): Promise<number>;

  // obtener el total de tareas asignadas en toda la historia
  abstract getTotalAssignedTasksHistory(patientId: number): Promise<number>;

  // obtener el total de puntos de experiencia de la semana
  abstract getWeeklyExperience(patientId: number): Promise<number>;

  // finalizar la tarea asignada del paciente
  abstract finishAssignedTask(
    assignmentId: number,
    patientId: number,
    leaderboardId: number,
    experience: number,
    flexicoins: number,
  ): Promise<void>;

  // actualizar la fecha de finalización de una asignación
  abstract updateAssignedTaskCompletion(
    assignmentId: number,
    options?: { tx?: EntityManager },
  ): Promise<void>;

  abstract findMultimediaByAssigment(
    assigmentId: number,
  ): Promise<LinkRawOne[]>;

  abstract findAssignedTaskDetails(
    assignmentId: number,
  ): Promise<TreatmentTasks>;

  abstract exists(ids: number[]): Promise<boolean>;

  abstract findAssignedTasksByPatient(
    options: IFindAssignedTasksByPatient,
  ): Promise<TreatmentTasks[]>;

  abstract createMany(
    payload: CreateTreatmentTaskDto[],
  ): Promise<TreatmentTasks[]>;
}
