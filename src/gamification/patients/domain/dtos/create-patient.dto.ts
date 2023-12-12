import { IsInt, IsPositive } from 'class-validator';

export class CreatePatientDto {
  @IsInt()
  @IsPositive()
  userId: number;
}
