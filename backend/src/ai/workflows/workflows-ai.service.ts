// import { Injectable, Logger } from '@nestjs/common';
// import { AiService } from '../ai.service';

// type GeneratedWorkflowStep = {
//   id: string;
//   title: string;
//   type: 'action' | 'decision' | 'alternative' | 'success' | 'failure';
//   actor: string;
//   page: string | null;
//   description: string;
//   stepOrder: number;
// };

// type GeneratedWorkflowPage = {
//   name: string;
//   purpose: string;
// };

// type GeneratedWorkflowConnection = {
//   from: string;
//   to: string;
//   condition: string | null;
// };

// export type GeneratedWorkflow = {
//   id: string;
//   name: string;
//   description: string;
//   actor: string;
//   goal: string;
//   entryPoint: string;
//   pages: GeneratedWorkflowPage[];
//   steps: GeneratedWorkflowStep[];
//   connections: GeneratedWorkflowConnection[];
//   completion: string;
// };

// type GeneratedActorPage = {
//   name: string;
//   purpose: string;
//   description: string;
// };

// type GeneratedActorCapability = {
//   name: string;
//   description: string;
// };

// export type GeneratedActor = {
//   name: string;
//   description: string;
//   pages: GeneratedActorPage[];
//   capabilities: GeneratedActorCapability[];
//   workflows: GeneratedWorkflow[];
// };

// type GeneratedPublicPage = {
//   name: string;
//   purpose: string;
//   description: string;
// };

// type GeneratedPublicFlow = {
//   pages: GeneratedPublicPage[];
// };

// export type GeneratedProductWorkflowStructure = {
//   publicFlow: GeneratedPublicFlow;
//   actors: GeneratedActor[];
// };

// type GenerateWorkflowsInput = {
//   understanding: string;

//   productModel: {
//     role: string;
//     directCustomer: string;
//     usageMode: string;
//     primaryInterfaces: string[];
//   };

//   productTypes: string[];

//   productAreas: {
//     name: string;
//     description?: string;
//   }[];

//   actors: {
//     name: string;
//     type: string;
//     responsibilities: string[];
//   }[];

//   entities: {
//     name: string;
//     description: string;
//   }[];

//   relationships: {
//     from: string;
//     relationship: string;
//     to: string;
//   }[];

//   uncertainties?: {
//     topic: string;
//     description: string;
//     whyItMatters: string;
//   }[];

//   answers?: {
//     question: string;
//     answer: string | null;
//   }[];

//   actorGoals?: {
//     actor: string;
//     goal: string;
//   }[];
// };

// type GeneratedWorkflowResponse = {
//   publicFlow: GeneratedPublicFlow;
//   actors: GeneratedActor[];
// };

// const VALID_STEP_TYPES = [
//   'action',
//   'decision',
//   'alternative',
//   'success',
//   'failure',
// ];

// const MAX_ATTEMPTS = 3;

// const SYSTEM_PROMPT = `
// You are Unfold's senior product architect and product modeling analyst.

// Your job is to take a product idea that has already been analyzed and turn it into a useful product structure AND a detailed set of meaningful workflows.

// The person using Unfold may be:
// - a founder
// - a designer
// - a product manager
// - a business owner
// - a developer

// They may understand their business very well but may NOT understand technical software terminology.

// Your output must be understandable to a non-technical person while still being detailed enough for a developer, designer, or product team to build from.

// ==================================================
// CORE IDEA
// ==================================================

// Do BOTH of these things:

// 1. Describe the normal product journey and structure.
// 2. Go deep enough into the actual product behavior that someone can understand what needs to happen inside the product.

// Do NOT choose between pages and workflows.

// Unfold needs BOTH.

// The correct mental model is:

// PRODUCT
// ↓
// PUBLIC / ENTRY EXPERIENCE
// ↓
// ACTORS
// ↓
// ACTOR PAGES / AREAS
// ↓
// ACTOR CAPABILITIES
// ↓
// DETAILED WORKFLOWS
// ↓
// WORKFLOW STEPS

