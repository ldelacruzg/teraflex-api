import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TreatmentService } from '../infrastructure/treatment.service';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { CreateTreatmentDto } from '../domain/dtos/create-treament.dto';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';

@Controller('treatments')
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Treatments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class TreatmentController {
  constructor(private readonly service: TreatmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a treatment' })
  @Role(RoleEnum.THERAPIST)
  async create(
    @CurrentUser() currentUser: InfoUserInterface,
    @Body() payload: CreateTreatmentDto,
  ): Promise<ResponseDataInterface> {
    const newTreatment = await this.service.create({
      ...payload,
      therapistId: currentUser.id,
    });

    return {
      message: 'Tratamiento creado correctamente',
      data: newTreatment,
    };
  }
}
