import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { UserController } from './controllers/users/user.controller';
import { UserService } from './services/users/user.service';
import { UserValidation } from '@entities/user-validation.entity';
import { UserRepository } from './services/users/user.repository';
import { GroupRepository } from './services/groups/group.repository';
import { GroupController } from './controllers/groups/group.controller';
import { GroupService } from './services/groups/group.service';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserValidation]), SharedModule],
  controllers: [UserController, GroupController],
  providers: [UserService, UserRepository, GroupRepository, GroupService],
  exports: [UserService],
})
export class UserModule {}
