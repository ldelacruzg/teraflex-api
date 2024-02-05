import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { Category } from '@entities/category.entity';
import { GroupRepository } from '@users/services/groups/group.repository';
import { GetManyUsersI, GetUserI } from '@users/interfaces/user.interfaces';
import { Group } from '@entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    private groupRepo: GroupRepository,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findNumberPatientsByAge() {
    return this.userRepository
      .createQueryBuilder('user')
      .select(['extract(year from age(user.birth_date)) as "age"', 'count(*)'])
      .where('user.role = :role', { role: RoleEnum.PATIENT })
      .andWhere('extract(year from age(user.birth_date)) > 0')
      .groupBy('age')
      .getRawMany<{ age: number; count: number }>();
  }

  async findById(cnx: EntityManager, id: number) {
    return await cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'user.firstName as "firstName"',
        'user.lastName as "lastName"',
        'user.docNumber as "docNumber"',
        'user.phone as phone',
        'user.description as description',
        'user.birthDate as "birthDate"',
        'user.createdAt as "createdAt"',
        'user.updatedAt as "updatedAt"',
        'user.role as role',
        'category.id as "categoryId"',
        'category.name as "categoryName"',
        'user.status as status',
      ])
      .from(User, 'user')
      .leftJoin(Category, 'category', 'category.id = user.categoryId')
      .where('user.id = :id', { id })
      .getRawOne<GetUserI>();
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
        'user.status as status',
        'category.id as "categoryId"',
        'category.name as "categoryName"',
        'user.role as role',
        'user.first_time as "firstTime"',
      ])
      .from(User, 'user')
      .leftJoin(Category, 'category', 'category.id = user.category_id')
      .where('user.doc_number = :docNumber', { docNumber });

    if (currentRole !== undefined) {
      query.andWhere('user.role = :role', {
        role:
          currentRole === RoleEnum.THERAPIST
            ? RoleEnum.PATIENT
            : RoleEnum.THERAPIST,
      });
    }

    return await query.getRawOne<GetUserI>();
  }

  async create(cnx: EntityManager, user: User) {
    const data = await cnx.create(User, user);
    return await cnx.save(data);
  }

  async updateStatus(cnx: EntityManager, id: number, status: boolean) {
    return await cnx.update(User, { id }, { status });
  }

  async update(cnx: EntityManager, id: number, user: User) {
    return await cnx
      .createQueryBuilder()
      .update(User)
      .set(user)
      .returning(
        'id, ' +
          'first_name as "firstName",' +
          'last_name as "lastName",' +
          'doc_number as "docNumber",' +
          'phone as phone,' +
          'description as description,' +
          'birth_date as "birthDate",' +
          'created_at as "createdAt",' +
          'updated_at as "updatedAt",' +
          'role as role',
      )
      .where('id = :id', { id })
      .execute();
  }

  async getAllPatients(
    cnx: EntityManager,
    status?: boolean,
    therapistId?: number,
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
      ])
      .from(User, 'user')
      .where('user.status = :status', { status: status ?? true })
      .andWhere('user.role = :role', { role: RoleEnum.PATIENT })
      .orderBy('user.first_name', 'ASC');

    if (therapistId !== undefined) {
      const patientsInGroup = await this.groupRepo.getAllByTherapist(
        cnx,
        therapistId,
      );

      const ids = patientsInGroup.map((group) => group.patient.id);
      if (ids.length > 0) query.andWhere('user.id NOT IN (:...ids)', { ids });
    }

    const patients = await query.getRawMany<GetManyUsersI>();

    return therapistId !== undefined
      ? patients
      : await this.getTherapistsByPatients(cnx, patients);
  }

  private async getTherapistsByPatients(
    cnx: EntityManager,
    patients: GetManyUsersI[],
  ) {
    return await Promise.all(
      patients.map(async (patient) => {
        patient.therapists = await cnx
          .createQueryBuilder()
          .select([
            'user.id as id',
            'user.first_name as "firstName"',
            'user.last_name as "lastName"',
            'user.doc_number as "docNumber"',
            'user.phone as phone',
          ])
          .from(User, 'user')
          .leftJoin(Group, 'group', 'group.therapist_id = user.id')
          .where('group.patient_id = :patientId', { patientId: patient.id })
          .getRawMany();
        return patient;
      }),
    );
  }

  async getAllTherapists(cnx: EntityManager, status?: boolean) {
    return await cnx.find(User, {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        docNumber: true,
        phone: true,
        description: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          name: true,
        },
      },
      where: {
        status: status ?? true,
        role: RoleEnum.THERAPIST,
      },
      relations: ['category'],
      order: {
        firstName: 'ASC',
      },
    });
  }
}
