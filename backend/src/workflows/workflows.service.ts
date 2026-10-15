import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  DataSource,
  Repository,
} from 'typeorm';

import { Workflow } from './entities/workflow.entity';
import { WorkflowStep } from './entities/workflow-step.entity';
import { PublicFlowPage } from './entities/public-flow-page.entity';
import { Actor } from './entities/actor.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectAccessService } from '../projects/project-access.service';
import { ProductStructureAiService } from '../ai/workflows/product-structure-ai.service';
import { ActorWorkflowsAiService } from '../ai/workflows/actor-workflows-ai.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { WorkflowPage } from './entities/workflow-page.entity';
import { WorkflowConnection } from './entities/workflow-connection.entity';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(
    WorkflowsService.name,
  );

  private readonly activeWorkflowGenerations =
    new Set<string>();

  private readonly activeUserGenerations =
    new Map<number, number>();

  private readonly MAX_ACTIVE_GENERATIONS_PER_USER = 2;

  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,

    @InjectRepository(WorkflowStep)
    private readonly workflowStepRepository: Repository<WorkflowStep>,

    @InjectRepository(WorkflowPage)
    private readonly workflowPageRepository: Repository<WorkflowPage>,

    @InjectRepository(WorkflowConnection)
    private readonly workflowConnectionRepository: Repository<WorkflowConnection>,

    @InjectRepository(PublicFlowPage)
    private readonly publicFlowPageRepository: Repository<PublicFlowPage>,

    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,

    private readonly productStructureAiService: ProductStructureAiService,

    private readonly actorWorkflowsAiService: ActorWorkflowsAiService,

    private readonly dataSource: DataSource,

    private readonly projectsService: ProjectsService,

    private readonly projectAccessService: ProjectAccessService,
  ) {}

  private async getProjectAnalysis(
    projectId: number,
    userId: number,
  ) {
    return this.projectsService.getAnalysis(
      projectId,
      userId,
    );
  }

  private acquireUserGeneration(
    userId: number,
  ) {
    const current =
      this.activeUserGenerations.get(userId) ?? 0;

    if (
      current >=
      this.MAX_ACTIVE_GENERATIONS_PER_USER
    ) {
      throw new HttpException(
        'Too many AI generations are already running. Please wait for one to finish.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.activeUserGenerations.set(
      userId,
      current + 1,
    );
  }

  private releaseUserGeneration(
    userId: number,
  ) {
    const current =
      this.activeUserGenerations.get(userId) ?? 0;

    if (current <= 1) {
      this.activeUserGenerations.delete(userId);
      return;
    }

    this.activeUserGenerations.set(
      userId,
      current - 1,
    );
  }

  async generateStructure(
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

    this.acquireUserGeneration(userId);

    try {
      const analysis =
        await this.getProjectAnalysis(
          projectId,
          userId,
        );

      const structure =
        await this.productStructureAiService.generateStructure(
          {
            understanding:
              analysis.understanding ?? '',

            productModel:
              analysis.productModel ?? {
                role: '',
                directCustomer: '',
                usageMode: '',
                primaryInterfaces: [],
              },

            productTypes:
              analysis.productTypes.map(
                (type) => type.name,
              ),

            productAreas:
              analysis.productAreas.map(
                (area) => ({
                  name: area.name,
                  description:
                    area.description ?? '',
                }),
              ),

            actors:
              analysis.people.map(
                (person) => ({
                  name: person.name,
                  type: person.type ?? '',
                  responsibilities:
                    person.responsibilities ?? [],
                }),
              ),

            actorGoals:
              analysis.actorGoals.map(
                (goal) => ({
                  actor: goal.actor,
                  goal: goal.goal,
                }),
              ),

            uncertainties:
              analysis.uncertainties ?? [],

            answers:
              analysis.questions
                .filter(
                  (question) =>
                    Boolean(
                      question.answer?.trim(),
                    ),
                )
                .map((question) => ({
                  question:
                    question.question,
                  answer:
                    question.answer!.trim(),
                })),

            productExperience: {
              coreProblem: '',
              primaryUser: '',
              productPurpose: '',
              productPromise: '',
              primaryOutcome: '',
              coreExperience: '',
              firstTimeJourney: [],
              ongoingExperience: [],
              importantDecisions: [],
            },
          },
        );

      this.logger.log(
        `Product structure AI completed for project ${projectId}`,
      );

      await this.dataSource.transaction(
        async (manager) => {
          const publicFlowPageRepository =
            manager.getRepository(
              PublicFlowPage,
            );

          const actorRepository =
            manager.getRepository(Actor);

          await publicFlowPageRepository.delete({
            projectId: project.id,
          });

          await actorRepository.delete({
            projectId: project.id,
          });

          if (
            structure.publicFlow?.pages?.length
          ) {
            const pages =
              structure.publicFlow.pages.map(
                (page) =>
                  publicFlowPageRepository.create({
                    name: page.name,
                    purpose: page.purpose,
                    description:
                      page.description ?? null,
                    project,
                  }),
              );

            await publicFlowPageRepository.save(
              pages,
            );
          }

          for (
            const generatedActor of
              structure.actors
          ) {
            const actor =
              actorRepository.create({
                name: generatedActor.name,
                description:
                  generatedActor.description,
                project,
                pages:
                  generatedActor.pages.map(
                    (page) => ({
                      name: page.name,
                      purpose: page.purpose,
                      description:
                        page.description,
                    }),
                  ),
                capabilities:
                  generatedActor.capabilities.map(
                    (capability) => ({
                      name: capability.name,
                      description:
                        capability.description,
                    }),
                  ),
              });

            await actorRepository.save(actor);
          }
        },
      );

      this.logger.log(
        `Product structure saved for project ${projectId}`,
      );

      return this.findStructure(
        projectId,
        userId,
      );
    } finally {
      this.releaseUserGeneration(userId);
    }
  }

  async findStructure(
    projectId: number,
    userId: number,
  ) {
    await this.projectAccessService.canAccess(
      projectId,
      userId,
      'view',
    );

    const [
      publicFlow,
      actors,
    ] = await Promise.all([
      this.publicFlowPageRepository.find({
        where: {
          projectId,
        },
        order: {
          createdAt: 'ASC',
        },
      }),

      this.actorRepository.find({
        where: {
          projectId,
        },
        relations: {
          pages: true,
          capabilities: true,
        },
        order: {
          createdAt: 'ASC',
        },
      }),
    ]);

    return {
      publicFlow,
      actors,
    };
  }

  async generateActorWorkflows(
    projectId: number,
    actorId: number,
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
      await this.getProjectAnalysis(
        projectId,
        userId,
      );

    const actor =
      await this.actorRepository.findOne({
        where: {
          id: actorId,
          projectId,
        },
        relations: {
          pages: true,
          capabilities: true,
        },
      });

    if (!actor) {
      throw new NotFoundException(
        'Actor not found. Generate the product structure first.',
      );
    }

    const generationKey =
      `${project.id}:${actor.id}`;

    if (
      this.activeWorkflowGenerations.has(
        generationKey,
      )
    ) {
      throw new HttpException(
        'Workflow generation is already running for this actor. Please wait for it to finish.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.acquireUserGeneration(userId);

    this.activeWorkflowGenerations.add(
      generationKey,
    );

    try {
      const existingWorkflows =
        await this.workflowRepository.find({
          where: {
            project: {
              id: project.id,
            },
            actor: actor.name,
          },
          relations: {
            steps: true,
            pages: true,
            connections: true,
          },
          order: {
            createdAt: 'ASC',
          },
        });

      if (existingWorkflows.length > 0) {
        existingWorkflows.forEach(
          (workflow) => {
            workflow.steps.sort(
              (a, b) =>
                a.stepOrder -
                b.stepOrder,
            );

            workflow.pages.sort(
              (a, b) => a.id - b.id,
            );

            workflow.connections.sort(
              (a, b) => a.id - b.id,
            );
          },
        );

        this.logger.log(
          `Existing workflows returned for project ${projectId}, actor ${actorId}`,
        );

        return existingWorkflows;
      }

      const allActors =
        await this.actorRepository.find({
          where: {
            projectId,
          },
        });

      const actorGoalEntry =
        analysis.actorGoals.find(
          (goal) =>
            goal.actor === actor.name,
        );

      const generatedWorkflows =
        await this.actorWorkflowsAiService.generateForActor(
          {
            understanding:
              analysis.understanding ?? '',

            productAreas:
              analysis.productAreas.map(
                (area) => ({
                  name: area.name,
                  description:
                    area.description ?? '',
                }),
              ),

            entities:
              analysis.entities.map(
                (entity) => ({
                  name: entity.name,
                  description:
                    entity.description,
                }),
              ),

            relationships:
              analysis.relationships.map(
                (relationship) => ({
                  from: relationship.from,
                  relationship:
                    relationship.relationship,
                  to: relationship.to,
                }),
              ),

            answers:
              analysis.questions
                .filter(
                  (question) =>
                    Boolean(
                      question.answer?.trim(),
                    ),
                )
                .map((question) => ({
                  question:
                    question.question,
                  answer:
                    question.answer!.trim(),
                })),

            actor: {
              name: actor.name,
              description: actor.description,

              pages:
                actor.pages.map(
                  (page) => ({
                    name: page.name,
                    purpose: page.purpose,
                    description:
                      page.description,
                  }),
                ),

              capabilities:
                actor.capabilities.map(
                  (capability) => ({
                    name: capability.name,
                    description:
                      capability.description,
                  }),
                ),
            },

            otherActors:
              allActors
                .filter(
                  (item) =>
                    item.id !== actor.id,
                )
                .map((item) => ({
                  name: item.name,
                  goal:
                    analysis.actorGoals.find(
                      (goal) =>
                        goal.actor ===
                        item.name,
                    )?.goal,
                })),

            actorGoal:
              actorGoalEntry?.goal,

            productExperience: {
              coreProblem: '',
              primaryUser: '',
              productPurpose: '',
              productPromise: '',
              primaryOutcome: '',
              coreExperience: '',
              firstTimeJourney: [],
              ongoingExperience: [],
              importantDecisions: [],
            },
          },
        );

      this.logger.log(
        `Workflow AI completed: project ${projectId}, actor ${actorId}, workflows ${generatedWorkflows.length}`,
      );

      const savedWorkflowIds =
        await this.dataSource.transaction(
          async (manager) => {
            const workflowRepository =
              manager.getRepository(
                Workflow,
              );

            const workflowStepRepository =
              manager.getRepository(
                WorkflowStep,
              );

            const workflowPageRepository =
              manager.getRepository(
                WorkflowPage,
              );

            const workflowConnectionRepository =
              manager.getRepository(
                WorkflowConnection,
              );

            await workflowRepository.delete({
              project: {
                id: project.id,
              },
              actor: actor.name,
            });

            const ids: number[] = [];

            for (
              const generatedWorkflow of
                generatedWorkflows
            ) {
              const workflow =
                workflowRepository.create({
                  name:
                    generatedWorkflow.name,

                  description:
                    generatedWorkflow.description ??
                    null,

                  actor:
                    generatedWorkflow.actor,

                  goal:
                    generatedWorkflow.goal,

                  entryPoint:
                    generatedWorkflow.entryPoint ??
                    null,

                  completion:
                    generatedWorkflow.completion ??
                    null,

                  project,
                });

              const savedWorkflow =
                await workflowRepository.save(
                  workflow,
                );

              if (
                generatedWorkflow.pages
                  ?.length
              ) {
                const pages =
                  generatedWorkflow.pages.map(
                    (page) =>
                      workflowPageRepository.create({
                        name: page.name,
                        purpose:
                          page.purpose,
                        workflow:
                          savedWorkflow,
                      }),
                  );

                await workflowPageRepository.save(
                  pages,
                );
              }

              if (
                generatedWorkflow.steps
                  ?.length
              ) {
                const steps =
                  generatedWorkflow.steps.map(
                    (step) =>
                      workflowStepRepository.create({
                        title: step.title,
                        type: step.type,
                        actor: step.actor,
                        page:
                          step.page ?? null,
                        description:
                          step.description ??
                          null,
                        stepOrder:
                          step.stepOrder,
                        workflow:
                          savedWorkflow,
                      }),
                  );

                await workflowStepRepository.save(
                  steps,
                );
              }

              if (
                generatedWorkflow
                  .connections?.length
              ) {
                const connections =
                  generatedWorkflow.connections.map(
                    (connection) =>
                      workflowConnectionRepository.create({
                        from:
                          connection.from,
                        to:
                          connection.to,
                        condition:
                          connection.condition ??
                          null,
                        workflow:
                          savedWorkflow,
                      }),
                  );

                await workflowConnectionRepository.save(
                  connections,
                );
              }

              ids.push(savedWorkflow.id);
            }

            return ids;
          },
        );

      this.logger.log(
        `Workflows saved: project ${projectId}, actor ${actorId}, count ${savedWorkflowIds.length}`,
      );

      if (savedWorkflowIds.length === 0) {
        return [];
      }

      const savedWorkflows =
        await this.workflowRepository.find({
          where: savedWorkflowIds.map(
            (id) => ({
              id,
            }),
          ),
          relations: {
            steps: true,
            pages: true,
            connections: true,
          },
          order: {
            createdAt: 'ASC',
          },
        });

      savedWorkflows.forEach(
        (workflow) => {
          workflow.steps.sort(
            (a, b) =>
              a.stepOrder -
              b.stepOrder,
          );

          workflow.connections.sort(
            (a, b) => a.id - b.id,
          );

          workflow.pages.sort(
            (a, b) => a.id - b.id,
          );
        },
      );

      this.logger.log(
        `Saved workflows loaded: project ${projectId}, actor ${actorId}, count ${savedWorkflows.length}`,
      );

      return savedWorkflows;
    } finally {
      this.activeWorkflowGenerations.delete(
        generationKey,
      );

      this.releaseUserGeneration(userId);
    }
  }

  async findPublicFlow(
    projectId: number,
    userId: number,
  ) {
    await this.projectAccessService.canAccess(
      projectId,
      userId,
      'view',
    );

    return this.publicFlowPageRepository.find({
      where: {
        projectId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async create(
    projectId: number,
    dto: CreateWorkflowDto,
    userId: number,
  ) {
    await this.projectAccessService.canAccess(
      projectId,
      userId,
      'edit',
    );

    const project =
      await this.projectsService.getProject(
        projectId,
        userId,
      );

    const workflow =
      this.workflowRepository.create({
        name: dto.name,
        description:
          dto.description ?? null,
        actor: dto.actor,
        goal: dto.goal,
        project,
      });

    const savedWorkflow =
      await this.workflowRepository.save(
        workflow,
      );

    if (dto.steps?.length) {
      const steps =
        dto.steps.map((step) =>
          this.workflowStepRepository.create({
            title: step.title,
            type: step.type,
            description:
              step.description ?? null,
            stepOrder: step.stepOrder,
            workflow: savedWorkflow,
          }),
        );

      await this.workflowStepRepository.save(
        steps,
      );
    }

    return this.findOne(
      savedWorkflow.id,
      userId,
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

    const workflows =
      await this.workflowRepository.find({
        where: {
          project: {
            id: projectId,
          },
        },
        relations: {
          steps: true,
          pages: true,
          connections: true,
        },
        order: {
          createdAt: 'ASC',
        },
      });

    workflows.forEach(
      (workflow) => {
        workflow.steps.sort(
          (a, b) =>
            a.stepOrder -
            b.stepOrder,
        );

        workflow.pages.sort(
          (a, b) => a.id - b.id,
        );

        workflow.connections.sort(
          (a, b) => a.id - b.id,
        );
      },
    );

    return workflows;
  }

  async findOne(
    workflowId: number,
    userId: number,
  ) {
    const workflow =
      await this.workflowRepository.findOne({
        where: {
          id: workflowId,
        },
        relations: {
          project: true,
          steps: true,
          pages: true,
          connections: true,
        },
      });

    if (!workflow) {
      throw new NotFoundException(
        'Workflow not found',
      );
    }

    await this.projectAccessService.canAccess(
      workflow.project.id,
      userId,
      'view',
    );

    workflow.steps.sort(
      (a, b) =>
        a.stepOrder -
        b.stepOrder,
    );

    workflow.pages.sort(
      (a, b) => a.id - b.id,
    );

    workflow.connections.sort(
      (a, b) => a.id - b.id,
    );

    return workflow;
  }

  async update(
    workflowId: number,
    dto: UpdateWorkflowDto,
    userId: number,
  ) {
    const workflow =
      await this.workflowRepository.findOne({
        where: {
          id: workflowId,
        },
        relations: {
          project: true,
          steps: true,
          pages: true,
          connections: true,
        },
      });

    if (!workflow) {
      throw new NotFoundException(
        'Workflow not found',
      );
    }

    await this.projectAccessService.canAccess(
      workflow.project.id,
      userId,
      'edit',
    );

    if (dto.name !== undefined) {
      workflow.name = dto.name;
    }

    if (dto.description !== undefined) {
      workflow.description =
        dto.description ?? null;
    }

    if (dto.actor !== undefined) {
      workflow.actor = dto.actor;
    }

    if (dto.goal !== undefined) {
      workflow.goal = dto.goal;
    }

    if (dto.steps !== undefined) {
      await this.workflowStepRepository.delete({
        workflow: {
          id: workflowId,
        },
      });

      if (dto.steps.length) {
        const steps =
          dto.steps.map((step) =>
            this.workflowStepRepository.create({
              title: step.title,
              type: step.type,
              description:
                step.description ?? null,
              stepOrder:
                step.stepOrder,
              workflow,
            }),
          );

        await this.workflowStepRepository.save(
          steps,
        );
      }
    }

    await this.workflowRepository.save(
      workflow,
    );

    return this.findOne(
      workflowId,
      userId,
    );
  }

  async remove(
    workflowId: number,
    userId: number,
  ) {
    const workflow =
      await this.workflowRepository.findOne({
        where: {
          id: workflowId,
        },
        relations: {
          project: true,
        },
      });

    if (!workflow) {
      throw new NotFoundException(
        'Workflow not found',
      );
    }

    await this.projectAccessService.canAccess(
      workflow.project.id,
      userId,
      'delete',
    );

    await this.workflowRepository.remove(
      workflow,
    );

    return {
      message:
        'Workflow deleted successfully',
    };
  }
}