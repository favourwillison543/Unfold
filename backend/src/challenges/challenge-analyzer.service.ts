import { Injectable } from '@nestjs/common';

import { Analysis } from '../analysis/entities/analysis.entity';
import { Workflow } from '../workflows/entities/workflow.entity';

type ChallengeSeverity = 'critical' | 'important' | 'consider';

export type GeneratedChallenge = {
  title: string;
  description: string;
  severity: ChallengeSeverity;
  relatedActor: string | null;
  relatedWorkflow: string | null;
  suggestedQuestion: string | null;
};

type CandidateChallenge = GeneratedChallenge & {
  category: string;
  score: number;
};

@Injectable()
export class ChallengeAnalyzerService {
  private readonly MAX_CHALLENGES = 4;

  analyze(
    analysis: Analysis | null,
    workflows: Workflow[],
  ): GeneratedChallenge[] {
    const candidates: CandidateChallenge[] = [];

    if (!analysis) {
      return [
        {
          title: 'Product analysis is missing',
          description:
            'The product does not have a completed analysis yet, so important actors, goals, entities, and product decisions cannot be checked against the workflows.',
          severity: 'critical',
          relatedActor: null,
          relatedWorkflow: null,
          suggestedQuestion:
            'What are the main users, business objects, and goals this product must support?',
        },
      ];
    }

    /*
     * ---------------------------------------------------------
     * PRODUCT / ACTOR ANALYSIS
     * (These are always meaningful, even with zero workflows,
     * since they only depend on the analysis itself.)
     * ---------------------------------------------------------
     */

    this.checkActorsWithoutGoals(analysis, candidates);
    this.checkActorsWithoutResponsibilities(analysis, candidates);
    this.checkProductModelCompleteness(analysis, candidates);
    this.checkUnresolvedQuestions(analysis, candidates);

    /*
     * ---------------------------------------------------------
     * NO WORKFLOWS AT ALL
     * ---------------------------------------------------------
     * If there are no workflows yet, every workflow-dependent
     * check below is either meaningless or produces redundant
     * noise (e.g. one "no supporting workflow" candidate per
     * goal, all collapsing into the same category). Surface one
     * clear, high-priority message instead and skip straight to
     * selection.
     */
    if (workflows.length === 0) {
      const hasSubstantiveAnalysis =
        (analysis.people ?? []).length > 0 ||
        (analysis.actorGoals ?? []).length > 0 ||
        (analysis.entities ?? []).length > 0 ||
        (analysis.productAreas ?? []).length > 0;

      if (hasSubstantiveAnalysis) {
        candidates.push({
          category: 'no-workflows',
          score: 99,
          title: 'No workflows have been defined yet',
          description:
            'The product analysis defines actors, goals, or entities, but there are no workflows showing how any of that behaviour actually happens. Nothing in the product can be validated as working until at least the core workflows exist.',
          severity: 'critical',
          relatedActor: null,
          relatedWorkflow: null,
          suggestedQuestion:
            'Which workflow should be defined first to deliver the most important actor goal?',
        });
      }

      return this.selectTopChallenges(candidates);
    }

    this.checkResponsibilitiesWithoutWorkflowCoverage(
      analysis,
      workflows,
      candidates,
    );

    this.checkGoalsWithoutWorkflowCoverage(
      analysis,
      workflows,
      candidates,
    );

    this.checkWorkflowsWithUndefinedActors(
      workflows,
      analysis,
      candidates,
    );

    /*
     * ---------------------------------------------------------
     * ENTITIES / DATA MODEL
     * ---------------------------------------------------------
     */

    this.checkEntitiesWithoutWorkflows(
      analysis,
      workflows,
      candidates,
    );

    this.checkRelationshipsWithoutWorkflows(
      analysis,
      workflows,
      candidates,
    );

    this.checkRelationshipReferentialIntegrity(
      analysis,
      candidates,
    );

    this.checkEntityLifecycleGaps(
      analysis,
      workflows,
      candidates,
    );

    /*
     * ---------------------------------------------------------
     * WORKFLOW / PRODUCT CONSISTENCY
     * ---------------------------------------------------------
     */

    this.checkWorkflowsWithoutActors(
      workflows,
      candidates,
    );

    this.checkWorkflowsMissingGoal(
      workflows,
      candidates,
    );

    this.checkWorkflowsWithoutGoals(
      workflows,
      analysis,
      candidates,
    );

    this.checkIncompleteWorkflows(
      workflows,
      candidates,
    );

    this.checkDanglingConnections(
      workflows,
      candidates,
    );

    this.checkDecisionPaths(
      workflows,
      candidates,
    );

    this.checkFailurePaths(
      workflows,
      candidates,
    );

    this.checkRecoveryPaths(
      workflows,
      candidates,
    );

    this.checkStateChangingWorkflows(
      workflows,
      candidates,
    );

    /*
     * ---------------------------------------------------------
     * CROSS-PRODUCT CONSISTENCY
     * ---------------------------------------------------------
     */

    this.checkCriticalActorGaps(
      analysis,
      workflows,
      candidates,
    );

    this.checkImportantProductAreasWithoutWorkflow(
      analysis,
      workflows,
      candidates,
    );

    /*
     * ---------------------------------------------------------
     * FINAL SELECTION
     * ---------------------------------------------------------
     */

    return this.selectTopChallenges(candidates);
  }

  /*
   * =========================================================
   * ACTORS
   * =========================================================
   */

