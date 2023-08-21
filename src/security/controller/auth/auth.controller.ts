import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../../service/auth/auth.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '../../jwt-strategy/roles.guard';
import { Role } from '../../jwt-strategy/roles.decorator';
import { RoleEnum } from '../../jwt-strategy/role.enum';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { CurrentUser } from '@security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { NewPasswordDto } from './dto/new-password.dto';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';

@Controller('auth')
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiHeader({
    name: 'identification',
    description: 'Número de cédula',
    required: true,
  })
  @ApiHeader({ name: 'password', description: 'Contraseña', required: true })
  async login(@Headers() payload: LoginDto) {
    return {
      data: await this.authService.login(this.cnx, payload),
      message: 'Inicio de sesión exitoso',
    } as ResponseDataInterface;
  }

  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  // @Get('otp/:identification')
  // @ApiOperation({ summary: 'Obtener OTP' })
  // async getOTP(@Param('identification') identification: string) {
  // try {
  //   return await this.authService.getOTP(docNumber);
  // } catch (e) {
  //   throw new HttpException(e.message, 400);
  // }
  //   throw new HttpException('No implementado', HttpStatus.NOT_IMPLEMENTED);
  // }

  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  // @Get('otp/validate/:identification/:otp')
  // @ApiOperation({ summary: 'Validar OTP' })
  // async validateOTP(
  //   @Param('identification') identification: string,
  //   @Param('otp') otp: string,
  // ) {
  //   try {
  //     return await this.authService.validateOTP(this.cnx, identification, otp);
  //   } catch (e) {
  //     throw new HttpException(e.message, 400);
  //   }
  // }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @Get('generate-password/:id')
  @ApiOperation({ summary: 'Generar nueva contraseña' })
  async generatePassword(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: InfoUserInterface,
  ) {
    return {
      data: {
        newPassword: await this.authService.newPassword(id, user),
      },
    } as ResponseDataInterface;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST, RoleEnum.PATIENT)
  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  async changePassword(
    @CurrentUser() { id }: InfoUserInterface,
    @Body() { password }: NewPasswordDto,
  ) {
    return {
      message: await this.authService.changePassword(id, password),
    } as ResponseDataInterface;
  }
}
