import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @Length(3, 100, {
    message: 'El título debe contener entre 3 y 100 caracteres',
  })
  @IsString({
    message: 'El título debe ser de tipo caracteres',
  })
  @IsNotEmpty({
    message: 'El título es requerido',
  })
  title: string;

  @ApiProperty()
  @IsString({
    message: 'La descripción debe ser de tipo caracteres',
  })
  @IsNotEmpty({
    message: 'La descripción es requerido',
  })
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({
    message: 'El estado debe ser de tipo booleano (true/false)',
  })
  status: boolean;

  @ApiProperty()
  @IsBoolean({
    message: 'Es público debe ser de tipo boolean (true/false)',
  })
  @IsNotEmpty({
    message: 'Es público es requerido',
  })
  isPublic: boolean;

  @ApiProperty({ type: [Number] })
  @ArrayUnique({
    message: 'Las categorias debe ser únicas',
  })
  @ArrayMinSize(1, {
    message: 'Debe haber por lo menos 1 categoría',
  })
  @IsArray({
    message: 'Las categorias debe ser de tipo arreglo',
  })
  @ArrayNotEmpty({
    message: 'Las categorias son requeridas',
  })
  categoryIds: number[];

  @ApiProperty({ type: [Number], required: false })
  @ArrayUnique()
  @IsNumber({}, { each: true })
  fileIds: number[];

  createdById: number;
}
