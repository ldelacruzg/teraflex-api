import { Module, forwardRef } from '@nestjs/common';
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
import { GamificationModule } from '@/gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserValidation]),
    SharedModule,
    forwardRef(() => GamificationModule),
  ],
  controllers: [UserController, GroupController],
  providers: [UserService, UserRepository, GroupRepository, GroupService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
