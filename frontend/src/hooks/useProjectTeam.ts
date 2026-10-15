import { useMutation } from "@tanstack/react-query";

import { post } from "@/lib/api";
import { ENDPOINTS } from "@/api/endpoints";

import { toast } from "sonner";

type InviteProjectMemberRequest = {
  projectId: number;
  email: string;
  role: "editor" | "viewer";
};

type InviteProjectMemberResponse = {
  id: number;
  projectId: number;
  email: string;
  role: "editor" | "viewer";
  token: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
};

export const useInviteProjectMember = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      email,
      role,
    }: InviteProjectMemberRequest) =>
      post<
        InviteProjectMemberResponse,
        {
          email: string;
          role: "editor" | "viewer";
        }
      >(
        ENDPOINTS.projects.team(projectId),
        {
          email,
          role,
        },
      ),

    onSuccess: () => {
      toast.success("Invitation sent successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to send invitation.",
      );
    },
  });
};

export const useAcceptProjectInvitation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      post<
        {
          message: string;
          projectId: number;
          role: "editor" | "viewer";
        },
        undefined
      >(
        ENDPOINTS.projects.acceptInvitation(token),
        undefined,
      ),

    onSuccess: () => {
      toast.success("Invitation accepted.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to accept invitation.",
      );
    },
  });
};