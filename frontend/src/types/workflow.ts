
export type WorkflowStep = {
  name: string;
  pageName: string | null;
  id: number;
  title: string;
  type: string;
  actor: string | null;
  page: string | null;
  description: string | null;
  stepOrder: number;
};

export type WorkflowPage = {
  id: number;
  name: string;
  purpose: string;
};

export type WorkflowConnection = {
  [x: string]: any;
  id: number;
  from: string;
  to: string;
  condition: string | null;
};

export type Workflow = {
  id: number;
  name: string;
  description: string | null;

  actor: string;
  goal: string;

  entryPoint: string | null;
  completion: string | null;

  pages: WorkflowPage[];
  steps: WorkflowStep[];
  connections: WorkflowConnection[];

  createdAt: string;
  updatedAt: string;
};

export type PublicFlowPage = {
  id: number;
  name: string;
  purpose: string;
  description: string | null;
  createdAt: string;
};

export type ActorPage = {
  id: number;
  name: string;
  purpose: string;
  description: string;
};

export type ActorCapability = {
  id: number;
  name: string;
  description: string;
};

export type Actor = {
  id: number;
  name: string;
  description: string;
  pages: ActorPage[];
  capabilities: ActorCapability[];
  createdAt: string;
};

export type ProjectStructure = {
  publicFlow: PublicFlowPage[];
  actors: Actor[];
};

