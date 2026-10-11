"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { createStaffUser } from "@/lib/user-api";
import type { ICreateUserPayload, IUserDetail } from "@/types/user.types";

export const USERS_QUERY_KEY = "users" as const;

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