import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';
import { Environment } from '../shared/constants/environment';
import { JwtStrategy } from './jwt-strategy/jwt.strategy';
import { AuthController } from './controller/auth/auth.controller';
import { AuthService } from './service/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserValidation } from '../entities/user-validation.entity';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: Environment.JWT_SECRETKEY,
    }),
    SharedModule,
    TypeOrmModule.forFeature([UserValidation, User]),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class SecurityModule {}
