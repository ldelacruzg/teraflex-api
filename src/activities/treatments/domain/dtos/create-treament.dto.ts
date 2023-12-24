import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateTreatmentDto {
  @ApiProperty()
  @Length(3, 70)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @Length(3)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  patientId: number;

  therapistId: number;
}
