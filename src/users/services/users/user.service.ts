import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EntityManager } from 'typeorm';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { User } from '@entities/user.entity';
import {
  CreatePatientDto,
  CreateUserDto,
} from '../../controllers/users/dto/create-user.dto';
import { hashSync } from 'bcrypt';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { GroupRepository } from '../groups/group.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UpdateUserDto } from '../../controllers/users/dto/update-user.dto';
import {
  deleteFailed,
  insertFailed,
  insertSucessful,
  notFound,
  updateSucessful,
} from '@shared/constants/messages';
import { Group } from '@entities/group.entity';
import { Environment } from '@/shared/constants/environment';

@Injectable()
export class UserService {
  constructor(
    private repo: UserRepository,
    private groupRepository: GroupRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) {
    cnx
      .findOneOrFail(User, {
        where: {
          docNumber: Environment.ADMIN_USER,
        },
      })
      .catch(async () => {
        await repo.create(cnx, {
          docNumber: Environment.ADMIN_USER,
          firstName: 'Admin',
          lastName: 'Admin',
          password: hashSync(Environment.ADMIN_PASSWORD, 10),
          role: RoleEnum.ADMIN,
        } as User);
      });
  }

  async create(
    user: CreateUserDto | CreatePatientDto,
    role: RoleEnum,
    currentUser: InfoUserInterface,
  ) {
    return await this.cnx.transaction(async (manager) => {
      const userExist = await this.repo.findByDocNumber(
        manager,
        user.docNumber,
        currentUser.role,
      );

      let userCreated: User;
      if (!userExist) {
        const data = {
          ...user,
          role,
          password: hashSync(user.docNumber, 10),
          createdBy: currentUser.id,
          firstTime: role === RoleEnum.THERAPIST ? true : null,
        } as User;

        userCreated = await this.repo.create(manager, data);

        if (!userCreated) throw new Error(insertFailed('usuario'));
      } else if (!userExist.status)
        await this.updateStatus(userExist.id, currentUser);

      if (currentUser.role === RoleEnum.THERAPIST) {
        await this.addToGroup(
          manager,
          userCreated?.id ?? userExist.id,
          currentUser,
        );
      }

      return insertSucessful(
        role == RoleEnum.PATIENT ? 'paciente' : 'terapeuta',
      );
    });
  }

  private async addToGroup(
    manager: EntityManager,
    patientId: number,
    therapist: InfoUserInterface,
  ) {
    const inGroup = await this.groupRepository.findPacientByTherapist(
      manager,
      patientId,
      therapist.id,
    );

    if (inGroup) throw new Error('Paciente ya está asociado al terapeuta');

    const add = await this.groupRepository.addPatient(manager, {
      patientId,
      therapistId: therapist.id,
    } as Group);

    if (!add) throw new Error('No se pudo agregar al paciente');
  }

  async findById(id: number) {
    const data = await this.repo.findById(this.cnx, id);

    if (!data) throw new NotFoundException(notFound('usuario'));

    return data;
  }

  async getPassword(cnx: EntityManager, id: number) {
    const pasword = await this.repo.getPassword(cnx, id);

    if (!pasword) throw new BadRequestException('No existe el usuario');

    return pasword;
  }

  async findByDocNumber(identification: string, role?: RoleEnum) {
    const data = await this.repo.findByDocNumber(
      this.cnx,
      identification,
      role,
    );

    if (!data) throw new BadRequestException('No existe el usuario');

    return data;
  }

  async updateStatus(id: number, currentUser: InfoUserInterface) {
    return await this.cnx.transaction(async (manager) => {
      const user = await this.repo.findById(manager, id);

      if (!user) throw new NotFoundException(notFound('usuario'));

      const deleted = await this.repo.updateStatus(manager, id, !user.status);

      if (deleted.affected == 0)
        throw new BadRequestException(deleteFailed('usuario'));

      if (user.role === RoleEnum.PATIENT) {
        const deleteOfGroup = await this.groupRepository.updateStatusPatient(
          manager,
          currentUser.id,
          id,
          !user.status,
          true,
        );

        if (deleteOfGroup.affected == 0)
          throw new Error('Error al eliminar el usuario de los grupos');
      }

      return updateSucessful('usuario');
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

  async getAllPatients(CurrentUser: InfoUserInterface, status?: boolean) {
    const users = await this.repo.getAllPatients(
      this.cnx,
      status,
      CurrentUser.role === RoleEnum.THERAPIST ? CurrentUser.id : undefined,
    );

    if (!users) throw new BadRequestException('No existen usuarios');

    return users;
  }

  async getAllTherapists(status?: boolean) {
    const therapists = await this.repo.getAllTherapists(this.cnx, status);

    if (!therapists) throw new NotFoundException('No existen usuarios');

    return therapists;
  }
}