  private checkActorsWithoutGoals(
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    const people = analysis.people ?? [];
    const goals = analysis.actorGoals ?? [];

    for (const person of people) {
      const actor = this.clean(person.name);

      if (!actor) continue;

      const hasGoal = goals.some((goal) =>
        this.sameName(goal.actor, person.name),
      );

      if (hasGoal) continue;

      candidates.push({
        category: 'actor-goal',
        score: 85,
        title: `${person.name} has no defined product goal`,
        description:
          `${person.name} is identified as a product actor, but the analysis does not define what this actor is trying to accomplish. Without a concrete goal, it is difficult to determine whether the workflows actually solve this actor's problem.`,
        severity: 'important',
        relatedActor: person.name,
        relatedWorkflow: null,
        suggestedQuestion:
          `What is the main outcome ${person.name} expects from the product?`,
      });
    }
  }

  private checkActorsWithoutResponsibilities(
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    const people = analysis.people ?? [];

    for (const person of people) {
      if (!person.name) continue;

      const responsibilities =
        person.responsibilities ?? [];

      if (responsibilities.length > 0) continue;

      candidates.push({
        category: 'actor-responsibility',
        score: 70,
        title: `${person.name} has no defined responsibilities`,
        description:
          `${person.name} is present in the product analysis, but there is no clear definition of what this actor is responsible for. This can leave permissions, ownership, and expected actions ambiguous.`,
        severity: 'important',
        relatedActor: person.name,
        relatedWorkflow: null,
        suggestedQuestion:
          `What actions or responsibilities belong specifically to ${person.name}?`,
      });
    }
  }

  private checkResponsibilitiesWithoutWorkflowCoverage(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const people = analysis.people ?? [];

    for (const person of people) {
      const responsibilities =
        person.responsibilities ?? [];

      if (
        !person.name ||
        responsibilities.length === 0
      ) {
        continue;
      }

      const workflowText = workflows
        .filter((workflow) =>
          this.sameName(workflow.actor, person.name),
        )
        .map((workflow) =>
          this.getWorkflowText(workflow),
        )
        .join(' ');

      const uncovered = responsibilities.filter(
        (responsibility) => {
          return !this.hasMeaningfulOverlap(
            responsibility,
            workflowText,
          );
        },
      );

      if (uncovered.length === 0) continue;

      candidates.push({
        category: 'responsibility-coverage',
        score: 92,
        title: `${person.name} has responsibilities not represented in the workflows`,
        description:
          `The analysis says ${person.name} is responsible for ${this.joinList(
            uncovered.slice(0, 3),
          )}, but the current workflows do not clearly show how those responsibilities are performed. This creates a gap between what the actor is supposed to do and what the product actually supports.`,
        severity: 'important',
        relatedActor: person.name,
        relatedWorkflow: null,
        suggestedQuestion:
          `How should the product support ${person.name} when handling ${uncovered[0]}?`,
      });
    }
  }

  private checkGoalsWithoutWorkflowCoverage(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const goals = analysis.actorGoals ?? [];
    const people = analysis.people ?? [];

    for (const goal of goals) {
      if (!goal.actor || !goal.goal) continue;

      /*
       * A goal assigned to an actor that does not exist in the
       * people analysis is its own, more fundamental problem
       * than "no workflow covers it" — surface it separately so
       * the real issue (an undefined actor) isn't masked.
       */
      const actorDefined = people.some((person) =>
        this.sameName(person.name, goal.actor),
      );

      if (!actorDefined) {
        candidates.push({
          category: 'goal-actor-mismatch',
          score: 88,
          title: `A goal is assigned to an actor that isn't defined`,
          description:
            `The analysis defines the goal "${goal.goal}" for "${goal.actor}", but "${goal.actor}" does not appear in the product's people/actors list. Either the actor is missing from the analysis, or the goal is attached to the wrong actor.`,
          severity: 'important',
          relatedActor: goal.actor,
          relatedWorkflow: null,
          suggestedQuestion:
            `Should "${goal.actor}" be added as a product actor, or does this goal belong to a different, already-defined actor?`,
        });

        continue;
      }

      const actorWorkflows = workflows.filter(
        (workflow) =>
          this.sameName(workflow.actor, goal.actor),
      );

      if (actorWorkflows.length === 0) {
        candidates.push({
          category: 'goal-coverage',
          score: 96,
          title: `${goal.actor}'s goal has no supporting workflow`,
          description:
            `The product analysis defines "${goal.goal}" as a goal for ${goal.actor}, but there is no workflow currently showing how that goal is achieved. The product may identify the need without actually providing the path to satisfy it.`,
          severity: 'critical',
          relatedActor: goal.actor,
          relatedWorkflow: null,
          suggestedQuestion:
            `What workflow allows ${goal.actor} to achieve "${goal.goal}"?`,
        });

        continue;
      }

      const goalCovered = actorWorkflows.some((workflow) =>
        this.hasMeaningfulOverlap(
          goal.goal,
          this.getWorkflowText(workflow),
        ),
      );

      if (!goalCovered) {
        candidates.push({
          category: 'goal-coverage',
          score: 90,
          title: `${goal.actor}'s goal is not clearly supported`,
          description:
            `The analysis says ${goal.actor} needs to "${goal.goal}", but none of the actor's workflows clearly represents that outcome. The workflow structure may exist without actually completing the goal identified during product analysis.`,
          severity: 'important',
          relatedActor: goal.actor,
          relatedWorkflow: actorWorkflows[0]?.name ?? null,
          suggestedQuestion:
            `Which workflow should complete the goal "${goal.goal}" for ${goal.actor}?`,
        });
      }
    }
  }

