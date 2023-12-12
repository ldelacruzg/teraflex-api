import { Resource } from '@/shared/interfaces/resource.interface';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';

export interface IPatientService extends Resource<Patient, CreatePatientDto> {}
