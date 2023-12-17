import { BadRequestException, Injectable } from '@nestjs/common';

import { PatientRepository } from '@/gamification/patients';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';
import { Treatment } from '../domain/treatment.entity';
import { ITreatmentService } from '../domain/treatment-service.interface';
import { TreatmentRepository } from '../domain/treatment.repository';

@Injectable()
export class TreatmentService implements ITreatmentService {
  constructor(
    private readonly repository: TreatmentRepository,
    private readonly patientRepository: PatientRepository,
  ) {}

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

  findAll(): Promise<Treatment[]> {
    throw new Error('Method not implemented.');
  }

  findOne(id: number): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  update(id: number, payload: CreateTreatmentDto): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }
}
