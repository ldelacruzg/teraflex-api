import { HttpException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginDto } from '../../controller/auth/dto/login.dto';
import { User } from '../../../entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '../../jwt-strategy/role.enum';
import { UserValidation } from '../../../entities/user-validation.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager() private cnx: EntityManager,
    private jwt: JwtService,
  ) {}

  async login(payload: LoginDto) {
    try {
      // TODO: Cambiar por el repositorio de usuario
      const user = await this.cnx.findOne(User, {
        where: { docNumber: payload.username },
      });

      if (!user) {
        throw new Error('No existe el usuario');
      }

      const passwordValidated = await compare(payload.password, user.password);

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
              user.role == RoleEnum.PATIENT
                ? Number.MAX_SAFE_INTEGER
                : '8h',
          },
        ),
        role: user.role,
      };
    } catch (e) {
      throw e;
    }
  }

  async getOTP(docNumber: string) {
    try {
      const user = await this.cnx.findOne(User, {
        where: { docNumber: docNumber },
      });

      if (!user) {
        throw new Error('No existe el usuario');
      }

      const validationCode = Math.floor(1000 + Math.random() * 9000).toString();

      const userValidation = await this.cnx.insert(UserValidation, {
        user,
        validationCode,
      });

      return 'Código de validación enviado';
    } catch (e) {
      throw e;
    }
  }

  async validateOTP(docNumber: string, validationCode: string) {
    try {
      const user = await this.cnx.findOne(User, {
        where: { docNumber: docNumber },
      });

      if (!user) {
        throw new Error('No existe el usuario');
      }

      const userValidation = await this.cnx.findOne(UserValidation, {
        where: { validationCode, userId: user.id },
      });

      if (!userValidation) {
        throw new Error('Código de validación incorrecto');
      }

      await this.cnx.update(UserValidation, { id: userValidation.id }, { validated: true });

      return 'Código de validación correcto';
    } catch (e) {
      throw e;
    }
  }
}
