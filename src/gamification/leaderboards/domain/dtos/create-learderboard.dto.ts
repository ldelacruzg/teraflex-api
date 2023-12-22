import { ApiProperty } from '@nestjs/swagger';
import { Rank } from '../rank.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLeaderboardDto {
  @ApiProperty()
  @IsEnum(Rank)
  @IsNotEmpty()
  rank: Rank;
}
