import { Injectable } from '@nestjs/common';

import { Patient } from '../domain/patient.entity';
import { IPatientService } from '../domain/patient-service.interface';
import { PatientRepository } from '../domain/patient.repository';
import { CreatePatientDto } from '../domain/dtos/create-patient.dto';

@Injectable()
export class PatientService implements IPatientService {
  constructor(private readonly repository: PatientRepository) {}

  findAll(): Promise<Patient[]> {
    return this.repository.findAll();
  }

  create(payload: CreatePatientDto): Promise<Patient> {
    return this.repository.create(payload);
  }
}
