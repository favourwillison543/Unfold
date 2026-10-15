import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Workflow } from './entities/workflow.entity';
import { WorkflowStep } from './entities/workflow-step.entity';
import { WorkflowPage } from './entities/workflow-page.entity';
import { WorkflowConnection } from './entities/workflow-connection.entity';

import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

import { Project } from '../projects/project.entity';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { Analysis } from '../analysis/entities/analysis.entity';

import { PublicFlowPage } from './entities/public-flow-page.entity';
import { Actor } from './entities/actor.entity';
import { ActorPage } from './entities/actor-page.entity';
import { ActorCapability } from './entities/actor-capability.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workflow,
      WorkflowStep,
      WorkflowPage,
      WorkflowConnection,
      Project,
      Analysis,
      PublicFlowPage,
      Actor,
      ActorPage,
      ActorCapability,
    ]),
    AiModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
})
export class WorkflowsModule {}