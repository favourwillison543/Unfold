import { Injectable, Logger } from '@nestjs/common';

import { AiService } from '../ai.service';

export type GeneratedPage = {
  name: string;
  purpose: string;
  description: string;
};

export type GeneratedCapability = {
  name: string;
  description: string;
};

export type GeneratedActorStructure = {
  name: string;
  description: string;
  pages: GeneratedPage[];
  capabilities: GeneratedCapability[];
};

export type GeneratedPublicFlow = {
  pages: GeneratedPage[];
};

export type GeneratedProductStructure = {
  publicFlow: GeneratedPublicFlow;
  actors: GeneratedActorStructure[];
};

type GenerateStructureInput = {
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

  productModel: {
    role: string;
    directCustomer: string;
    usageMode: string;
    primaryInterfaces: string[];
  };

  productTypes: string[];

  productAreas: {
    name: string;
    description?: string;
  }[];

  actors: {
    name: string;
    type: string;
    responsibilities: string[];
  }[];

  actorGoals?: {
    actor: string;
    goals?: {
      id: string;
      goal: string;
    }[];
    goal?: string;
  }[];

  uncertainties?: {
    topic: string;
    description: string;
    whyItMatters: string;
  }[];

  answers?: {
    question: string;
    answer: string | null;
  }[];
};

/**
 * Hard caps — enforced in code, not just suggested in the prompt.
 */
const MAX_ACTORS = 8;
const MAX_PAGES_PER_ACTOR = 8;
const MAX_CAPABILITIES_PER_ACTOR = 10;
const MAX_PUBLIC_PAGES = 8;
const MAX_ATTEMPTS = 3;

