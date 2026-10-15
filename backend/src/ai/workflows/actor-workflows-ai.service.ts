import { Injectable, Logger } from '@nestjs/common';

import { AiService } from '../ai.service';

export type GeneratedWorkflowStep = {
  id: string;
  title: string;
  type:
    | 'action'
    | 'decision'
    | 'alternative'
    | 'success'
    | 'failure';
  actor: string;
  page: string | null;
  description: string;
  stepOrder: number;
};

export type GeneratedWorkflowPage = {
  name: string;
  purpose: string;
};

export type GeneratedWorkflowConnection = {
  from: string;
  to: string;
  condition: string | null;
};

export type GeneratedWorkflow = {
  id: string;
  name: string;
  description: string;
  actor: string;
  goal: string;
  entryPoint: string;
  pages: GeneratedWorkflowPage[];
  steps: GeneratedWorkflowStep[];
  connections: GeneratedWorkflowConnection[];
  completion: string;
};

type GenerateActorWorkflowsInput = {
  understanding: string;

  productExperience: {
    coreProblem: string;
    primaryUser: string;
    productPurpose: string;
    productPromise: string;
    primaryOutcome: string;
    coreExperience: string;
    firstTimeJourney: string[];
    ongoingExperience: string[];
    importantDecisions: string[];
  };

  productAreas: {
    name: string;
    description?: string;
  }[];

  entities: {
    name: string;
    description: string;
  }[];

  relationships: {
    from: string;
    relationship: string;
    to: string;
  }[];

  answers?: {
    question: string;
    answer: string | null;
  }[];

  actor: {
    name: string;
    description: string;
    pages: {
      name: string;
      purpose: string;
      description: string;
    }[];
    capabilities: {
      name: string;
      description: string;
    }[];
  };

  otherActors: {
    name: string;
    goal?: string;
  }[];

  actorGoal?: string;
};

const VALID_STEP_TYPES = [
  'action',
  'decision',
  'alternative',
  'success',
  'failure',
] as const;

type ValidStepType = (typeof VALID_STEP_TYPES)[number];

const STEP_TYPE_ALIASES: Record<string, ValidStepType> = {
  validation: 'action',
  system: 'action',
  process: 'action',
  input: 'action',
  output: 'action',
};

/**
 * Production-conscious limits.
 *
 * One actor should produce one coherent journey.
 * This prevents the model from splitting one journey
 * into many shallow workflows.
 */
const MAX_WORKFLOWS = 1;
const MAX_STEPS_PER_WORKFLOW = 18;
const MAX_CONNECTIONS_PER_WORKFLOW = 30;

/**
 * Two attempts:
 *
 * 1. Normal generation
 * 2. One correction attempt
 */
const MAX_ATTEMPTS = 2;

