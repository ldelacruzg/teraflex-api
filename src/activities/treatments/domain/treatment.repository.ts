import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';
import { IFindAllTreatmentsOptions } from './interfaces';

export abstract class TreatmentRepository extends Resource<
  Treatment,
  CreateTreatmentDto
> {
  abstract findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
  abstract exists(ids: number[]): Promise<boolean>;
  abstract existsAndIsActive(id: number): Promise<boolean>;
}
