import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsPositive } from 'class-validator';

export class RemoveManyAssignmentDto {
  @ApiProperty()
  @ArrayUnique()
  @IsPositive({ each: true })
  @ArrayNotEmpty()
  assignmentIds: number[];
}
