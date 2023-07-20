import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { Group } from '@entities/group.entity';
import { EntityManager } from 'typeorm';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserRepository } from '@user/service/user/user.repository';
import { updateSucessful } from '@shared/constants/messages';

@Injectable()
export class GroupService {
  constructor(
    private repo: GroupRepository,
    private userRepo: UserRepository,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  async addPatient(patientId: number, therapist: InfoUserInterface) {
    return await this.cnx.transaction(async (manager) => {
      try {
        const pacient = await this.userRepo.findById(manager, patientId);

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

  async updateStatusPatient(patientId: number, therapist: InfoUserInterface) {
    try {
      const patient = await this.userRepo.findById(this.cnx, patientId);
      if (!patient) throw new Error('Paciente no encontrado');

      const inGroup = await this.repo.findPacientByTherapist(
        this.cnx,
        patientId,
        therapist.id,
      );

      if (!inGroup) throw new Error('Paciente no está registrado');

      const deletePatient = await this.repo.updateStatusPatient(
        this.cnx,
        therapist.id,
        patientId,
        !inGroup.status,
      );

      if (deletePatient.affected === 0)
        throw new Error('No se pudo actualizar al paciente');

      return updateSucessful('paciente');
    } catch (e) {
      throw e;
    }
  }

  async getAllByTherapist(therapistId: number) {
    try {
      const patients = await this.repo.getAllByTherapist(this.cnx, therapistId);

      if (!patients) throw new Error('No se encontraron pacientes');

      return patients;
    } catch (e) {
      throw e;
    }
  }
}
