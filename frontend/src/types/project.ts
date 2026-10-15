export type Project = {
  id: number;
  name: string;
  description: string | null;
  productFormat: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
  productFormat: string;
};

// -------------------------
// Persisted Analysis
// -------------------------
export type ProductModel = {
  role: string;
  directCustomer: string;
  usageMode: string;
  primaryInterfaces: string[];
};

export type ProductType = {
  id: number;
  name: string;
};

export type ProductArea = {
  id: number;
  name: string;
  description: string | null;
};

export type Actor = {
  id: number;
  name: string;
  type: string | null;
  responsibilities: string[] | null;
  description: string | null;
};

export type ProductEntity = {
  id: number;
  name: string;
  description: string;
};

export type ProductRelationship = {
  id: number;
  from: string;
  relationship: string;
  to: string;
};

export type Analysis = {
  id: number;
  understanding: string | null;
  productModel: ProductModel | null;
  productTypes: ProductType[];
  productAreas: ProductArea[];
  people: Actor[];
  questions: Question[];
  actorGoals: ActorGoal[];
  entities: ProductEntity[];
  relationships: ProductRelationship[];
  createdAt: string;
  updatedAt: string;
};
export type AnalysisUncertainty = {
  topic: string;
  description: string;
  whyItMatters: string;
};
// -------------------------
// AI Analysis
// -------------------------
export type AnalysisResult = {
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
    description: string;
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
  uncertainties: AnalysisUncertainty[];
};

export type CreateAnalysisResponse = {
  analysis: unknown;
  result: AnalysisResult;
};

// -------------------------
// Questions
// -------------------------

export type QuestionOption = {
  label: string;
  value: string;
};

export type Question = {
  id: number;
  question: string;
  options: QuestionOption[];
  answer: string | null;
  reason: string | null;
};

export type GenerateQuestionsRequest = AnalysisResult;

export type GenerateQuestionsResponse = {
  questions: Question[];
};

export type QuestionAnswer = {
  question: string;
  answer: string;
};

// -------------------------
// Goals
// -------------------------

export type GenerateGoalSuggestionsRequest = {
  understanding: string;

  productTypes: string[];

  productAreas: {
    name: string;
  }[];

  actors: {
    name: string;
    type: string;
    responsibilities: string[];
  }[];

  answers: QuestionAnswer[];
};

export type ActorGoal = {
  id: number;
  actor: string;
  goal: string;
};

export type GenerateGoalSuggestionsResponse = {
  actorGoals: ActorGoal[];
};