const SYSTEM_PROMPT = `
You are Unfold's senior product architect.

Your job is ONLY to produce the PRODUCT STRUCTURE.

The product structure defines:

1. The public entry flow.
2. The actors who use or operate the product.
3. The important application pages/areas available to each actor.
4. The meaningful capabilities each actor can perform.

Do NOT generate detailed workflows or step-by-step journeys.

Workflows are generated separately after this structure exists.

==================================================
PRODUCT EXPERIENCE COMES FIRST
==================================================

The product experience is the highest-level source of truth.

Use it to determine what structure is actually necessary.

The structure exists to support the product experience.

Before generating pages or capabilities, determine:

- what problem the product solves
- who primarily experiences that problem
- what meaningful outcome the product is intended to create
- what the product promises
- what the core experience is
- what the first-time journey requires
- what the ongoing experience requires
- what important product decisions have already been made

Do NOT allow the structural model to redefine the product.

Do not create a page merely because an entity exists.

Do not create a capability merely because an actor responsibility exists.

Do not create Dashboard merely because this is a SaaS product.

Do not create CRUD pages for every entity.

The structure should support the actual product journey.

==================================================
IMPORTANT DISTINCTION
==================================================

A PAGE represents a meaningful product destination or major application
area.

A CAPABILITY represents something meaningful an actor can accomplish.

Do NOT treat small UI elements as pages or capabilities.

Bad pages:

- Add Customer Button
- Search Modal
- Profile Dropdown
- Confirmation Dialog
- Navigation Menu

Bad capabilities:

- Click button
- Open menu
- Navigate to page
- Enter text
- Submit form

Good pages:

- Landing
- Sign Up
- Login
- Dashboard
- Customers
- Transactions
- Developer
- Reports
- Settings

Good capabilities:

- Add customer
- View customer accounts
- Review transactions
- Generate API credentials
- View reports
- Manage team members
- Update business information

==================================================
PUBLIC FLOW
==================================================

The public flow contains pages the user encounters before reaching the
main authenticated product.

Include only pages supported by the product.

Examples may include:

- Landing
- Sign Up
- Login
- Onboarding
- Pricing
- Documentation
- Public marketplace

Do NOT force these pages into every product.

For example, if the product does not have public pricing, do not create
a Pricing page.

Maximum ${MAX_PUBLIC_PAGES} public pages.

The public flow should describe the actual entry into the product.

==================================================
ACTORS
==================================================

Use the actors already identified in the input.

Do not invent unrelated actors.

An actor is a meaningful role interacting with the product.

Examples:

- Business
- Customer
- Developer
- Admin
- Merchant
- Instructor
- Student
- Doctor
- Patient
- Operations Manager

Maximum ${MAX_ACTORS} actors.

The actor's description should explain their role in the product in
1–2 short sentences.

==================================================
ACTOR PAGES
==================================================

For each actor, identify the important pages or major areas they actually
use.

Maximum ${MAX_PAGES_PER_ACTOR} pages per actor.

Pages should reflect the actual product described in the input.

Infer pages from:

- product experience
- product understanding
- product areas
- entities
- relationships
- actor responsibilities
- actor goals
- previous answers

Do not blindly copy familiar SaaS structures.

==================================================
IMPORTANT: DASHBOARDS AND MAJOR AREAS
==================================================

A major application page should represent a meaningful area of the
product.

Dashboard may be appropriate when the actor genuinely needs an overview
of their product state.

But do NOT create Dashboard simply because most SaaS products have one.

Do NOT create every Dashboard section as a separate page unless the
section is actually a distinct product destination.

For example:

Dashboard
Customers
Transactions
Reports
Settings

is preferable to:

Dashboard
Customer Summary Card
Transaction Card
Revenue Card
Customer Button
Transaction Table

The workflow generator will later explain the meaningful product process.

==================================================
CAPABILITIES
==================================================

Capabilities describe meaningful things the actor can accomplish.

Maximum ${MAX_CAPABILITIES_PER_ACTOR} capabilities per actor.

Capabilities should be based on actual product behavior.

Examples:

- Add customer
- Create project
- Assign task
- Review transactions
- Generate API credentials
- Export report
- Manage team members
- Update business information

Do NOT turn every small action into a capability.

Avoid:

- Click Add
- Open Customers
- View Dashboard
- Navigate to Settings
- Click Save

==================================================
GOALS
==================================================

Actor goals describe meaningful outcomes.

Use them to understand what the actor needs the product structure to
support.

Do NOT simply turn a goal into a page.

For example:

Goal:
"Make meaningful progress toward a chosen creator-career direction."

Do NOT automatically create:

"Career Progress"

as a page.

Instead determine what product areas actually need to exist to support
that outcome.

Likewise, do not turn:

"Identify relevant opportunities"

into a generic Opportunities page unless the product understanding
actually establishes opportunities as a meaningful product area.

==================================================
PRODUCT-SPECIFIC REASONING
==================================================

Use the supplied product information to understand what the product
actually is.

Prioritize concrete product behavior over generic SaaS assumptions.

Use:

- product experience
- product understanding
- product model
- product types
- product areas
- actors
- actor responsibilities
- actor goals
- uncertainties
- previous answers

to determine the structure.

Do not invent:

- unsupported pages
- unsupported capabilities
- unsupported integrations
- unsupported permissions
- unsupported financial behavior
- unsupported business rules
- unsupported actors

If the input clearly describes a relationship between two parts of the
product, preserve it.

==================================================
PRODUCT STRUCTURE VS WORKFLOW
==================================================

Do NOT put workflow steps into this response.

For example, do NOT return:

"Business logs in and opens Customers."

Instead return the structure:

Page:

"Customers"

Capability:

"Add customer"

The workflow generator will later turn those structures into a meaningful
journey.

==================================================
STRUCTURE SHOULD SUPPORT THE CORE EXPERIENCE
==================================================

Think about the product's structure as infrastructure for the experience.

If the core experience requires the actor to:

- establish their current state
- make an important decision
- receive a product outcome
- take an action
- monitor progress
- return later

then the structure should contain the meaningful surfaces necessary to
support those activities.

Do not automatically translate each activity into a page.

A meaningful experience can happen inside one page, across several pages,
or through an API/process.

Choose the structure that best fits the supplied product information.

==================================================
GENERALIZATION
==================================================

The structure must work for many different product types.

For example:

A fintech product might have:

Dashboard
Customers
Transactions
Developer
Reports
Settings

A project management product might have:

Workspace
Projects
Project Details
Tasks
Team
Automations
Reports
Settings

A healthcare product might have:

Dashboard
Patients
Appointments
Medical Records
Prescriptions
Reports
Settings

Do not copy these examples automatically.

Infer the correct structure from the actual product input.

==================================================
QUALITY BAR
==================================================

The resulting structure should answer:

"What actually exists in this product?"

It should give the later workflow generator enough information to
understand:

- where meaningful product activity can occur
- what the actor can accomplish
- what product areas support the actor's goals

Do not make the structure too shallow.

Do not make it an exhaustive technical specification.

Keep descriptions concise.

Every "description" and "purpose" field should be 1–2 short sentences.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

No markdown.

No code fences.

No explanation.

{
  "publicFlow": {
    "pages": [
      {
        "name": "Landing",
        "purpose": "Introduce the product and provide the main entry points.",
        "description": "The public starting point for users before entering the application."
      }
    ]
  },
  "actors": [
    {
      "name": "Business",
      "description": "The business uses the platform to manage its customers and financial operations.",
      "pages": [
        {
          "name": "Dashboard",
          "purpose": "Provide an overview of the business and its current activity.",
          "description": "The main application area where the business reviews important information and enters core product areas."
        }
      ],
      "capabilities": [
        {
          "name": "Add customer",
          "description": "Create a customer and initiate the account creation behavior supported by the product."
        }
      ]
    }
  ]
}
`;

