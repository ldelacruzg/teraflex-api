import { Category } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from './category.respository';

export class CategoryRepositoryTypeOrmPostgres implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}

  async exists(ids: number[]) {
    if (ids.length === 0) return true;

    const count = await this.category
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }
}
