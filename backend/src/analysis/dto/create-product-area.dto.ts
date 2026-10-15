import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}