// ==================================================
// PART 1 — NORMAL PRODUCT ENTRY
// ==================================================

// Start with the normal entry experience.

// A product may have:

// Landing
// ↓
// Sign up
// ↓
// Login
// ↓
// Onboarding
// ↓
// Authenticated product

// However, only include pages that actually make sense for the product.

// Do not blindly add every standard SaaS page.

// Use the product model.

// The purpose of this part is to help someone understand:

// "What pages do I need before the user reaches the actual product?"

// Do not spend most of the intelligence here.

// The important detail comes after the product is reached.

// ==================================================
// PART 2 — IDENTIFY THE ACTORS
// ==================================================

// Actors are one of the most important parts of Unfold's product model.

// Use the actors already identified by the analysis.

// Examples may include:

// - Customer
// - Business
// - Merchant
// - Seller
// - Buyer
// - Service Provider
// - Delivery Worker
// - Developer
// - Employee
// - Organization
// - Administrator

// Do NOT invent actors simply because similar products normally have them.

// If the analysis only identifies Customer and Service Provider, do not automatically add Admin, Support Agent, or Manager unless the supplied product information supports them.

// External systems should only be included when they genuinely participate in the product behavior.

// ==================================================
// PART 3 — THINK FROM EACH ACTOR
// ==================================================

// For EACH meaningful actor, ask:

// "What does this actor need to see and do in this product?"

// Then determine:

// - which pages or areas they need
// - what each area is for
// - what they can accomplish there
// - which capabilities are important
// - which capabilities require detailed workflows

// Actors may share pages.

// Do NOT assume every actor has a completely separate application.

// ==================================================
// PART 4 — ACTOR PAGES / PRODUCT AREAS
// ==================================================

// For each actor, identify meaningful pages or areas.

// Good examples:

// - Customers
// - Transactions
// - Orders
// - Bookings
// - Account
// - Developer Portal
// - Reports
// - Settings

// Bad examples:

// - Button
// - Modal
// - Input
// - Confirmation popup
// - Dropdown

// Those are UI components, not product areas.

// Each page must have:

// - name
// - purpose
// - description

// ==================================================
// PART 5 — CAPABILITIES
// ==================================================

// Capabilities describe what the actor can meaningfully accomplish.

// For example:

// Customers:
// - Add customer
// - View customer
// - View dedicated account
// - View customer transactions

// Transactions:
// - Review transactions
// - Inspect transaction details
// - Track transaction status

// Settings:
// - Manage team members
// - Update business information
// - Complete verification

// Do NOT turn navigation into capabilities.

// Bad:
// - Open Customers
// - Click Add
// - Open Details

// Good:
// - Add customer
// - Create dedicated account
// - Review customer activity

// ==================================================
// PART 6 — WHICH CAPABILITIES BECOME WORKFLOWS?
// ==================================================

// Not every capability needs a detailed workflow.

// Create workflows for capabilities where understanding the underlying behavior is useful.

// For example:

// "Add customer"

// is useful as a detailed workflow when adding a customer causes:

// - validation
// - customer creation
// - account creation
// - state changes
// - relationships
// - another meaningful system action

// Do not create dozens of tiny workflows.

// ==================================================
// PART 7 — DETAILED WORKFLOW MODEL
// ==================================================

// A detailed workflow represents a meaningful product journey.

// Think:

// "Someone wants to accomplish something."

// Determine:

// 1. Who starts it?
// 2. What do they want?
// 3. What causes it to begin?
// 4. What does the actor do?
// 5. What does the product do?
// 6. What information is collected?
// 7. What changes?
// 8. Are there decisions?
// 9. Are there failure cases?
// 10. Does another actor become involved?
// 11. What is the meaningful final result?

// Do NOT reduce workflows to interface navigation.

