import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../../service/group/group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '../../../security/jwt-strategy/roles.guard';
import { Role } from '../../../security/jwt-strategy/roles.decorator';
import { RoleEnum } from '../../../security/jwt-strategy/role.enum';
import { ResponseDataInterface } from '../../../shared/interfaces/response-data.interface';

@Controller('group')
@ApiTags('Grupo')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
@Role(RoleEnum.THERAPIST)
export class GroupController {
  constructor(private service: GroupService) {}

  @Post('add/:id')
  @ApiOperation({ summary: 'Asociar paciente a terapista' })
  async addPatient(@Req() req, @Param('id', ParseIntPipe) id: number) {
    try {
      return {
        message: await this.service.addPatient(id, req.user),
      } as ResponseDataInterface;
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Desasociar paciente de terapista' })
  async deletePatient(@Req() req, @Param('id', ParseIntPipe) id: number) {
    try {
      return {
        message: await this.service.deletePatient(id, req.user),
      } as ResponseDataInterface;
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
      return {
        data: await this.service.getAllByTherapist(req.user.id),
      } as ResponseDataInterface;
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
