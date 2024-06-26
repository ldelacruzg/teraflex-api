import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TreatmentTaskService } from '../infrastructure/treatment-task.service';
import { AssignTasksToTreatmentBodyDto } from '../domain/dtos/create-treatment-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ParseBoolAllowUndefinedPipe } from '@/shared/pipes/parse-bool-allow-undefined.pipe';
import { UserService } from '@/users/services/users/user.service';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { NotificationService } from '@/notifications/services/notifications/notification.service';
import { TreatmentService } from '@/activities/treatments';
import { FormatDateService } from '@/shared/services/format-date.service';

@Controller()
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@ApiTags('Assignmets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TreatmentTaskController {
  constructor(
    private readonly service: TreatmentTaskService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly treatmentService: TreatmentService,
  ) {}

  @Post('treatments/:treatmentId/assign-tasks')
  @ApiOperation({ summary: 'Assign tasks to treatment' })
  @Role(RoleEnum.THERAPIST)
  async create(
    @CurrentUser() userLogged: InfoUserInterface,
    @Param('treatmentId', ParseIntPipe) treatmentId: number,
    @Body() payload: AssignTasksToTreatmentBodyDto,
  ): Promise<ResponseDataInterface> {
    const [assigments, therapist, treatment] = await Promise.all([
      this.service.assignTasksToTreatment({ ...payload, treatmentId }),
      this.userService.findById(userLogged.id),
      this.treatmentService.findOne(treatmentId),
    ]);

    // notify the patient
    const lenTasks = payload.tasks.length;
    const bodyNotification = `El terapeuta ${therapist.lastName} te ha asignado`;

    await this.notificationService.sendNotification(treatment.patientId, {
      title: lenTasks > 1 ? 'Nuevas tareas asignadas' : 'Nueva tarea asignada',
      body:
        lenTasks > 1
          ? `${bodyNotification} ${lenTasks} tareas nuevas`
          : `${bodyNotification} una nueva tarea hasta el ${FormatDateService.formatDateToNotification(
              payload.tasks[0].expirationDate,
            )}`,
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

  @Get('patients/number-of-pacients-by-ages')
  @ApiOperation({ summary: 'Get number of pacients by ages' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getNumberOfPacientsByAges(): Promise<ResponseDataInterface> {
    return {
      data: await this.service.getNumberOfPacientsByAges(),
      message: 'Número de pacientes por edades obtenido correctamente',
    };
  }

  @Get('therapists/:therapistId/patients/last-completed')
  @ApiOperation({
    summary: 'Get last task completed of patients by therapist',
  })
  @Role(RoleEnum.THERAPIST)
  async getLastTaskCompleted(
    @Param('therapistId', ParseIntPipe) therapistId: number,
  ): Promise<ResponseDataInterface> {
    // get last task completed
    const lastCompletedTask = await this.service.getLastTaskCompleted({
      therapistId,
    });

    return {
      message: 'ültimas tareas completadas obtenidas correctamente',
      data: lastCompletedTask,
    };
  }

  @Delete('assignments')
  @ApiOperation({
    summary: 'Delete one or more tasks assigned to a patient',
  })
  @ApiQuery({ name: 'id', required: true })
  @Role(RoleEnum.THERAPIST)
  async deleteTasksFromUser(
    @Query('id', new ParseArrayPipe({ items: Number })) assignmentIds: number[],
  ): Promise<ResponseDataInterface> {
    // remove tasks from user
    const removedTasks = await this.service.removeMany(assignmentIds);

    return {
      message:
        assignmentIds.length > 1
          ? 'Tareas asignadas eliminadas correctamente'
          : 'La tarea asignada fue eliminada correctamente',
      data: removedTasks,
    };
  }
}
