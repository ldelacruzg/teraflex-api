import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';
import { RoleEnum } from '../../../security/jwt-strategy/role.enum';

@Injectable()
export class UserRepository {
  async findById(cnx: EntityManager, id: number) {
    return await cnx.findOneBy(User, { id });
  }

  async getPassword(cnx: EntityManager, id: number) {
    return (await cnx.findOne(User, { select: ['password'], where: { id } }))
      .password;
  }

  async findByDocNumber(
    cnx: EntityManager,
    docNumber: string,
    currentRole?: RoleEnum,
  ) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'user.first_name as "firstName"',
        'user.last_name as "lastName"',
        'user.doc_number as "docNumber"',
        'user.phone as phone',
        'user.description as description',
        'user.birth_date as "birthDate"',
        'user.created_at as "createdAt"',
        'user.updated_at as "updatedAt"',
        'user.role as role',
      ])
      .from(User, 'user')
      .where('user.status = :status', { status: true })
      .where('user.doc_number = :docNumber', { docNumber });

    if (currentRole !== undefined && currentRole === RoleEnum.THERAPIST) {
      query.andWhere('user.role = :role', { role: RoleEnum.PATIENT });
    }

    return await query.getRawOne();
  }

  async create(cnx: EntityManager, user: User) {
    const data = await cnx.create(User, user);
    return await cnx.save(data);
  }

  async updateStatus(cnx: EntityManager, id: number, status: boolean) {
    return await cnx.update(User, { id }, { status });
  }
}
