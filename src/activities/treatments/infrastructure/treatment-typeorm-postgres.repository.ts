import { EntityManager, Repository } from 'typeorm';
import { Treatment } from '../domain/treatment.entity';
import { TreatmentRepository } from '../domain/treatment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';
import { IFindAllTreatmentsOptions } from '../domain/interfaces';

export class TreatmentRepositoryTypeOrmPostgres implements TreatmentRepository {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatment: Repository<Treatment>,
  ) {}

  existsAndIsActive(id: number): Promise<boolean> {
    const result = this.treatment
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .andWhere('t.isActive = :isActive', { isActive: true })
      .getExists();

    return result;
  }

  async exists(ids: number[]): Promise<boolean> {
    const count = await this.treatment
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }

  create(payload: CreateTreatmentDto, tx?: EntityManager): Promise<Treatment> {
    if (tx) return tx.save(Treatment, payload);
    return this.treatment.save(payload);
  }

  findAll(options?: IFindAllTreatmentsOptions): Promise<Treatment[]> {
    const { patientId, treatmentActive } = options;
    const query = this.treatment.createQueryBuilder('t');

    if (patientId) {
      query.where('t.patientId = :patientId', { patientId });
    }

    if (treatmentActive !== undefined) {
      query.andWhere('t.isActive = :isActive', { isActive: treatmentActive });
    }

    return query.getMany();
  }

  findOne(id: number, tx?: any): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  update(
    id: number,
    payload: CreateTreatmentDto,
    tx?: any,
  ): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }

  remove(id: number, tx?: any): Promise<Treatment> {
    throw new Error('Method not implemented.');
  }
}
