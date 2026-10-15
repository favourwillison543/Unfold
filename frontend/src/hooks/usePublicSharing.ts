import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { del, get, post } from "@/lib/api";
import { ENDPOINTS } from "@/api/endpoints";
import { toast } from "sonner";

export type PublicPerson = {
  id: number;
  name: string;
  type?: string | null;
  description?: string | null;
  responsibilities?: string[];
};

export type PublicQuestion = {
  id?: number;
  question?: string;
  answer?: string | null;
};

export type PublicProductType = {
  id?: number;
  name?: string;
  description?: string | null;
};

export type PublicProductArea = {
  id?: number;
  name?: string;
  description?: string | null;
};

export type PublicActorGoal = {
  id?: number;
  actor?: string;
  goal?: string;
};

export type PublicEntity = {
  id?: number;
  name?: string;
  type?: string;
  description?: string | null;
};

export type PublicRelationship = {
  id?: number;
  source?: string;
  target?: string;
  type?: string;
  description?: string | null;
};

export type PublicWorkflowStep = {
  id: number;
  title: string;
  type: string;
  actor: string | null;
  page: string | null;
  description: string | null;
  stepOrder: number;
};

export type PublicWorkflowPage = {
  id?: number;
  name?: string;
  path?: string;
  description?: string | null;
};

export type PublicWorkflowConnection = {
  id?: number;
  source?: string;
  target?: string;
  type?: string;
};

export type PublicWorkflow = {
  id: number;
  name: string;
  description: string | null;
  actor: string;
  goal: string;
  entryPoint: string | null;
  completion: string | null;
  steps?: PublicWorkflowStep[];
  pages?: PublicWorkflowPage[];
  connections?: PublicWorkflowConnection[];
};

export type PublicChallenge = {
  id: number;
  title: string;
  description: string;
  severity: string;
  relatedActor: string | null;
  relatedWorkflow: string | null;
  suggestedQuestion: string | null;
  resolved: boolean;
};

export type PublicAnalysis = {
  id: number;
  understanding: string | null;

  productModel: {
    role: string;
    directCustomer: string;
    usageMode: string;
    primaryInterfaces: string[];
  } | null;

  productTypes: PublicProductType[];
  productAreas: PublicProductArea[];
  people: PublicPerson[];
  questions: PublicQuestion[];
  actorGoals: PublicActorGoal[];
  entities: PublicEntity[];
  relationships: PublicRelationship[];
};

export type PublicProjectResponse = {
  project: {
    id: number;
    name: string;
    description: string | null;
    productFormat: string;
  };

  analysis: PublicAnalysis | null;

  workflows: PublicWorkflow[];

  challenges: PublicChallenge[];
};

export type PublicShareResponse = {
  enabled: boolean;
  token: string | null;
  url: string | null;
};

export const usePublicShare = (projectId: number) => {
  return useQuery({
    queryKey: ["public-share", projectId],
    queryFn: () =>
      get<PublicShareResponse>(
        ENDPOINTS.projects.publicShare(projectId),
      ),
    enabled: !!projectId,
  });
};

export const useEnablePublicSharing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) =>
      post<PublicShareResponse, undefined>(
        ENDPOINTS.projects.publicShare(projectId),
        undefined,
      ),

    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["public-share", projectId],
      });

      toast.success("Public sharing enabled.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to enable public sharing.",
      );
    },
  });
};

export const useDisablePublicSharing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) =>
      del<{ enabled: false }>(
        ENDPOINTS.projects.publicShare(projectId),
      ),

    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["public-share", projectId],
      });

      toast.success("Public sharing disabled.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to disable public sharing.",
      );
    },
  });
};

export const usePublicProject = (token: string) => {
  return useQuery({
    queryKey: ["public-project", token],

    queryFn: () =>
      get<PublicProjectResponse>(
        ENDPOINTS.projects.publicProject(token),
      ),

    enabled: !!token,
  });
};