import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({ description: 'Nueva contraseña' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número',
    },
  )
  password: string;
}
