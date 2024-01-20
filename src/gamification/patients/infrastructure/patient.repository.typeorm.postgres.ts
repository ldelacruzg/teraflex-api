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

  create(payload: CreatePatientDto, tx?: EntityManager): Promise<Patient> {
    if (tx === undefined) {
      return this.patient.save({
        id: payload.userId,
      });
    }

    return tx.save(Patient, {
      id: payload.userId,
    });
  }

  findAll(tx?: EntityManager): Promise<Patient[]> {
    return this.patient.createQueryBuilder().getMany();
  }

  findOne(id: number): Promise<Patient> {
    return this.patient.findOne({ where: { id } });
  }

  update(
    id: number,
    payload: CreatePatientDto,
    tx?: EntityManager,
  ): Promise<Patient> {
    throw new Error('Method not implemented.');
  }

  remove(id: number, tx?: EntityManager): Promise<Patient> {
    throw new Error('Method not implemented.');
  }

  async exists(ids: number[]): Promise<boolean> {
    const count = await this.patient
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }
}
