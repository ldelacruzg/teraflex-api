import { EntityManager } from 'typeorm';
import { Link } from '../../entities/link.entity';

export class MultimediaRepository {
  async create(cnx: EntityManager, payload: Link) {
    const obj = cnx.create(Link, payload);
    return await cnx.save(obj);
  }

  async get(cnx: EntityManager, id: number) {
    return await cnx.findOne(Link, { where: { id } });
  }
}
