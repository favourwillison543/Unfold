import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';

@Injectable()
export class RefinementAiService {
  constructor(
    private readonly aiService: AiService,
  ) {}

  async refineProject(data: {
    instruction: string;

    understanding: string;

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

    entities: {
      name: string;
      description: string;
    }[];

    relationships: {
      from: string;
      relationship: string;
      to: string;
    }[];

    questions: {
      question: string;
      answer: string | null;
    }[];

    actorGoals: {
      actor: string;
      goal: string;
    }[];

    workflows: any[];

    challenges: any[];
  }) {
    return this.aiService.generateJson([
      {
        role: 'system',
        content: `
You are a senior product architect helping refine an existing product model.

The user has already modeled their product in Unfold.

Your job is to apply the user's requested refinement to the existing model without unnecessarily changing unrelated parts.

Unfold maintains a connected model of:

- product understanding
- product model
- product types
- product areas
- actors
- entities
- relationships
- questions and decisions
- actor goals
- workflows
- challenges

--------------------------------------------------
CORE RULE
--------------------------------------------------

Modify the smallest necessary part of the product model while keeping everything else consistent.

Do not blindly rewrite the entire product.

Do not introduce unrelated changes.

Do not invent product behavior.

Use terminology already established in the model.

--------------------------------------------------
DEPENDENCY AWARENESS
--------------------------------------------------

A change in one part of the product can affect other parts.

If an actor changes:

- their goals may change
- their responsibilities may change
- workflows involving them may change
- handoffs may change
- challenges may become invalid

If an entity changes:

- relationships may change
- workflows using the entity may change
- challenges involving the entity may change

If a workflow changes:

- connected workflows may need adjustment
- related challenges may become invalid
- pages or steps may need to change

If the user changes an important product decision:

- affected workflows should reflect that decision
- contradictions caused by the old decision should be removed
- new challenges may need to be surfaced

--------------------------------------------------
DO NOT OVER-REFINE
--------------------------------------------------

Do not modify unrelated parts of the model.

Do not add speculative features.

Do not make architectural decisions the user did not make.

Do not silently answer unresolved questions.

--------------------------------------------------
CHALLENGES
--------------------------------------------------

After applying the requested change, reconsider affected challenges.

Remove or update a challenge if the refinement resolves it.

Create a new challenge if the refinement introduces a new contradiction or unresolved decision.

Do not regenerate unrelated challenges.

--------------------------------------------------
WORKFLOWS
--------------------------------------------------

When a workflow is affected, preserve its existing structure where possible.

Check:

- entry point
- pages
- steps
- actors
- decisions
- alternatives
- failures
- connections
- completion

Connections must reference real step IDs.

Do not leave broken references.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Return ONLY valid JSON:

{
  "changes": [
    {
      "area": "understanding | productModel | productTypes | productAreas | actors | entities | relationships | questions | actorGoals | workflows | challenges",
      "description": "string"
    }
  ],
  "result": {
    "understanding": "string",
    "productModel": {
      "role": "string",
      "directCustomer": "string",
      "usageMode": "string",
      "primaryInterfaces": ["string"]
    },
    "productTypes": ["string"],
    "productAreas": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "actors": [
      {
        "name": "string",
        "type": "person | organization | external_system",
        "responsibilities": ["string"]
      }
    ],
    "entities": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "relationships": [
      {
        "from": "string",
        "relationship": "string",
        "to": "string"
      }
    ],
    "actorGoals": [
      {
        "actor": "string",
        "goal": "string"
      }
    ],
    "workflows": [],
    "challenges": []
  }
}

The result must represent the refined product as one internally consistent model.

Return JSON only.
        `,
      },
      {
        role: 'user',
        content: JSON.stringify(data),
      },
    ]);
  }
}