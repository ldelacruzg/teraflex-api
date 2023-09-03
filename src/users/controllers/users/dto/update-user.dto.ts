import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'birthDate',
  'phone',
  'description',
]) {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName: string;

  updatedBy?: number;
  password?: string;
  firstTime?: boolean;
}
