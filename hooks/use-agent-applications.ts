"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  getAgentApplications,
  getAgentApplicationStats,
  reviewAgentApplication,
} from "@/lib/agent-application-admin-api";
import type { ApiResponse } from "@/types/api.types";
import type {
  IAgentApplication,
  IAgentApplicationListParams,
  IAgentApplicationStats,
  IReviewAgentApplicationPayload,
} from "@/types/agentApplication.types";

export const AGENT_APPLICATIONS_QUERY_KEY = [
  "agent-applications",
] as const;

export const AGENT_APPLICATION_STATS_QUERY_KEY = [
  "agent-applications",
  "stats",
] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useAgentApplications(params: IAgentApplicationListParams) {
  return useQuery<ApiResponse<IAgentApplication[]>, ApiError>({
    queryKey: [...AGENT_APPLICATIONS_QUERY_KEY, params],
    queryFn: () => getAgentApplications(params),
    placeholderData: keepPreviousData,
  });
}

export function useAgentApplicationStats() {
  return useQuery<IAgentApplicationStats, ApiError>({
    queryKey: AGENT_APPLICATION_STATS_QUERY_KEY,
    queryFn: getAgentApplicationStats,
  });
}

export interface IReviewAgentApplicationVariables {
  id: string;
  payload: IReviewAgentApplicationPayload;
}

export function useReviewAgentApplication() {
  const queryClient = useQueryClient();

  return useMutation<
    IAgentApplication,
    ApiError,
    IReviewAgentApplicationVariables
  >({
    mutationFn: ({ id, payload }) => reviewAgentApplication(id, payload),
    onSuccess: (application) => {
      const approved = application.status === "APPROVED";
      toast.success(
        approved ? "Application approved" : "Application rejected",
        {
          description: approved
            ? "The applicant is now an approved agent."
            : "The rejection reason has been recorded.",
        },
      );
      queryClient.invalidateQueries({
        queryKey: AGENT_APPLICATIONS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: AGENT_APPLICATION_STATS_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error("Failed to review application", {
        description: describeError(error),
      });
    },
  });
}
