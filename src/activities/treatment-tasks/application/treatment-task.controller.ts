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

  /**
   * Get assigned tasks by patient
   * @param patientId
   * @param taskDone true: tareas realizadas, false: tareas pendientes, undefined: todas las tareas
   * @param treatmentActive true: tratamientos activos, false: tratamientos inactivos, undefined: todos los tratamientos
   */
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
}
