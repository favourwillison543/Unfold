import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicSharingController } from './public-sharing.controller';
import { PublicSharingService } from './public-sharing.service';
import { PublicProjectShare } from './public-project-share.entity';

import { Project } from '../projects/project.entity';
import { Analysis } from '../analysis/entities/analysis.entity';
import { Workflow } from '../workflows/entities/workflow.entity';
import { Challenge } from '../challenges/entities/challenge.entity';

import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublicProjectShare,
      Project,
      Analysis,
      Workflow,
      Challenge,
    ]),

    ProjectsModule,
  ],

  controllers: [
    PublicSharingController,
  ],

  providers: [
    PublicSharingService,
  ],
})
export class PublicSharingModule {}