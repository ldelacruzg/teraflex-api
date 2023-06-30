import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  @IsString({
    message: 'El nombre debe ser una cadena',
  })
  name: string;

  @ApiProperty()
  @IsOptional()
  @Length(3, 255, {
    message: 'La descripción debe tener entre 3 y 255 caracteres',
  })
  @IsString({
    message: 'La descripción debe ser una cadena',
  })
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({
    message: 'El estado debe ser de tipo booleano (verdadero/falso)',
  })
  status: boolean;

  createdById: number;
}
