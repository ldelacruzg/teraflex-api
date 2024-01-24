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
import { TreatmentTaskService } from '../infrastructure/treatment-task.service';
import { AssignTasksToTreatmentBodyDto } from '../domain/dtos/create-treatment-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ParseBoolAllowUndefinedPipe } from '@/shared/pipes/parse-bool-allow-undefined.pipe';

@Controller()
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@ApiTags('Assignmets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TreatmentTaskController {
  constructor(private readonly service: TreatmentTaskService) {}

  @Post('treatments/:treatmentId/assign-tasks')
  @ApiOperation({ summary: 'Assign tasks to treatment' })
  @Role(RoleEnum.THERAPIST)
  async create(
    @Param('treatmentId', ParseIntPipe) treatmentId: number,
    @Body() payload: AssignTasksToTreatmentBodyDto,
  ): Promise<ResponseDataInterface> {
    const assigments = await this.service.assignTasksToTreatment({
      ...payload,
      treatmentId,
    });

    return {
      message: 'Tareas asignadas correctamente',
      data: assigments,
    };
  }

  @Get('patients/:patientId/assignments')
  @ApiOperation({ summary: 'Get assigned tasks by patient' })
  @Role(RoleEnum.PATIENT, RoleEnum.THERAPIST)
  async getAssignedTasksByPatientId(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Query('task-done', ParseBoolAllowUndefinedPipe) taskDone: boolean,
    @Query('treatment-active', ParseBoolAllowUndefinedPipe)
    treatmentActive: boolean,
  ): Promise<ResponseDataInterface> {
    const tasks = await this.service.getAssignedTasksByPatient({
      patientId,
      taskDone,
      treatmentActive,
    });

    return {
      message: 'Tareas asignadas obtenidas correctamente',
      data: tasks,
    };
  }

  @Get('assignments/:assignmentId')
  @ApiOperation({ summary: 'Get a task assigned' })
  @Role(RoleEnum.PATIENT, RoleEnum.THERAPIST)
  async getAssignedTask(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<ResponseDataInterface> {
    const task = await this.service.getAssignedTaskDetails(assignmentId);

    return {
      message: 'Tarea asignada obtenida correctamente',
      data: task,
    };
  }

  @Get('assignments/:assignmentId/multimedia')
  @ApiOperation({ summary: 'Get multimedia from assignment' })
  @Role(RoleEnum.PATIENT, RoleEnum.THERAPIST)
  async getMultimedia(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<ResponseDataInterface> {
    const multimedia = await this.service.getMultimediasByAssigment(
      assignmentId,
    );

    return {
      message: 'Multimedia obtenida correctamente',
      data: multimedia,
    };
  }

  // endpoint para finalizar una tarea asignada
  @Patch('assignments/:assignmentId/finish')
  @ApiOperation({ summary: 'Finish an assigned task' })
  @Role(RoleEnum.PATIENT, RoleEnum.THERAPIST)
  async finishAssignedTask(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<ResponseDataInterface> {
    const weeklySummary = await this.service.finishAssignedTask(assignmentId);

    return {
      message: 'Tarea finalizada correctamente',
      data: weeklySummary,
    };
  }
}