  /*
   * Merged replacement for the previous checkActorWorkflowMismatch
   * and checkWorkflowsWithUnknownActors, which performed the same
   * comparison (workflow.actor vs analysis.people) under two
   * different category names and therefore doubled up on nearly
   * identical candidates.
   */
  private checkWorkflowsWithUndefinedActors(
    workflows: Workflow[],
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    const people = analysis.people ?? [];

    for (const workflow of workflows) {
      if (!workflow.actor) continue;

      const actorExists = people.some((person) =>
        this.sameName(person.name, workflow.actor),
      );

      if (actorExists) continue;

      candidates.push({
        category: 'workflow-actor-mismatch',
        score: 88,
        title: `"${workflow.name}" uses an actor that is not in the product analysis`,
        description:
          `The workflow "${workflow.name}" is assigned to "${workflow.actor}", but that actor is not represented in the product's people analysis. This creates uncertainty about who is actually allowed or expected to perform the workflow.`,
        severity: 'important',
        relatedActor: workflow.actor,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `Should ${workflow.actor} be added as a product actor, or should this workflow belong to another actor?`,
      });
    }
  }

  /*
   * =========================================================
   * PRODUCT MODEL
   * =========================================================
   */

  private checkProductModelCompleteness(
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    const model = analysis.productModel;

    if (!model) {
      candidates.push({
        category: 'product-model',
        score: 94,
        title: 'The product model has not been defined',
        description:
          'The product has actors and workflows, but there is no product model explaining the core role of the product, who directly uses it, how it is used, or the main interfaces involved. This makes the rest of the analysis harder to validate as one coherent product.',
        severity: 'important',
        relatedActor: null,
        relatedWorkflow: null,
        suggestedQuestion:
          'What is the core product model, who directly uses it, and through which interfaces?',
      });

      return;
    }

    const missing: string[] = [];

    if (!this.hasText(model.role)) {
      missing.push('the product role');
    }

    if (!this.hasText(model.directCustomer)) {
      missing.push('the direct customer');
    }

    if (!this.hasText(model.usageMode)) {
      missing.push('the usage mode');
    }

    if (
      !Array.isArray(model.primaryInterfaces) ||
      model.primaryInterfaces.length === 0
    ) {
      missing.push('the primary interface');
    }

    if (missing.length === 0) return;

    candidates.push({
      category: 'product-model',
      score: 78,
      title: 'The product model has important gaps',
      description:
        `The product model is missing ${this.joinList(
          missing,
        )}. These details affect how the actors, workflows, and product behaviour should be interpreted.`,
      severity: 'important',
      relatedActor: null,
      relatedWorkflow: null,
      suggestedQuestion:
        'What should be added to the product model so the product behaviour is unambiguous?',
    });
  }

  /*
   * =========================================================
   * QUESTIONS
   * =========================================================
   */

  private checkUnresolvedQuestions(
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    const questions = analysis.questions ?? [];

    const unresolved = questions.filter(
      (question: any) => {
        if (!question) return false;

        if (typeof question.resolved === 'boolean') {
          return !question.resolved;
        }

        if (typeof question.status === 'string') {
          return (
            question.status.toLowerCase() !==
            'resolved'
          );
        }

        return true;
      },
    );

    if (unresolved.length === 0) return;

    const importantQuestions = unresolved
      .slice(0, 3)
      .map((question: any) =>
        this.extractQuestionText(question),
      )
      .filter(Boolean);

    if (importantQuestions.length === 0) return;

    candidates.push({
      category: 'unresolved-question',
      score: 91,
      title: 'Important product decisions are still unresolved',
      description:
        `The analysis still contains unresolved questions: ${this.joinList(
          importantQuestions,
        )}. These decisions can change how the product should behave, so the current workflows may be based on assumptions rather than confirmed requirements.`,
      severity: 'important',
      relatedActor: null,
      relatedWorkflow: null,
      suggestedQuestion:
        importantQuestions[0] ?? null,
    });
  }

  /*
   * =========================================================
   * ENTITIES
   * =========================================================
   */

  private checkEntitiesWithoutWorkflows(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const entities = analysis.entities ?? [];

    for (const entity of entities) {
      const entityName = this.getEntityName(entity);

      if (!entityName) continue;

      const workflowText = workflows
        .map((workflow) =>
          this.getWorkflowText(workflow),
        )
        .join(' ');

      if (
        this.hasMeaningfulOverlap(
          entityName,
          workflowText,
        )
      ) {
        continue;
      }

      candidates.push({
        category: 'entity-coverage',
        score: 84,
        title: `${entityName} has no clear product workflow`,
        description:
          `The product analysis identifies "${entityName}" as a core product entity, but the current workflows do not clearly create, use, update, or otherwise interact with it. The entity may exist in the model without a real product behaviour around it.`,
        severity: 'important',
        relatedActor: null,
        relatedWorkflow: null,
        suggestedQuestion:
          `Which workflow creates or meaningfully uses ${entityName}?`,
      });
    }
  }

  private checkRelationshipsWithoutWorkflows(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const relationships =
      analysis.relationships ?? [];

    const workflowText = workflows
      .map((workflow) =>
        this.getWorkflowText(workflow),
      )
      .join(' ');

    for (const relationship of relationships) {
      const relationshipText =
        this.getRelationshipText(relationship);

      if (!relationshipText) continue;

      if (
        this.hasMeaningfulOverlap(
          relationshipText,
          workflowText,
        )
      ) {
        continue;
      }

      candidates.push({
        category: 'relationship-coverage',
        score: 67,
        title: 'A product relationship is not represented in behaviour',
        description:
          `The analysis defines the relationship "${relationshipText}", but the workflows do not clearly show when or how that relationship is created, changed, or used.`,
        severity: 'consider',
        relatedActor: null,
        relatedWorkflow: null,
        suggestedQuestion:
          `When does the product create or use the relationship "${relationshipText}"?`,
      });
    }
  }

