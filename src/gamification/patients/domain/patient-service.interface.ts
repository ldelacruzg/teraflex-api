import { Resource } from '@/shared/interfaces/resource.interface';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { GlobalSummaryDto } from './dtos/global-summary.dto';

export interface IPatientService extends Resource<Patient, CreatePatientDto> {
  getGlobalSummary(patientId: number): Promise<GlobalSummaryDto>;
}
