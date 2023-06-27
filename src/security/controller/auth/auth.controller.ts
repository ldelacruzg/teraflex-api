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

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiHeader({ name: 'username', description: 'Número de cédula' })
  @ApiHeader({ name: 'password', description: 'Contraseña' })
  async login(@Headers() payload: LoginDto) {
    try {
      return await this.authService.login(payload);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @Get('otp/:docNumber')
  @ApiOperation({ summary: 'Obtener OTP' })
  async getOTP(@Param('docNumber') docNumber: string) {
    // try {
    //   return await this.authService.getOTP(docNumber);
    // } catch (e) {
    //   throw new HttpException(e.message, 400);
    // }
    throw new HttpException('No implementado', HttpStatus.NOT_IMPLEMENTED);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @Get('otp/validate/:docNumber/:otp')
  @ApiOperation({ summary: 'Validar OTP' })
  async validateOTP(@Param('docNumber') docNumber: string, @Param('otp') otp: string) {
    try {
      return await this.authService.validateOTP(docNumber, otp);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
