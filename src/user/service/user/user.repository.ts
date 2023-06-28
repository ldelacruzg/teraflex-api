import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserRepository {
  async findById(cnx: EntityManager, id: number) {
    return await cnx.findOneBy(User, { id });
  }

  async getPassword(cnx: EntityManager, id: number) {
    return (await cnx.findOne(User, { select: ['password'], where: { id } }))
      .password;
  }

  async findByDocNumber(cnx: EntityManager, docNumber: string) {
    return await cnx.findOneBy(User, { docNumber });
  }

  async create(cnx: EntityManager, user: User) {
    const data = await cnx.create(User, user);
    return await cnx.save(data);
  }
}
