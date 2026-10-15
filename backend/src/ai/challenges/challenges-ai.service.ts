import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { AiService } from '../ai.service';

@Injectable()
export class ChallengesAiService {
  private readonly logger =
    new Logger(ChallengesAiService.name);

  private readonly MAX_ATTEMPTS = 3;
  private readonly TOTAL_TIMEOUT_MS = 30_000;
  private readonly RETRY_DELAY_MS = 4_000;

  constructor(
    private readonly aiService: AiService,
  ) {}

  async generateChallenges(data: any) {
    const startTime = Date.now();

    let lastError: unknown = null;

    for (
      let attempt = 1;
      attempt <= this.MAX_ATTEMPTS;
      attempt++
    ) {
      const elapsed = Date.now() - startTime;
      const remainingTime =
        this.TOTAL_TIMEOUT_MS - elapsed;

      if (remainingTime <= 0) {
        break;
      }

      try {
        const result =
          await this.generateSingleChallenge(
            data,
            remainingTime,
          );

        if (
          result?.challenges &&
          Array.isArray(result.challenges) &&
          result.challenges.length > 0
        ) {
          const challenge =
            result.challenges[0];

          if (this.isValidChallenge(challenge)) {
            return {
              challenges: [challenge],
            };
          }
        }

        lastError = new Error(
          'AI returned no valid challenge',
        );

        this.logger.warn(
          `Challenge attempt ${attempt} returned no valid challenge`,
        );
      } catch (error) {
        lastError = error;

        this.logger.warn(
          `Challenge attempt ${attempt} failed`,
        );
      }

      if (
        attempt < this.MAX_ATTEMPTS
      ) {
        const elapsedAfterAttempt =
          Date.now() - startTime;

        const remainingAfterAttempt =
          this.TOTAL_TIMEOUT_MS -
          elapsedAfterAttempt;

        if (
          remainingAfterAttempt <= 0
        ) {
          break;
        }

        const delay = Math.min(
          this.RETRY_DELAY_MS,
          remainingAfterAttempt,
        );

        await this.sleep(delay);
      }
    }

    if (lastError) {
      this.logger.warn(
        'Challenge generation ended without a valid challenge',
      );
    }

    return {
      challenges: [],
    };
  }

  private async generateSingleChallenge(
    data: any,
    timeoutMs: number,
  ) {
    const aiPromise =
      this.aiService.generateJson([
        {
          role: 'system',
          content: `
You are a senior product architect reviewing a product model.

Your job is to find the SINGLE most important edge case, gap, contradiction, or missing decision that the product creator has not properly considered.

Do not generate generic product advice.

Do not invent features, actors, entities, workflows, or behavior.

Only identify problems that are grounded in the information provided.

--------------------------------------------------
WHAT YOU MUST REVIEW
--------------------------------------------------

Review the entire product model:

- product understanding
- product model
- product types
- product areas
- actors
- actor responsibilities
- actor goals
- entities
- relationships
- questions and answers
- workflows
- workflow pages
- workflow steps
- decisions
- alternative paths
- failure paths
- completion states
- connections between workflows
- cross-actor handoffs
- external systems
- ownership and permissions
- entity lifecycle
- state changes
- navigation and page gaps
- unanswered questions
- contradictions
- duplicated or conflicting behavior

Think about the product as one connected system.

--------------------------------------------------
YOUR JOB
--------------------------------------------------

Find the ONE highest-value thing that appears to be missing, unclear, contradictory, or dangerous.

Prioritize problems such as:

1. A central workflow cannot be completed correctly.
2. An important decision has no clear outcome.
3. A failure path is missing.
4. Ownership of an important entity is unclear.
5. Permissions between actors are unclear.
6. An entity changes state but the rest of the product does not account for it.
7. Two workflows make conflicting assumptions.
8. Two actors have conflicting responsibilities.
9. An important handoff between actors or systems is unclear.
10. A required page or product area is missing from a workflow.
11. An important question remains unanswered.
12. A meaningful edge case is implied by the existing model but has not been handled.

Do not create a challenge simply because something could theoretically exist.

The challenge must be grounded in the provided product model.

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Return EXACTLY ONE challenge.

Do not return multiple challenges.

Do not list minor issues.

Do not provide general recommendations.

Do not solve the problem.

Surface the decision the product creator needs to make.

A strong challenge should make the product creator think:

"I had not considered that."

--------------------------------------------------
CHALLENGE QUALITY
--------------------------------------------------

The challenge must clearly explain:

- What is unclear or missing?
- Where does it appear in the product model?
- Why does it matter?
- What decision needs to be made?

--------------------------------------------------
SEVERITY
--------------------------------------------------

Use only:

critical
- central product flow cannot work correctly
- major contradiction
- major ownership or permission ambiguity
- important workflow cannot be completed

important
- meaningful gap likely to cause incorrect or incomplete implementation
- important workflow or entity behavior is unclear

consider
- lower-impact ambiguity worth deciding before implementation

Do not artificially increase severity.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Return ONLY valid JSON.

{
  "challenges": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "severity": "critical | important | consider",
      "category": "string",
      "relatedActor": "string | null",
      "relatedWorkflow": "string | null",
      "relatedEntities": ["string"],
      "relatedAreas": ["string"],
      "evidence": [
        {
          "source": "string",
          "detail": "string"
        }
      ],
      "suggestedQuestion": "string | null"
    }
  ]
}

Return JSON only.
          `,
        },
        {
          role: 'user',
          content: JSON.stringify(data),
        },
      ]);

    return Promise.race([
      aiPromise,
      this.timeout(timeoutMs),
    ]);
  }

  private isValidChallenge(
    challenge: any,
  ): boolean {
    if (!challenge) {
      return false;
    }

    if (
      typeof challenge.title !==
        'string' ||
      !challenge.title.trim()
    ) {
      return false;
    }

    if (
      typeof challenge.description !==
        'string' ||
      !challenge.description.trim()
    ) {
      return false;
    }

    if (
      ![
        'critical',
        'important',
        'consider',
      ].includes(challenge.severity)
    ) {
      return false;
    }

    return true;
  }

  private timeout(
    timeoutMs: number,
  ): Promise<never> {
    return new Promise(
      (_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              'Challenge AI generation timed out',
            ),
          );
        }, timeoutMs);
      },
    );
  }

  private sleep(
    ms: number,
  ): Promise<void> {
    return new Promise(
      (resolve) =>
        setTimeout(resolve, ms),
    );
  }
}