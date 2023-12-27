import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';
import { IFindAllTreatmentsOptions } from './interfaces';

export interface ITreatmentService
  extends Resource<Treatment, CreateTreatmentDto> {
  findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
}