// Bad:
// - Open customers
// - Click add
// - Fill form
// - Click submit

// Better:

// Business submits customer information.
// System validates the information.
// System creates the customer.
// System creates the dedicated account.

// ==================================================
// PART 8 — WORKFLOW ENTRY POINT
// ==================================================

// Every detailed workflow needs a meaningful entry point.

// Examples:

// - Business decides to add a new customer.
// - Customer confirms an order.
// - Customer chooses an appointment.
// - Merchant receives a new order.
// - Developer wants to create API credentials.
// - Business wants to review a transaction.

// The entry point should describe a real situation.

// ==================================================
// PART 9 — WORKFLOW STEPS
// ==================================================

// Each step should represent a meaningful event.

// A step may be:

// - human action
// - system behavior
// - external system behavior
// - decision
// - alternative
// - success
// - failure

// Do not model individual UI clicks.

// ==================================================
// PART 10 — HUMAN ACTION VS SYSTEM BEHAVIOR
// ==================================================

// Make responsibility clear.

// Example:

// Business:
// "Business enters the customer's information."

// System:
// "System validates the information."

// System:
// "System creates the customer record."

// System:
// "System creates the dedicated account."

// Business:
// "Business can now view the customer's account details."

// ==================================================
// PART 11 — DECISIONS
// ==================================================

// Use decisions when they genuinely change the workflow.

// Example:

// Customer submits payment.
// ↓
// System checks payment.
// ↓
// Decision: Was the payment successful?

// YES:
// Continue the order.

// NO:
// Mark payment as unsuccessful and allow retry if appropriate.

// Do not invent unnecessary decisions.

// ==================================================
// PART 12 — FAILURE PATHS
// ==================================================

// Important workflows should include realistic failure situations when supported by the product.

// Examples:

// - invalid information
// - unavailable service
// - insufficient balance
// - rejected payment
// - expired request
// - unauthorized action
// - duplicate request
// - unavailable appointment
// - failed delivery

// Only include failures supported by the product or natural consequences of the described behavior.

// Do not invent highly specific business rules.

// ==================================================
// PART 13 — ALTERNATIVE PATHS
// ==================================================

// Some workflows have multiple valid outcomes.

// Represent meaningful alternatives.

// Do not add alternatives just to make the workflow longer.

// ==================================================
// PART 14 — CROSS-ACTOR HANDOFFS
// ==================================================

// Some workflows involve multiple actors.

// Make the handoff visible.

// Example:

// Customer places order
// ↓
// System creates order
// ↓
// Restaurant receives order
// ↓
// Restaurant accepts order
// ↓
// Delivery worker receives assignment
// ↓
// Delivery worker completes delivery
// ↓
// Customer receives order

// The primary actor should remain the actor whose goal the workflow represents.

// ==================================================
// PART 15 — ENTITIES AND STATE CHANGES
// ==================================================

// Use the supplied entities and relationships.

// When an important entity changes, make the change visible.

// Only use states supported by the product model.

// Do not invent detailed state machines without evidence.

// ==================================================
// PART 16 — PAGES INSIDE WORKFLOWS
// ==================================================

// A workflow can reference meaningful product pages.

// Examples:

// - Customers
// - Transactions
// - Developer Portal

// Do not use UI components as pages.

// Every page a step references must also appear in that workflow's own "pages" list.

// ==================================================
// PART 17 — USE PRODUCT AREAS AS EVIDENCE
// ==================================================

// Use the supplied productAreas.

// Reason about the product using:

// - product understanding
// - product model
// - product areas
// - actors
// - entities
// - relationships
// - actor goals
// - previous answers
// - uncertainties

// ==================================================
// PART 18 — SHARED AREAS
// ==================================================

// A product area may be used by multiple actors.

// Each actor's pages should describe how THAT actor uses the area.

// ==================================================
// PART 19 — ACTOR GOALS
// ==================================================

