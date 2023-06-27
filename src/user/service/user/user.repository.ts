import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class UserRepository{
    constructor(@InjectEntityManager() private cnx: EntityManager){}

    async findById(id: number){
        return await this.cnx.findOneBy(User, { id });
    }

    async findByDocNumber(docNumber: string){
        return await this.cnx.findOneBy(User, { docNumber });
    }

    async create(user: User){
        const data = await this.cnx.create(User, user);
        return await this.cnx.save(data);
    }
}