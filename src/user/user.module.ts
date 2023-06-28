import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './controller/user/user.controller';
import { UserService } from './service/user/user.service';
import { UserValidation } from 'src/entities/user-validation.entity';
import { UserRepository } from './service/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserValidation])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