// Use actor goals when provided.

// Goals should influence:

// - which pages matter
// - which capabilities matter
// - which workflows matter

// Do not simply copy an actor goal into a workflow name.

// ==================================================
// PART 20 — PREVIOUS ANSWERS
// ==================================================

// Previous answers represent decisions made by the user.

// Treat them as product decisions.

// Do not contradict known answers.

// Do not ask questions inside the workflow output.

// ==================================================
// PART 21 — DO NOT INVENT
// ==================================================

// Do not invent:

// - actors
// - pages
// - capabilities
// - permissions
// - payment providers
// - integrations
// - business rules
// - pricing
// - notifications
// - entities
// - states
// - workflows

// unless they are supported by the supplied information or are a natural consequence of something explicitly stated.

// Use the user's terminology.

// ==================================================
// PART 22 — WORKFLOW QUANTITY
// ==================================================

// Simple product:
// 2–4 important workflows.

// Medium product:
// 3–6 important workflows.

// Complex product:
// 5–8 important workflows.

// Do not force a fixed number.

// Do not generate duplicate journeys.

// ==================================================
// PART 23 — IMPORTANT PRODUCT STRUCTURE
// ==================================================

// The output must make it possible to answer:

// "What does this product look like?"

// "Who uses it?"

// "What does each actor see?"

// "What can each actor accomplish?"

// "How does the important behavior actually work?"

// The output needs BOTH:

// A product structure

// AND

// Detailed workflows.

// ==================================================
// PART 24 — QUALITY
// ==================================================

// Before returning the result, check:

// 1. Does the public entry flow make sense?
// 2. Are all meaningful actors represented?
// 3. Does every actor have realistic product areas?
// 4. Are pages grounded in the product?
// 5. Are capabilities meaningful?
// 6. Are workflows connected to meaningful capabilities?
// 7. Are workflows detailed enough after reaching the main product?
// 8. Are human and system actions distinguished?
// 9. Are important decisions represented?
// 10. Are meaningful failures represented?
// 11. Are actor handoffs represented?
// 12. Are important entity changes represented?
// 13. Are workflow pages meaningful product areas?
// 14. Did you avoid generic login/dashboard workflows dominating the result?
// 15. Did you avoid inventing unsupported functionality?
// 16. Could a non-technical founder understand the result?
// 17. Could a designer understand the required areas?
// 18. Could a developer understand important product behavior?
// 19. Are workflows genuinely different?
// 20. Is the output focused rather than bloated?
// 21. Does every workflow.actor exactly match a name from the actors list?
// 22. Does every step.page (when not null) exactly match a name in that workflow's pages list?
// 23. Does every workflow have at least one step?
// 24. Is every workflow "id" globally unique across all actors?
// 25. Did you avoid adding a separate top-level "workflows" array (workflows should only appear nested inside their actor)?

// ==================================================
// OUTPUT FORMAT
// ==================================================

// Return ONLY valid JSON.

// Do not return Markdown.

// Do not return code fences.

// Use this exact top-level structure:

// {
//   "publicFlow": {
//     "pages": [
//       {
//         "name": "Landing",
//         "purpose": "string",
//         "description": "string"
//       }
//     ]
//   },
//   "actors": [
//     {
//       "name": "Business",
//       "description": "string",
//       "pages": [
//         {
//           "name": "Customers",
//           "purpose": "string",
//           "description": "string"
//         }
//       ],
//       "capabilities": [
//         {
//           "name": "Add customer",
//           "description": "string"
//         }
//       ],
//       "workflows": [
//         {
//           "id": "business-add-customer",
//           "name": "Add customer",
//           "description": "string",
//           "actor": "Business",
//           "goal": "string",
//           "entryPoint": "string",
//           "pages": [
//             {
//               "name": "Customers",
//               "purpose": "string"
//             }
//           ],
//           "steps": [
//             {
//               "id": "step-1",
//               "title": "Enter customer information",
//               "type": "action",
//               "actor": "Business",
//               "page": "Customers",
//               "description": "string",
//               "stepOrder": 1
//             }
//           ],
//           "connections": [
//             {
//               "from": "step-1",
//               "to": "step-2",
//               "condition": null
//             }
//           ],
//           "completion": "string"
//         }
//       ]
//     }
//   ]
// }

