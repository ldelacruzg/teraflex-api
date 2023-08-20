import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateLinkDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPublic: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;
}
