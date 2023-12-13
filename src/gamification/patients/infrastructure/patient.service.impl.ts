import { Injectable } from '@nestjs/common';

import { Patient } from '../domain/patient.entity';
import { IPatientService } from '../domain/patient-service.interface';
import { PatientRepository } from '../domain/patient.repository';
import { CreatePatientDto } from '../domain/dtos/create-patient.dto';

@Injectable()
export class PatientService implements IPatientService {
  constructor(private readonly repository: PatientRepository) {}

  create(payload: CreatePatientDto): Promise<Patient> {
    return this.repository.create(payload);
  }

  findAll(): Promise<Patient[]> {
    return this.repository.findAll();
  }

  findOne(id: number): Promise<Patient> {
    throw new Error('Method not implemented.');
  }

  update(id: number, payload: CreatePatientDto): Promise<Patient> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
}
