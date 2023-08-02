import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { CreatePatientDto, CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';

@Controller('user')
@ApiTags('User')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private service: UserService) { }

  @Post('therapist')
  @ApiOperation({ summary: 'Crear terapeuta' })
  @Role(RoleEnum.ADMIN)
  async createTherapist(@Req() req, @Body() body: CreateUserDto) {
      return {
        data: null,
        message: await this.service.create(body, RoleEnum.THERAPIST, req.user),
      } as ResponseDataInterface;
  }

  @Post('patient')
  @ApiOperation({ summary: 'Crear paciente' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async createPatient(@Req() req, @Body() body: CreatePatientDto) {
    return {
      data: null,
      message: await this.service.create(body, RoleEnum.PATIENT, req.user),
    } as ResponseDataInterface;
  }

  @Get('by-id/:id')
  @ApiOperation({ summary: 'Buscar por id' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return {
      data: await this.service.findById(id),
      message: null,
    } as ResponseDataInterface;
  }

  @Get('by-identification/:identification')
  @ApiOperation({ summary: 'Buscar por número de cédula' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async findByDocNumber(
    @Param('identification') identification: string,
    @Req() req,
  ) {
    return {
      data: await this.service.findByDocNumber(identification, req.user.role),
    } as ResponseDataInterface;
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Activar/desactivar usuario' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return {
      message: await this.service.updateStatus(id, req.user),
    } as ResponseDataInterface;
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() body: UpdateUserDto,
  ) {
    body.updatedBy = (req.user as InfoUserInterface).id;
    return {
      data: await this.service.update(id, body),
      message: null,
    } as ResponseDataInterface;
  }

  @Get('my-profile')
  @ApiOperation({ summary: 'Obtener datos de mi perfil' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getMyProfile(@Req() req) {
    return {
      data: await this.service.findById((req.user as InfoUserInterface).id),
      message: null,
    } as ResponseDataInterface;
  }

  @Get('all')
  @ApiOperation({
    summary: 'Obtener todos los usuarios excepto los que están en el grupo',
  })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @ApiQuery({ name: 'status', required: false })
  async getAll(@Req() req, @Query('status') status: boolean) {
    return {
      data: await this.service.getAll(req.user, status),
      message: null,
    } as ResponseDataInterface;
  }
}
