import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeAnalyzerService } from './challenge-analyzer.service';

import { Challenge } from './entities/challenge.entity';

import { Project } from '../projects/project.entity';
import { Analysis } from '../analysis/entities/analysis.entity';
import { Workflow } from '../workflows/entities/workflow.entity';

import { ProjectsModule } from '../projects/projects.module';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Challenge,
      Project,
      Analysis,
      Workflow,
    ]),

    ProjectsModule,
    AuthModule,
  ],

  controllers: [ChallengesController],

  providers: [
    ChallengesService,
    ChallengeAnalyzerService,
  ],
})
export class ChallengesModule {}