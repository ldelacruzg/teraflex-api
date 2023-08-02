import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from '../../service/group/group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';

@Controller('group')
@ApiTags('Group')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ResponseHttpInterceptor)
@ApiBearerAuth()
@Role(RoleEnum.THERAPIST)
export class GroupController {
  constructor(private service: GroupService) {}

  @Post('add/:id')
  @ApiOperation({ summary: 'Asociar paciente a terapista' })
  async addPatient(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return {
      message: await this.service.addPatient(id, req.user),
    } as ResponseDataInterface;
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Reasociar/desasociar paciente de terapista' })
  async updateStatusPatient(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return {
      message: await this.service.updateStatusPatient(id, req.user),
    } as ResponseDataInterface;
  }

  @Get('all')
  @ApiOperation({
    summary: 'Obtener todos los pacientes asociados al terapista',
  })
  async getAllByTherapist(@Req() req) {
    return {
      data: await this.service.getAllByTherapist(req.user.id),
    } as ResponseDataInterface;
  }
}
