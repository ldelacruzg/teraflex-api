import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Max(13)
  @Min(10)
  docNumber: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  birthDate: Date;

  @ApiProperty()
  @IsString()
  @Max(10)
  @Min(10)
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
