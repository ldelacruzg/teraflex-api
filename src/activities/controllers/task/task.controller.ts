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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from '@activities/services/task/task.service';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { InfoUserInterface } from 'security/jwt-strategy/info-user.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignmentService } from '@activities/services/assignment/assignment.service';
import { ParseBoolAllowUndefinedPipe } from '@shared/pipes/parse-bool-allow-undefined.pipe';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';

@Controller()
@UseInterceptors(ResponseHttpInterceptor)
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
  async getAllTasks(): Promise<ResponseDataInterface> {
    // get all tasks
    const tasks = await this.taskService.getAllTasks({});

    return {
      message: 'Tareas obtenidas correctamente',
      data: tasks,
    };
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a task' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataInterface> {
    // get task by id
    const task = await this.taskService.getTask(id);

    return {
      message: 'Tarea obtenida correctamente',
      data: task,
    };
  }

  // endpoint for get last completed task of pacients by therapist
  @Get('therapists/:therapistId/patients/last-completed')
  @ApiOperation({
    summary: 'Get last task completed of pacients by therapist',
  })
  @Role(RoleEnum.THERAPIST)
  async getLastTaskCompleted(
    @Param('therapistId', ParseIntPipe) therapistId: number,
  ): Promise<ResponseDataInterface> {
    // get last task completed
    const lastCompletedTask = await this.assignmentService.getLastTaskCompleted(
      {
        therapistId,
      },
    );

    return {
      message: 'ültimas tareas completadas obtenidas correctamente',
      data: lastCompletedTask,
    };
  }

  @Get('patients/number-of-pacients-by-ages')
  @ApiOperation({ summary: 'Get number of pacients by ages' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getNumberOfPacientsByAges(): Promise<ResponseDataInterface> {
    return {
      data: await this.assignmentService.getNumberOfPacientsByAges(),
      message: 'Número de pacientes por edades obtenido correctamente',
    };
  }

  @Get('therapists/:therapistId/tasks')
  @ApiOperation({ summary: 'Get tasks by therapist id' })
  @Role(RoleEnum.THERAPIST)
  async getTasksByTherapistId(
    @Param('therapistId', ParseIntPipe) therapistId: number,
    @Query('status', ParseBoolAllowUndefinedPipe) status: boolean | undefined,
  ): Promise<ResponseDataInterface> {
    // get tasks by therapist id
    const tasks = await this.taskService.getAllTasks({
      userId: therapistId,
      status,
    });

    return {
      message: 'Tareas obtenidas correctamente',
      data: tasks,
    };
  }

  @Get('logged/tasks')
  @ApiOperation({ summary: 'Get tasks created by the logged in user' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getTasksByLoggedTherapist(
    @Req() req,
    @Query('status', ParseBoolAllowUndefinedPipe) status: boolean | undefined,
  ): Promise<ResponseDataInterface> {
    // get user logged
    const { id: userId, role } = req.user as InfoUserInterface;

    // get tasks by patient id
    if (role === RoleEnum.PATIENT) {
      // get tasks by patient id
      const tasks = await this.assignmentService.getAssigmentTasksByUser({
        userId,
        isCompleted: false,
      });

      return {
        message: 'Tareas obtenidas correctamente',
        data: tasks,
      };
    }

    // get tasks by therapist id
    const tasks = await this.taskService.getAllTasks({ userId, status });

    // get tasks by therapist id
    return {
      message: 'Tareas obtenidas correctamente',
      data: tasks,
    };
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create a task' })
  @Role(RoleEnum.THERAPIST)
  async createTask(
    @Req() req,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<ResponseDataInterface> {
    // Asigna el usuario de creación
    const userLogged = req.user as InfoUserInterface;
    createTaskDto.createdById = userLogged.id;

    // Crea la tarea
    const task = await this.taskService.createTask(createTaskDto);

    // Devuelve la tarea creada
    return {
      message: 'Tarea creada correctamente',
      data: task,
    };
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Update a task' })
  @Role(RoleEnum.THERAPIST)
  async updateTask(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseDataInterface> {
    // Asigna el usuario de modificación
    const userLogged = req.user as InfoUserInterface;
    updateTaskDto.updatedById = userLogged.id;

    // Actualiza la tarea
    const task = await this.taskService.updateTask(id, updateTaskDto);

    // Devuleve la tarea modificada
    return {
      message: 'Tarea actualizada correctamente',
      data: task,
    };
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a task' })
  @Role(RoleEnum.THERAPIST)
  async deleteTask(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataInterface> {
    // Asigna el usuario de eliminación
    const userLogged = req.user as InfoUserInterface;

    // Elimina la tarea
    const task = await this.taskService.deleteTask({
      id,
      updatedById: userLogged.id,
    });

    // Devuelve la tarea eliminada
    return {
      message: 'Tarea eliminada correctamente',
      data: task,
    };
  }
}
