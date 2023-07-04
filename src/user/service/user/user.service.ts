import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EntityManager } from 'typeorm';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '../../controller/user/dto/create-user.dto';
import { hashSync } from 'bcrypt';
import { InfoUserInterface } from '../../../security/jwt-strategy/info-user.interface';
import { GroupRepository } from '../group/group.repository';
import { Group } from '../../../entities/group.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UpdateUserDto } from '../../controller/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private repo: UserRepository,
    private groupRepository: GroupRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  async create(
    cnx: EntityManager,
    user: CreateUserDto,
    role: RoleEnum,
    currentUser: InfoUserInterface,
  ) {
    return await cnx.transaction(async (manager) => {
      try {
        const userExist = await this.repo.findByDocNumber(
          manager,
          user.docNumber,
          role,
        );

        let userCreated: User;
        if (!userExist) {
          const data = {
            ...user,
            role,
            password: hashSync(user.docNumber, 10),
            createdBy: currentUser.id,
          } as User;

          userCreated = await this.repo.create(manager, data);

          if (!userCreated) throw new Error('Error al crear el usuario');
        }

        if (currentUser.role === RoleEnum.THERAPIST) {
          const group = {
            therapistId: currentUser.id,
            patientId: userExist?.id ?? userCreated?.id,
          } as Group;

          const newGroup = await this.groupRepository.addPatient(
            manager,
            group,
          );

          if (!newGroup) throw new Error('Error al agregar paciente al grupo');
        }

        return 'Usuario creado correctamente';
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

  async findByDocNumber(
    cnx: EntityManager,
    identification: string,
    role?: RoleEnum,
  ) {
    try {
      const data = await this.repo.findByDocNumber(cnx, identification, role);

      if (!data) throw new Error('No existe el usuario');

      return data;
    } catch (e) {
      throw e;
    }
  }

  async delete(cnx: EntityManager, id: number, currentUser: InfoUserInterface) {
    return await cnx.transaction(async (manager) => {
      try {
        const user = await this.repo.findById(manager, id);

        if (!user) throw new Error('No existe el usuario');

        const deleted = await this.repo.updateStatus(manager, id, false);

        if (deleted.affected == 0)
          throw new Error('Error al eliminar el usuario');

        if (user.role === RoleEnum.PATIENT) {
          const deleteOfGroup = await this.groupRepository.deletePatient(
            manager,
            currentUser.id,
            id,
            true,
          );

          if (deleteOfGroup.affected == 0)
            throw new Error('Error al eliminar el usuario de los grupos');
        }

        return 'Eliminado correctamente';
      } catch (e) {
        throw e;
      }
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.repo.findById(this.cnx, id);

    if (!user) throw new NotFoundException('No existe el usuario');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const updated = await this.repo.update(this.cnx, id, data as User);
    console.log(updated);

    if (updated.affected == 0)
      throw new Error('Error al actualizar el usuario');

    return updated.raw;
  }
}
