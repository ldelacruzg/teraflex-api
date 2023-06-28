import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoginDto } from '../../controller/auth/dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '../../jwt-strategy/role.enum';
import { UserValidation } from '../../../entities/user-validation.entity';
import { UserService } from '../../../user/service/user/user.service';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private userService: UserService) {}

  async login(cnx: EntityManager, payload: LoginDto) {
    try {
      const user = await this.userService.findByDocNumber(
        cnx,
        payload.identification,
      );

      const password = await this.userService.getPassword(cnx, user.id);

      const passwordValidated = await compare(payload.password, password);

      if (!passwordValidated) {
        throw new Error('Contraseña incorrecta');
      }

      return {
        token: this.jwt.sign(
          {
            id: user.id,
            docNumber: user.docNumber,
            role: user.role,
          },
          {
            expiresIn:
              user.role == RoleEnum.PATIENT ? Number.MAX_SAFE_INTEGER : '8h',
          },
        ),
        role: user.role,
      };
    } catch (e) {
      throw e;
    }
  }

  async getOTP(cnx: EntityManager, docNumber: string) {
    try {
      const user = await this.userService.findByDocNumber(cnx, docNumber);

      const validationCode = Math.floor(1000 + Math.random() * 9000).toString();

      const userValidation = await cnx.insert(UserValidation, {
        user,
        validationCode,
      });

      return 'Código de validación enviado';
    } catch (e) {
      throw e;
    }
  }

  async validateOTP(
    cnx: EntityManager,
    docNumber: string,
    validationCode: string,
  ) {
    try {
      const user = await this.userService.findByDocNumber(cnx, docNumber);

      const userValidation = await cnx.findOne(UserValidation, {
        where: { validationCode, userId: user.id },
      });

      if (!userValidation) {
        throw new Error('Código de validación incorrecto');
      }

      await cnx.update(
        UserValidation,
        { id: userValidation.id },
        { validated: true },
      );

      return 'Código de validación correcto';
    } catch (e) {
      throw e;
    }
  }
}