  /*
   * NEW: validates that relationships actually point at entities
   * that exist in the analysis. A relationship referencing an
   * undefined entity is a data-model inconsistency that was
   * previously invisible to this analyzer.
   */
  private checkRelationshipReferentialIntegrity(
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    const relationships = analysis.relationships ?? [];
    const entities = analysis.entities ?? [];

    if (relationships.length === 0 || entities.length === 0) {
      return;
    }

    const entityNames = entities
      .map((entity) => this.getEntityName(entity))
      .filter(Boolean);

    for (const relationship of relationships as any[]) {
      const from =
        relationship?.from ?? relationship?.source ?? null;
      const to =
        relationship?.to ?? relationship?.target ?? null;

      const relationshipText =
        this.getRelationshipText(relationship);

      if (!relationshipText) continue;

      const unresolved: string[] = [];

      if (
        this.hasText(from) &&
        !entityNames.some((name) => this.sameName(name, from))
      ) {
        unresolved.push(from);
      }

      if (
        this.hasText(to) &&
        !entityNames.some((name) => this.sameName(name, to))
      ) {
        unresolved.push(to);
      }

      if (unresolved.length === 0) continue;

      candidates.push({
        category: 'relationship-integrity',
        score: 75,
        title: 'A relationship references an entity that is not defined',
        description:
          `The relationship "${relationshipText}" refers to ${this.joinList(
            unresolved,
          )}, which ${
            unresolved.length === 1 ? 'does' : 'do'
          } not match any entity currently defined in the product analysis. This is likely a naming inconsistency or a missing entity.`,
        severity: 'consider',
        relatedActor: null,
        relatedWorkflow: null,
        suggestedQuestion:
          `Should ${this.joinList(
            unresolved,
          )} be added as a defined entity, or renamed to match an existing one?`,
      });
    }
  }

  private checkEntityLifecycleGaps(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const entities = analysis.entities ?? [];

    for (const entity of entities) {
      const entityName = this.getEntityName(entity);

      if (!entityName) continue;

      const relevantWorkflows = workflows.filter(
        (workflow) =>
          this.hasMeaningfulOverlap(
            entityName,
            this.getWorkflowText(workflow),
          ),
      );

      if (relevantWorkflows.length === 0) {
        continue;
      }

      const combinedText = relevantWorkflows
        .map((workflow) =>
          this.getWorkflowText(workflow),
        )
        .join(' ');

      const hasCreate = this.containsAny(
        combinedText,
        [
          'create',
          'register',
          'add',
          'submit',
          'open',
          'start',
        ],
      );

      const hasChange = this.containsAny(
        combinedText,
        [
          'update',
          'edit',
          'change',
          'modify',
          'approve',
          'reject',
          'cancel',
          'delete',
        ],
      );

      if (!hasCreate && !hasChange) {
        candidates.push({
          category: 'entity-lifecycle',
          score: 63,
          title: `${entityName} appears in the product without a clear lifecycle`,
          description:
            `"${entityName}" is referenced by product workflows, but those workflows do not clearly show how the entity is created or changed. This may leave an important business object without a defined lifecycle.`,
          severity: 'consider',
          relatedActor: null,
          relatedWorkflow:
            relevantWorkflows[0]?.name ?? null,
          suggestedQuestion:
            `How is ${entityName} created and how can its state change?`,
        });
      }
    }
  }

  /*
   * =========================================================
   * WORKFLOWS
   * =========================================================
   */

  private checkWorkflowsWithoutActors(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    for (const workflow of workflows) {
      if (this.hasText(workflow.actor)) {
        continue;
      }

      candidates.push({
        category: 'workflow-actor',
        score: 89,
        title: `"${workflow.name}" has no responsible actor`,
        description:
          `The workflow "${workflow.name}" has no defined actor. The product therefore does not establish who is responsible for starting or completing this behaviour.`,
        severity: 'important',
        relatedActor: null,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `Which actor owns the "${workflow.name}" workflow?`,
      });
    }
  }

  /*
   * NEW: flags workflows that have an actor but never declared a
   * goal at all. Previously only mismatched goals were caught;
   * a completely missing goal silently passed the mismatch check
   * (it `continue`s whenever `workflow.goal` is falsy).
   */
  private checkWorkflowsMissingGoal(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    for (const workflow of workflows) {
      if (!workflow.actor) continue;
      if (this.hasText(workflow.goal)) continue;

      candidates.push({
        category: 'workflow-no-goal',
        score: 76,
        title: `"${workflow.name}" does not state what it's trying to achieve`,
        description:
          `The workflow "${workflow.name}" belongs to ${workflow.actor}, but declares no goal. Without a stated goal, it's unclear whether this workflow exists to serve a real actor need or was added without a clear purpose.`,
        severity: 'consider',
        relatedActor: workflow.actor,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `What outcome is "${workflow.name}" supposed to achieve for ${workflow.actor}?`,
      });
    }
  }

