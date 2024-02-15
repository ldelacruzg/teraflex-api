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
import { UpdateResult } from 'typeorm';
import { TreatmentSummary } from '../domain/dtos/treatment-summary.dto';

@Injectable()
export class TreatmentService implements ITreatmentService {
  constructor(
    private readonly repository: TreatmentRepository,
    private readonly patientRepository: PatientRepository,
  ) {}
  async toggleActive(treatmentId: number): Promise<UpdateResult> {
    // verificar que existe el tratamiento
    const treament = await this.repository.findOne(treatmentId);
    if (!treament) {
      throw new BadRequestException(`El tratamiento con id (${treatmentId}) no existe`);
    }

    // verificar que no este finalizado
    if (treament.endDate !== null) {
      throw new BadRequestException(
        `El tratamiento con id (${treatmentId}) ya está finalizado`,
      );
    }
    
    return this.repository.toggleActive(treatmentId);
  }

  async getTreatmentSummary(treatmentId: number): Promise<TreatmentSummary> {
    // verificar que el tratamiento exista
    const treatmentExists = await this.repository.exists([treatmentId]);
    if (!treatmentExists) {
      throw new BadRequestException(
        `El tratamiento con id (${treatmentId}) no existe`,
      );
    }

    return this.repository.findTreatmentSummary(treatmentId);
  }
  
  async finishTreatment(treatmentId: number): Promise<UpdateResult> {
    // verificar que el tratamiento exista
    const treatmentExists = await this.repository.findOne(treatmentId);
    if (!treatmentExists) {
      throw new BadRequestException(
        `El tratamiento con id (${treatmentId}) no existe`,
      );
    }

    // verificar que el tratamiento no este finalizado
    if (treatmentExists.endDate !== null) {
      throw new BadRequestException(
        `El tratamiento con id (${treatmentId}) ya está finalizado`,
      );
    }

    // finalizar el tratamiento
    return this.repository.finishTreatment(treatmentId);
  }

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
