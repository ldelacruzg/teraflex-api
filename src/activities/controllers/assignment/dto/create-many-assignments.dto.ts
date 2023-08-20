import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AssignTaskDto } from './assign-task.dto';

export class CreateManyAssignmentsDto {
  @ApiProperty({ type: [AssignTaskDto] })
  @ValidateNested()
  @Type(() => AssignTaskDto)
  @ArrayNotEmpty()
  tasks: AssignTaskDto[];

  @ApiProperty()
  //@Matches(/^d{4}-d{2}-d{2} d{2}:d{2}:d{2}$/)
  @IsNotEmpty()
  dueDate: Date;

  createdById?: number;
}
