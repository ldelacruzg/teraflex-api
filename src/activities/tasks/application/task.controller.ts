import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from '../infrastructure/task.service';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { CreateTaskDto } from '../domain/dtos/create-task.dto';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';

@Controller('tasks')
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
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

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @Role(RoleEnum.THERAPIST)
  async findAll(): Promise<ResponseDataInterface> {
    const tasks = await this.service.findAll();

    return {
      message: 'Tareas obtenidas correctamente',
      data: tasks,
    };
  }
}