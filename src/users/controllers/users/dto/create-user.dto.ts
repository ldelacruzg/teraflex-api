import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinDate,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(10, 13, {
    message: 'El número de identificación debe tener entre 10 y 13 caracteres',
  })
  docNumber: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  lastName: string;

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

  @ApiProperty()
  @IsDateString({ strict: true })
  @MinDate(new Date('1910-01-01'))
  @IsOptional()
  birthDate: Date;

  @ApiProperty()
  @IsNumber()
  categoryId: number;

  createdBy: number;
}

export class CreatePatientDto extends OmitType(CreateUserDto, ['categoryId']) {}
