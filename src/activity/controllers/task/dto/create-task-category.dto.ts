import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateTaskCategoryDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  taskId: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  createdById: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  status?: boolean;
}
