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

@Controller()
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
  ) {
    if (isCompleted === undefined) {
      return this.assignmentService.getAssigmentTasksByUser({
        userId: patientId,
      });
    }

    return this.assignmentService.getAssigmentTasksByUser({
      userId: patientId,
      isCompleted,
    });
  }

  @Get('assignments/:assignmentId/task')
  @ApiOperation({
    summary: 'Se obtiene el detalle de una tarea asignada',
  })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getAssignedTaskDetails(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    return this.assignmentService.getAssignedTaskDetails({
      assignmentId,
    });
  }

  @Post('patients/:patientId/tasks')
  @ApiOperation({ summary: 'Asigna una o más tareas a un paciente' })
  @Role(RoleEnum.THERAPIST)
  async assignTasksToUser(
    @Req() req,
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() createManyAssignmentDto: CreateManyAssignmentsDto,
  ) {
    // Assign the creation user
    const userLogged = req.user as InfoUserInterface;
    createManyAssignmentDto.createdById = userLogged.id;

    // Return the created assignments
    return this.assignmentService.assignTasksToUser(
      patientId,
      createManyAssignmentDto,
    );
  }

  @Delete('assigments')
  @ApiOperation({
    summary: 'Elimina una o más tareas asiganadas a un paciente',
  })
  @Role(RoleEnum.THERAPIST)
  async deleteTasksFromUser(
    @Body() removeManyAssignmentDto: RemoveManyAssignmentDto,
  ) {
    return this.assignmentService.removeTasksFromUser(removeManyAssignmentDto);
  }

  @Patch('assigments/:assignmentId/completed')
  @ApiOperation({ summary: 'Cambia el estado de la tarea asignada true/false' })
  @Role(RoleEnum.PATIENT)
  async changeIsCompletedAssignment(
    @Req() req,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    // get the user logged
    const userLogged = req.user as InfoUserInterface;

    return this.assignmentService.changeIsCompletedAssignment({
      assignmentId,
      userLoggedId: userLogged.id,
    });
  }
}
