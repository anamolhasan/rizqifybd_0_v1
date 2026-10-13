"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

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

  return useMutation<IUserDetail, ApiError, ICreateUserPayload>({
    mutationFn: createStaffUser,
    onSuccess: (user) => {
      toast.success("Staff account created", {
        description: `“${user.name}” (${user.email}) has been added.`,
      });
      invalidate();
    },
    onError: (error) => {
      toast.error("Failed to create staff account", {
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

  return useMutation<IUserDetail, ApiError, IUpdateUserProfileVariables>({
    mutationFn: ({ id, payload }) => updateUserProfile(id, payload),
    onSuccess: (user) => {
      toast.success("User updated", {
        description: `“${user.name}” has been updated.`,
      });
      invalidate();
    },
    onError: (error) => {
      toast.error("Failed to update user", {
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

  return useMutation<IUserDetail, ApiError, IUpdateUserStatusVariables>({
    mutationFn: ({ id, payload }) => updateUserStatus(id, payload),
    onSuccess: (user) => {
      toast.success("User status updated", {
        description: `${user.name} is now ${user.status.toLowerCase()}.`,
      });
      invalidate();
    },
    onError: (error) => {
      toast.error("Failed to update user status", {
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

  return useMutation<IUserDetail, ApiError, IUpdateUserRoleVariables>({
    mutationFn: ({ id, payload }) => updateUserRole(id, payload),
    onSuccess: (user) => {
      toast.success("User role updated", {
        description: `“${user.name}” is now ${user.role}.`,
      });
      invalidate();
    },
    onError: (error) => {
      toast.error("Failed to update user role", {
        description: describeError(error),
      });
    },
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();

  return useMutation<{ id: string; deletedAt: string }, ApiError, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted", {
        description: "The account can be restored later.",
      });
      invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete user", {
        description: describeError(error),
      });
    },
  });
}

export function useRestoreUser() {
  const invalidate = useInvalidateUsers();

  return useMutation<IUserDetail, ApiError, string>({
    mutationFn: restoreUser,
    onSuccess: (user) => {
      toast.success("User restored", {
        description: `“${user.name}” can sign in again.`,
      });
      invalidate();
    },
    onError: (error) => {
      toast.error("Failed to restore user", {
        description: describeError(error),
      });
    },
  });
}
