import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Param,
  UseGuards,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AssignmentService } from '@activities/services/assignment/assignment.service';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { CreateManyAssignmentsDto } from './dto/create-many-assignments.dto';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { ParseBoolAllowUndefinedPipe } from '@shared/pipes/parse-bool-allow-undefined.pipe';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { NotificationService } from '@notifications/services/notifications/notification.service';
import moment from 'moment';
import { UserService } from '@/users/services/users/user.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@ApiTags('Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AssignmentController {
  constructor(
    private assignmentService: AssignmentService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  @Get('patients/:patientId/tasks')
  @ApiOperation({
    summary: 'Se obtiene la lista de tareas asignadas a un paciente',
  })
  @ApiQuery({ name: 'isCompleted', required: false })
  @ApiQuery({ name: 'last', required: false })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getAssigmentTasksByUser(
    @Param('patientId', ParseIntPipe)
    patientId: number,
    @Query('isCompleted', ParseBoolAllowUndefinedPipe)
    isCompleted: boolean | undefined,
    @Query('last', ParseBoolAllowUndefinedPipe)
    last: boolean | undefined,
  ): Promise<ResponseDataInterface> {
    // get the tasks assigned to the user
    const assigedTasks = await this.assignmentService.getAssigmentTasksByUser({
      userId: patientId,
      isCompleted,
      last,
    });

    return {
      message: 'Tareas obtenidas correctamente',
      data: assigedTasks,
    };
  }

  @Get('assignments/:assignmentId/task')
  @ApiOperation({
    summary: 'Se obtiene el detalle de una tarea asignada',
  })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getAssignedTaskDetails(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<ResponseDataInterface> {
    // get the task assigned details
    const taskDetails = await this.assignmentService.getAssignedTaskDetails({
      assignmentId,
    });

    return {
      message: 'Tarea obtenida correctamente',
      data: taskDetails,
    };
  }

  @Post('patients/:patientId/tasks')
  @ApiOperation({ summary: 'Asigna una o más tareas a un paciente' })
  @Role(RoleEnum.THERAPIST)
  async assignTasksToUser(
    @Req() req,
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() createManyAssignmentDto: CreateManyAssignmentsDto,
  ): Promise<ResponseDataInterface> {
    const { tasks } = createManyAssignmentDto;

    // Assign the creation user
    const userLogged = req.user as InfoUserInterface;
    createManyAssignmentDto.createdById = userLogged.id;

    // assign tasks to user
    const assignedTasks = await this.assignmentService.assignTasksToUser(
      patientId,
      createManyAssignmentDto,
    );

    // notify the patient
    const fromDate = moment(createManyAssignmentDto.dueDate)
      .locale('es')
      .format('dddd D [de] MMMM [del] YYYY');

    const therapist = await this.userService.findById(userLogged.id);
    const bodyNotification = `El terapeuta ${therapist.lastName} te ha asignado`;

    await this.notificationService.sendNotification(patientId, {
      title: 'TeraFlex',
      body:
        tasks.length > 1
          ? `${bodyNotification} ${tasks.length} tareas hasta el ${fromDate}`
          : `${bodyNotification} una nueva tarea hasta el ${fromDate}`,
    });

    // Return the created assignments
    return {
      message: 'Tareas asignadas correctamente',
      data: assignedTasks,
    };
  }

  @Delete('assignments')
  @ApiOperation({
    summary: 'Elimina una o más tareas asignadas a un paciente',
  })
  @ApiQuery({ name: 'id', required: true })
  @Role(RoleEnum.THERAPIST)
  async deleteTasksFromUser(
    @Query('id', new ParseArrayPipe({ items: Number })) assignmentIds: number[],
  ): Promise<ResponseDataInterface> {
    // remove tasks from user
    const removedTasks = await this.assignmentService.removeTasksFromUser({
      assignmentIds,
    });

    return {
      message:
        assignmentIds.length > 1
          ? 'Tareas asignadas eliminadas correctamente'
          : 'La tarea asignada fue eliminada correctamente',
      data: removedTasks,
    };
  }

  @Patch('assignments/:assignmentId/completed')
  @ApiOperation({ summary: 'Cambia el estado de la tarea asignada true/false' })
  @Role(RoleEnum.PATIENT)
  async changeIsCompletedAssignment(
    @Req() req,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<ResponseDataInterface> {
    // get the user logged
    const userLogged = req.user as InfoUserInterface;

    // change the isCompleted assignment
    const assignment = await this.assignmentService.changeIsCompletedAssignment(
      {
        assignmentId,
        userLoggedId: userLogged.id,
      },
    );

    return {
      message: 'Estado de la tarea asignada cambiado correctamente',
      data: assignment,
    };
  }
}
