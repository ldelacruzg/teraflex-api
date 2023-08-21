import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(10, 13)
  identification: string;

  @IsString()
  password: string;
}
