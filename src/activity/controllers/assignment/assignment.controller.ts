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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignmentService } from 'src/activity/services/assignment/assignment.service';
import { JwtAuthGuard } from 'src/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { Role } from 'src/security/jwt-strategy/roles.decorator';
import { RoleGuard } from 'src/security/jwt-strategy/roles.guard';
import { CreateManyAssignmentsDto } from './dto/create-many-assignments.dto';
import { InfoUserInterface } from 'src/security/jwt-strategy/info-user.interface';
import { RemoveManyAssignmentDto } from './dto/remove-many-assigments.dto';
import { ParseBoolAllowUndefinedPipe } from 'src/shared/pipes/parse-bool-allow-undefined.pipe';
import { ResponseHttpInterceptor } from 'src/shared/interceptors/response-http.interceptor';
import { ResponseDataInterface } from 'src/shared/interfaces/response-data.interface';

@Controller()
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Get('patients/:patientId/tasks')
  @ApiOperation({
    summary: 'Se obtiene la lista de tareas asignadas a un paciente',
  })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getAssigmentTasksByUser(
    @Param('patientId', ParseIntPipe)
    patientId: number,
    @Query('isCompleted', ParseBoolAllowUndefinedPipe)
    isCompleted: boolean | undefined,
  ): Promise<ResponseDataInterface> {
    // get the tasks assigned to the user
    const assigedTasks = await this.assignmentService.getAssigmentTasksByUser({
      userId: patientId,
      isCompleted,
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
    // Assign the creation user
    const userLogged = req.user as InfoUserInterface;
    createManyAssignmentDto.createdById = userLogged.id;

    // assign tasks to user
    const assignedTasks = await this.assignmentService.assignTasksToUser(
      patientId,
      createManyAssignmentDto,
    );

    // Return the created assignments
    return {
      message: 'Tareas asignadas correctamente',
      data: assignedTasks,
    };
  }

  @Delete('assignments')
  @ApiOperation({
    summary: 'Elimina una o más tareas asiganadas a un paciente',
  })
  @Role(RoleEnum.THERAPIST)
  async deleteTasksFromUser(
    @Body() removeManyAssignmentDto: RemoveManyAssignmentDto,
  ): Promise<ResponseDataInterface> {
    // remove tasks from user
    const removedTasks = await this.assignmentService.removeTasksFromUser(
      removeManyAssignmentDto,
    );

    return {
      message: 'Tareas asignadas eliminadas correctamente',
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
