import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Analysis } from './entities/analysis.entity';
import { ProductType } from './entities/product-type.entity';
import { ProductArea } from './entities/product-area.entity';
import { Person } from './entities/person.entity';

import { ProductTypesController } from './product-types.controller';
import { ProductTypesService } from './product-types.service';

import { ProductAreasController } from './product-areas.controller';
import { ProductAreasService } from './product-areas.service';

import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Analysis,
      ProductType,
      ProductArea,
      Person,
    ]),
  ],
  controllers: [
    ProductTypesController,
    ProductAreasController,
    PeopleController,
  ],
  providers: [
    ProductTypesService,
    ProductAreasService,
    PeopleService,
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class AnalysisModule {}