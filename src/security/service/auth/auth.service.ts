import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LoginDto } from '../../controller/auth/dto/login.dto';
import { compare, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '../../jwt-strategy/role.enum';
// import { UserValidation } from '@entities/user-validation.entity';
import { UserService } from '@users/services/users/user.service';
import { UpdateUserDto } from '@users/controllers/users/dto/update-user.dto';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(cnx: EntityManager, payload: LoginDto) {
    const user = await this.userService.findByDocNumber(payload.identification);

    const password = await this.userService.getPassword(cnx, user.id);

    if (!(await compare(payload.password, password))) {
      throw new UnauthorizedException('Contraseña incorrecta');
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
      firstTime: user.firstTime ?? false,
    };
  }

  // async getOTP(cnx: EntityManager, docNumber: string) {
  //   try {
  //     const user = await this.userService.findByDocNumber(docNumber);

  //     const validationCode = Math.floor(1000 + Math.random() * 9000).toString();

  //     await cnx.insert(UserValidation, {
  //       user,
  //       validationCode,
  //     });

  //     return 'Código de validación enviado';
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // async validateOTP(
  //   cnx: EntityManager,
  //   docNumber: string,
  //   validationCode: string,
  // ) {
  //   try {
  //     const user = await this.userService.findByDocNumber(docNumber);

  //     const userValidation = await cnx.findOne(UserValidation, {
  //       where: { validationCode, userId: user.id },
  //     });

  //     if (!userValidation) {
  //       throw new Error('Código de validación incorrecto');
  //     }

  //     await cnx.update(
  //       UserValidation,
  //       { id: userValidation.id },
  //       { validated: true },
  //     );

  //     return 'Código de validación correcto';
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  async newPassword(
    id: number,
    currentUser: InfoUserInterface,
  ): Promise<string> {
    const user = await this.userService.findById(id);

    if (
      currentUser.role === RoleEnum.THERAPIST &&
      user.role !== RoleEnum.PATIENT
    )
      throw new ForbiddenException(
        'No tienes permisos para cambiar la contraseña de este usuario',
      );

    const newPassword = this.generarStringAleatorio(6);

    const updated = await this.userService.update(id, {
      password: hashSync(newPassword, 10),
      updatedBy: currentUser.id,
      firstTime: true,
    } as UpdateUserDto);

    if (updated.affected === 0)
      throw new InternalServerErrorException(
        'Error al generar la nueva contraseña',
      );

    return newPassword;
  }

  private generarStringAleatorio(longitud: number): string {
    try {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';

      for (let i = 0; i < longitud; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
      }

      return result;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error al generar la nueva contraseña',
      );
    }
  }

  async changePassword(currentUserId: number, password: string) {
    await this.userService.findById(currentUserId);

    const updated = await this.userService.update(currentUserId, {
      password: hashSync(password, 10),
      updatedBy: currentUserId,
      firstTime: false,
    } as UpdateUserDto);

    if (updated.affected === 0)
      throw new Error('Error al cambiar la contraseña');

    return 'Contraseña cambiada correctamente';
  }
}
