import { IsString, Max, Min } from 'class-validator';

export class LoginDto {
  @IsString({ always: true })
  @Max(13)
  @Min(10)
  identification: string;

  @IsString({ always: true })
  password: string;
}
