import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EntityManager } from 'typeorm';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { User } from '@entities/user.entity';
import { CreateUserDto } from '../../controller/user/dto/create-user.dto';
import { hashSync } from 'bcrypt';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { GroupRepository } from '../group/group.repository';
import { Group } from '@entities/group.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UpdateUserDto } from '../../controller/user/dto/update-user.dto';
import { insertSucessful } from '@shared/constants/messages';

@Injectable()
export class UserService {
  constructor(
    private repo: UserRepository,
    private groupRepository: GroupRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  async create(
    user: CreateUserDto,
    role: RoleEnum,
    currentUser: InfoUserInterface,
  ) {
    return await this.cnx.transaction(async (manager) => {
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
          await this.addToGroup(userCreated ?? userExist, currentUser, manager);
        }

        return insertSucessful(
          role == RoleEnum.PATIENT ? 'paciente' : 'terapeuta',
        );
      } catch (error) {
        throw error;
      }
    });
  }

  private async addToGroup(
    user: any,
    currentUser: InfoUserInterface,
    cnx: EntityManager,
  ) {
    const inGroup = await this.groupRepository.findPacientByTherapist(
      this.cnx,
      user.id,
      currentUser.id,
    );

    if (inGroup) throw new Error('El paciente ya se encuentra en el grupo');

    const group = {
      therapistId: currentUser.id,
      patientId: user.id,
    } as Group;

    const newGroup = await this.groupRepository.addPatient(cnx, group);

    if (!newGroup) throw new Error('Error al agregar paciente al grupo');
  }

  async findById(id: number) {
    try {
      const data = await this.repo.findById(this.cnx, id);

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

  async findByDocNumber(identification: string, role?: RoleEnum) {
    try {
      const data = await this.repo.findByDocNumber(
        this.cnx,
        identification,
        role,
      );

      if (!data) throw new Error('No existe el usuario');

      return data;
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number, currentUser: InfoUserInterface) {
    return await this.cnx.transaction(async (manager) => {
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

    if (updated.affected == 0)
      throw new Error('Error al actualizar el usuario');

    return updated.raw;
  }
}
