import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiService } from './ai.service';

import { AnalysisAiService } from './analysis/analysis-ai.service';
import { QuestionsAiService } from './questions/questions-ai.service';
import { GoalsAiService } from './goals/goals-ai.service';

import { ProductStructureAiService } from './workflows/product-structure-ai.service';
import { ActorWorkflowsAiService } from './workflows/actor-workflows-ai.service';
import { ChallengesAiService } from './challenges/challenges-ai.service';
import { RefinementAiService } from './refinement/refinement-ai.service';

@Module({
  imports: [
    ConfigModule,
  ],

  providers: [
    AiService,
    AnalysisAiService,
    QuestionsAiService,
    GoalsAiService,
    ProductStructureAiService,
    ActorWorkflowsAiService,
    ChallengesAiService,
    RefinementAiService,
  ],

  exports: [
    AiService,
    AnalysisAiService,
    QuestionsAiService,
    GoalsAiService,
    ProductStructureAiService,
    ActorWorkflowsAiService,
    ChallengesAiService,
    RefinementAiService,
  ],
})
export class AiModule {}