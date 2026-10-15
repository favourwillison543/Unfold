import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  
  import { Repository } from 'typeorm';
  
  import { randomBytes } from 'crypto';
  
  import { PublicProjectShare } from './public-project-share.entity';
  
  import { Project } from '../projects/project.entity';
  
  import { Analysis } from '../analysis/entities/analysis.entity';
  
  import { Workflow } from '../workflows/entities/workflow.entity';
  
  import { Challenge } from '../challenges/entities/challenge.entity';
  
  @Injectable()
  export class PublicSharingService {
    constructor(
      @InjectRepository(PublicProjectShare)
      private readonly publicProjectShareRepository: Repository<PublicProjectShare>,
  
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
  
      @InjectRepository(Analysis)
      private readonly analysisRepository: Repository<Analysis>,
  
      @InjectRepository(Workflow)
      private readonly workflowRepository: Repository<Workflow>,
  
      @InjectRepository(Challenge)
      private readonly challengeRepository: Repository<Challenge>,
    ) {}
  
    async enablePublicSharing(projectId: number) {
      const project = await this.projectRepository.findOneBy({
        id: projectId,
      });
  
      if (!project) {
        throw new NotFoundException('Project not found');
      }
  
      const token = randomBytes(32).toString('hex');
  
      let share = await this.publicProjectShareRepository.findOne({
        where: {
          projectId,
        },
      });
  
      if (!share) {
        share = this.publicProjectShareRepository.create({
          projectId,
          token,
          enabled: true,
        });
      } else {
        share.token = token;
        share.enabled = true;
      }
  
      const savedShare =
        await this.publicProjectShareRepository.save(share);
  
      return {
        enabled: savedShare.enabled,
        token: savedShare.token,
        url: `${process.env.FRONTEND_URL}/share/${savedShare.token}`,
      };
    }
  
    async getPublicShare(projectId: number) {
      const project = await this.projectRepository.findOneBy({
        id: projectId,
      });
  
      if (!project) {
        throw new NotFoundException('Project not found');
      }
  
      const share =
        await this.publicProjectShareRepository.findOne({
          where: {
            projectId,
          },
        });
  
      if (!share) {
        return {
          enabled: false,
          token: null,
          url: null,
        };
      }
  
      return {
        enabled: share.enabled,
        token: share.enabled ? share.token : null,
        url: share.enabled
          ? `${process.env.FRONTEND_URL}/share/${share.token}`
          : null,
      };
    }
  
    async disablePublicSharing(projectId: number) {
      const share =
        await this.publicProjectShareRepository.findOne({
          where: {
            projectId,
          },
        });
  
      if (!share) {
        throw new NotFoundException(
          'Public sharing has not been enabled for this project',
        );
      }
  
      share.enabled = false;
  
      await this.publicProjectShareRepository.save(share);
  
      return {
        enabled: false,
      };
    }
  
    async getPublicProject(token: string) {
      /*
       * ---------------------------------------------------------
       * 1. Find the public link
       * ---------------------------------------------------------
       */
  
      const share =
        await this.publicProjectShareRepository.findOne({
          where: {
            token,
            enabled: true,
          },
        });
  
      if (!share) {
        throw new NotFoundException(
          'Public project link not found or has been disabled',
        );
      }
  
      /*
       * ---------------------------------------------------------
       * 2. Get the project ONLY.
       *
       * No relations here.
       * ---------------------------------------------------------
       */
  
      const project =
        await this.projectRepository.findOneBy({
          id: share.projectId,
        });
  
      if (!project) {
        throw new NotFoundException('Project not found');
      }
  
      /*
       * ---------------------------------------------------------
       * 3. Get the analysis itself.
       *
       * No child relations are loaded here.
       * ---------------------------------------------------------
       */
  
      const analysis =
        await this.analysisRepository.findOne({
          where: {
            project: {
              id: project.id,
            },
          },
        });
  
      /*
       * ---------------------------------------------------------
       * 4. Load each analysis collection separately.
       *
       * IMPORTANT:
       *
       * We NEVER do this:
       *
       * analysis
       *   -> productTypes
       *   -> productAreas
       *   -> people
       *   -> questions
       *   -> actorGoals
       *   -> entities
       *   -> relationships
       *
       * in one request.
       *
       * Each query loads ONE collection.
       * ---------------------------------------------------------
       */
  
      let productTypes: any[] = [];
      let productAreas: any[] = [];
      let people: any[] = [];
      let questions: any[] = [];
      let actorGoals: any[] = [];
      let entities: any[] = [];
      let relationships: any[] = [];
  
      if (analysis) {
        const [
          analysisWithProductTypes,
          analysisWithProductAreas,
          analysisWithPeople,
          analysisWithQuestions,
          analysisWithActorGoals,
          analysisWithEntities,
          analysisWithRelationships,
        ] = await Promise.all([
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              productTypes: true,
            },
          }),
  
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              productAreas: true,
            },
          }),
  
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              people: true,
            },
          }),
  
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              questions: true,
            },
          }),
  
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              actorGoals: true,
            },
          }),
  
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              entities: true,
            },
          }),
  
          this.analysisRepository.findOne({
            where: {
              id: analysis.id,
            },
            relations: {
              relationships: true,
            },
          }),
        ]);
  
        productTypes =
          analysisWithProductTypes?.productTypes ?? [];
  
        productAreas =
          analysisWithProductAreas?.productAreas ?? [];
  
        people =
          analysisWithPeople?.people ?? [];
  
        questions =
          analysisWithQuestions?.questions ?? [];
  
        actorGoals =
          analysisWithActorGoals?.actorGoals ?? [];
  
        entities =
          analysisWithEntities?.entities ?? [];
  
        relationships =
          analysisWithRelationships?.relationships ?? [];
      }
  
      /*
       * ---------------------------------------------------------
       * 5. Get workflows WITHOUT their child relations.
       * ---------------------------------------------------------
       */
  
      const workflows =
        await this.workflowRepository.find({
          where: {
            project: {
              id: project.id,
            },
          },
          order: {
            createdAt: 'ASC',
          },
        });
  
      /*
       * ---------------------------------------------------------
       * 6. Load workflow children separately.
       *
       * One relation at a time.
       * ---------------------------------------------------------
       */
  
      const workflowsWithRelations =
        await Promise.all(
          workflows.map(async (workflow) => {
            const [
              workflowWithSteps,
              workflowWithPages,
              workflowWithConnections,
            ] = await Promise.all([
              this.workflowRepository.findOne({
                where: {
                  id: workflow.id,
                },
                relations: {
                  steps: true,
                },
              }),
  
              this.workflowRepository.findOne({
                where: {
                  id: workflow.id,
                },
                relations: {
                  pages: true,
                },
              }),
  
              this.workflowRepository.findOne({
                where: {
                  id: workflow.id,
                },
                relations: {
                  connections: true,
                },
              }),
            ]);
  
            return {
              ...workflow,
  
              steps:
                workflowWithSteps?.steps ?? [],
  
              pages:
                workflowWithPages?.pages ?? [],
  
              connections:
                workflowWithConnections?.connections ?? [],
            };
          }),
        );
  
      /*
       * ---------------------------------------------------------
       * 7. Challenges are already a simple query.
       * ---------------------------------------------------------
       */
  
      const challenges =
        await this.challengeRepository.find({
          where: {
            project: {
              id: project.id,
            },
          },
          order: {
            createdAt: 'ASC',
          },
        });
  
      /*
       * ---------------------------------------------------------
       * 8. Return the complete public project.
       * ---------------------------------------------------------
       */
  
      return {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          productFormat: project.productFormat,
        },
  
        analysis: analysis
          ? {
              id: analysis.id,
              understanding: analysis.understanding,
              productModel: analysis.productModel,
  
              productTypes,
  
              productAreas,
  
              people,
  
              questions,
  
              actorGoals,
  
              entities,
  
              relationships,
            }
          : null,
  
        workflows: workflowsWithRelations,
  
        challenges,
      };
    }
  }