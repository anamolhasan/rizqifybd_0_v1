"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  changePassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateMyProfile,
  type AuthResult,
  type AuthUser,
  type ChangePasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type UpdateMyProfilePayload,
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

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, ApiError, UpdateMyProfilePayload>({
    mutationFn: updateMyProfile,
    onSuccess: (user) => {
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      });
      // Reflect the change immediately, then refetch to stay in sync.
      queryClient.setQueryData<AuthUser>(["auth/me"], user);
      queryClient.invalidateQueries({ queryKey: ["auth/me"] });
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description: describeError(error),
      });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation<null, ApiError, ChangePasswordPayload>({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed", {
        description:
          "Your password has been updated. Use it the next time you sign in.",
      });
      queryClient.invalidateQueries({ queryKey: ["auth/me"] });
    },
    onError: (error) => {
      toast.error("Failed to change password", {
        description: describeError(error),
      });
    },
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