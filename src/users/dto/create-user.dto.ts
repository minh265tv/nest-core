import { IsBoolean, IsEmail, IsNotEmpty, Length, Validate } from 'class-validator'
import { PasswordConfirmValidator } from '@validators/password-confirm.validator'
import { UniqueEmailValidator } from '@validators/unique-email.validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'email of user',
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueEmailValidator)
  email: string

  @ApiProperty()
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 24)
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @Validate(PasswordConfirmValidator, ['password'])
  password_confirmation: string

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean
}
