import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserService } from '../../service/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from '../../../security/jwt-strategy/role.enum';
import { JwtAuthGuard } from '../../../security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '../../../security/jwt-strategy/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../../security/jwt-strategy/roles.decorator';

@Controller('user')
@ApiTags('user')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    @InjectEntityManager() private cnx: EntityManager,
    private service: UserService,
  ) {}

  @Post('therapist')
  @ApiOperation({ summary: 'Crear terapeuta' })
  @Role(RoleEnum.ADMIN)
  async createTherapist(@Req() req, @Body() body: CreateUserDto) {
    try {
      return await this.service.create(
        this.cnx,
        body,
        RoleEnum.THERAPIST,
        req.user,
      );
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Post('patient')
  @ApiOperation({ summary: 'Crear paciente' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async createPatient(@Req() req, @Body() body: CreateUserDto) {
    try {
      return await this.service.create(
        this.cnx,
        body,
        RoleEnum.PATIENT,
        req.user,
      );
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Get('by-id/:id')
  @ApiOperation({ summary: 'Buscar por id' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async findById(@Param('id') id: number) {
    try {
      return await this.service.findById(this.cnx, id);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Get('by-identification/:identification')
  @ApiOperation({ summary: 'Buscar por número de cédula' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async findByDocNumber(
    @Param('identification') identification: string,
    @Req() req,
  ) {
    try {
      return await this.service.findByDocNumber(
        this.cnx,
        identification,
        req.user.role,
      );
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar usuario' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async delete(@Param('id') id: number, @Req() req) {
    try {
      return await this.service.delete(this.cnx, id, req.user);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
