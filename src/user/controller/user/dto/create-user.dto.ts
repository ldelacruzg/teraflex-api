import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(10, 13, {
    message: 'El número de documento debe tener entre 10 y 13 caracteres',
  })
  docNumber: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @ApiProperty()
  @IsString()
  @Length(10, 10, {
    message: 'El número de teléfono debe tener 10 caracteres',
  })
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  createdBy: number;
}
