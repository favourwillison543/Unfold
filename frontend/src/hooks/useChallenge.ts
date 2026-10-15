import { useMutation, useQuery } from "@tanstack/react-query";

import { get, post } from "@/lib/api";
import { ENDPOINTS } from "@/api/endpoints";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  severity: string;
  relatedActor: string | null;
  relatedWorkflow: string | null;
  suggestedQuestion: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useProjectChallenges = (
  projectId: number
) => {
  return useQuery({
    queryKey: ["project-challenges", projectId],
    queryFn: () =>
      get<Challenge[]>(
        ENDPOINTS.projects.challenges(projectId)
      ),
    enabled: !!projectId,
  });
};

export const useGenerateChallenges = () => {
  return useMutation({
    mutationFn: (projectId: number) =>
      post<Challenge[], undefined>(
        ENDPOINTS.projects.generateChallenges(projectId),
        undefined
      ),
  });
};