import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

import { AuthModule } from '../auth/auth.module';
import { AnalysisModule } from '../analysis/analysis.module';
import { AiModule } from '../ai/ai.module';

import { ProductType } from '../analysis/entities/product-type.entity';
import { ProductArea } from '../analysis/entities/product-area.entity';
import { Person } from '../analysis/entities/person.entity';
import { Question } from '../analysis/entities/question.entity';
import { ActorGoal } from '../analysis/entities/actor-goal.entity';
import { ProductEntity } from '../analysis/entities/product-entity.entity';
import { ProductRelationship } from '../analysis/entities/product-relationship.entity';

import { Workflow } from '../workflows/entities/workflow.entity';
import { WorkflowStep } from '../workflows/entities/workflow-step.entity';

import { Challenge } from '../challenges/entities/challenge.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectAccessService } from './project-access.service';
import { ProjectAccessGuard } from './project-access.guard';
import { ProjectInvitation } from './project-invitation.entity';
import { ProjectInvitationService } from './project-invitation.service';
import { ProjectInvitationController } from './project-invitation.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMember,
      ProjectInvitation,
      ProductType,
      ProductArea,
      Person,
      Question,
      ActorGoal,
      ProductEntity,
      ProductRelationship,
      Workflow,
      WorkflowStep,
      Challenge,
    ]),
    AuthModule,
    AnalysisModule,
    AiModule,
    EmailModule,

  ],

  controllers: [
    ProjectsController,
    ProjectInvitationController,
  ],

  providers: [
    ProjectsService,
    ProjectAccessService,
    ProjectAccessGuard,
    ProjectInvitationService,
  ],

  exports: [
    ProjectsService,
    ProjectAccessService,
    ProjectAccessGuard,
  ],
})
export class ProjectsModule {}