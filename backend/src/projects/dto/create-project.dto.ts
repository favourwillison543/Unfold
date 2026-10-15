import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsString()
    @IsNotEmpty()
    productFormat: string;
  }