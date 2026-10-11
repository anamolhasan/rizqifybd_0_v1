"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { createStaffUser, getUsers } from "@/lib/user-api";
import type { ICreateUserPayload, IUser, IUserDetail } from "@/types/user.types";

export const USERS_QUERY_KEY = "users" as const;

export const USERS_SEARCH_QUERY_KEY = [USERS_QUERY_KEY, "search"] as const;

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

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useCreateStaffUser() {
  const queryClient = useQueryClient();

  return useMutation<IUserDetail, ApiError, ICreateUserPayload>({
    mutationFn: createStaffUser,
    onSuccess: (user) => {
      toast.success("Staff account created", {
        description: `“${user.name}” (${user.email}) has been added.`,
      });
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to create staff account", {
        description: describeError(error),
      });
    },
  });
}