  private checkWorkflowsWithoutGoals(
    workflows: Workflow[],
    analysis: Analysis,
    candidates: CandidateChallenge[],
  ) {
    for (const workflow of workflows) {
      if (!workflow.actor || !workflow.goal) {
        continue;
      }

      const actorGoals = (
        analysis.actorGoals ?? []
      ).filter((goal) =>
        this.sameName(goal.actor, workflow.actor),
      );

      if (actorGoals.length === 0) continue;

      const workflowGoal = this.clean(
        workflow.goal,
      );

      const matches = actorGoals.some((goal) =>
        this.hasMeaningfulOverlap(
          workflowGoal,
          goal.goal,
        ),
      );

      if (matches) continue;

      candidates.push({
        category: 'workflow-goal-mismatch',
        score: 82,
        title: `"${workflow.name}" may not support its actor's stated goal`,
        description:
          `The workflow "${workflow.name}" belongs to ${workflow.actor} and declares the goal "${workflow.goal}", but that goal does not clearly match the goals defined for this actor in the product analysis. The workflow may be solving a different problem than the product analysis describes.`,
        severity: 'important',
        relatedActor: workflow.actor,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `What actor goal is "${workflow.name}" actually intended to complete?`,
      });
    }
  }

  private checkIncompleteWorkflows(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    for (const workflow of workflows) {
      const steps = workflow.steps ?? [];

      if (steps.length === 0) {
        candidates.push({
          category: 'empty-workflow',
          score: 93,
          title: `"${workflow.name}" has no workflow steps`,
          description:
            `The product defines "${workflow.name}" as a workflow, but there are no steps showing how the behaviour actually happens.`,
          severity: 'critical',
          relatedActor: workflow.actor ?? null,
          relatedWorkflow: workflow.name,
          suggestedQuestion:
            `What are the actual steps required to complete "${workflow.name}"?`,
        });

        continue;
      }

      const hasCompletion =
        this.hasText(workflow.completion);

      const lastStep =
        [...steps].sort(
          (a, b) => a.stepOrder - b.stepOrder,
        )[steps.length - 1];

      const lastStepText =
        this.getStepText(lastStep);

      if (
        !hasCompletion &&
        !this.containsAny(lastStepText, [
          'complete',
          'completed',
          'success',
          'successful',
          'done',
          'finish',
          'finished',
          'confirmed',
          'approved',
          'created',
        ])
      ) {
        candidates.push({
          category: 'workflow-completion',
          score: 79,
          title: `"${workflow.name}" does not clearly define completion`,
          description:
            `The workflow "${workflow.name}" has steps, but there is no clear completion condition and the final step does not clearly indicate what successful completion means.`,
          severity: 'important',
          relatedActor: workflow.actor ?? null,
          relatedWorkflow: workflow.name,
          suggestedQuestion:
            `What exact state tells the product that "${workflow.name}" has been successfully completed?`,
        });
      }
    }
  }

  /*
   * NEW: detects connections that reference a step id/title that
   * does not actually exist in the workflow. This was previously
   * unvalidated — a broken or orphaned connection was invisible.
   */
  private checkDanglingConnections(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    for (const workflow of workflows) {
      const steps = workflow.steps ?? [];
      const connections = workflow.connections ?? [];

      if (steps.length === 0 || connections.length === 0) {
        continue;
      }

      const stepIds = new Set(
        steps.map((step: any) => String(step.id)),
      );
      const stepTitles = new Set(
        steps.map((step: any) => this.clean(step.title)),
      );

      const isKnown = (ref: unknown) => {
        if (!this.hasText(ref as string)) return true; // nothing to validate
        return (
          stepIds.has(String(ref)) ||
          stepTitles.has(this.clean(ref as string))
        );
      };

      const broken = connections.filter(
        (connection: any) =>
          !isKnown(connection.from) || !isKnown(connection.to),
      );

      if (broken.length === 0) continue;

      candidates.push({
        category: 'broken-connection',
        score: 80,
        title: `"${workflow.name}" has a connection pointing to a step that doesn't exist`,
        description:
          `"${workflow.name}" has ${broken.length} connection${
            broken.length === 1 ? '' : 's'
          } referencing a step that isn't defined in the workflow. This usually means a step was renamed, removed, or the flow was never fully wired up, leaving a dead end or broken path.`,
        severity: 'important',
        relatedActor: workflow.actor ?? null,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `Which step should "${workflow.name}"'s broken connection actually point to?`,
      });
    }
  }

  private checkDecisionPaths(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    for (const workflow of workflows) {
      const steps = workflow.steps ?? [];
      const connections = workflow.connections ?? [];

      for (const step of steps) {
        const stepType =
          this.clean(step.type);

        const stepText =
          this.getStepText(step);

        const isDecision =
          stepType.includes('decision') ||
          stepType.includes('condition') ||
          this.containsAny(stepText, [
            'if ',
            'check',
            'verify',
            'eligible',
            'valid',
            'approved',
            'accepted',
            'available',
          ]);

        if (!isDecision) continue;

        const relatedConnections =
          connections.filter((connection) =>
            this.connectionMatchesStep(
              connection,
              step,
            ),
          );

        /*
         * It's not enough to have two connections leaving a
         * decision step — they need to actually lead somewhere
         * different (or be guarded by different conditions),
         * otherwise both "branches" collapse to the same outcome.
         */
        const distinctOutcomes = new Set(
          relatedConnections.map((connection: any) => {
            const target = this.clean(connection.to);
            const condition = this.clean(connection.condition);
            return `${target}::${condition}`;
          }),
        );

        if (
          relatedConnections.length >= 2 &&
          distinctOutcomes.size >= 2
        ) {
          continue;
        }

        candidates.push({
          category: 'decision-path',
          score: 87,
          title: `"${workflow.name}" has a decision without clear branches`,
          description:
            `A decision or validation point appears in "${workflow.name}", but the workflow does not clearly define both outcomes. The product therefore does not specify what happens when the condition passes versus when it fails.`,
          severity: 'important',
          relatedActor: workflow.actor ?? null,
          relatedWorkflow: workflow.name,
          suggestedQuestion:
            `What happens when this decision passes, and what happens when it fails?`,
        });
      }
    }
  }

