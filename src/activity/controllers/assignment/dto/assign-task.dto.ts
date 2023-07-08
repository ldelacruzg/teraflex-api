import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, Max } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Max(59)
  @IsPositive()
  @IsNotEmpty()
  estimatedTime: number;
}
