import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { get, post } from "@/lib/api";
import { ENDPOINTS } from "@/api/endpoints";

import {
  Workflow,
  PublicFlowPage,
  ProjectStructure,
} from "@/types/workflow";

/* --------------------------------------------------
   All workflows for a project
-------------------------------------------------- */
export const useProjectWorkflows = (
  projectId: number,
) => {
  return useQuery({
    queryKey: ["project-workflows", projectId],
    queryFn: () =>
      get<Workflow[]>(
        ENDPOINTS.projects.workflows(projectId),
      ),
    enabled: !!projectId,
  });
};

/* --------------------------------------------------
   One specific workflow
-------------------------------------------------- */
export const useProjectWorkflow = (
  projectId: number,
  workflowId: number,
) => {
  return useQuery({
    queryKey: [
      "project-workflow",
      projectId,
      workflowId,
    ],
    queryFn: () =>
      get<Workflow>(
        ENDPOINTS.projects.workflow(
          projectId,
          workflowId,
        ),
      ),
    enabled:
      Number.isFinite(projectId) &&
      Number.isFinite(workflowId),
  });
};

/* --------------------------------------------------
   Public flow
-------------------------------------------------- */
export const useProjectPublicFlow = (
  projectId: number,
) => {
  return useQuery({
    queryKey: [
      "project-public-flow",
      projectId,
    ],
    queryFn: () =>
      get<PublicFlowPage[]>(
        ENDPOINTS.projects.publicFlow(projectId),
      ),
    enabled: !!projectId,
  });
};

/* --------------------------------------------------
   STEP 1 — Product structure
   Public flow + actors + actor pages/capabilities
-------------------------------------------------- */
export const useProjectStructure = (
  projectId: number,
) => {
  return useQuery({
    queryKey: [
      "project-structure",
      projectId,
    ],
    queryFn: () =>
      get<ProjectStructure>(
        ENDPOINTS.projects.structure(projectId),
      ),
    enabled: !!projectId,
  });
};

/* --------------------------------------------------
   Generate product structure
-------------------------------------------------- */
export const useGenerateStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) =>
      post<ProjectStructure, undefined>(
        ENDPOINTS.projects.generateStructure(
          projectId,
        ),
        undefined,
      ),

    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({
        queryKey: [
          "project-structure",
          projectId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "project-public-flow",
          projectId,
        ],
      });
    },
  });
};

/* --------------------------------------------------
   STEP 2 — Generate workflows for one actor
-------------------------------------------------- */
export const useGenerateActorWorkflows = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      actorId,
    }: {
      projectId: number;
      actorId: number;
    }) =>
      post<Workflow[], undefined>(
        ENDPOINTS.projects.generateActorWorkflows(
          projectId,
          actorId,
        ),
        undefined,
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "project-workflows",
          variables.projectId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "project-structure",
          variables.projectId,
        ],
      });
    },
  });
};