// Every actor must have:

// - name
// - description
// - pages
// - capabilities
// - workflows

// Every page must have:

// - name
// - purpose
// - description

// Every capability must have:

// - name
// - description

// Every workflow must have:

// - id
// - name
// - description
// - actor
// - goal
// - entryPoint
// - pages
// - steps
// - connections
// - completion

// Every workflow step must have:

// - id
// - title
// - type
// - actor
// - page
// - description
// - stepOrder

// Step type must be exactly one of:

// - action
// - decision
// - alternative
// - success
// - failure

// Every connection must reference existing step IDs.

// Step IDs must be unique inside their workflow.

// Workflow "id" values must be unique across the ENTIRE response, not just within one actor.

// stepOrder must start at 1 and increase sequentially.

// Connections must follow the actual logical flow.

// Do not create connections to nonexistent steps.

// Do not create circular connections unless the product clearly requires a loop.

// Do NOT include a separate top-level "workflows" array. Workflows only need to appear once, nested inside their actor.

// ==================================================
// SOURCE DATA
// ==================================================

// The following information is already known about the product.

// Use it as the source of truth.

// Do not ignore it.

// Do not contradict it.

// Do not invent unsupported functionality.

// Return valid JSON only.
// `;

// @Injectable()
// export class WorkflowsAiService {
//   private readonly logger = new Logger(WorkflowsAiService.name);

//   constructor(private readonly aiService: AiService) {}

//   async generateWorkflows(
//     data: GenerateWorkflowsInput,
//   ): Promise<{
//     publicFlow: GeneratedPublicFlow;
//     workflows: GeneratedWorkflow[];
//   }> {
//     const knownActorNames = new Set(data.actors.map((a) => a.name));

//     const userPayload = JSON.stringify(
//       {
//         productUnderstanding: data.understanding,
//         productModel: data.productModel,
//         productTypes: data.productTypes,
//         productAreas: data.productAreas,
//         actors: data.actors,
//         actorGoals: data.actorGoals ?? [],
//         entities: data.entities,
//         relationships: data.relationships,
//         uncertainties: data.uncertainties ?? [],
//         previousAnswers: data.answers ?? [],
//       },
//       null,
//       2,
//     );

//     const messages: { role: 'system' | 'user'; content: string }[] = [
//       { role: 'system', content: SYSTEM_PROMPT },
//       { role: 'user', content: userPayload },
//     ];

//     let lastError: Error | null = null;
//     let lastRawResponse: unknown = null;

//     for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
//       let response: unknown;

//       try {
//         response = await this.aiService.generateJson(messages);
//         lastRawResponse = response;

//         const workflows = this.parseAndValidate(response, knownActorNames);

//         if (attempt > 1) {
//           this.logger.log(
//             `Workflow generation succeeded on attempt ${attempt} after repair.`,
//           );
//         }

//         return workflows;
//       } catch (error) {
//         lastError = error instanceof Error ? error : new Error(String(error));

//         this.logger.warn(
//           `Workflow generation attempt ${attempt}/${MAX_ATTEMPTS} failed: ${lastError.message}`,
//         );

//         if (attempt === MAX_ATTEMPTS) {
//           break;
//         }

//         // Feed the failure back to the model so it can repair its own output
//         // instead of regenerating blind and possibly repeating the same mistake.
//         // generateJson only accepts 'system' | 'user' roles, so the previous
//         // response and the error are folded into one user message rather than
//         // sent as a separate 'assistant' turn.
//         const previousResponseText =
//           typeof response === 'string' ? response : JSON.stringify(response);

