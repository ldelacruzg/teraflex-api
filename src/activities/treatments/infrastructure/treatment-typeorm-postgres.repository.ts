import { EntityManager, Repository } from 'typeorm';
import { Treatment } from '../domain/treatment.entity';
import { TreatmentRepository } from '../domain/treatment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';

export class TreatmentRepositoryTypeOrmPostgres implements TreatmentRepository {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatment: Repository<Treatment>,
  ) {}

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

  findAll(tx?: any): Promise<Treatment[]> {
    throw new Error('Method not implemented.');
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