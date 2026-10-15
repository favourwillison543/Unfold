import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';

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

const MAX_QUESTIONS = 7;

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

    private readonly dataSource: DataSource,
    private readonly analysisAiService: AnalysisAiService,
    private readonly questionsAiService: QuestionsAiService,
    private readonly goalsAiService: GoalsAiService,
  ) {}

  // ---------------- PROJECTS ----------------

  async getProjects(userId: number) {
    const ownedProjects = await this.projectRepository.find({
      where: { createdById: userId },
    });

    const memberships = await this.projectMemberRepository.find({
      where: { userId },
    });

    if (memberships.length === 0) {
      return ownedProjects;
    }

    const sharedProjects = await this.projectRepository.find({
      where: { id: In(memberships.map((m) => m.projectId)) },
    });

    const unique = new Map<number, Project>();
    for (const project of [...ownedProjects, ...sharedProjects]) {
      unique.set(project.id, project);
    }

    return Array.from(unique.values());
  }

  async getProject(id: number, userId: number) {
    const ownedProject = await this.projectRepository.findOneBy({
      id,
      createdById: userId,
    });

    if (ownedProject) {
      return ownedProject;
    }

    const membership = await this.projectMemberRepository.findOne({
      where: { projectId: id, userId },
    });

    if (!membership) {
      throw new NotFoundException('Project not found');
    }

    const project = await this.projectRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async createProject(createProjectDto: CreateProjectDto, userId: number) {
    const existingProject = await this.projectRepository.findOne({
      where: {
        createdById: userId,
        name: createProjectDto.name,
        description: createProjectDto.description ?? IsNull(),
        productFormat: createProjectDto.productFormat ?? IsNull(),
      },
      order: { id: 'DESC' },
    });

    if (existingProject) {
      const existingAnalysis = await this.analysisRepository.findOne({
        where: { project: { id: existingProject.id } },
      });

      if (!existingAnalysis || !existingAnalysis.understanding) {
        return existingProject;
      }
    }

    const project = this.projectRepository.create({
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
    const project = await this.projectRepository.findOneBy({
      id,
      createdById: userId,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    Object.assign(project, updateProjectDto);

    return this.projectRepository.save(project);
  }

  async deleteProject(id: number, userId: number) {
    const project = await this.projectRepository.findOneBy({
      id,
      createdById: userId,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.remove(project);

    return { message: 'Project deleted successfully' };
  }

  // ---------------- ANALYSIS ----------------

  async createAnalysis(projectId: number, userId: number) {
    const project = await this.projectRepository.findOneBy({
      id: projectId,
      createdById: userId,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Run the AI first so a failure leaves nothing behind.
    const result = await this.analysisAiService.analyzeProject(
      project.name,
      project.description ?? '',
      project.productFormat,
    );

    // Everything below is all-or-nothing.
    const analysis = await this.dataSource.transaction(async (manager) => {
      let current = await manager.findOne(Analysis, {
        where: { project: { id: projectId } },
      });

      if (!current) {
        current = await manager.save(manager.create(Analysis, { project }));
      }

      current.understanding = result.understanding;
      current.productModel = result.productModel;
      current = await manager.save(current);

      const scope = { analysis: { id: current.id } };

      await manager.delete(ProductType, scope);
      await manager.delete(ProductArea, scope);
      await manager.delete(Person, scope);
      await manager.delete(ProductEntity, scope);
      await manager.delete(ProductRelationship, scope);

      await manager.save(
        (result.productTypes ?? []).map((name: string) =>
          manager.create(ProductType, { name, analysis: current }),
        ),
      );

      await manager.save(
        (result.productAreas ?? []).map(
          (area: { name: string; description: string }) =>
            manager.create(ProductArea, {
              name: area.name,
              description: area.description ?? null,
              analysis: current,
            }),
        ),
      );

      await manager.save(
        (result.actors ?? []).map(
          (actor: {
            name: string;
            type: string;
            responsibilities: string[];
          }) =>
            manager.create(Person, {
              name: actor.name,
              type: actor.type,
              responsibilities: actor.responsibilities,
              analysis: current,
            }),
        ),
      );

      await manager.save(
        (result.entities ?? []).map(
          (entity: { name: string; description: string }) =>
            manager.create(ProductEntity, {
              name: entity.name,
              description: entity.description,
              analysis: current,
            }),
        ),
      );

      await manager.save(
        (result.relationships ?? []).map(
          (relationship: {
            from: string;
            relationship: string;
            to: string;
          }) =>
            manager.create(ProductRelationship, {
              from: relationship.from,
              relationship: relationship.relationship,
              to: relationship.to,
              analysis: current,
            }),
        ),
      );

      return current;
    });

    return { analysis, result };
  }

  /** Owner, editor and viewer can use this. */
  async getAnalysis(projectId: number, userId: number) {
    await this.getProject(projectId, userId);

    const analysis = await this.analysisRepository.findOne({
      where: { project: { id: projectId } },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    await this.loadAnalysisDetails(analysis, true);

    return analysis;
  }

  /** Owner-only. Use for mutations and generation. */
  async getOwnerAnalysis(projectId: number, userId: number) {
    const analysis = await this.analysisRepository.findOne({
      where: {
        project: { id: projectId, createdById: userId },
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return analysis;
  }

  async getViewableAnalysisForProject(projectId: number, userId: number) {
    return this.getAnalysis(projectId, userId);
  }

  private async loadAnalysisDetails(
    analysis: Analysis,
    includeQuestionsAndGoals = false,
  ) {
    const where = { analysis: { id: analysis.id } };

    analysis.productTypes = await this.productTypeRepository.find({ where });
    analysis.productAreas = await this.productAreaRepository.find({ where });
    analysis.people = await this.personRepository.find({ where });
    analysis.entities = await this.productEntityRepository.find({ where });
    analysis.relationships = await this.productRelationshipRepository.find({
      where,
    });

    if (includeQuestionsAndGoals) {
      analysis.questions = await this.questionRepository.find({ where });
      analysis.actorGoals = await this.actorGoalRepository.find({ where });
    }
  }

  // ---------------- QUESTIONS ----------------

  private findQuestions(analysisId: number) {
    return this.questionRepository.find({
      where: { analysis: { id: analysisId } },
      order: { id: 'ASC' },
    });
  }

  private buildQuestionsInput(
    analysis: Analysis,
    previousQuestions: { question: string; answer: string | null }[],
  ) {
    return {
      understanding: analysis.understanding ?? '',

      productModel: analysis.productModel ?? {
        role: '',
        directCustomer: '',
        usageMode: '',
        primaryInterfaces: [],
      },

      productTypes: analysis.productTypes?.map((type) => type.name) ?? [],

      productAreas:
        analysis.productAreas?.map((area) => ({
          name: area.name,
          description: area.description ?? undefined,
        })) ?? [],

      actors:
        analysis.people?.map((person) => ({
          name: person.name,
          type: person.type ?? '',
          responsibilities: person.responsibilities ?? [],
        })) ?? [],

      entities:
        analysis.entities?.map((entity) => ({
          name: entity.name,
          description: entity.description,
        })) ?? [],

      relationships:
        analysis.relationships?.map((relationship) => ({
          from: relationship.from,
          relationship: relationship.relationship,
          to: relationship.to,
        })) ?? [],

      uncertainties: analysis.uncertainties ?? [],

      previousQuestions,

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
    };
  }

  async generateQuestions(projectId: number, userId: number) {
    const analysis = await this.getOwnerAnalysis(projectId, userId);

    const existingQuestions = await this.findQuestions(analysis.id);

    if (existingQuestions.length > 0) {
      return { questions: existingQuestions };
    }

    await this.loadAnalysisDetails(analysis);

    const result = await this.questionsAiService.generateQuestions(
      this.buildQuestionsInput(analysis, []),
    );

    const questions = (result.questions ?? []).map(
      (question: {
        question: string;
        options: { label: string; value: string; description: string }[];
        reason: string;
      }) =>
        this.questionRepository.create({
          question: question.question,
          options: question.options,
          reason: question.reason,
          answer: null,
          analysis,
        }),
    );

    const savedQuestions = await this.questionRepository.save(questions);

    return { questions: savedQuestions };
  }

  async getQuestions(projectId: number, userId: number) {
    const analysis = await this.getViewableAnalysisForProject(
      projectId,
      userId,
    );

    return this.findQuestions(analysis.id);
  }

  async updateQuestions(
    projectId: number,
    questions: {
      id: number;
      question?: string;
      options?: { label: string; value: string }[];
      reason?: string;
      answer?: string;
    }[],
    userId: number,
  ) {
    const analysis = await this.getOwnerAnalysis(projectId, userId);

    const existing = await this.questionRepository.find({
      where: {
        id: In(questions.map((item) => item.id)),
        analysis: { id: analysis.id },
      },
    });

    const existingById = new Map(existing.map((q) => [q.id, q]));
    const changed: Question[] = [];
    let answerWasSubmitted = false;

    for (const item of questions) {
      const question = existingById.get(item.id);

      if (!question) {
        continue;
      }

      if (item.question !== undefined) {
        question.question = item.question;
      }

      if (item.options !== undefined) {
        question.options = item.options.map((option) => ({
          ...option,
          description: '',
        }));
      }

      if (item.reason !== undefined) {
        question.reason = item.reason;
      }

      if (item.answer !== undefined) {
        question.answer = item.answer;
        answerWasSubmitted = true;
      }

      changed.push(question);
    }

    if (changed.length > 0) {
      await this.questionRepository.save(changed);
    }

    if (!answerWasSubmitted) {
      return this.getQuestions(projectId, userId);
    }

    const previousQuestions = await this.findQuestions(analysis.id);

    if (previousQuestions.length >= MAX_QUESTIONS) {
      return { questions: previousQuestions };
    }

    await this.loadAnalysisDetails(analysis);

    const result = await this.questionsAiService.generateQuestions(
      this.buildQuestionsInput(
        analysis,
        previousQuestions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      ),
    );

    if (!result.questions || result.questions.length === 0) {
      return { questions: previousQuestions };
    }

    const nextQuestion = result.questions[0];

    const savedQuestion = await this.questionRepository.save(
      this.questionRepository.create({
        question: nextQuestion.question,
        options: nextQuestion.options,
        reason: nextQuestion.reason,
        answer: null,
        analysis,
      }),
    );

    return { questions: [...previousQuestions, savedQuestion] };
  }

  // ---------------- GOALS ----------------

  async generateGoalSuggestions(
    projectId: number,
    generateGoalsDto: GenerateGoalsDto,
    userId: number,
  ) {
    const analysis = await this.getOwnerAnalysis(projectId, userId);

    // Call the AI before deleting so a failure keeps the old goals.
    const result =
      await this.goalsAiService.generateGoalSuggestions(generateGoalsDto);

    const savedGoals = await this.dataSource.transaction(async (manager) => {
      await manager.delete(ActorGoal, { analysis: { id: analysis.id } });

      const goals = (result.actorGoals ?? []).flatMap(
        (actorGroup: {
          actor: string;
          goals: { id: string; goal: string }[];
        }) =>
          actorGroup.goals.map((goal) =>
            manager.create(ActorGoal, {
              actor: actorGroup.actor,
              goal: goal.goal,
              analysis,
            }),
          ),
      );

      return manager.save(goals);
    });

    return { actorGoals: savedGoals };
  }

  async getGoals(projectId: number, userId: number) {
    const analysis = await this.getViewableAnalysisForProject(
      projectId,
      userId,
    );

    return this.actorGoalRepository.find({
      where: { analysis: { id: analysis.id } },
      order: { id: 'ASC' },
    });
  }

  async updateGoals(
    projectId: number,
    goals: { id: number; actor?: string; goal?: string }[],
    userId: number,
  ) {
    const analysis = await this.getOwnerAnalysis(projectId, userId);

    const existing = await this.actorGoalRepository.find({
      where: {
        id: In(goals.map((item) => item.id)),
        analysis: { id: analysis.id },
      },
    });

    const existingById = new Map(existing.map((g) => [g.id, g]));
    const changed: ActorGoal[] = [];

    for (const item of goals) {
      const goal = existingById.get(item.id);

      if (!goal) {
        continue;
      }

      if (item.actor !== undefined) {
        goal.actor = item.actor;
      }

      if (item.goal !== undefined) {
        goal.goal = item.goal;
      }

      changed.push(goal);
    }

    if (changed.length > 0) {
      await this.actorGoalRepository.save(changed);
    }

    return this.getGoals(projectId, userId);
  }
}