//         messages.push({
//           role: 'user',
//           content: `Your previous response was:

// ${previousResponseText}

// That response was INVALID for this reason: ${lastError.message}

// Return the corrected FULL JSON response again. Follow the exact same output format from the system instructions. Do not explain the fix, only return valid JSON.`,
//         });
//       }
//     }

//     this.logger.error(
//       `Workflow generation failed after ${MAX_ATTEMPTS} attempts. Last error: ${lastError?.message}`,
//       JSON.stringify(lastRawResponse)?.slice(0, 4000),
//     );

//     throw new Error(
//       `AI failed to generate a valid workflow structure after ${MAX_ATTEMPTS} attempts: ${lastError?.message}`,
//     );
//   }

//   private parseAndValidate(
//     response: unknown,
//     knownActorNames: Set<string>,
//   ): { publicFlow: GeneratedPublicFlow; workflows: GeneratedWorkflow[] } {
//     if (!response || typeof response !== 'object') {
//       throw new Error('AI returned an invalid workflow response.');
//     }

//     const generated = response as Partial<GeneratedWorkflowResponse>;

//     if (
//       !generated.publicFlow ||
//       typeof generated.publicFlow !== 'object' ||
//       !Array.isArray(generated.publicFlow.pages)
//     ) {
//       throw new Error('AI returned an invalid public product flow.');
//     }

//     generated.publicFlow.pages.forEach((page, index) =>
//       this.validatePageShape(page, `publicFlow.pages[${index}]`),
//     );

//     if (!Array.isArray(generated.actors) || generated.actors.length === 0) {
//       throw new Error('AI returned an invalid or empty actor structure.');
//     }

//     const allWorkflowIds = new Set<string>();
//     const allActorNamesInResponse = new Set(
//       generated.actors.map((a) => a?.name).filter(Boolean),
//     );

//     for (const actor of generated.actors) {
//       if (!actor || typeof actor !== 'object') {
//         throw new Error('AI returned an invalid actor.');
//       }

//       if (
//         typeof actor.name !== 'string' ||
//         actor.name.trim() === '' ||
//         typeof actor.description !== 'string'
//       ) {
//         throw new Error(
//           'AI returned an actor with invalid identity information.',
//         );
//       }

//       if (!Array.isArray(actor.pages)) {
//         throw new Error(`Actor "${actor.name}" has invalid pages.`);
//       }
//       actor.pages.forEach((page, index) =>
//         this.validatePageShape(page, `actor "${actor.name}".pages[${index}]`, true),
//       );

//       if (!Array.isArray(actor.capabilities)) {
//         throw new Error(`Actor "${actor.name}" has invalid capabilities.`);
//       }
//       actor.capabilities.forEach((capability, index) => {
//         if (
//           !capability ||
//           typeof capability.name !== 'string' ||
//           capability.name.trim() === '' ||
//           typeof capability.description !== 'string'
//         ) {
//           throw new Error(
//             `Actor "${actor.name}" has an invalid capability at index ${index}.`,
//           );
//         }
//       });

//       if (!Array.isArray(actor.workflows)) {
//         throw new Error(`Actor "${actor.name}" has invalid workflows.`);
//       }

//       for (const workflow of actor.workflows) {
//         this.validateWorkflow(workflow, knownActorNames, allActorNamesInResponse);

//         if (allWorkflowIds.has(workflow.id)) {
//           throw new Error(
//             `Duplicate workflow id "${workflow.id}" found across actors. Workflow ids must be globally unique.`,
//           );
//         }
//         allWorkflowIds.add(workflow.id);
//       }
//     }

//     const actorWorkflows = generated.actors.flatMap((actor) => actor.workflows);

//     return {
//       publicFlow: generated.publicFlow,
//       workflows: actorWorkflows,
//     };
//   }

