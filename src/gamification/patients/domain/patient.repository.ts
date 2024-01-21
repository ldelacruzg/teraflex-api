import { Resource } from '@shared/interfaces/resource.interface';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { EntityManager } from 'typeorm';

export abstract class PatientRepository extends Resource<
  Patient,
  CreatePatientDto
> {
  // actualizar la suma de experiencia del paciente
  abstract updateExperience(
    patientId: number,
    experience: number,
    options?: { tx?: EntityManager },
  ): Promise<void>;

  // actualizar la suma de flexicoins del paciente
  abstract updateFlexicoins(
    patientId: number,
    flexicoins: number,
    options?: { tx?: EntityManager },
  ): Promise<void>;

  abstract exists(ids: number[]): Promise<boolean>;
}
