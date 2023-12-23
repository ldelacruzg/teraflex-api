import { Brackets, EntityManager, Repository } from 'typeorm';
import { Link } from '@entities/link.entity';
import { Injectable } from '@nestjs/common';
import { GetByUserAndPublic } from '@/multimedia/services/interfaces/multimedia.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskMultimedia } from '@/entities';

@Injectable()
export class MultimediaRepository {
  constructor(
    @InjectRepository(Link)
    private readonly link: Repository<Link>,
    @InjectRepository(TaskMultimedia)
    private readonly taskMultimedia: Repository<TaskMultimedia>,
  ) {}

  async create(cnx: EntityManager, payload: Link) {
    const obj = cnx.create(Link, payload);
    return await cnx.save(obj);
  }

  async getById(cnx: EntityManager, id: number) {
    return await cnx.findOneBy(Link, { id });
  }

  async getByUserAndPublic(cnx: EntityManager, id: number, status?: boolean) {
    return await cnx
      .createQueryBuilder()
      .select([
        'link.id as id',
        'link.url as url',
        'link.title as title',
        'link.type as type',
        'link.isPublic as "isPublic"',
        'link.description as description',
        'link.createdAt as "createdAt"',
        'link.updatedAt as "updatedAt"',
      ])
      .from(Link, 'link')
      .where(
        new Brackets((qb) => {
          qb.where('link.createdById = :id', { id }).orWhere(
            'link.isPublic = :isPublic',
            { isPublic: true },
          );
        }),
      )
      .andWhere('link.status = :status', { status: status ?? true })
      .orderBy('link.createdAt', 'DESC')
      .getRawMany<GetByUserAndPublic>();
  }

  async update(cnx: EntityManager, id: number, payload: Link) {
    return await cnx.update(Link, { id }, payload);
  }

  async exists(ids: number[]) {
    if (ids.length === 0) return true;

    const count = await this.link
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getCount();

    return count === ids.length;
  }

  async findTaskMultimedia(taskId: number): Promise<Link[]> {
    const taskMultimedia = await this.taskMultimedia.find({
      where: { taskId },
    });
    const linkIds = taskMultimedia.map(
      (taskMultimedia) => taskMultimedia.linkId,
    );
    const links = await this.link
      .createQueryBuilder()
      .where('id IN (:...linkIds)', { linkIds })
      .getMany();

    return links;
  }
}
