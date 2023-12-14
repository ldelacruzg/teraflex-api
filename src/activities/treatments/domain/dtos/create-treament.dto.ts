import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateTreatmentDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  patientId: number;

  therapistId: number;
}
