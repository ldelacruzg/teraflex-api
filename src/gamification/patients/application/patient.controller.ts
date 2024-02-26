import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import crypto from 'crypto';

import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { PatientService } from '../infrastructure/patient.service';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { Environment } from '@/shared/constants/environment';

@Controller()
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Get('/patients')
  @ApiOperation({ summary: 'Get all patients' })
  @Role(RoleEnum.THERAPIST)
  async findAll(): Promise<ResponseDataInterface> {
    const patients = await this.service.findAll();

    return {
      message: 'Pacientes obtenidos correctamente',
      data: patients,
    };
  }

  @Get('/patients/:patientId/global-summary')
  @ApiOperation({ summary: 'Get global summary' })
  @Role(RoleEnum.PATIENT, RoleEnum.THERAPIST)
  async getGlobalSummary(
    @Param('patientId', ParseIntPipe) patientId: number,
  ): Promise<ResponseDataInterface> {
    const globalSummary = await this.service.getGlobalSummary(patientId);

    return {
      message: 'Resumen obtenido correctamente',
      data: globalSummary,
    };
  }

  @Post('/patients/:patientId/redeem')
  @ApiOperation({ summary: 'Canjear un producto' })
  @Role(RoleEnum.PATIENT)
  async redeemProduct(
    @Param('patientId', ParseIntPipe) patientId: number,
  ): Promise<ResponseDataInterface> {
    // descontar los flexicoins (patient)
    await this.service.redeemProduct(
      patientId,
      Environment.STORE_FREE_APPOINTMENT_FXC,
    );

    // generar el código
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    return {
      message: 'Producto adquirido correctamente',
      data: { code },
    };
  }
}
