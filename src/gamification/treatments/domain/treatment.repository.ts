import { Resource } from '@/shared/interfaces/resource.interface';
import { Treatment } from './treatment.entity';
import { CreateTreatmentDto } from './dtos/create-treament.dto';

export abstract class TreatmentRepository extends Resource<
  Treatment,
  CreateTreatmentDto
> {}
