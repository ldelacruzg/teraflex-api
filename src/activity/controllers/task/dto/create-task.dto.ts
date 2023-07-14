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
  IsPositive,
  IsString,
  Length,
  Max,
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
  @Length(3, 255, {
    message: 'La descripción debe contener entre 3 y 255 caracteres',
  })
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
  @Max(59, {
    message: 'El tiempo estimado debe ser menor o igual que 59 min',
  })
  @IsPositive({
    message: 'El tiempo estimado debe ser un número positivo',
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'El tiempo estimado debe ser de tipo numérico',
    },
  )
  @IsNotEmpty({
    message: 'El tiempo estimado es requerido',
  })
  estimatedTime: number;

  @ApiProperty()
  @IsBoolean({
    message: 'Es público debe ser de tipo boolean (true/false)',
  })
  @IsNotEmpty({
    message: 'Es público es requerido',
  })
  isPublic: boolean;

  @ApiProperty()
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

  @ApiProperty()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  fileIds: number[];

  createdById: number;
}
