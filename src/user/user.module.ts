import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './controller/user/user.controller';
import { UserService } from './service/user/user.service';
import { UserValidation } from 'src/entities/user-validation.entity';
import { UserRepository } from './service/user/user.repository';
import { GroupRepository } from './service/group/group.repository';
import { GroupController } from './controller/group/group.controller';
import { GroupService } from './service/group/group.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserValidation]), SharedModule],
  controllers: [UserController, GroupController],
  providers: [UserService, UserRepository, GroupRepository, GroupService],
  exports: [UserService],
})
export class UserModule {}
