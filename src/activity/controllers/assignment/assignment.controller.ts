import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Param,
  UseGuards,
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

@Controller('assignments')
@ApiTags('Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  @Get(':userId/tasks')
  @ApiOperation({ summary: 'List all the tasks assigned to a pacient' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async listTasksByUser(@Param('userId') userId: number) {
    return this.assignmentService.listTasksByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Assign one or more tasks to a user' })
  @Role(RoleEnum.THERAPIST)
  async assignTasksToUser(
    @Req() req,
    @Body() createManyAssignmentDto: CreateManyAssignmentsDto,
  ) {
    // Assign the creation user
    const userLogged = req.user as InfoUserInterface;
    createManyAssignmentDto.createdById = userLogged.id;

    // Return the created assignments
    return this.assignmentService.assignTasksToUser(createManyAssignmentDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete one or more tasks from a user' })
  @Role(RoleEnum.THERAPIST)
  async deleteTasksFromUser(
    @Req() req,
    @Body() removeManyAssignmentDto: RemoveManyAssignmentDto,
  ) {
    return this.assignmentService.removeTasksFromUser(removeManyAssignmentDto);
  }
}
