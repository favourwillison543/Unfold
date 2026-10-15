import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // User's name must be a string and cannot be empty.
  @IsString()
  @IsNotEmpty()
  name: string;

  // User's email must be a valid email address.
  @IsEmail()
  email: string;

  // Password must be a string and have at least 8 characters.
  @IsString()
  @MinLength(8)
  password: string;
}