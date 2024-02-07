import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { LeaderboardRepository } from '@/gamification/leaderboards';
import { Environment } from '@/shared/constants/environment';
import { UserRepository } from '@/users/services/users/user.repository';

@Injectable()
export class TreatmentTaskService implements ITreatmentTaskService {
  constructor(
    private readonly repository: TreatmentTaskRepository,
    private readonly treatmentRepository: TreatmentRepository,
    private readonly taskRepository: TaskRespository,
    private readonly patientRepository: PatientRepository,
    private readonly leaderboardRepository: LeaderboardRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async getLastTaskCompleted(options: { therapistId: number }) {
    const { therapistId } = options;

    // verify if the user exists and is a therapist
    const user = await this.userRepository.findTherapistById(therapistId);

    if (!user) {
      throw new NotFoundException(
        `El terapeuta con id (${therapistId}) no existe`,
      );
    }

    return this.repository.findLastTasksCompletedByTherapist(therapistId);
  }

  // get number of pacients by age
  async getNumberOfPacientsByAges() {
    const numberPacientsByAges =
      await this.userRepository.findNumberPatientsByAge();

    const rangeOfAges = [
      { min: 3, max: 9 },
      { min: 10, max: 17 },
      { min: 18, max: 25 },
      { min: 26, max: 35 },
      { min: 36 },
    ];

    const numberOfPatients = numberPacientsByAges.reduce(
      (prevValue, currValue) => {
        return prevValue + Number(currValue.count);
      },
      0,
    );

    return rangeOfAges.map((rangeOfAge) => {
      const { min, max } = rangeOfAge;

      const tag = max
        ? `De ${min} a ${max} años`
        : `De ${min} años en adelante`;

      const numberAgeByRange = numberPacientsByAges.reduce(
        (prevValue, currValue) => {
          const { age, count } = currValue;
          // if max is undefined, it means that the range is from min to infinity
          if (max === undefined && Number(age) >= min) {
            return prevValue + Number(count);
          }

          // if max is defined, it means that the range is from min to max
          if (Number(age) >= min && Number(age) <= max) {
            return prevValue + Number(count);
          }

          // if the age is not in the range, return the previous value
          return prevValue;
        },
        0,
      );

      return {
        tag,
        quantity: numberAgeByRange,
        percentage: Number((numberAgeByRange / numberOfPatients).toFixed(2)),
      };
    });
  }

  async finishAssignedTask(assignmentId: number): Promise<WeeklySummaryDto> {
    // verificar que la asignación existe
    const assignment = await this.repository.findOne(assignmentId);
    if (!assignment) {
      throw new BadRequestException(
        `La asignación con id [${assignmentId}] no existe`,
      );
    }

    const { treatmentId } = assignment;
    // validar que la asignación no este finalizada
    if (assignment.performanceDate) {
      throw new BadRequestException(
        `La asignación con id [${assignmentId}] ya fue realizada`,
      );
    }

    // obtener paciente
    const treatment = await this.treatmentRepository.findOne(treatmentId);
    const patient = await this.patientRepository.findOne(treatment.patientId);
    const { id: patientId, rank } = patient;

    // encontrar la tabla de clasificacíón que pertenece el paciente (semana actual)
    let patientInLeaderboard =
      await this.leaderboardRepository.findCurrentWeekPatientLeaderboard(
        patientId,
      );

    if (!patientInLeaderboard) {
      // crear un registro de paciente en la tabla de clasificación
      patientInLeaderboard =
        await this.leaderboardRepository.createPatientInLeaderboard(patientId);
    }

    await this.repository.finishAssignedTask(
      assignmentId,
      patientId,
      patientInLeaderboard.id,
      Environment.AMOUNT_EXPERIENCE_PER_TASK_PERFORMED,
      Environment.AMOUNT_FLEXICOINS_PER_TASK_PERFORMED,
    );

    // return weekly summary
    return await this.repository.getWeeklySummary(
      patientInLeaderboard.id,
      patientId,
    );
  }

  async getMultimediasByAssigment(
    assignmentId: number,
  ): Promise<MultimediaDto[]> {
    const assignmentExists = await this.repository.exists([assignmentId]);

    if (!assignmentExists) {
      throw new BadRequestException(
        `La asignación con id [${assignmentId}] no existe`,
      );
    }

    const raw = await this.repository.findMultimediaByAssigment(assignmentId);

    return TreatmentTasksMapper.toMultimedia(raw);
  }

  async getAssignedTaskDetails(
    assignmentId: number,
  ): Promise<AssignedTaskFullDetailDto> {
    // validar que la asignación existe
    const assignmentExists = await this.repository.exists([assignmentId]);

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

  async removeMany(ids: number[]) {
    // verify if the assignments exists
    const assignments = await this.repository.findAssignedTasksByIds(ids);

    if (assignments.length !== ids.length) {
      throw new BadRequestException(
        ids.length > 1 
          ? `Las asignaciones con ids (${ids}) no existen`
          : `La asignación con id (${ids}) no existe`,
      );
    }

    // verify if the assignment belogs to the same patient
    if (ids.length > 1) {
      const patientId = assignments[0].treatment.patientId;
      const isSamePatient = assignments.every(
        (assignment) => assignment.treatment.patientId === patientId,
      );

      if (!isSamePatient) {
        throw new NotFoundException(
          `Las asignaciones con ids (${ids}) no pertenecen al mismo paciente`,
        );
      }
    }

    // delete the assignments
    return this.repository.removeMany(ids);
  }

  remove<G>(id: G): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }
}
