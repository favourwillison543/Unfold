import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    ValidateNested,
  } from 'class-validator';
  
  import { Type } from 'class-transformer';
  
  class WorkflowStepDto {
    @IsString()
    title: string;
  
    @IsString()
    type: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsInt()
    stepOrder: number;
  }
  
  export class CreateWorkflowDto {
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsString()
    actor: string;
  
    @IsString()
    goal: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkflowStepDto)
    steps: WorkflowStepDto[];
  }