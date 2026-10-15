import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { get, post } from "@/lib/api";

import { ENDPOINTS } from "@/api/endpoints";

import {
  CreateAccountRequest,
  CreateAccountResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/types/auth";

import { toast } from "sonner";

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (body: CreateAccountRequest) =>
      post<CreateAccountResponse, CreateAccountRequest>(
        ENDPOINTS.auth.signup,
        body
      ),

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create your account."
      );
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: VerifyEmailRequest) =>
      post<VerifyEmailResponse, VerifyEmailRequest>(
        ENDPOINTS.auth.verifyEmail,
        body
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      toast.success("Email verified successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "The verification code is invalid or expired."
      );
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) =>
      post<LoginResponse, LoginRequest>(
        ENDPOINTS.auth.login,
        body
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      toast.success("Welcome back.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to log in."
      );
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      get<GetMeResponse>(ENDPOINTS.auth.me),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      post(ENDPOINTS.auth.logout),

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      toast.success("Logged out successfully.");
    },

    onError: () => {
      toast.error("Unable to log out.");
    },
  });
};