const SYSTEM_PROMPT = `
You are Unfold's senior product architect.

Your job is to generate ONE meaningful product workflow for ONE selected
actor.

A workflow is not a page flow.

A workflow is not a list of capabilities.

A workflow is not a CRUD sequence.

A workflow is the actual product process through which an actor moves
from a meaningful starting condition toward a meaningful outcome.

==================================================
CORE PRINCIPLE
==================================================

UNDERSTAND THE PRODUCT EXPERIENCE BEFORE MODELING THE WORKFLOW.

The workflow must be derived in this order:

PRODUCT PURPOSE
→ CORE EXPERIENCE
→ ACTOR OUTCOME
→ JOURNEY
→ PRODUCT PROCESS
→ STEPS
→ PRODUCT SURFACES

NOT:

PAGES
→ CAPABILITIES
→ CLICKING
→ STEPS

The supplied pages and capabilities describe what may exist.

They do NOT determine what the workflow is.

==================================================
THE CENTRAL QUESTION
==================================================

Before generating any step, answer internally:

"What is this actor actually trying to accomplish in this product?"

Then:

"What does the actor need to go through for that outcome to happen?"

Then:

"What must the product do during that journey?"

Only then construct the steps.

If you cannot answer those questions from the supplied information,
do not invent an answer.

==================================================
PRODUCT EXPERIENCE
==================================================

The product experience is the highest-level source of truth.

Use:

- coreProblem
- primaryUser
- productPurpose
- productPromise
- primaryOutcome
- coreExperience
- firstTimeJourney
- ongoingExperience
- importantDecisions

The workflow should fit the product's actual experience.

Do not allow a secondary entity, page, capability, or industry pattern
to redefine the product.

Example:

If the product exists to help an emerging creator understand what to do
next in their career, a workflow such as:

Creator → open opportunities → view opportunity → apply

may be only one possible supporting process.

It is NOT automatically the core workflow.

The workflow must first reflect the actual actor outcome supported by
the product.

==================================================
ACTOR GOAL
==================================================

The actor goal is the immediate destination of this workflow.

The workflow must explain how the product helps the actor move toward
that goal.

Do not replace the supplied goal with a more familiar SaaS workflow.

Do not reduce the goal to a page or entity.

If the goal is:

"Make meaningful progress toward a chosen creator-career direction."

the workflow should reason about how the product helps the creator make
that progress.

It should not automatically become:

"Creator manages profile."

"Creator browses opportunities."

"Creator connects with manager."

unless those processes are actually supported by the supplied product
understanding.

==================================================
FIRST-TIME VS ONGOING EXPERIENCE
==================================================

Use the supplied product experience to determine whether the workflow
represents:

- first-time product use
- an ongoing recurring journey
- a specific important product process

Do not automatically assume the workflow starts at login or dashboard.

The real entry point may be:

- a creator describing their current situation
- a contribution becoming due
- a booking request being created
- a customer initiating an action
- an opportunity becoming relevant
- another meaningful product event

Login is not a workflow unless authentication itself is the meaningful
product process.

==================================================
WORKFLOW BOUNDARY
==================================================

Generate ONE coherent journey.

The journey should have:

1. meaningful starting condition
2. actor intention
3. meaningful product interaction
4. important product decisions or processing
5. relevant state changes
6. relevant handoffs
7. meaningful outcome

Do not combine unrelated journeys.

Do not create a workflow that simply visits every page.

Do not create a workflow that exists only because several capabilities
were supplied.

==================================================
PRODUCT LOGIC
==================================================

Use the supplied:

- product experience
- actor goal
- actors
- product areas
- entities
- relationships
- previous answers

to determine the actual process.

Entities are not automatically pages.

Relationships are not automatically actions.

Capabilities are not automatically workflow steps.

A capability tells you something the actor can accomplish.

The workflow explains the meaningful process surrounding that outcome.

==================================================
SYSTEM BEHAVIOUR
==================================================

System behaviour is part of the workflow even though the system is NOT
an actor.

For example:

Actor:
"Member"

Step:
"The member submits the contribution."

Next step:
"The product associates the payment with the member's contribution
obligation."

The second step represents system behaviour.

The schema requires every step to have a supplied actor, so use the
actor whose journey the system behaviour is advancing.

Do NOT turn system behaviour into a fake human action.

Never turn:

"The system matches the payment"

into:

"Member matches the payment."

The description must make it clear when the product performs the
behaviour.

==================================================
ACTORS
==================================================

The top-level workflow actor MUST be:

"${'${expectedActorName}'}"

Every step.actor MUST be one of the supplied actors.

Do not use:

- System
- system
- Application
- Platform
- Backend

for step.actor.

When a step represents system behaviour, use the relevant supplied actor
for the journey and make the description explicitly state the system
behaviour.

Other actors may appear only when the supplied product information
establishes a genuine interaction, handoff, approval, service, or
dependency involving them.

Do not invent actor responsibilities.

==================================================
PAGES AND PRODUCT SURFACES
==================================================

Pages are supporting infrastructure for the workflow.

Do NOT start by selecting pages.

First determine the business journey.

Then determine which product surfaces support it.

Existing pages may be reused.

A required surface may also be identified when the product logic clearly
requires one.

However:

Do not create a page simply because an entity exists.

Do not create a page simply because a capability exists.

Do not create Dashboard unless the journey genuinely begins there or
requires it.

Do not create Settings unless the workflow genuinely requires settings.

Do not create arbitrary pages to make the workflow look complete.

==================================================
TRIGGER
==================================================

The entryPoint must describe the real starting condition of the journey.

It should answer:

"What causes this workflow to begin?"

Examples:

- Creator begins defining their current career situation.
- Member's contribution becomes due.
- Customer initiates a booking request.
- Merchant receives a payment event.

Avoid:

- Login
- Dashboard
- Home page

unless those are genuinely the starting point of the product process.

==================================================
STEPS
==================================================

Generate only meaningful steps.

Allowed types:

- action
- decision
- alternative
- success
- failure

A step may represent:

- actor action
- meaningful system processing
- state change
- decision
- alternative path
- failure
- success
- handoff

Do NOT create steps for:

- clicking
- opening
- closing
- typing
- scrolling
- navigation
- loading
- cosmetic UI
- generic authentication

unless those events are themselves meaningful to the product outcome.

Aim for 5-18 meaningful steps.

Do not manufacture steps to reach five.

A short workflow is better than a padded workflow.

==================================================
STEP QUALITY
==================================================

Every step should answer:

"What meaningful thing happens here?"

Bad:

"Creator clicks Continue."

Good:

"Creator provides enough information about their current situation for
the product to establish their starting position."

Bad:

"System validates profile."

Good:

"The product evaluates the supplied information against the product's
known creator context."

Only use the stronger statement if supported by the product.

Do not invent hidden scoring, ranking, matching, or recommendation logic.

==================================================
DECISIONS
==================================================

Only create a decision when the decision materially changes the journey.

Use known answers as binding product decisions.

If a decision is unresolved, expose the unresolved state.

Do not silently invent an answer.

A decision should represent real product logic, not UI choice.

Bad:

"Does the user click Continue?"

Good:

"Is enough information available to determine the creator's current
starting position?"

Only use that decision if the product actually requires it.

==================================================
STATE CHANGES
==================================================

Important state changes should be represented when supported.

Examples:

- request becomes submitted
- contribution becomes recorded
- booking becomes confirmed
- creator profile becomes established
- workflow becomes completed

Do not invent state names that the product does not establish.

==================================================
HANDOFFS
==================================================

Include another actor only when the supplied product information supports
a genuine handoff.

Examples:

- creator → manager
- customer → provider
- member → administrator

Do not add handoffs simply because another actor exists.

==================================================
EDGE CASES
==================================================

Include only meaningful exceptions relevant to the actual journey.

Examples:

- required information is missing
- decision cannot be resolved
- payment cannot be matched
- requested resource is unavailable
- another actor must intervene

Do not add generic:

- server error
- network error
- invalid password
- session expired

unless authentication or infrastructure failure is genuinely part of the
product workflow.

==================================================
WORKFLOW COHERENCE TEST
==================================================

Before returning the workflow, mentally remove the pages and capabilities
from the input.

If the remaining workflow no longer makes sense, the workflow was probably
page-driven instead of product-driven.

Also verify:

1. The workflow directly serves the actor goal.
2. The journey fits the product purpose.
3. The starting point is meaningful.
4. Each step advances the journey.
5. The steps describe product logic rather than UI mechanics.
6. Important decisions are represented.
7. Relevant state changes are represented.
8. Handoffs are grounded.
9. The completion describes the actor's meaningful outcome.
10. No unsupported business rule was invented.
11. The workflow does not merely visit pages.
12. The workflow does not merely execute capabilities.
13. The workflow does not become a generic industry workflow.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Return exactly one workflow.

Structure:

{
  "workflows": [
    {
      "id": "meaningful-workflow-id",
      "name": "Meaningful product workflow",
      "description": "What this product journey accomplishes.",
      "actor": "Selected Actor",
      "goal": "The actor's meaningful outcome.",
      "entryPoint": "The real starting condition or product trigger.",
      "pages": [
        {
          "name": "Product surface",
          "purpose": "Why this surface is required by this journey."
        }
      ],
      "steps": [
        {
          "id": "step-1",
          "title": "Meaningful product event",
          "type": "action",
          "actor": "Selected Actor",
          "page": "Product surface or null",
          "description": "What meaningfully happens.",
          "stepOrder": 1
        }
      ],
      "connections": [
        {
          "from": "step-1",
          "to": "step-2",
          "condition": null
        }
      ],
      "completion": "The meaningful product outcome achieved by the actor."
    }
  ]
}
`;

