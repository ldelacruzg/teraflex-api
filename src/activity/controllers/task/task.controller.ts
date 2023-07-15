import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from 'src/activity/services/task/task.service';
import { JwtAuthGuard } from 'src/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { Role } from 'src/security/jwt-strategy/roles.decorator';
import { RoleGuard } from 'src/security/jwt-strategy/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { InfoUserInterface } from 'src/security/jwt-strategy/info-user.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignmentService } from 'src/activity/services/assignment/assignment.service';
import { ParseBoolAllowUndefinedPipe } from 'src/shared/pipes/parse-bool-allow-undefined.pipe';

@Controller()
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TaskController {
  constructor(
    private taskService: TaskService,
    private assignmentService: AssignmentService,
  ) {}

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks' })
  @Role(RoleEnum.THERAPIST)
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a task' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTask(id);
  }

  @Get('therapists/:therapistId/tasks')
  @ApiOperation({ summary: 'Get tasks by therapist id' })
  @Role(RoleEnum.THERAPIST)
  async getTasksByTherapistId(
    @Param('therapistId', ParseIntPipe) therapistId: number,
    @Query('status', ParseBoolAllowUndefinedPipe) status: boolean | undefined,
  ) {
    return this.taskService.getAllTasks({ userId: therapistId, status });
  }

  @Get('logged/tasks')
  @ApiOperation({ summary: 'Get tasks created by the logged in user' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getTasksByLoggedTherapist(
    @Req() req,
    @Query('status', ParseBoolAllowUndefinedPipe) status: boolean | undefined,
  ) {
    // get user logged
    const { id: userId, role } = req.user as InfoUserInterface;

    // get tasks by patient id
    if (role === RoleEnum.PATIENT) {
      return this.assignmentService.getAssigmentTasksByUser({
        userId,
        isCompleted: false,
      });
    }

    // get tasks by therapist id
    return this.taskService.getAllTasks({ userId, status });
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create a task' })
  @Role(RoleEnum.THERAPIST)
  async createTask(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    // Asigna el usuario de creación
    const userLogged = req.user as InfoUserInterface;
    createTaskDto.createdById = userLogged.id;

    // Devuelve la tarea creada
    return this.taskService.createTask(createTaskDto);
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Update a task' })
  @Role(RoleEnum.THERAPIST)
  async updateTask(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    // Asigna el usuario de modificación
    const userLogged = req.user as InfoUserInterface;
    updateTaskDto.updatedById = userLogged.id;

    // Devuleve la tarea modificada
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a task' })
  @Role(RoleEnum.THERAPIST)
  async deleteTask(@Req() req, @Param('id', ParseIntPipe) id: number) {
    // Devuelve la tarea eliminada
    return this.taskService.deleteTask({ id, updatedById: req.user.id });
  }
}
