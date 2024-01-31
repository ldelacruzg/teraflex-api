import { BadRequestException, Injectable } from '@nestjs/common';

import { Patient } from '../domain/patient.entity';
import { IPatientService } from '../domain/patient-service.interface';
import { PatientRepository } from '../domain/patient.repository';
import { CreatePatientDto } from '../domain/dtos/create-patient.dto';
import { TreatmentTaskRepository } from '@/activities/treatment-tasks';
import { GlobalSummaryDto } from '../domain/dtos/global-summary.dto';

@Injectable()
export class PatientService implements IPatientService {
  constructor(
    private readonly repository: PatientRepository,
    private readonly tretamentTaskRepository: TreatmentTaskRepository,
  ) {}

  async getGlobalSummary(patientId: number): Promise<GlobalSummaryDto> {
    // verificar si existe el usuario
    const patient = await this.findOne(patientId);

    if (!patient) {
      throw new BadRequestException(
        `El paciente con id (${patientId}) no existe`,
      );
    }

    const { flexicoins, experience, rank } = patient;
    const [weekly, history] = await Promise.all([
      this.tretamentTaskRepository.getWeeklyAssignedAndCompletedTasks(
        patientId,
      ),
      this.tretamentTaskRepository.getAssignedAndCompletedTasksHistory(
        patientId,
      ),
    ]);

    const globalSummary: GlobalSummaryDto = {
      flexicoins,
      experience,
      rank,
      qtyTasksHistory: history.qty_tasks,
      qtyTasksCompletedHistory: history.qty_tasks_completed,
      qtyTasksWeekly: weekly.qty_tasks,
      qtyTasksCompletedWeekly: weekly.qty_tasks_completed,
    };

    return globalSummary;
  }

  create(payload: CreatePatientDto): Promise<Patient> {
    return this.repository.create(payload);
  }

  findAll(): Promise<Patient[]> {
    return this.repository.findAll();
  }

  findOne(id: number): Promise<Patient> {
    return this.repository.findOne(id);
  }

  update(id: number, payload: CreatePatientDto): Promise<Patient> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
}
