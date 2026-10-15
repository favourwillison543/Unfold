import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}