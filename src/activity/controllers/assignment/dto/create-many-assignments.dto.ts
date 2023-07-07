import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsPositive,
  Matches,
  Max,
} from 'class-validator';

export class CreateManyAssignmentsDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @ArrayUnique()
  @IsPositive({ each: true })
  @ArrayNotEmpty()
  taskIds: number[];

  @ApiProperty()
  @Max(60)
  @IsPositive()
  @IsNotEmpty()
  estimatedTime: number;

  @ApiProperty()
  @IsBoolean()
  status?: boolean;

  @ApiProperty()
  //@Matches(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2}$/)
  //@IsDate()
  @IsNotEmpty()
  dueDate: Date;

  createdById?: number;
}
