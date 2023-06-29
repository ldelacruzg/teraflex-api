import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { Group } from '../../../entities/group.entity';
import { EntityManager } from 'typeorm';
import { InfoUserInterface } from '../../../security/jwt-strategy/info-user.interface';
import { UserService } from '../user/user.service';
import { RoleEnum } from '../../../security/jwt-strategy/role.enum';

@Injectable()
export class GroupService {
  constructor(
    private repo: GroupRepository,
    private userService: UserService,
  ) {}

  async addPatient(
    cnx: EntityManager,
    patientId: number,
    therapist: InfoUserInterface,
  ) {
    return await cnx.transaction(async (manager) => {
      try {
        const pacient = await this.userService.findById(manager, patientId);

        if (!pacient) throw new Error('Paciente no encontrado');
        if (pacient.role !== RoleEnum.PATIENT)
          throw new Error('El usuario no es paciente');

        const group = await this.repo.findPacientByTherapist(
          manager,
          patientId,
          therapist.id,
        );

        if (group) throw new Error('Paciente ya está registrado');

        const add = await this.repo.addPatient(manager, {
          patientId,
          therapistId: therapist.id,
        } as Group);

        if (!add) throw new Error('No se pudo agregar al paciente');

        return 'Agregado con éxito';
      } catch (e) {
        throw e;
      }
    });
  }

  async deletePatient(
    cnx: EntityManager,
    patientId: number,
    therapist: InfoUserInterface,
  ) {
    try {
      const patient = await this.userService.findById(cnx, patientId);
      if (!patient) throw new Error('Paciente no encontrado');

      const deletePatient = await this.repo.deletePatient(
        cnx,
        therapist.id,
        patientId,
      );

      if (deletePatient.affected === 0)
        throw new Error('No se pudo eliminar al paciente');

      return 'Eliminado con éxito';
    } catch (e) {
      throw e;
    }
  }

  async getAllByTherapist(cnx: EntityManager, therapistId: number) {
    try {
      const patients = await this.repo.getAllByTherapist(cnx, therapistId);

      if (!patients) throw new Error('No se encontraron pacientes');

      return patients;
    } catch (e) {
      throw e;
    }
  }
}
