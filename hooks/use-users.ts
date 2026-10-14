"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  getRoleLabel,
  getStatusLabel,
} from "@/components/modules/users/user.constants";
import { ApiError } from "@/lib/api";
import {
  createStaffUser,
  deleteUser,
  getUserById,
  getUserStats,
  getUsers,
  restoreUser,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
} from "@/lib/user-api";
import type { ApiResponse } from "@/types/api.types";
import type {
  ICreateUserPayload,
  IUpdateUserProfilePayload,
  IUpdateUserRolePayload,
  IUpdateUserStatusPayload,
  IUser,
  IUserDetail,
  IUserListParams,
  IUserStats,
} from "@/types/user.types";

export const USERS_QUERY_KEY = "users" as const;

export const USERS_SEARCH_QUERY_KEY = [USERS_QUERY_KEY, "search"] as const;

export const USERS_STATS_QUERY_KEY = [USERS_QUERY_KEY, "stats"] as const;

export function useUsersSearch(searchTerm: string) {
  const trimmed = searchTerm.trim();

  return useQuery<IUser[], ApiError>({
    queryKey: [...USERS_SEARCH_QUERY_KEY, trimmed],
    queryFn: async () => {
      const response = await getUsers({
        searchTerm: trimmed,
        page: 1,
        limit: 8,
        sortBy: "name",
        sortOrder: "asc",
      });
      return response.data;
    },
    enabled: trimmed.length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useUsers(params: IUserListParams = {}) {
  return useQuery<ApiResponse<IUser[]>, ApiError>({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUserStats() {
  return useQuery<IUserStats, ApiError>({
    queryKey: USERS_STATS_QUERY_KEY,
    queryFn: getUserStats,
  });
}

export function useUser(id: string | null) {
  return useQuery<IUserDetail, ApiError>({
    queryKey: [USERS_QUERY_KEY, "detail", id],
    queryFn: () => getUserById(id as string),
    enabled: Boolean(id),
  });
}

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: USERS_STATS_QUERY_KEY });
  };
}

export function useCreateStaffUser() {
  const invalidate = useInvalidateUsers();
  const t = useTranslations("toast");

  return useMutation<IUserDetail, ApiError, ICreateUserPayload>({
    mutationFn: createStaffUser,
    onSuccess: (user) => {
      toast.success(t("staffCreated"), {
        description: t("staffCreatedDescription", {
          name: user.name,
          email: user.email,
        }),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(t("staffCreateFailed"), {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateUserProfileVariables {
  id: string;
  payload: IUpdateUserProfilePayload;
}

export function useUpdateUserProfile() {
  const invalidate = useInvalidateUsers();
  const t = useTranslations("toast");

  return useMutation<IUserDetail, ApiError, IUpdateUserProfileVariables>({
    mutationFn: ({ id, payload }) => updateUserProfile(id, payload),
    onSuccess: (user) => {
      toast.success(t("userUpdated"), {
        description: t("userUpdatedDescription", { name: user.name }),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(t("userUpdateFailed"), {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateUserStatusVariables {
  id: string;
  payload: IUpdateUserStatusPayload;
}

export function useUpdateUserStatus() {
  const invalidate = useInvalidateUsers();
  const t = useTranslations("toast");
  const te = useTranslations("enums");

  return useMutation<IUserDetail, ApiError, IUpdateUserStatusVariables>({
    mutationFn: ({ id, payload }) => updateUserStatus(id, payload),
    onSuccess: (user) => {
      toast.success(t("userStatusUpdated"), {
        description: t("userStatusUpdatedDescription", {
          name: user.name,
          status: getStatusLabel(user.status, te),
        }),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(t("userStatusUpdateFailed"), {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateUserRoleVariables {
  id: string;
  payload: IUpdateUserRolePayload;
}

export function useChangeUserRole() {
  const invalidate = useInvalidateUsers();
  const t = useTranslations("toast");
  const te = useTranslations("enums");

  return useMutation<IUserDetail, ApiError, IUpdateUserRoleVariables>({
    mutationFn: ({ id, payload }) => updateUserRole(id, payload),
    onSuccess: (user) => {
      toast.success(t("userRoleUpdated"), {
        description: t("userRoleUpdatedDescription", {
          name: user.name,
          role: getRoleLabel(user.role, te),
        }),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(t("userRoleUpdateFailed"), {
        description: describeError(error),
      });
    },
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  const t = useTranslations("toast");

  return useMutation<{ id: string; deletedAt: string }, ApiError, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success(t("userDeleted"), {
        description: t("userDeletedDescription"),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(t("userDeleteFailed"), {
        description: describeError(error),
      });
    },
  });
}

export function useRestoreUser() {
  const invalidate = useInvalidateUsers();
  const t = useTranslations("toast");

  return useMutation<IUserDetail, ApiError, string>({
    mutationFn: restoreUser,
    onSuccess: (user) => {
      toast.success(t("userRestored"), {
        description: t("userRestoredDescription", { name: user.name }),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(t("userRestoreFailed"), {
        description: describeError(error),
      });
    },
  });
}