  /*
   * =========================================================
   * FAILURE / RECOVERY
   * =========================================================
   */

  private checkFailurePaths(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const riskyWords = [
      'pay',
      'payment',
      'transfer',
      'withdraw',
      'deposit',
      'login',
      'register',
      'submit',
      'upload',
      'send',
      'verify',
      'approve',
      'create',
      'delete',
      'checkout',
      'book',
      'reserve',
      'publish',
    ];

    for (const workflow of workflows) {
      const steps = workflow.steps ?? [];

      for (const step of steps) {
        const text = this.getStepText(step);

        const risky = this.containsAny(
          text,
          riskyWords,
        );

        if (!risky) continue;

        const hasFailureConnection =
          (workflow.connections ?? []).some(
            (connection) =>
              this.connectionMatchesStep(
                connection,
                step,
              ) &&
              this.containsAny(
                connection.condition ?? '',
                [
                  'fail',
                  'failed',
                  'error',
                  'invalid',
                  'declined',
                  'rejected',
                  'denied',
                  'timeout',
                  'unavailable',
                ],
              ),
          );

        if (hasFailureConnection) continue;

        candidates.push({
          category: 'failure-path',
          score: 91,
          title: `"${workflow.name}" does not define what happens when a critical action fails`,
          description:
            `The workflow contains the critical action "${step.title}", but there is no clear failure path for cases such as rejection, validation failure, error, timeout, or unavailable resources. The happy path is defined, but the product behaviour when the action fails is not.`,
          severity: 'important',
          relatedActor: workflow.actor ?? null,
          relatedWorkflow: workflow.name,
          suggestedQuestion:
            `What should happen if "${step.title}" fails, is rejected, or times out?`,
        });

        break;
      }
    }
  }

  private checkRecoveryPaths(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const recoveryWords = [
      'retry',
      'recover',
      'restore',
      'reverse',
      'refund',
      'cancel',
      'undo',
      'resubmit',
      'reset',
      'appeal',
    ];

    for (const workflow of workflows) {
      const text = this.getWorkflowText(workflow);

      const hasFailure =
        this.containsAny(text, [
          'fail',
          'failed',
          'error',
          'declined',
          'rejected',
          'timeout',
        ]);

      if (!hasFailure) continue;

      const hasRecovery =
        this.containsAny(
          text,
          recoveryWords,
        );

      if (hasRecovery) continue;

      candidates.push({
        category: 'recovery-path',
        score: 83,
        title: `"${workflow.name}" has failure states without a recovery path`,
        description:
          `The workflow accounts for a failure or rejected state, but does not clearly explain how the user or system recovers from that state. A failed operation may therefore leave the product in an unresolved state.`,
        severity: 'important',
        relatedActor: workflow.actor ?? null,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `After the failure, can the actor retry, cancel, reverse, or otherwise recover?`,
      });
    }
  }

  /*
   * Rewritten to look for the state change at the step level
   * first, then check for a reversal path. Previously this
   * matched state words and reversal words anywhere in the
   * whole workflow's concatenated text, so a "cancel" mentioned
   * in a completely unrelated step would incorrectly clear a
   * flagged state change elsewhere in the same workflow.
   */
  private checkStateChangingWorkflows(
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const stateWords = [
      'pending',
      'approved',
      'rejected',
      'active',
      'inactive',
      'completed',
      'cancelled',
      'suspended',
      'verified',
      'blocked',
    ];

    const changeWords = [
      'approve',
      'reject',
      'activate',
      'deactivate',
      'complete',
      'cancel',
      'verify',
      'block',
      'suspend',
    ];

    const reversalWords = [
      'cancel',
      'reverse',
      'refund',
      'restore',
      'reactivate',
      'undo',
      'reject',
    ];

    for (const workflow of workflows) {
      const steps = workflow.steps ?? [];

      const stateChangingSteps = steps.filter((step: any) => {
        const stepText = this.getStepText(step);
        return (
          this.containsAny(stepText, stateWords) &&
          this.containsAny(stepText, changeWords)
        );
      });

      if (stateChangingSteps.length === 0) continue;

      const hasReversal =
        steps.some((step: any) =>
          this.containsAny(this.getStepText(step), reversalWords),
        ) ||
        (workflow.connections ?? []).some((connection: any) =>
          this.containsAny(connection.condition ?? '', reversalWords),
        );

      if (hasReversal) continue;

      const changedStepTitle =
        (stateChangingSteps[0] as any)?.title ?? 'this step';

      candidates.push({
        category: 'state-lifecycle',
        score: 72,
        title: `"${workflow.name}" changes state without a clear reversal path`,
        description:
          `The step "${changedStepTitle}" in "${workflow.name}" changes or establishes a durable state, but there is no obvious way to correct or reverse that state when the underlying action was wrong or later needs to be undone.`,
        severity: 'consider',
        relatedActor: workflow.actor ?? null,
        relatedWorkflow: workflow.name,
        suggestedQuestion:
          `What should happen if this state change needs to be corrected or reversed?`,
      });
    }
  }

