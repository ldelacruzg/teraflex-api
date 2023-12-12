import { Injectable } from '@nestjs/common';

import { Patient } from '../domain/patient.entity';
import { PatientRepository } from '../domain/patient.repository';
import { CreatePatientDto } from '../domain/dtos/create-patient.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientRepositoryTypeOrmPostgres implements PatientRepository {
  constructor(
    @InjectRepository(Patient)
    private patient: Repository<Patient>,
  ) {}

  findAll(): Promise<Patient[]> {
    return this.patient.createQueryBuilder().getMany();
  }

  create(payload: CreatePatientDto, tx?: EntityManager): Promise<Patient> {
    if (tx === undefined) {
      return this.patient.save(payload);
    }

    return tx.save(Patient, payload);
  }
}
