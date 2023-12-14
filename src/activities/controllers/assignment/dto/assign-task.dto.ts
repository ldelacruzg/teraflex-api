import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { CreateTaskDto } from '../../task/dto/create-task.dto';

export class AssignTaskDto extends PickType(CreateTaskDto, ['description']) {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}