  /*
   * =========================================================
   * CRITICAL ACTOR / PRODUCT GAPS
   * =========================================================
   */

  private checkCriticalActorGaps(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const people = analysis.people ?? [];

    for (const person of people) {
      const actorWorkflows = workflows.filter(
        (workflow) =>
          this.sameName(
            workflow.actor,
            person.name,
          ),
      );

      const responsibilities =
        person.responsibilities ?? [];

      const goals = (
        analysis.actorGoals ?? []
      ).filter((goal) =>
        this.sameName(
          goal.actor,
          person.name,
        ),
      );

      if (
        responsibilities.length === 0 &&
        goals.length === 0 &&
        actorWorkflows.length === 0
      ) {
        candidates.push({
          category: 'unused-actor',
          score: 68,
          title: `${person.name} is defined but has no product behaviour`,
          description:
            `${person.name} appears in the product analysis, but has no defined goals, responsibilities, or workflows. It is unclear why this actor exists in the product.`,
          severity: 'consider',
          relatedActor: person.name,
          relatedWorkflow: null,
          suggestedQuestion:
            `What does ${person.name} actually need to do in the product?`,
        });
      }
    }
  }

  private checkImportantProductAreasWithoutWorkflow(
    analysis: Analysis,
    workflows: Workflow[],
    candidates: CandidateChallenge[],
  ) {
    const areas = analysis.productAreas ?? [];

    for (const area of areas) {
      const areaName =
        typeof (area as any).name === 'string'
          ? (area as any).name
          : '';

      if (!areaName) continue;

      const covered = workflows.some((workflow) =>
        this.hasMeaningfulOverlap(
          areaName,
          this.getWorkflowText(workflow),
        ),
      );

      if (covered) continue;

      candidates.push({
        category: 'product-area',
        score: 74,
        title: `"${areaName}" has no clear workflow coverage`,
        description:
          `The product analysis identifies "${areaName}" as a product area, but the current workflows do not clearly represent behaviour in that area. This may indicate that an important part of the product has not been designed yet.`,
        severity: 'important',
        relatedActor: null,
        relatedWorkflow: null,
        suggestedQuestion:
          `What user or system workflow is responsible for "${areaName}"?`,
      });
    }
  }

  /*
   * =========================================================
   * SELECTION
   * =========================================================
   */

  private selectTopChallenges(
    candidates: CandidateChallenge[],
  ): GeneratedChallenge[] {
    const unique =
      this.removeDuplicateChallenges(candidates);

    const sorted = unique.sort(
      (a, b) => b.score - a.score,
    );

    /*
     * First pass: favour different problem categories.
     *
     * This prevents the final 4 from becoming:
     *
     * - payment failure
     * - payment retry
     * - payment recovery
     * - payment timeout
     *
     * when the product has completely different problems
     * elsewhere.
     */
    const selected: CandidateChallenge[] = [];
    const usedCategories = new Set<string>();

    for (const candidate of sorted) {
      if (selected.length >= this.MAX_CHALLENGES) {
        break;
      }

      if (usedCategories.has(candidate.category)) {
        continue;
      }

      selected.push(candidate);
      usedCategories.add(candidate.category);
    }

    /*
     * If we still have fewer than 4, fill remaining slots
     * with the strongest remaining genuine candidates.
     */
    if (selected.length < this.MAX_CHALLENGES) {
      for (const candidate of sorted) {
        if (selected.length >= this.MAX_CHALLENGES) {
          break;
        }

        if (selected.includes(candidate)) {
          continue;
        }

        selected.push(candidate);
      }
    }

    return selected.map(
      ({
        category: _category,
        score: _score,
        ...challenge
      }) => challenge,
    );
  }

  /*
   * =========================================================
   * DUPLICATION
   * =========================================================
   */

  private removeDuplicateChallenges(
    candidates: CandidateChallenge[],
  ): CandidateChallenge[] {
    const result: CandidateChallenge[] = [];

    for (const candidate of candidates) {
      const duplicate = result.some(
        (existing) => {
          if (
            existing.category !==
            candidate.category
          ) {
            return false;
          }

          const sameActor =
            this.sameName(
              existing.relatedActor,
              candidate.relatedActor,
            );

          const sameWorkflow =
            this.sameName(
              existing.relatedWorkflow,
              candidate.relatedWorkflow,
            );

          const similarTitle =
            this.hasMeaningfulOverlap(
              existing.title,
              candidate.title,
            );

          return (
            (sameActor || sameWorkflow) &&
            similarTitle
          );
        },
      );

      if (!duplicate) {
        result.push(candidate);
      }
    }

    return result;
  }

  /*
   * =========================================================
   * TEXT HELPERS
   * =========================================================
   */

  private getWorkflowText(
    workflow: Workflow,
  ): string {
    const parts: string[] = [];

    if (workflow.name) {
      parts.push(workflow.name);
    }

    if (workflow.description) {
      parts.push(workflow.description);
    }

    if (workflow.actor) {
      parts.push(workflow.actor);
    }

    if (workflow.goal) {
      parts.push(workflow.goal);
    }

    if (workflow.entryPoint) {
      parts.push(workflow.entryPoint);
    }

    if (workflow.completion) {
      parts.push(workflow.completion);
    }

    for (const step of workflow.steps ?? []) {
      parts.push(this.getStepText(step));
    }

    for (const connection of workflow.connections ??
      []) {
      if (connection.condition) {
        parts.push(connection.condition);
      }

      if (connection.from) {
        parts.push(connection.from);
      }

      if (connection.to) {
        parts.push(connection.to);
      }
    }

    for (const page of workflow.pages ?? []) {
      const pageAny = page as any;

      if (typeof pageAny.name === 'string') {
        parts.push(pageAny.name);
      }

      if (
        typeof pageAny.description === 'string'
      ) {
        parts.push(pageAny.description);
      }
    }

    return parts
      .filter(Boolean)
      .join(' ');
  }

