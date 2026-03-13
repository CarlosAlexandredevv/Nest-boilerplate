import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../models/user';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  name: string;

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

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
