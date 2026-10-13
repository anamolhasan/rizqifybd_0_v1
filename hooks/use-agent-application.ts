"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  getMyAgentApplication,
  submitAgentApplication,
} from "@/lib/agent-application-api";
import { ApiError } from "@/lib/api";
import type {
  IAgentApplication,
  IAgentStatus,
  ISubmitAgentApplicationPayload,
} from "@/types/agentApplication.types";

export const AGENT_APPLICATION_QUERY_KEY = ["agent-application", "me"] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useMyAgentApplication() {
  return useQuery<IAgentStatus, ApiError>({
    queryKey: AGENT_APPLICATION_QUERY_KEY,
    queryFn: getMyAgentApplication,
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useSubmitAgentApplication() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<
    IAgentApplication,
    ApiError,
    ISubmitAgentApplicationPayload
  >({
    mutationFn: submitAgentApplication,
    onSuccess: () => {
      toast.success(t("agentApplied"), {
        description: t("applicationReceived"),
      });
      queryClient.invalidateQueries({
        queryKey: AGENT_APPLICATION_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error(t("agentApplyFailed"), {
        description: describeError(error),
      });
    },
  });
}
