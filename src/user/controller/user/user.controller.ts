import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
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
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { CurrentUser } from '@security/jwt-strategy/auth.decorator';

@Controller('user')
@ApiTags('User')
@UseInterceptors(ResponseHttpInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private service: UserService) {}

  @Post('therapist')
  @ApiOperation({ summary: 'Crear terapeuta' })
  @Role(RoleEnum.ADMIN)
  async createTherapist(
    @CurrentUser() user: InfoUserInterface,
    @Body() body: CreateUserDto,
  ) {
    return {
      data: null,
      message: await this.service.create(body, RoleEnum.THERAPIST, user),
    } as ResponseDataInterface;
  }

  @Post('patient')
  @ApiOperation({ summary: 'Crear paciente' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async createPatient(
    @CurrentUser() user: InfoUserInterface,
    @Body() body: CreatePatientDto,
  ) {
    return {
      data: null,
      message: await this.service.create(body, RoleEnum.PATIENT, user),
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
    @CurrentUser() user: InfoUserInterface,
  ) {
    return {
      data: await this.service.findByDocNumber(identification, user.role),
    } as ResponseDataInterface;
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Activar/desactivar usuario' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: InfoUserInterface,
  ) {
    return {
      message: await this.service.updateStatus(id, user),
    } as ResponseDataInterface;
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: InfoUserInterface,
    @Body() body: UpdateUserDto,
  ) {
    body.updatedBy = user.id;
    return {
      data: await this.service.update(id, body),
      message: null,
    } as ResponseDataInterface;
  }

  @Get('my-profile')
  @ApiOperation({ summary: 'Obtener datos de mi perfil' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getMyProfile(@CurrentUser() { id }: InfoUserInterface) {
    return {
      data: await this.service.findById(id),
      message: null,
    } as ResponseDataInterface;
  }

  @Get('all')
  @ApiOperation({
    summary: 'Obtener todos los usuarios excepto los que están en el grupo',
  })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  @ApiQuery({ name: 'status', required: false })
  async getAll(
    @CurrentUser() user: InfoUserInterface,
    @Query('status') status: boolean,
  ) {
    return {
      data: await this.service.getAll(user, status),
      message: null,
    } as ResponseDataInterface;
  }
}