  private getStepText(step: any): string {
    return [
      step?.title,
      step?.description,
      step?.type,
      step?.actor,
      step?.page,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getRelationshipText(
    relationship: any,
  ): string {
    if (!relationship) return '';

    return [
      relationship.name,
      relationship.from,
      relationship.to,
      relationship.source,
      relationship.target,
      relationship.type,
      relationship.description,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getEntityName(
    entity: any,
  ): string {
    if (!entity) return '';

    return (
      entity.name ??
      entity.entityName ??
      entity.label ??
      ''
    );
  }

  private extractQuestionText(
    question: any,
  ): string {
    if (!question) return '';

    return (
      question.question ??
      question.text ??
      question.title ??
      question.content ??
      ''
    );
  }

  /*
   * =========================================================
   * CONNECTION HELPERS
   * =========================================================
   */

  private connectionMatchesStep(
    connection: any,
    step: any,
  ): boolean {
    if (!connection || !step) {
      return false;
    }

    const stepId = String(step.id);
    const stepTitle = this.clean(step.title);

    return (
      String(connection.from) === stepId ||
      String(connection.to) === stepId ||
      this.clean(connection.from) === stepTitle ||
      this.clean(connection.to) === stepTitle
    );
  }

  /*
   * =========================================================
   * NAME / TEXT MATCHING
   * =========================================================
   */

  /*
   * Now also matches when one cleaned name fully contains the
   * other as a substring (e.g. "Admin" vs "System Admin",
   * "Customer" vs "End Customer"). Exact match is still tried
   * first and is the common case; the substring fallback only
   * kicks in for names of at least 3 characters to avoid noisy
   * matches on very short strings.
   */
  private sameName(
    first: string | null | undefined,
    second: string | null | undefined,
  ): boolean {
    if (!first || !second) return false;

    const a = this.clean(first);
    const b = this.clean(second);

    if (!a || !b) return false;

    if (a === b) return true;

    if (a.length < 3 || b.length < 3) return false;

    return a.includes(b) || b.includes(a);
  }

  private hasMeaningfulOverlap(
    first: string | null | undefined,
    second: string | null | undefined,
  ): boolean {
    if (!first || !second) return false;

    const firstWords =
      this.normaliseWords(first);

    const secondWords =
      this.normaliseWords(second);

    if (
      firstWords.length === 0 ||
      secondWords.length === 0
    ) {
      return false;
    }

    const overlap = this.countOverlap(
      firstWords,
      secondWords,
    );

    /*
     * One strong word is enough for a short phrase,
     * otherwise require at least two meaningful words.
     */
    if (
      firstWords.length <= 2 ||
      secondWords.length <= 2
    ) {
      return overlap >= 1;
    }

    return overlap >= 2;
  }

  private countOverlap(
    first: string[],
    second: string[],
  ): number {
    const secondSet = new Set(second);

    return first.filter((word) =>
      secondSet.has(word),
    ).length;
  }

  private normaliseWords(
    value: string,
  ): string[] {
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'to',
      'of',
      'for',
      'with',
      'on',
      'in',
      'at',
      'by',
      'is',
      'are',
      'be',
      'this',
      'that',
      'user',
      'users',
      'system',
      'product',
    ]);

    return this.clean(value)
      .split(/\s+/)
      .map((word) =>
        this.normaliseWord(word),
      )
      .filter(
        (word) =>
          word.length > 2 &&
          !stopWords.has(word),
      );
  }

  private normaliseWord(
    word: string,
  ): string {
    let result = word.toLowerCase();

    /*
     * Basic normalization so common variants such as:
     *
     * payment / payments
     * create / created / creating
     * approve / approved / approving
     *
     * have a better chance of matching.
     */
    if (result.endsWith('ies')) {
      result = `${result.slice(0, -3)}y`;
    } else if (
      result.endsWith('ing') &&
      result.length > 5
    ) {
      result = result.slice(0, -3);
    } else if (
      result.endsWith('ed') &&
      result.length > 4
    ) {
      result = result.slice(0, -2);
    } else if (
      result.endsWith('s') &&
      result.length > 4
    ) {
      result = result.slice(0, -1);
    }

    return result;
  }

  private clean(
    value: string | null | undefined,
  ): string {
    return String(value ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private hasText(
    value: string | null | undefined,
  ): boolean {
    return Boolean(
      value && value.trim().length > 0,
    );
  }

  private containsAny(
    value: string,
    words: string[],
  ): boolean {
    const normalised = this.clean(value);

    return words.some((word) =>
      normalised.includes(
        this.clean(word),
      ),
    );
  }

  private joinList(
    values: string[],
  ): string {
    const cleaned = values
      .map((value) => value.trim())
      .filter(Boolean);

    if (cleaned.length === 0) {
      return '';
    }

    if (cleaned.length === 1) {
      return `"${cleaned[0]}"`;
    }

    if (cleaned.length === 2) {
      return `"${cleaned[0]}" and "${cleaned[1]}"`;
    }

    return `${cleaned
      .slice(0, -1)
      .map((value) => `"${value}"`)
      .join(', ')}, and "${cleaned[cleaned.length - 1]}"`;
  }
}