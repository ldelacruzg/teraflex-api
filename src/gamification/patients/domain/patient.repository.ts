import { Resource } from '@shared/interfaces/resource.interface';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';

export abstract class PatientRepository extends Resource<
  Patient,
  CreatePatientDto
> {
  abstract exists(ids: number[]): Promise<boolean>;
}
