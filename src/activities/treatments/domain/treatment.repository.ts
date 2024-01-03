import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';
import {
  IFindAllTreatmentTasksOptions,
  IFindAllTreatmentsOptions,
} from './interfaces';
import { TreatmentTasks } from '@/entities';
import { TreatmentRawOneDto } from '../infrastructure/mappers/treatment-typeorm-postgres.mapper';

export abstract class TreatmentRepository extends Resource<
  Treatment,
  CreateTreatmentDto
> {
  abstract findTasks(
    treatmentId: number,
    options?: Omit<IFindAllTreatmentTasksOptions, 'treatmentId'>,
  ): Promise<TreatmentTasks[]>;

  abstract findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]>;
  abstract findAll(
    options?: IFindAllTreatmentsOptions,
  ): Promise<Treatment[] | TreatmentRawOneDto[]>;

  abstract exists(ids: number[]): Promise<boolean>;
  abstract existsAndIsActive(id: number): Promise<boolean>;
}
