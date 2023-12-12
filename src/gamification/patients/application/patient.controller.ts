import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { PatientService } from '../infrastructure/patient.service.impl';

@Controller()
@UseInterceptors(ResponseHttpInterceptor)
@ApiTags('Patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Get('/patients')
  @ApiOperation({ summary: 'Get all patients' })
  async findAll(): Promise<ResponseDataInterface> {
    const patients = await this.service.findAll();

    return {
      message: 'Pacientes obtenidos correctamente',
      data: patients,
    };
  }
}
