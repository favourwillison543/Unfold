import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Challenge } from './entities/challenge.entity';
import { Workflow } from '../workflows/entities/workflow.entity';
import { ChallengeAnalyzerService } from './challenge-analyzer.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectAccessService } from '../projects/project-access.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,

    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,

    private readonly challengeAnalyzer: ChallengeAnalyzerService,

    private readonly projectsService: ProjectsService,

    private readonly projectAccessService: ProjectAccessService,
  ) {}

  async generate(
    projectId: number,
    userId: number,
  ) {
    await this.projectAccessService.canAccess(
      projectId,
      userId,
      'generate',
    );

    const project =
      await this.projectsService.getProject(
        projectId,
        userId,
      );

    const analysis =
      await this.projectsService.getAnalysis(
        projectId,
        userId,
      );

    const workflows =
      await this.workflowRepository.find({
        where: {
          project: {
            id: project.id,
          },
        },
        relations: {
          pages: true,
          steps: true,
          connections: true,
        },
        order: {
          id: 'ASC',
        },
      });

    const challenges =
      this.challengeAnalyzer.analyze(
        analysis,
        workflows,
      );

    await this.challengeRepository.delete({
      project: {
        id: project.id,
      },
    });

    if (challenges.length === 0) {
      return [];
    }

    const challenge = challenges[0];

    const newChallenge =
      this.challengeRepository.create({
        title: challenge.title,
        description: challenge.description,
        severity: challenge.severity,
        relatedActor: challenge.relatedActor,
        relatedWorkflow: challenge.relatedWorkflow,
        suggestedQuestion: challenge.suggestedQuestion,
        resolved: false,
        project,
      });

    return this.challengeRepository.save(
      newChallenge,
    );
  }

  async findAll(
    projectId: number,
    userId: number,
  ) {
    await this.projectAccessService.canAccess(
      projectId,
      userId,
      'view',
    );

    return this.challengeRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async update(
    challengeId: number,
    userId: number,
    data: {
      resolved?: boolean;
    },
  ) {
    const challenge =
      await this.challengeRepository.findOne({
        where: {
          id: challengeId,
        },
        relations: {
          project: true,
        },
      });

    if (!challenge) {
      throw new NotFoundException(
        'Challenge not found',
      );
    }

    await this.projectAccessService.canAccess(
      challenge.project.id,
      userId,
      'edit',
    );

    if (data.resolved !== undefined) {
      challenge.resolved = data.resolved;
    }

    return this.challengeRepository.save(
      challenge,
    );
  }
}