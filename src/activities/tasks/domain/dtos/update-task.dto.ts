import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Length(3, 100, {
    message: 'El título debe contener entre 3 y 100 caracteres',
  })
  @IsString({
    message: 'El título debe ser de tipo caracteres',
  })
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Length(3, 255, {
    message: 'La descripción debe contener entre 3 y 255 caracteres',
  })
  @IsString({
    message: 'La descripción debe ser de tipo caracteres',
  })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({
    message: 'El estado debe ser de tipo booleano (true/false)',
  })
  status: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({
    message: 'Es público debe ser de tipo boolean (true/false)',
  })
  isPublic: boolean;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @ArrayUnique({
    message: 'Las categorias debe ser únicas',
  })
  @ArrayMinSize(1, {
    message: 'Debe haber por lo menos 1 categoría',
  })
  @IsArray({
    message: 'Las categorias debe ser de tipo arreglo',
  })
  categories: number[];

  updatedById: number;
}
