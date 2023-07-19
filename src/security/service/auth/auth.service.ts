import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoginDto } from '../../controller/auth/dto/login.dto';
import { compare, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '../../jwt-strategy/role.enum';
import { UserValidation } from '@entities/user-validation.entity';
import { UserService } from '@user/service/user/user.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UpdateUserDto } from 'user/controller/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  async login(cnx: EntityManager, payload: LoginDto) {
    try {
      const user = await this.userService.findByDocNumber(
        payload.identification,
      );

      const password = await this.userService.getPassword(cnx, user.id);

      if (!(await compare(payload.password, password))) {
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
              user.role == RoleEnum.PATIENT ? Number.MAX_SAFE_INTEGER : '9h',
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
      const user = await this.userService.findByDocNumber(docNumber);

      const validationCode = Math.floor(1000 + Math.random() * 9000).toString();

      await cnx.insert(UserValidation, {
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
      const user = await this.userService.findByDocNumber(docNumber);

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

  async newPassword(id: number, currentUserId: number) {
    try {
      await this.userService.findById(id);

      const newPassword = this.generarStringAleatorio(6);

      const updated = await this.userService.update(id, {
        password: hashSync(newPassword, 10),
        updatedBy: currentUserId,
      } as UpdateUserDto);

      if (updated.affected === 0) throw new Error();

      return newPassword;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error al generar la nueva contraseña',
      );
    }
  }

  private generarStringAleatorio(longitud: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < longitud; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }

    return result;
  }

  async changePassword(currentUserId: number, password: string) {
    try {
      await this.userService.findById(currentUserId);

      const updated = await this.userService.update(currentUserId, {
        password: hashSync(password, 10),
        updatedBy: currentUserId,
      } as UpdateUserDto);

      if (updated.affected === 0)
        throw new Error('Error al cambiar la contraseña');

      return 'Contraseña cambiada correctamente';
    } catch (e) {
      throw e;
    }
  }
}
