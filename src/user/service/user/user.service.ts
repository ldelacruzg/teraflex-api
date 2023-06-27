import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
    constructor(private repo: UserRepository, @InjectEntityManager() private cnx: EntityManager) {}

    async create(user: any, role: RoleEnum) {
        return await this.cnx.transaction(async (manager) => {
            try {
                const data ={
                    ...user,
                    role,
                } as User;

                const created = await this.repo.create(data);

                if(!created)
                    throw new Error('Error al crear el usuario');

                return created.id;
            } catch (error) {
                throw error;
            }
        });
    }
}
