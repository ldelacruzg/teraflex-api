import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty()
  @IsUrl({}, { message: 'El campo url debe ser una url válida' })
  url: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBooleanString({ message: 'El campo isPublic debe ser booleano' })
  @IsOptional()
  isPublic: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  createdById: number;
}

export class uploadMultimediaDto extends OmitType(CreateLinkDto, ['url']) {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    maxItems: 5,
  })
  files: Array<Express.Multer.File>;
}
