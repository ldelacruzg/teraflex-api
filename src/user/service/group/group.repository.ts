import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Group } from '../../../entities/group.entity';

@Injectable()
export class GroupRepository {
  async addPatient(cnx: EntityManager, group: Group) {
    const newGroup = await cnx.create(Group, group);
    return await cnx.save(newGroup);
  }

  async deletePatient(
    cnx: EntityManager,
    therapistId: number,
    patientId: number,
    allGroups?: boolean,
  ) {
    const query = cnx
      .createQueryBuilder()
      .update(Group)
      .set({ status: false })
      .where('patient_id = :patientId', { patientId });

    if (!allGroups) {
      query.andWhere('therapist_id = :therapistId', { therapistId });
    }

    return await query.execute();
  }

  async getAllByTherapist(cnx: EntityManager, therapistId: number) {
    return await cnx.find(Group, {
      select: ['id', 'patient', 'createdAt', 'updatedAt'],
      where: { therapistId, status: true },
      relations: { patient: true },
    });
  }

  async findPacientByTherapist(
    cnx: EntityManager,
    patientId: number,
    therapistId: number,
  ) {
    return cnx.findOne(Group, {
      where: { patientId, therapistId, status: true },
    });
  }
}