//   private validatePageShape(
//     page: unknown,
//     context: string,
//     requireDescription = false,
//   ): asserts page is GeneratedPublicPage {
//     if (!page || typeof page !== 'object') {
//       throw new Error(`${context} is not a valid page object.`);
//     }

//     const p = page as Partial<GeneratedPublicPage>;

//     if (typeof p.name !== 'string' || p.name.trim() === '') {
//       throw new Error(`${context} is missing a valid "name".`);
//     }

//     if (typeof p.purpose !== 'string' || p.purpose.trim() === '') {
//       throw new Error(`${context} is missing a valid "purpose".`);
//     }

//     if (requireDescription && typeof p.description !== 'string') {
//       throw new Error(`${context} is missing a valid "description".`);
//     }
//   }

//   private validateWorkflow(
//     workflow: GeneratedWorkflow,
//     knownActorNamesFromInput: Set<string>,
//     actorNamesInResponse: Set<string>,
//   ) {
//     if (!workflow || typeof workflow !== 'object') {
//       throw new Error('AI returned an invalid workflow.');
//     }

//     if (typeof workflow.id !== 'string' || workflow.id.trim() === '') {
//       throw new Error('Workflow is missing a valid id.');
//     }

//     if (typeof workflow.name !== 'string' || workflow.name.trim() === '') {
//       throw new Error(`Workflow "${workflow.id}" is missing a valid name.`);
//     }

//     if (typeof workflow.description !== 'string') {
//       throw new Error(
//         `Workflow "${workflow.id}" has an invalid description.`,
//       );
//     }

//     if (typeof workflow.actor !== 'string' || workflow.actor.trim() === '') {
//       throw new Error(`Workflow "${workflow.id}" is missing an actor.`);
//     }

//     // The workflow's actor must be a real actor — either one supplied in the
//     // input, or one the model itself declared in this response. Prevents a
//     // workflow silently referencing an actor that doesn't exist anywhere.
//     if (
//       !knownActorNamesFromInput.has(workflow.actor) &&
//       !actorNamesInResponse.has(workflow.actor)
//     ) {
//       throw new Error(
//         `Workflow "${workflow.id}" references unknown actor "${workflow.actor}".`,
//       );
//     }

//     if (typeof workflow.goal !== 'string' || workflow.goal.trim() === '') {
//       throw new Error(`Workflow "${workflow.id}" is missing a goal.`);
//     }

//     if (
//       typeof workflow.entryPoint !== 'string' ||
//       workflow.entryPoint.trim() === ''
//     ) {
//       throw new Error(`Workflow "${workflow.id}" is missing an entry point.`);
//     }

//     if (!Array.isArray(workflow.pages)) {
//       throw new Error(`Workflow "${workflow.id}" has invalid pages.`);
//     }

//     const workflowPageNames = new Set<string>();
//     workflow.pages.forEach((page, index) => {
//       if (
//         !page ||
//         typeof page.name !== 'string' ||
//         page.name.trim() === '' ||
//         typeof page.purpose !== 'string'
//       ) {
//         throw new Error(
//           `Workflow "${workflow.id}" has an invalid page at index ${index}.`,
//         );
//       }
//       workflowPageNames.add(page.name);
//     });

//     if (!Array.isArray(workflow.steps)) {
//       throw new Error(`Workflow "${workflow.id}" has invalid steps.`);
//     }

//     if (workflow.steps.length === 0) {
//       throw new Error(`Workflow "${workflow.id}" has no steps.`);
//     }

//     if (!Array.isArray(workflow.connections)) {
//       throw new Error(`Workflow "${workflow.id}" has invalid connections.`);
//     }

//     if (typeof workflow.completion !== 'string') {
//       throw new Error(
//         `Workflow "${workflow.id}" has an invalid completion.`,
//       );
//     }

//     const stepIds = new Set<string>();

