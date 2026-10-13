"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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

function describeError(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("toast");
  const tc = useTranslations("common");

  return useMutation<AuthResult, ApiError, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(t("welcomeBack"), {
        description: data.user?.email
          ? t("signedInAs", { email: data.user.email })
          : t("signedIn"),
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
      toast.error(t("signInFailed"), {
        description: describeError(error, tc("error")),
      });
    },
  });
}

export function useRegister(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("toast");
  const tc = useTranslations("common");

  return useMutation<AuthResult, ApiError, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(t("accountCreated"), {
        description: data.user?.email
          ? t("welcomeUser", { name: data.user.name ?? data.user.email })
          : t("accountReady"),
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
      toast.error(t("registrationFailed"), {
        description: describeError(error, tc("error")),
      });
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
  const t = useTranslations("toast");
  const tc = useTranslations("common");

  return useMutation<AuthUser, ApiError, UpdateMyProfilePayload>({
    mutationFn: updateMyProfile,
    onSuccess: (user) => {
      toast.success(t("profileUpdated"), {
        description: t("profileUpdatedDescription"),
      });
      // Reflect the change immediately, then refetch to stay in sync.
      queryClient.setQueryData<AuthUser>(["auth/me"], user);
      queryClient.invalidateQueries({ queryKey: ["auth/me"] });
    },
    onError: (error) => {
      toast.error(t("profileUpdateFailed"), {
        description: describeError(error, tc("error")),
      });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");
  const tc = useTranslations("common");

  return useMutation<null, ApiError, ChangePasswordPayload>({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(t("passwordChanged"), {
        description: t("passwordChangedDescription"),
      });
      queryClient.invalidateQueries({ queryKey: ["auth/me"] });
    },
    onError: (error) => {
      toast.error(t("passwordChangeFailed"), {
        description: describeError(error, tc("error")),
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<unknown, ApiError, void>({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      toast.success(t("signedOut"));
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