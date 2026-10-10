"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  type AuthResult,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/auth-api";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { LOGIN_ROUTE } from "@/lib/constants";
import type { Role } from "@/types/enums";

function resolveRedirect(redirectTo?: string, fallback = "/") {
  if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    return redirectTo;
  }
  return fallback;
}

function describeError(error: unknown) {
  if (error instanceof ApiError && error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResult, ApiError, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("Welcome back!", {
        description: data.user?.email
          ? `Signed in as ${data.user.email}`
          : "You are now signed in.",
      });
      queryClient.invalidateQueries({ queryKey: ["auth/me"] });
      router.push(
        resolveRedirect(
          redirectTo,
          getDefaultDashboardRoute(data.user?.role as Role | undefined),
        ),
      );
      router.refresh();
    },
    onError: (error) => {
      toast.error("Sign in failed", { description: describeError(error) });
    },
  });
}

export function useRegister(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResult, ApiError, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Account created!", {
        description: data.user?.email
          ? `Welcome ${data.user.name ?? data.user.email}`
          : "Your account is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["auth/me"] });
      router.push(
        resolveRedirect(
          redirectTo,
          getDefaultDashboardRoute(data.user?.role as Role | undefined),
        ),
      );
      router.refresh();
    },
    onError: (error) => {
      toast.error("Registration failed", { description: describeError(error) });
    },
  });
}

export function useCurrentUser() {
  return useQuery<AuthUser>({
    queryKey: ["auth/me"],
    queryFn: getMe,
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, void>({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      toast.success("You have been signed out.");
      queryClient.clear();
      router.push(LOGIN_ROUTE);
      router.refresh();
    },
    onError: () => {
      queryClient.clear();
      router.push(LOGIN_ROUTE);
      router.refresh();
    },
  });
}