@Injectable()
export class ActorWorkflowsAiService {
  private readonly logger = new Logger(
    ActorWorkflowsAiService.name,
  );

  constructor(
    private readonly aiService: AiService,
  ) {}

  async generateForActor(
    data: GenerateActorWorkflowsInput,
  ): Promise<GeneratedWorkflow[]> {
    const knownActorNames = new Set([
      data.actor.name,
      ...data.otherActors.map((actor) => actor.name),
    ]);

    const userPayload = JSON.stringify({
      productUnderstanding: data.understanding,

      productExperience: data.productExperience,

      productAreas: data.productAreas,

      entities: data.entities,

      relationships: data.relationships,

      previousAnswers: data.answers ?? [],

      actor: data.actor,

      actorGoal: data.actorGoal ?? null,

      otherActors: data.otherActors,
    });

    const baseUserMessage = `
Generate exactly ONE complete product workflow for ONLY this actor:

"${data.actor.name}"

The actor's goal is:

${data.actorGoal ?? data.actor.description}

The product's experience model is provided in the product context.

IMPORTANT:

Do not generate the workflow from the actor's pages or capabilities.

First understand:

1. Why the product exists.
2. What meaningful outcome this actor is trying to achieve.
3. What kind of journey the product is intended to provide.
4. What must happen for the actor to reach the goal.

Then construct the workflow.

Requirements:

- Return exactly one workflow.
- The workflow actor MUST be "${data.actor.name}".
- Do not create workflows for other actors.
- Build one coherent journey around the actor's actual goal.
- Do not start from Dashboard/Login unless genuinely required.
- Do not turn pages into workflows.
- Do not turn capabilities into workflows.
- Do not invent unsupported business rules.
- Previous answers are binding product decisions.
- Use the product experience as the highest-level source of truth.
- Use product entities and relationships to support the journey.
- Reuse supplied pages only when they materially support the journey.
- You MAY identify additional product surfaces when the product logic
  actually requires them.
- Do NOT invent arbitrary product surfaces.
- Use only supplied actors for step.actor.
- Never use System, Application, Platform, or Backend as an actor.
- Use only action, decision, alternative, success, or failure step types.
- Every connection must reference an existing step.
- Do not create self-referencing connections.
- The workflow must end in a meaningful actor outcome.
- Return ONLY valid JSON.

Product context:

${userPayload}
`;

    let lastError: Error | null = null;

    for (
      let attempt = 1;
      attempt <= MAX_ATTEMPTS;
      attempt++
    ) {
      try {
        const retryInstruction =
          attempt === 1
            ? baseUserMessage
            : `
Your previous workflow generation failed validation.

You must regenerate the COMPLETE JSON.

Validation error:

${lastError?.message}

Fix the validation error.

Do not merely patch the previous structure.

Re-evaluate the workflow against the product experience and actor goal.

CRITICAL:

- Return exactly ONE workflow.
- Workflow actor MUST be "${data.actor.name}".
- Do not create workflows for another actor.
- Do not start from a page simply because the page exists.
- Do not turn capabilities into workflow steps.
- entryPoint is REQUIRED.
- entryPoint must represent the real trigger or meaningful starting
  condition.
- Every step actor must be a supplied actor.
- Do not use System, Application, Platform, or Backend as an actor.
- Do not invent unsupported business rules.
- Previous answers remain binding.
- Expose unresolved product decisions instead of silently deciding them.
- Every connection must reference an existing step.
- Do not create self-referencing connections.
- The workflow must remain one coherent journey.
- The workflow must end in a meaningful outcome.
- Return ONLY valid JSON.

Original product context:

${userPayload}
`;

        const messages: {
          role: 'system' | 'user';
          content: string;
        }[] = [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: retryInstruction,
          },
        ];

        const response =
          await this.aiService.generateJson(messages);

        return this.validate(
          response,
          knownActorNames,
          data.actor.name,
        );
      } catch (error) {
        lastError =
          error instanceof Error
            ? error
            : new Error(String(error));

        this.logger.warn(
          `Actor "${data.actor.name}" workflow generation attempt ${attempt}/${MAX_ATTEMPTS} failed: ${lastError.message}`,
        );

        const errorMessage =
          lastError.message.toLowerCase();

        const isRateLimitError =
          errorMessage.includes('rate limit') ||
          errorMessage.includes('rate_limit') ||
          errorMessage.includes('too many requests') ||
          errorMessage.includes('tokens per minute') ||
          errorMessage.includes('429');

        /**
         * Never retry rate-limit failures.
         */
        if (isRateLimitError) {
          throw new Error(
            'AI generation is temporarily rate limited. Please try again shortly.',
          );
        }

        if (attempt === MAX_ATTEMPTS) {
          break;
        }
      }
    }