//     for (const step of workflow.steps) {
//       if (!step || typeof step !== 'object') {
//         throw new Error(
//           `Workflow "${workflow.id}" contains an invalid step.`,
//         );
//       }

//       if (typeof step.id !== 'string' || step.id.trim() === '') {
//         throw new Error(
//           `Workflow "${workflow.id}" contains a step with no valid id.`,
//         );
//       }

//       if (stepIds.has(step.id)) {
//         throw new Error(
//           `Workflow "${workflow.id}" contains duplicate step id "${step.id}".`,
//         );
//       }

//       stepIds.add(step.id);

//       if (typeof step.title !== 'string' || step.title.trim() === '') {
//         throw new Error(
//           `Workflow "${workflow.id}" contains a step with no title.`,
//         );
//       }

//       if (!VALID_STEP_TYPES.includes(step.type)) {
//         throw new Error(
//           `Workflow "${workflow.id}" contains invalid step type "${step.type}".`,
//         );
//       }

//       if (typeof step.actor !== 'string' || step.actor.trim() === '') {
//         throw new Error(
//           `Workflow "${workflow.id}" contains a step with no actor.`,
//         );
//       }

//       if (
//         !knownActorNamesFromInput.has(step.actor) &&
//         !actorNamesInResponse.has(step.actor)
//       ) {
//         throw new Error(
//           `Workflow "${workflow.id}" step "${step.id}" references unknown actor "${step.actor}".`,
//         );
//       }

//       if (step.page !== null && typeof step.page !== 'string') {
//         throw new Error(
//           `Workflow "${workflow.id}" contains a step with an invalid page.`,
//         );
//       }

//       // A step can only reference a page that this workflow actually declared.
//       if (step.page !== null && !workflowPageNames.has(step.page)) {
//         throw new Error(
//           `Workflow "${workflow.id}" step "${step.id}" references page "${step.page}" which is not in this workflow's pages list.`,
//         );
//       }

//       if (
//         typeof step.description !== 'string' ||
//         step.description.trim() === ''
//       ) {
//         throw new Error(
//           `Workflow "${workflow.id}" contains a step with no description.`,
//         );
//       }

//       if (
//         typeof step.stepOrder !== 'number' ||
//         !Number.isInteger(step.stepOrder) ||
//         step.stepOrder < 1
//       ) {
//         throw new Error(
//           `Workflow "${workflow.id}" contains an invalid step order.`,
//         );
//       }
//     }

//     const sortedSteps = [...workflow.steps].sort(
//       (a, b) => a.stepOrder - b.stepOrder,
//     );

//     sortedSteps.forEach((step, index) => {
//       const expectedOrder = index + 1;

//       if (step.stepOrder !== expectedOrder) {
//         throw new Error(
//           `Workflow "${workflow.id}" has invalid step ordering. Expected ${expectedOrder} but received ${step.stepOrder}.`,
//         );
//       }
//     });

//     for (const connection of workflow.connections) {
//       if (!connection || typeof connection !== 'object') {
//         throw new Error(
//           `Workflow "${workflow.id}" contains an invalid connection.`,
//         );
//       }

//       if (
//         typeof connection.from !== 'string' ||
//         typeof connection.to !== 'string'
//       ) {
//         throw new Error(
//           `Workflow "${workflow.id}" contains a connection with invalid step references.`,
//         );
//       }

//       if (!stepIds.has(connection.from)) {
//         throw new Error(
//           `Workflow "${workflow.id}" connection references unknown step "${connection.from}".`,
//         );
//       }

//       if (!stepIds.has(connection.to)) {
//         throw new Error(
//           `Workflow "${workflow.id}" connection references unknown step "${connection.to}".`,
//         );
//       }

//       if (
//         connection.condition !== null &&
//         typeof connection.condition !== 'string'
//       ) {
//         throw new Error(
//           `Workflow "${workflow.id}" contains an invalid connection condition.`,
//         );
//       }
//     }
//   }
// }