@Injectable()
export class ProductStructureAiService {
  private readonly logger = new Logger(
    ProductStructureAiService.name,
  );

  constructor(
    private readonly aiService: AiService,
  ) {}

  async generateStructure(
    data: GenerateStructureInput,
  ): Promise<GeneratedProductStructure> {
    /**
     * Keep the payload compact.
     *
     * Pretty-printing adds unnecessary whitespace/tokens without
     * adding any information for the AI.
     */
    const userPayload = JSON.stringify({
      productUnderstanding: data.understanding,

      productExperience: data.productExperience,

      productModel: data.productModel,

      productTypes: data.productTypes,

      productAreas: data.productAreas,

      actors: data.actors,

      actorGoals: data.actorGoals ?? [],

      uncertainties: data.uncertainties ?? [],

      previousAnswers: data.answers ?? [],
    });

    let lastError: Error | null = null;

    for (
      let attempt = 1;
      attempt <= MAX_ATTEMPTS;
      attempt++
    ) {
      try {
        /**
         * Create a fresh message array on every attempt.
         *
         * Retry messages should not accumulate and make the
         * request larger on each retry.
         */
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
            content:
              attempt === 1
                ? `
Generate the product structure from the following product information.

The product experience is the highest-level source of truth.

Do not generate workflows.

Do not invent structure simply because a familiar product type normally
contains certain pages.

Product input:

${userPayload}

Return ONLY valid JSON.
`
                : `
Your previous response was invalid.

Validation error:

${lastError?.message}

Return the corrected FULL JSON again.

Important:

- Follow the exact requested structure.
- Keep the structure grounded in the supplied product experience.
- Do not invent unsupported pages.
- Do not invent unsupported capabilities.
- Do not invent actors.
- Do not turn workflow steps into capabilities.
- Do not turn entities into pages automatically.
- Return ONLY valid JSON.
- Do not include markdown or explanation.

Original product input:

${userPayload}
`,
          },
        ];

        const response =
          await this.aiService.generateJson(
            messages,
          );

        return this.validate(response);
      } catch (error) {
        lastError =
          error instanceof Error
            ? error
            : new Error(String(error));

        this.logger.warn(
          `Structure generation attempt ${attempt}/${MAX_ATTEMPTS} failed: ${lastError.message}`,
        );

        if (attempt === MAX_ATTEMPTS) {
          break;
        }
      }
    }

    throw new Error(
      `AI failed to generate a valid product structure after ${MAX_ATTEMPTS} attempts: ${lastError?.message}`,
    );
  }

  private validate(
    response: unknown,
  ): GeneratedProductStructure {
    if (
      !response ||
      typeof response !== 'object'
    ) {
      throw new Error(
        'AI returned an invalid structure response.',
      );
    }

    const generated =
      response as Partial<GeneratedProductStructure>;

    // ---------------------------------------------
    // PUBLIC FLOW
    // ---------------------------------------------

    if (
      !generated.publicFlow ||
      !Array.isArray(
        generated.publicFlow.pages,
      )
    ) {
      throw new Error(
        'AI returned an invalid public flow.',
      );
    }

    if (
      generated.publicFlow.pages.length >
      MAX_PUBLIC_PAGES
    ) {
      throw new Error(
        `Public flow exceeds the maximum of ${MAX_PUBLIC_PAGES} pages.`,
      );
    }

    const publicPageNames =
      new Set<string>();

    generated.publicFlow.pages.forEach(
      (page, index) => {
        this.validatePage(
          page,
          `publicFlow.pages[${index}]`,
        );

        if (
          publicPageNames.has(page.name)
        ) {
          throw new Error(
            `Public flow has duplicate page "${page.name}".`,
          );
        }

        publicPageNames.add(page.name);
      },
    );

    // ---------------------------------------------
    // ACTORS
    // ---------------------------------------------

    if (
      !Array.isArray(generated.actors) ||
      generated.actors.length === 0
    ) {
      throw new Error(
        'AI returned an invalid or empty actor list.',
      );
    }

    if (
      generated.actors.length >
      MAX_ACTORS
    ) {
      throw new Error(
        `Response exceeds the maximum of ${MAX_ACTORS} actors.`,
      );
    }

    const actorNames =
      new Set<string>();

    for (const actor of generated.actors) {
      if (
        !actor ||
        typeof actor.name !== 'string' ||
        actor.name.trim() === '' ||
        typeof actor.description !== 'string'
      ) {
        throw new Error(
          'AI returned an actor with invalid identity.',
        );
      }

      actor.name = actor.name.trim();
      actor.description =
        actor.description.trim();

      if (
        actorNames.has(actor.name)
      ) {
        throw new Error(
          `Duplicate actor "${actor.name}".`,
        );
      }

      actorNames.add(actor.name);

      // ---------------------------------------------
      // ACTOR PAGES
      // ---------------------------------------------

      if (!Array.isArray(actor.pages)) {
        throw new Error(
          `Actor "${actor.name}" has invalid pages.`,
        );
      }

      if (
        actor.pages.length >
        MAX_PAGES_PER_ACTOR
      ) {
        throw new Error(
          `Actor "${actor.name}" exceeds the maximum of ${MAX_PAGES_PER_ACTOR} pages.`,
        );
      }

      const pageNames =
        new Set<string>();

      actor.pages.forEach(
        (page, index) => {
          this.validatePage(
            page,
            `actor "${actor.name}".pages[${index}]`,
          );

          page.name = page.name.trim();
          page.purpose =
            page.purpose.trim();
          page.description =
            page.description.trim();

          if (
            pageNames.has(page.name)
          ) {
            throw new Error(
              `Actor "${actor.name}" has duplicate page "${page.name}".`,
            );
          }

          pageNames.add(page.name);
        },
      );

      // ---------------------------------------------
      // ACTOR CAPABILITIES
      // ---------------------------------------------

      if (
        !Array.isArray(actor.capabilities)
      ) {
        throw new Error(
          `Actor "${actor.name}" has invalid capabilities.`,
        );
      }

      if (
        actor.capabilities.length >
        MAX_CAPABILITIES_PER_ACTOR
      ) {
        throw new Error(
          `Actor "${actor.name}" exceeds the maximum of ${MAX_CAPABILITIES_PER_ACTOR} capabilities.`,
        );
      }

      const capabilityNames =
        new Set<string>();

      actor.capabilities.forEach(
        (capability, index) => {
          if (
            !capability ||
            typeof capability.name !==
              'string' ||
            capability.name.trim() === '' ||
            typeof capability.description !==
              'string'
          ) {
            throw new Error(
              `Actor "${actor.name}" has an invalid capability at index ${index}.`,
            );
          }

          capability.name =
            capability.name.trim();

          capability.description =
            capability.description.trim();

          if (
            capabilityNames.has(
              capability.name,
            )
          ) {
            throw new Error(
              `Actor "${actor.name}" has duplicate capability "${capability.name}".`,
            );
          }

          capabilityNames.add(
            capability.name,
          );
        },
      );
    }

    return generated as GeneratedProductStructure;
  }

  private validatePage(
    page: unknown,
    context: string,
  ) {
    if (
      !page ||
      typeof page !== 'object'
    ) {
      throw new Error(
        `${context} is not a valid page object.`,
      );
    }

    const p =
      page as Partial<GeneratedPage>;

    if (
      typeof p.name !== 'string' ||
      p.name.trim() === ''
    ) {
      throw new Error(
        `${context} is missing a valid "name".`,
      );
    }

    if (
      typeof p.purpose !== 'string' ||
      p.purpose.trim() === ''
    ) {
      throw new Error(
        `${context} is missing a valid "purpose".`,
      );
    }

    if (
      typeof p.description !== 'string' ||
      p.description.trim() === ''
    ) {
      throw new Error(
        `${context} is missing a valid "description".`,
      );
    }
  }
}