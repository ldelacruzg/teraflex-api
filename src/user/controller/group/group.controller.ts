import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../../service/group/group.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '../../../security/jwt-strategy/roles.guard';
import { Role } from '../../../security/jwt-strategy/roles.decorator';
import { RoleEnum } from '../../../security/jwt-strategy/role.enum';

@Controller('group')
@ApiTags('Grupo')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
@Role(RoleEnum.THERAPIST)
export class GroupController {
  constructor(private service: GroupService) {}

  @Post('add/:id')
  @ApiOperation({ summary: 'Asociar paciente a terapista' })
  async addPatient(@Req() req, @Param('id') id: number) {
    try {
      return await this.service.addPatient(id, req.user);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Desasociar paciente de terapista' })
  async deletePatient(@Req() req, @Param('id') id: number) {
    try {
      return await this.service.deletePatient(id, req.user);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Get('all')
  @ApiOperation({
    summary: 'Obtener todos los pacientes asociados al terapista',
  })
  async getAllByTherapist(@Req() req) {
    try {
      return await this.service.getAllByTherapist(req.user.id);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
