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
  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ type: [Number] })
  @ArrayUnique()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  categoryIds: number[];

  @ApiProperty({ type: [Number] })
  @ArrayUnique()
  @IsNumber({}, { each: true })
  @IsArray()
  fileIds: number[];

  createdById: number;
}
