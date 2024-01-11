import { BadRequestException, Injectable } from '@nestjs/common';

import { PatientRepository } from '@/gamification/patients';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';
import { Treatment } from '../domain/treatment.entity';
import { ITreatmentService } from '../domain/treatment-service.interface';
import { TreatmentRepository } from '../domain/treatment.repository';
import {
  IFindAllTreatmentTasksOptions,
  IFindAllTreatmentsOptions,
} from '../domain/interfaces';
import { AssignedTaskDetailDto } from '@/activities/treatment-tasks/domain/dtos/assigned-task-detail.dto';
import { TreatmentTasksMapper } from '@/activities/treatment-tasks/infrastructure/mappers';

@Injectable()
export class TreatmentService implements ITreatmentService {
  constructor(
    private readonly repository: TreatmentRepository,
    private readonly patientRepository: PatientRepository,
  ) {}

  async findAllTreatmentTasks(
    options: IFindAllTreatmentTasksOptions,
  ): Promise<AssignedTaskDetailDto[]> {
    const { treatmentId } = options;
    const treatmentExists = await this.repository.exists([treatmentId]);

    if (!treatmentExists) {
      throw new BadRequestException(
        `El tratamiento con id "${treatmentId}" no existe`,
      );
    }

    const tasks = await this.repository.findTasks(treatmentId, options);

    return tasks.map((task) => TreatmentTasksMapper.toAssignedTaskDetail(task));
  }

  async create(payload: CreateTreatmentDto): Promise<Treatment> {
    const { patientId } = payload;
    const patientExists = await this.patientRepository.exists([patientId]);

    if (!patientExists) {
      throw new BadRequestException(
        `El paciente con id "${patientId}" no existe`,
      );
    }

    return this.repository.create(payload);
  }

  async findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]> {
    const { patientId } = options;

    if (patientId) {
      // verificar si existe el paciente
      const patientExists = await this.patientRepository.exists([patientId]);

      if (!patientExists) {
        throw new BadRequestException(
          `El paciente con id "${patientId}" no existe`,
        );
      }
    }

    return this.repository.findAll(options);
  }

  findOne(id: number): Promise<Treatment> {
    const treatmentExists = this.repository.exists([id]);

    if (!treatmentExists) {
      throw new BadRequestException(`El tratamiento con id "${id}" no existe`);
    }

    return this.repository.findOne(id);
  }

  update(id: number, payload: CreateTreatmentDto): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }
}
