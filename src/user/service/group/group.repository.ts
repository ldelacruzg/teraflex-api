import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Group } from '@entities/group.entity';

@Injectable()
export class GroupRepository {
  async addPatient(cnx: EntityManager, group: Group) {
    const newGroup = await cnx.create(Group, group);
    return await cnx.save(newGroup);
  }

  async updateStatusPatient(
    cnx: EntityManager,
    therapistId: number,
    patientId: number,
    status: boolean,
    allGroups?: boolean,
  ) {
    const query = cnx
      .createQueryBuilder()
      .update(Group)
      .set({ status })
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
    status?: boolean,
  ) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'group.id as id',
        'group.created_at as "createdAt"',
        'group.updated_at as "updatedAt"',
        'group.status as status',
        'patient.id as "patientId"',
        'patient.first_name as "firstName"',
        'patient.last_name as "lastName"',
        'patient.doc_number as "docNumber"',
        'patient.phone as phone',
        'patient.description as description',
        'patient.birth_date as "birthDate"',
      ])
      .from(Group, 'group')
      .innerJoin('group.patient', 'patient')
      .where('patient.id = :patientId', { patientId })
      .andWhere('group.therapist_id = :therapistId', { therapistId });

    if (status !== undefined) {
      query.andWhere('group.status = :status', { status });
    }

    return await query.getRawOne();
  }
}
