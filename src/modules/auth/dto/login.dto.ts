import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}
