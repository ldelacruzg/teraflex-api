import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TreatmentService } from '../infrastructure/treatment.service';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ParseBoolAllowUndefinedPipe } from '@/shared/pipes/parse-bool-allow-undefined.pipe';
import { ParseIntAllowsUndefinedPipe } from '@/shared/pipes/parse-int-allows-undefined.pipe';

@Controller('treatments')
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Treatments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TreatmentController {
  constructor(private readonly service: TreatmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a treatment' })
  @Role(RoleEnum.THERAPIST)
  async create(
    @CurrentUser() currentUser: InfoUserInterface,
    @Body() payload: CreateTreatmentDto,
  ): Promise<ResponseDataInterface> {
    const newTreatment = await this.service.create({
      ...payload,
      therapistId: currentUser.id,
    });

    return {
      message: 'Tratamiento creado correctamente',
      data: newTreatment,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all treatments' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getAll(
    @Query('patient-id', ParseIntAllowsUndefinedPipe) patientId: number,
    @Query('treatment-active', ParseBoolAllowUndefinedPipe)
    treatmentActive: boolean,
    @Query('tasks-number', ParseBoolAllowUndefinedPipe)
    tasksNumber: boolean,
  ): Promise<ResponseDataInterface> {
    const treatments = await this.service.findAll({
      patientId,
      treatmentActive,
      tasksNumber,
    });

    return {
      message: 'Tratamientos obtenidos correctamente',
      data: treatments,
    };
  }

  @Get(':treatmentId/tasks')
  @ApiOperation({ summary: 'Get all tasks from a treatment' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getAllTreatmentTasks(
    @Param('treatmentId', ParseIntPipe) treatmentId: number,
    @Query('completedTasks', ParseBoolAllowUndefinedPipe)
    completedTasks: boolean,
    @Query('pendingTasks', ParseBoolAllowUndefinedPipe)
    pendingTasks: boolean,
    @Query('expiredTasks', ParseBoolAllowUndefinedPipe)
    expiredTasks: boolean,
  ): Promise<ResponseDataInterface> {
    const tasks = await this.service.findAllTreatmentTasks({
      treatmentId,
      completedTasks,
      pendingTasks,
      expiredTasks,
    });

    return {
      message: 'Las tareas del tratamiento se obtuvieron correctamente',
      data: tasks,
    };
  }

  @Get(':treatmentId')
  @ApiOperation({ summary: 'Get a treatment by id' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getOne(
    @Param('treatmentId', ParseIntPipe) treatmentId: number,
  ): Promise<ResponseDataInterface> {
    const treatment = await this.service.findOne(treatmentId);

    return {
      message: 'Tratamiento obtenido correctamente',
      data: treatment,
    };
  }
}
