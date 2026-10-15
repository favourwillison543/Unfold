import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { get, post, patch, del } from "@/lib/api";

import { ENDPOINTS } from "@/api/endpoints";

import {
  CreateProjectRequest,
  CreateAnalysisResponse,
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
  GenerateGoalSuggestionsRequest,
  GenerateGoalSuggestionsResponse,
  Project,
  Analysis,
  Question,
  ActorGoal,
} from "@/types/project";

import { toast } from "sonner";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateProjectRequest) =>
      post<Project, CreateProjectRequest>(
        ENDPOINTS.projects.create,
        body
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      toast.success("Project created successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create project."
      );
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],

    queryFn: () =>
      get<Project[]>(ENDPOINTS.projects.list),
  });
};

export const useProject = (projectId: number) => {
  return useQuery({
    queryKey: ["project", projectId],

    queryFn: () =>
      get<Project>(
        ENDPOINTS.projects.get(projectId)
      ),

    enabled: !!projectId,
  });
};

export const useCreateAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) =>
      post<CreateAnalysisResponse, undefined>(
        ENDPOINTS.projects.analysis(projectId),
        undefined
      ),

    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["project-analysis", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      toast.success("Analysis created successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create project analysis."
      );
    },
  });
};

export const useProjectAnalysis = (projectId: number) => {
  return useQuery({
    queryKey: ["project-analysis", projectId],

    queryFn: () =>
      get<Analysis>(
        ENDPOINTS.projects.analysis(projectId)
      ),

    enabled: !!projectId,
  });
};

export const useGenerateQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: number;
      body: GenerateQuestionsRequest;
    }) =>
      post<
        GenerateQuestionsResponse,
        GenerateQuestionsRequest
      >(
        ENDPOINTS.projects.questions(projectId),
        body
      ),

    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["project-questions", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-analysis", projectId],
      });

      toast.success("Questions generated successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to generate questions."
      );
    },
  });
};

export const useProjectQuestions = (projectId: number) => {
  return useQuery({
    queryKey: ["project-questions", projectId],

    queryFn: () =>
      get<Question[]>(
        ENDPOINTS.projects.questions(projectId)
      ),

    enabled: !!projectId,
  });
};

export const useUpdateQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      questions,
    }: {
      projectId: number;
      questions: {
        id: number;
        answer: string;
      }[];
    }) =>
      patch<
        {
          questions: Question[];
        },
        {
          id: number;
          answer: string;
        }[]
      >(
        ENDPOINTS.projects.updateQuestions(projectId),
        questions
      ),

    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["project-questions", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-analysis", projectId],
      });

      toast.success("Questions updated successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update questions."
      );
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) =>
      del<void>(
        ENDPOINTS.projects.delete(projectId)
      ),

    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.removeQueries({
        queryKey: ["project", projectId],
      });

      queryClient.removeQueries({
        queryKey: ["project-analysis", projectId],
      });

      queryClient.removeQueries({
        queryKey: ["project-questions", projectId],
      });

      queryClient.removeQueries({
        queryKey: ["project-goals", projectId],
      });

      toast.success("Project deleted successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete project."
      );
    },
  });
};

export const useGenerateGoalSuggestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: number;
      body: GenerateGoalSuggestionsRequest;
    }) =>
      post<
        GenerateGoalSuggestionsResponse,
        GenerateGoalSuggestionsRequest
      >(
        ENDPOINTS.projects.goalSuggestions(projectId),
        body
      ),

    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["project-goals", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-analysis", projectId],
      });

      toast.success(
        "Goal suggestions generated successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to generate goal suggestions."
      );
    },
  });
};

export const useProjectGoals = (projectId: number) => {
  return useQuery({
    queryKey: ["project-goals", projectId],

    queryFn: () =>
      get<ActorGoal[]>(
        ENDPOINTS.projects.goals(projectId)
      ),

    enabled: !!projectId,
  });
};