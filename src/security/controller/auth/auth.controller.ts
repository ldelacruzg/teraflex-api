import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
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

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectEntityManager() private cnx: EntityManager,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiHeader({ name: 'identification', description: 'Número de cédula' })
  @ApiHeader({ name: 'password', description: 'Contraseña' })
  async login(@Headers() payload: LoginDto) {
    try {
      return await this.authService.login(this.cnx, payload);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @Get('otp/:identification')
  @ApiOperation({ summary: 'Obtener OTP' })
  async getOTP(@Param('identification') identification: string) {
    // try {
    //   return await this.authService.getOTP(docNumber);
    // } catch (e) {
    //   throw new HttpException(e.message, 400);
    // }
    throw new HttpException('No implementado', HttpStatus.NOT_IMPLEMENTED);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @Get('otp/validate/:identification/:otp')
  @ApiOperation({ summary: 'Validar OTP' })
  async validateOTP(
    @Param('identification') identification: string,
    @Param('otp') otp: string,
  ) {
    try {
      return await this.authService.validateOTP(this.cnx, identification, otp);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
