import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @Role(RoleEnum.THERAPIST)
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task' })
  @Role(RoleEnum.THERAPIST)
  async getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTask(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @Role(RoleEnum.THERAPIST)
  async createTask(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    // Asigna el usuario de creación
    const userLogged = req.user as InfoUserInterface;
    createTaskDto.createdById = userLogged.id;

    // Devuelve la tarea creada
    return this.taskService.createTask(createTaskDto);
  }

  @Put(':id')
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @Role(RoleEnum.THERAPIST)
  async deleteTask(@Req() req, @Param('id', ParseIntPipe) id: number) {
    // Devuelve la tarea eliminada
    return this.taskService.deleteTask({ id, updatedById: req.user.id });
  }
}
