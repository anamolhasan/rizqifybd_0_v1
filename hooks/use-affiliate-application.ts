"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  getMyAffiliateApplication,
  submitAffiliateApplication,
} from "@/lib/affiliate-application-api";
import { ApiError } from "@/lib/api";
import type {
  IAffiliateApplication,
  IAffiliateStatus,
  ISubmitAffiliateApplicationPayload,
} from "@/types/affiliateApplication.types";

export const AFFILIATE_APPLICATION_QUERY_KEY = [
  "affiliate-application",
  "me",
] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useMyAffiliateApplication(enabled = true) {
  return useQuery<IAffiliateStatus, ApiError>({
    queryKey: AFFILIATE_APPLICATION_QUERY_KEY,
    queryFn: getMyAffiliateApplication,
    retry: false,
    staleTime: 60 * 1000,
    enabled,
  });
}

export function useSubmitAffiliateApplication() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<
    IAffiliateApplication,
    ApiError,
    ISubmitAffiliateApplicationPayload
  >({
    mutationFn: submitAffiliateApplication,
    onSuccess: () => {
      toast.success(t("affiliateApplied"), {
        description: t("applicationReceived"),
      });
      queryClient.invalidateQueries({
        queryKey: AFFILIATE_APPLICATION_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error(t("affiliateApplyFailed"), {
        description: describeError(error),
      });
    },
  });
}
