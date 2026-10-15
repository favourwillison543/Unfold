import {
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class ProductAreaDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
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

class EntityDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

class RelationshipDto {
  @IsString()
  from: string;

  @IsString()
  relationship: string;

  @IsString()
  to: string;
}

export class GenerateQuestionsDto {
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
  @Type(() => EntityDto)
  entities: EntityDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationshipDto)
  relationships: RelationshipDto[];
}