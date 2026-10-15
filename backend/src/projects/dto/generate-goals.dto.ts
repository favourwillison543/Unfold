import {
    IsArray,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class ProductAreaDto {
    @IsString()
    name: string;
  }
  
  class ActorDto {
    @IsString()
    name: string;
  
    @IsString()
    type: string;
  
    @IsArray()
    @IsString({ each: true })
    responsibilities: string[];
  }
  
  class QuestionAnswerDto {
    @IsString()
    question: string;
  
    @IsString()
    answer: string;
  }
  
  export class GenerateGoalsDto {
    @IsString()
    understanding: string;
  
    @IsArray()
    @IsString({ each: true })
    productTypes: string[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductAreaDto)
    productAreas: ProductAreaDto[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActorDto)
    actors: ActorDto[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionAnswerDto)
    answers: QuestionAnswerDto[];
    productExperience: {};
    productModel: {};
    entities: never[];
    relationships: never[];
    uncertainties: never[];
    previousQuestions: never[];
  }