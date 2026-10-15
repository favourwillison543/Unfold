export const ENDPOINTS = {
  auth: {
    login: "auth/login",
    signup: "auth/signup",
    verifyEmail: "auth/verify-email",
    me: "auth/me",
    logout: "auth/logout",
  },

  projects: {
    list: "projects",
    create: "projects",

    get: (projectId: number) =>
      `projects/${projectId}`,

    delete: (projectId: number) =>
      `projects/${projectId}`,

    analysis: (projectId: number) =>
      `projects/${projectId}/analysis`,

    questions: (projectId: number) =>
      `projects/${projectId}/questions`,

    updateQuestions: (projectId: number) =>
      `projects/${projectId}/questions`,

    goals: (projectId: number) =>
      `projects/${projectId}/goals`,

    goalSuggestions: (projectId: number) =>
      `projects/${projectId}/goals/suggestions`,

    workflows: (projectId: number) =>
      `projects/${projectId}/workflows`,

    workflow: (
      projectId: number,
      workflowId: number,
    ) =>
      `projects/${projectId}/workflows/${workflowId}`,

    structure: (projectId: number) =>
      `projects/${projectId}/workflows/structure`,

    generateStructure: (projectId: number) =>
      `projects/${projectId}/workflows/structure/generate`,

    generateActorWorkflows: (
      projectId: number,
      actorId: number,
    ) =>
      `projects/${projectId}/workflows/actors/${actorId}/generate`,

    publicFlow: (projectId: number) =>
      `projects/${projectId}/workflows/public-flow`,

    challenges: (projectId: number) =>
      `projects/${projectId}/challenges`,

    generateChallenges: (projectId: number) =>
      `projects/${projectId}/challenges/generate`,

    
    team: (projectId: number) =>
      `projects/${projectId}/invitations`,
    
    acceptInvitation: (token: string) =>
      `invitations/${token}/accept`,
    
    publicShare: (projectId: number) =>
      `projects/${projectId}/public-share`,
    
    publicProject: (token: string) =>
      `public/projects/${token}`,
  },
};