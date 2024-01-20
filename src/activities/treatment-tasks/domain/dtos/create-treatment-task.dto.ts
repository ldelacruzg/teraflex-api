import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsDecimal,
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateIf,
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
  @IsDecimal({ force_decimal: true })
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
  @IsOptional()
  frecuency: FrecuencyDto;

  @ApiProperty()
  @IsDecimal({ force_decimal: true })
  @IsNumberString()
  @IsOptional()
  breakTime: number;

  @ApiProperty()
  @Max(5)
  @Min(1)
  @IsNumber()
  @IsOptional()
  series: number;
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
