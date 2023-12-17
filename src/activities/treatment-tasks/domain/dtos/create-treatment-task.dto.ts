import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsDecimal,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FrecuencyType, IFrecuency } from '../treatment-tasks.entity';

class FrecuencyDto implements IFrecuency {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @IsIn(['day', 'week'])
  @IsNotEmpty()
  type: FrecuencyType;
}

export class CreateTreatmentTaskDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  treatmentId: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  taskId: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  expirationDate: Date;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  @IsNotEmpty()
  timePerRepetition: number;

  @ApiProperty()
  @Max(10)
  @Min(1)
  @IsPositive()
  @IsNotEmpty()
  repetitions: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => FrecuencyDto)
  @IsObject()
  @IsNotEmpty()
  frecuency: FrecuencyDto;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @IsNumberString()
  @IsOptional()
  breakTime: number;

  @ApiProperty()
  @Max(5)
  @Min(0)
  @IsNumber()
  @IsOptional()
  series: number;

  // assigmentDate: Date; // Default
  // performedDate: Date; // Patient input
}

export class TaskAssigmentParamDto extends OmitType(CreateTreatmentTaskDto, [
  'treatmentId',
]) {}

export class AssignTasksToTreatmentBodyDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => TaskAssigmentParamDto)
  @ArrayNotEmpty()
  tasks: TaskAssigmentParamDto[];
}

export class AssignTasksToTreatmentDto extends PickType(
  CreateTreatmentTaskDto,
  ['treatmentId'],
) {
  tasks: TaskAssigmentParamDto[];
}
