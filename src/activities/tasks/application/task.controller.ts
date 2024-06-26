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
import { TaskService } from '../infrastructure/task.service';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { CreateTaskDto } from '../domain/dtos/create-task.dto';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { ParseBoolAllowUndefinedPipe } from '@/shared/pipes/parse-bool-allow-undefined.pipe';
import { UpdateTaskDto } from '../domain/dtos/update-task.dto';

@Controller()
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post('tasks')
  @ApiOperation({ summary: 'Create a task' })
  @Role(RoleEnum.THERAPIST)
  async create(
    @CurrentUser() userLogged: InfoUserInterface,
    @Body()
    payload: CreateTaskDto,
  ): Promise<ResponseDataInterface> {
    const task = await this.service.create({
      ...payload,
      createdById: userLogged.id,
    });

    return {
      message: 'Tarea creada correctamente',
      data: task,
    };
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks' })
  @Role(RoleEnum.THERAPIST)
  async findAll(): Promise<ResponseDataInterface> {
    const tasks = await this.service.findAll();

    return {
      message: 'Tareas obtenidas correctamente',
      data: tasks,
    };
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a task' })
  @Role(RoleEnum.THERAPIST)
  async getTaskWithRelations(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataInterface> {
    const task = await this.service.findOneWithRelations(id);

    return {
      message: 'Tarea obtenida correctamente',
      data: task,
    };
  }

  @Get('logged/tasks')
  @ApiOperation({ summary: 'Get tasks created by the logged in user' })
  @ApiQuery({ name: 'status', required: false })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getTasksByLoggedTherapist(
    @Req() req,
    @Query('status', ParseBoolAllowUndefinedPipe) status: boolean | undefined,
  ): Promise<ResponseDataInterface> {
    // get user logged
    const { id: userId } = req.user as InfoUserInterface;

    // get tasks by therapist id
    const tasks = await this.service.getAllTasks({
      userId,
      status,
    });

    // get tasks by therapist id
    return {
      message: 'Tareas obtenidas correctamente',
      data: tasks,
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
    const task = await this.service.updateTask(id, updateTaskDto);

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
    const task = await this.service.deleteTask({
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
