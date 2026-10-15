import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GenerateGoalsDto } from './dto/generate-goals.dto';

import { Analysis } from '../analysis/entities/analysis.entity';
import { ProductType } from '../analysis/entities/product-type.entity';
import { ProductArea } from '../analysis/entities/product-area.entity';
import { Person } from '../analysis/entities/person.entity';
import { Question } from '../analysis/entities/question.entity';
import { ActorGoal } from '../analysis/entities/actor-goal.entity';
import { ProductEntity } from '../analysis/entities/product-entity.entity';
import { ProductRelationship } from '../analysis/entities/product-relationship.entity';

import { AnalysisAiService } from '../ai/analysis/analysis-ai.service';
import { QuestionsAiService } from '../ai/questions/questions-ai.service';
import { GoalsAiService } from '../ai/goals/goals-ai.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectMember)
    private readonly projectMemberRepository: Repository<ProjectMember>,

    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>,

    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,

    @InjectRepository(ProductArea)
    private readonly productAreaRepository: Repository<ProductArea>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(ActorGoal)
    private readonly actorGoalRepository: Repository<ActorGoal>,

    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,

    @InjectRepository(ProductRelationship)
    private readonly productRelationshipRepository: Repository<ProductRelationship>,

    private readonly analysisAiService: AnalysisAiService,

    private readonly questionsAiService: QuestionsAiService,

    private readonly goalsAiService: GoalsAiService,
  ) {}

  // ---------------- PROJECTS ----------------

  async getProjects(userId: number) {
    const ownedProjects =
      await this.projectRepository.find({
        where: {
          createdById: userId,
        },
      });

    const memberships =
      await this.projectMemberRepository.find({
        where: {
          userId,
        },
      });

    if (memberships.length === 0) {
      return ownedProjects;
    }

    const sharedProjects =
      await this.projectRepository.findBy(
        memberships.map((membership) => ({
          id: membership.projectId,
        })),
      );

    const projects = [
      ...ownedProjects,
      ...sharedProjects,
    ];

    return Array.from(
      new Map(
        projects.map((project) => [
          project.id,
          project,
        ]),
      ).values(),
    );
  }

  async getProject(
    id: number,
    userId: number,
  ) {
    const ownedProject =
      await this.projectRepository.findOneBy({
        id,
        createdById: userId,
      });

    if (ownedProject) {
      return ownedProject;
    }

    const membership =
      await this.projectMemberRepository.findOne({
        where: {
          projectId: id,
          userId,
        },
      });

    if (!membership) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    const project =
      await this.projectRepository.findOneBy({
        id,
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    userId: number,
  ) {
    const project =
      this.projectRepository.create({
        ...createProjectDto,
        createdById: userId,
      });

    return this.projectRepository.save(project);
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
  ) {
    const project =
      await this.projectRepository.findOneBy({
        id,
        createdById: userId,
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    Object.assign(
      project,
      updateProjectDto,
    );

    return this.projectRepository.save(
      project,
    );
  }

  async deleteProject(
    id: number,
    userId: number,
  ) {
    const project =
      await this.projectRepository.findOneBy({
        id,
        createdById: userId,
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    await this.projectRepository.remove(
      project,
    );

    return {
      message: 'Project deleted successfully',
    };
  }

  // ---------------- ANALYSIS ----------------

  async createAnalysis(
    projectId: number,
    userId: number,
  ) {
    const project =
      await this.projectRepository.findOneBy({
        id: projectId,
        createdById: userId,
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    let analysis =
      await this.analysisRepository.findOne({
        where: {
          project: {
            id: projectId,
          },
        },
      });

    if (!analysis) {
      analysis =
        this.analysisRepository.create({
          project,
        });

      analysis =
        await this.analysisRepository.save(
          analysis,
        );
    }

    const result =
      await this.analysisAiService.analyzeProject(
        project.name,
        project.description ?? '',
        project.productFormat,
      );

    analysis.understanding =
      result.understanding;

    analysis.productModel =
      result.productModel;

    await this.analysisRepository.save(
      analysis,
    );

    // Remove previous generated model.

    await this.productTypeRepository.delete({
      analysis: {
        id: analysis.id,
      },
    });

    await this.productAreaRepository.delete({
      analysis: {
        id: analysis.id,
      },
    });

    await this.personRepository.delete({
      analysis: {
        id: analysis.id,
      },
    });

    await this.productEntityRepository.delete({
      analysis: {
        id: analysis.id,
      },
    });

    await this.productRelationshipRepository.delete({
      analysis: {
        id: analysis.id,
      },
    });

    // Save product types.

    await this.productTypeRepository.save(
      result.productTypes.map(
        (name: string) =>
          this.productTypeRepository.create({
            name,
            analysis,
          }),
      ),
    );

    // Save product areas.

    await this.productAreaRepository.save(
      result.productAreas.map(
        (area: {
          name: string;
          description: string;
        }) =>
          this.productAreaRepository.create({
            name: area.name,
            description:
              area.description ?? null,
            analysis,
          }),
      ),
    );

    // Save actors.

    await this.personRepository.save(
      result.actors.map(
        (actor: {
          name: string;
          type: string;
          responsibilities: string[];
        }) =>
          this.personRepository.create({
            name: actor.name,
            type: actor.type,
            responsibilities:
              actor.responsibilities,
            analysis,
          }),
      ),
    );

    // Save entities.

    await this.productEntityRepository.save(
      result.entities.map(
        (entity: {
          name: string;
          description: string;
        }) =>
          this.productEntityRepository.create({
            name: entity.name,
            description:
              entity.description,
            analysis,
          }),
      ),
    );

    // Save relationships.

    await this.productRelationshipRepository.save(
      result.relationships.map(
        (relationship: {
          from: string;
          relationship: string;
          to: string;
        }) =>
          this.productRelationshipRepository.create({
            from: relationship.from,
            relationship:
              relationship.relationship,
            to: relationship.to,
            analysis,
          }),
      ),
    );

    return {
      analysis,
      result,
    };
  }

  /**
   * Viewable analysis.
   *
   * Owner, editor and viewer can use this.
   */
  async getAnalysis(
    projectId: number,
    userId: number,
  ) {
    await this.getProject(
      projectId,
      userId,
    );

    const analysis =
      await this.analysisRepository.findOne({
        where: {
          project: {
            id: projectId,
          },
        },
      });

    if (!analysis) {
      throw new NotFoundException(
        'Analysis not found',
      );
    }

    analysis.productTypes =
      await this.productTypeRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    analysis.productAreas =
      await this.productAreaRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    analysis.people =
      await this.personRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    analysis.entities =
      await this.productEntityRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    analysis.relationships =
      await this.productRelationshipRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    analysis.questions =
      await this.questionRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    analysis.actorGoals =
      await this.actorGoalRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    return analysis;
  }

  /**
   * Owner-only analysis.
   *
   * Use this for mutations and generation.
   */
  async getOwnerAnalysis(
    projectId: number,
    userId: number,
  ) {
    const analysis =
      await this.analysisRepository.findOne({
        where: {
          project: {
            id: projectId,
            createdById: userId,
          },
        },
      });

    if (!analysis) {
      throw new NotFoundException(
        'Analysis not found',
      );
    }

    return analysis;
  }

  /**
   * Viewable analysis helper.
   *
   * Owner, editor and viewer can use this.
   */
  async getViewableAnalysisForProject(
    projectId: number,
    userId: number,
  ) {
    return this.getAnalysis(
      projectId,
      userId,
    );
  }

  // ---------------- QUESTIONS ----------------

  async generateQuestions(
    projectId: number,
    userId: number,
  ) {
    const analysis =
      await this.getOwnerAnalysis(
        projectId,
        userId,
      );

    const existingQuestions =
      await this.questionRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
        order: {
          id: 'ASC',
        },
      });

    if (existingQuestions.length > 0) {
      return {
        questions: existingQuestions,
      };
    }

    const result =
      await this.questionsAiService.generateQuestions({
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
          analysis.productTypes?.map(
            (type) => type.name,
          ) ?? [],

        productAreas:
          analysis.productAreas?.map(
            (area) => ({
              name: area.name,
              description:
                area.description ??
                undefined,
            }),
          ) ?? [],

        actors:
          analysis.people?.map(
            (person) => ({
              name: person.name,
              type: person.type ?? '',
              responsibilities:
                person.responsibilities ?? [],
            }),
          ) ?? [],

        entities:
          analysis.entities?.map(
            (entity) => ({
              name: entity.name,
              description:
                entity.description,
            }),
          ) ?? [],

        relationships:
          analysis.relationships?.map(
            (relationship) => ({
              from: relationship.from,
              relationship:
                relationship.relationship,
              to: relationship.to,
            }),
          ) ?? [],

        uncertainties:
          analysis.uncertainties ?? [],

        previousQuestions: [],

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
      });

    const questions =
      (result.questions ?? []).map(
        (question: {
          question: string;
          options: {
            label: string;
            value: string;
            description: string;
          }[];
          reason: string;
        }) =>
          this.questionRepository.create({
            question:
              question.question,
            options:
              question.options,
            reason:
              question.reason,
            answer: null,
            analysis,
          }),
      );

    const savedQuestions =
      await this.questionRepository.save(
        questions,
      );

    return {
      questions: savedQuestions,
    };
  }

  async getQuestions(
    projectId: number,
    userId: number,
  ) {
    const analysis =
      await this.getViewableAnalysisForProject(
        projectId,
        userId,
      );

    return this.questionRepository.find({
      where: {
        analysis: {
          id: analysis.id,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async updateQuestions(
    projectId: number,
    questions: {
      id: number;
      question?: string;
      options?: {
        label: string;
        value: string;
      }[];
      reason?: string;
      answer?: string;
    }[],
    userId: number,
  ) {
    const analysis =
      await this.getOwnerAnalysis(
        projectId,
        userId,
      );

    let answerWasSubmitted = false;

    for (const item of questions) {
      const question =
        await this.questionRepository.findOne({
          where: {
            id: item.id,
            analysis: {
              id: analysis.id,
            },
          },
        });

      if (!question) {
        continue;
      }

      if (
        item.question !== undefined
      ) {
        question.question =
          item.question;
      }

      if (
        item.options !== undefined
      ) {
        question.options =
          item.options.map(
            (option) => ({
              ...option,
              description: '',
            }),
          );
      }

      if (
        item.reason !== undefined
      ) {
        question.reason =
          item.reason;
      }

      if (
        item.answer !== undefined
      ) {
        question.answer =
          item.answer;

        answerWasSubmitted = true;
      }

      await this.questionRepository.save(
        question,
      );
    }

    if (!answerWasSubmitted) {
      return this.getQuestions(
        projectId,
        userId,
      );
    }

    const MAX_QUESTIONS = 7;

    const totalQuestions =
      await this.questionRepository.count({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
      });

    if (totalQuestions >= MAX_QUESTIONS) {
      const finalQuestions =
        await this.questionRepository.find({
          where: {
            analysis: {
              id: analysis.id,
            },
          },
          order: {
            id: 'ASC',
          },
        });

      return {
        questions: finalQuestions,
      };
    }

    const previousQuestions =
      await this.questionRepository.find({
        where: {
          analysis: {
            id: analysis.id,
          },
        },
        order: {
          id: 'ASC',
        },
      });

    const result =
      await this.questionsAiService.generateQuestions({
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
          analysis.productTypes?.map(
            (type) => type.name,
          ) ?? [],

        productAreas:
          analysis.productAreas?.map(
            (area) => ({
              name: area.name,
              description:
                area.description ??
                undefined,
            }),
          ) ?? [],

        actors:
          analysis.people?.map(
            (person) => ({
              name: person.name,
              type: person.type ?? '',
              responsibilities:
                person.responsibilities ?? [],
            }),
          ) ?? [],

        entities:
          analysis.entities?.map(
            (entity) => ({
              name: entity.name,
              description:
                entity.description,
            }),
          ) ?? [],

        relationships:
          analysis.relationships?.map(
            (relationship) => ({
              from: relationship.from,
              relationship:
                relationship.relationship,
              to: relationship.to,
            }),
          ) ?? [],

        uncertainties:
          analysis.uncertainties ?? [],

        previousQuestions:
          previousQuestions.map(
            (question) => ({
              question:
                question.question,
              answer:
                question.answer,
            }),
          ),

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
      });

    if (
      !result.questions ||
      result.questions.length === 0
    ) {
      return {
        questions: previousQuestions,
      };
    }

    const nextQuestion =
      result.questions[0];

    const savedQuestion =
      await this.questionRepository.save(
        this.questionRepository.create({
          question:
            nextQuestion.question,
          options:
            nextQuestion.options,
          reason:
            nextQuestion.reason,
          answer: null,
          analysis,
        }),
      );

    return {
      questions: [
        ...previousQuestions,
        savedQuestion,
      ],
    };
  }

  // ---------------- GOALS ----------------

  async generateGoalSuggestions(
    projectId: number,
    generateGoalsDto: GenerateGoalsDto,
    userId: number,
  ) {
    const analysis =
      await this.getOwnerAnalysis(
        projectId,
        userId,
      );

    const result =
      await this.goalsAiService.generateGoalSuggestions(
        generateGoalsDto,
      );

    await this.actorGoalRepository.delete({
      analysis: {
        id: analysis.id,
      },
    });

    const goals =
      result.actorGoals.flatMap(
        (actorGroup: {
          actor: string;
          goals: {
            id: string;
            goal: string;
          }[];
        }) =>
          actorGroup.goals.map(
            (goal: {
              id: string;
              goal: string;
            }) =>
              this.actorGoalRepository.create({
                actor:
                  actorGroup.actor,
                goal:
                  goal.goal,
                analysis,
              }),
          ),
      );

    const savedGoals =
      await this.actorGoalRepository.save(
        goals,
      );

    return {
      actorGoals: savedGoals,
    };
  }

  async getGoals(
    projectId: number,
    userId: number,
  ) {
    const analysis =
      await this.getViewableAnalysisForProject(
        projectId,
        userId,
      );

    return this.actorGoalRepository.find({
      where: {
        analysis: {
          id: analysis.id,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async updateGoals(
    projectId: number,
    goals: {
      id: number;
      actor?: string;
      goal?: string;
    }[],
    userId: number,
  ) {
    const analysis =
      await this.getOwnerAnalysis(
        projectId,
        userId,
      );

    for (const item of goals) {
      const goal =
        await this.actorGoalRepository.findOne({
          where: {
            id: item.id,
            analysis: {
              id: analysis.id,
            },
          },
        });

      if (!goal) {
        continue;
      }

      if (
        item.actor !== undefined
      ) {
        goal.actor = item.actor;
      }

      if (
        item.goal !== undefined
      ) {
        goal.goal = item.goal;
      }

      await this.actorGoalRepository.save(
        goal,
      );
    }

    return this.getGoals(
      projectId,
      userId,
    );
  }
}