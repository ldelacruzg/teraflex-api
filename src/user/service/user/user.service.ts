import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EntityManager } from 'typeorm';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '../../controller/user/dto/create-user.dto';
import { hashSync } from 'bcrypt';
import { InfoUserInterface } from '../../../security/jwt-strategy/info-user.interface';

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  async create(
    cnx: EntityManager,
    user: CreateUserDto,
    role: RoleEnum,
    currentUser: InfoUserInterface,
  ) {
    return await cnx.transaction(async (manager) => {
      try {
        const data = {
          ...user,
          role,
          password: hashSync(user.docNumber, 10),
          createdBy: currentUser.id,
        } as User;

        const created = await this.repo.create(manager, data);

        if (!created) throw new Error('Error al crear el usuario');

        return created.id;
      } catch (error) {
        throw error;
      }
    });
  }

  async findById(cnx: EntityManager, id: number) {
    try {
      const data = await this.repo.findById(cnx, id);

      if (!data) throw new Error('No existe el usuario');

      return data;
    } catch (e) {
      throw e;
    }
  }

  async getPassword(cnx: EntityManager, id: number) {
    try {
      const pasword = await this.repo.getPassword(cnx, id);

      if (!pasword) throw new Error('No existe el usuario');

      return pasword;
    } catch (e) {
      throw e;
    }
  }

  async findByDocNumber(cnx: EntityManager, identification: string) {
    try {
      const data = await this.repo.findByDocNumber(cnx, identification);

      if (!data) throw new Error('No existe el usuario');

      return data;
    } catch (e) {
      throw e;
    }
  }
}