    throw new Error(
      `AI failed to generate a valid workflow for actor "${data.actor.name}" after ${MAX_ATTEMPTS} attempts: ${lastError?.message}`,
    );
  }

  private validate(
    response: unknown,
    knownActorNames: Set<string>,
    expectedActorName: string,
  ): GeneratedWorkflow[] {
    if (!response || typeof response !== 'object') {
      throw new Error(
        'AI returned an invalid workflow response.',
      );
    }

    const generated =
      response as {
        workflows?: unknown;
      };

    if (!Array.isArray(generated.workflows)) {
      throw new Error(
        'AI returned an invalid workflows array.',
      );
    }

    if (
      generated.workflows.length !==
      MAX_WORKFLOWS
    ) {
      throw new Error(
        `AI must return exactly ${MAX_WORKFLOWS} workflow.`,
      );
    }

    const workflowIds = new Set<string>();

    const workflows =
      generated.workflows as GeneratedWorkflow[];

    for (const workflow of workflows) {
      this.normalizeWorkflow(
        workflow,
        knownActorNames,
        expectedActorName,
      );

      if (workflowIds.has(workflow.id)) {
        throw new Error(
          `Duplicate workflow id "${workflow.id}".`,
        );
      }

      workflowIds.add(workflow.id);
    }

    return workflows;
  }

  private normalizeWorkflow(
    workflow: GeneratedWorkflow,
    knownActorNames: Set<string>,
    expectedActorName: string,
  ) {
    if (
      !workflow ||
      typeof workflow !== 'object'
    ) {
      throw new Error(
        'AI returned an invalid workflow.',
      );
    }

    if (
      typeof workflow.id !== 'string' ||
      workflow.id.trim() === ''
    ) {
      throw new Error(
        'Workflow is missing a valid id.',
      );
    }

    workflow.id = workflow.id.trim();

    if (
      typeof workflow.name !== 'string' ||
      workflow.name.trim() === ''
    ) {
      workflow.name =
        `${expectedActorName} workflow`;
    } else {
      workflow.name = workflow.name.trim();
    }

    if (
      typeof workflow.description !== 'string' ||
      workflow.description.trim() === ''
    ) {
      workflow.description =
        `A product workflow for ${expectedActorName}.`;
    } else {
      workflow.description =
        workflow.description.trim();
    }

    /**
     * This is a semantic check.
     *
     * Do not silently repair the actor because doing so can
     * turn incorrect product logic into apparently valid logic.
     */
    if (
      workflow.actor !== expectedActorName
    ) {
      throw new Error(
        `Workflow "${workflow.id}" has actor "${workflow.actor}" but this call was for "${expectedActorName}".`,
      );
    }

    workflow.actor = expectedActorName;

    if (
      typeof workflow.goal !== 'string' ||
      workflow.goal.trim() === ''
    ) {
      throw new Error(
        `Workflow "${workflow.id}" is missing a meaningful goal.`,
      );
    } else {
      workflow.goal = workflow.goal.trim();
    }

    // --------------------------------------------------
    // PAGES
    // --------------------------------------------------

    if (!Array.isArray(workflow.pages)) {
      workflow.pages = [];
    }

    const pages: GeneratedWorkflowPage[] = [];
    const pageNames = new Set<string>();

    for (const rawPage of workflow.pages) {
      if (
        !rawPage ||
        typeof rawPage !== 'object'
      ) {
        continue;
      }

      const page =
        rawPage as Partial<GeneratedWorkflowPage>;

      const name =
        typeof page.name === 'string'
          ? page.name.trim()
          : '';

      if (!name || pageNames.has(name)) {
        continue;
      }

      const purpose =
        typeof page.purpose === 'string' &&
        page.purpose.trim()
          ? page.purpose.trim()
          : 'Product surface required by this workflow.';

      pages.push({
        name,
        purpose,
      });

      pageNames.add(name);
    }

    workflow.pages = pages;

    // --------------------------------------------------
    // ENTRY POINT
    // --------------------------------------------------

    if (
      typeof workflow.entryPoint !== 'string' ||
      workflow.entryPoint.trim() === ''
    ) {
      throw new Error(
        `Workflow "${workflow.id}" is missing a valid entryPoint.`,
      );
    }

    workflow.entryPoint =
      workflow.entryPoint.trim();

    /**
     * entryPoint is allowed to describe a trigger that
     * is not literally a page.
     *
     * Do not automatically convert every entry point
     * into a page.
     */

    // --------------------------------------------------
    // STEPS
    // --------------------------------------------------

    if (!Array.isArray(workflow.steps)) {
      throw new Error(
        `Workflow "${workflow.id}" has no usable steps.`,
      );
    }

    const usableSteps =
      workflow.steps.filter(
        (step) =>
          step &&
          typeof step === 'object',
      );

    if (usableSteps.length === 0) {
      throw new Error(
        `Workflow "${workflow.id}" has no usable steps.`,
      );
    }

    if (
      usableSteps.length >
      MAX_STEPS_PER_WORKFLOW
    ) {
      throw new Error(
        `Workflow "${workflow.id}" exceeds the maximum of ${MAX_STEPS_PER_WORKFLOW} steps.`,
      );
    }

    workflow.steps = usableSteps;

    const stepIds = new Set<string>();

    workflow.steps.forEach(
      (rawStep, index) => {
        const step =
          rawStep as GeneratedWorkflowStep;

        if (
          typeof step.id !== 'string' ||
          step.id.trim() === ''
        ) {
          step.id = `step-${index + 1}`;
        } else {
          step.id = step.id.trim();
        }

        const originalId = step.id;

        let uniqueId = originalId;
        let suffix = 2;

        while (stepIds.has(uniqueId)) {
          uniqueId =
            `${originalId}-${suffix}`;
          suffix += 1;
        }

        step.id = uniqueId;

        stepIds.add(uniqueId);

        if (
          typeof step.title !== 'string' ||
          step.title.trim() === ''
        ) {
          throw new Error(
            `Workflow "${workflow.id}" has a step without a valid title.`,
          );
        }

        step.title = step.title.trim();

        if (
          typeof step.description !== 'string' ||
          step.description.trim() === ''
        ) {
          throw new Error(
            `Workflow "${workflow.id}" has a step without a valid description.`,
          );
        }

        step.description =
          step.description.trim();

        const rawType =
          typeof step.type === 'string'
            ? step.type.trim().toLowerCase()
            : '';

        const normalizedType =
          STEP_TYPE_ALIASES[rawType] ??
          (VALID_STEP_TYPES.includes(
            rawType as ValidStepType,
          )
            ? (rawType as ValidStepType)
            : null);

        if (!normalizedType) {
          throw new Error(
            `Workflow "${workflow.id}" has an invalid step type "${step.type}".`,
          );
        }

        step.type = normalizedType;

        /**
         * Do NOT silently convert invalid actors into the
         * selected actor.
         *
         * That can corrupt product semantics.
         */
        if (
          typeof step.actor !== 'string' ||
          !knownActorNames.has(step.actor)
        ) {
          throw new Error(
            `Workflow "${workflow.id}" contains an invalid step actor "${step.actor}".`,
          );
        }

        if (
          step.actor === 'System' ||
          step.actor === 'system' ||
          step.actor === 'Application' ||
          step.actor === 'Platform' ||
          step.actor === 'Backend'
        ) {
          throw new Error(
            `Workflow "${workflow.id}" contains unsupported system actor "${step.actor}".`,
          );
        }

        if (
          typeof step.page !== 'string' ||
          step.page.trim() === ''
        ) {
          step.page = null;
        } else {
          step.page = step.page.trim();

          if (!pageNames.has(step.page)) {
            workflow.pages.push({
              name: step.page,
              purpose:
                'Product surface required by this workflow step.',
            });

            pageNames.add(step.page);
          }
        }

        /**
         * The array order is the intended workflow order.
         * Normalize stepOrder rather than trusting AI numbering.
         */
        step.stepOrder = index + 1;
      },
    );

    // --------------------------------------------------
    // CONNECTIONS
    // --------------------------------------------------

    if (!Array.isArray(workflow.connections)) {
      throw new Error(
        `Workflow "${workflow.id}" has no connections.`,
      );
    }

    const validConnections: GeneratedWorkflowConnection[] =
      [];

    const seenConnections =
      new Set<string>();

    for (const rawConnection of workflow.connections) {
      if (
        !rawConnection ||
        typeof rawConnection !== 'object'
      ) {
        continue;
      }

      const connection =
        rawConnection as GeneratedWorkflowConnection;

      if (
        typeof connection.from !== 'string' ||
        typeof connection.to !== 'string'
      ) {
        continue;
      }

      const from =
        connection.from.trim();

      const to =
        connection.to.trim();

      if (
        !stepIds.has(from) ||
        !stepIds.has(to) ||
        from === to
      ) {
        continue;
      }

      const key = `${from}->${to}`;

      if (seenConnections.has(key)) {
        continue;
      }

      seenConnections.add(key);

      validConnections.push({
        from,
        to,
        condition:
          typeof connection.condition === 'string' &&
          connection.condition.trim() !== ''
            ? connection.condition.trim()
            : null,
      });

      if (
        validConnections.length >=
        MAX_CONNECTIONS_PER_WORKFLOW
      ) {
        break;
      }
    }

    /**
     * Do not manufacture a sequential journey when the AI
     * failed to provide valid connections.
     *
     * A fake connection can make semantically broken output
     * appear valid.
     */
    if (
      workflow.steps.length > 1 &&
      validConnections.length === 0
    ) {
      throw new Error(
        `Workflow "${workflow.id}" contains no valid connections.`,
      );
    }

    workflow.connections =
      validConnections;

    // --------------------------------------------------
    // COMPLETION
    // --------------------------------------------------

    if (
      typeof workflow.completion !== 'string' ||
      workflow.completion.trim() === ''
    ) {
      const successStep =
        [...workflow.steps]
          .reverse()
          .find(
            (step) =>
              step.type === 'success',
          );

      if (
        successStep?.description?.trim()
      ) {
        workflow.completion =
          successStep.description.trim();
      } else {
        throw new Error(
          `Workflow "${workflow.id}" is missing a meaningful completion outcome.`,
        );
      }
    } else {
      workflow.completion =
        workflow.completion.trim();
    }
  }
}