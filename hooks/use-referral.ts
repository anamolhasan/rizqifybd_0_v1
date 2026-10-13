"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { applyForReferralIncome, getMyReferral } from "@/lib/referral-api";
import type {
  IReferralApplication,
  IReferralMe,
  ISubmitReferralApplicationPayload,
} from "@/types/referral.types";

export const REFERRAL_QUERY_KEY = ["referral", "me"] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useMyReferral() {
  return useQuery<IReferralMe, ApiError>({
    queryKey: REFERRAL_QUERY_KEY,
    queryFn: getMyReferral,
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useApplyForReferral() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<
    IReferralApplication,
    ApiError,
    ISubmitReferralApplicationPayload
  >({
    mutationFn: applyForReferralIncome,
    onSuccess: () => {
      toast.success(t("referralApplied"), {
        description: t("applicationReceived"),
      });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(t("referralApplyFailed"), {
        description: describeError(error),
      });
    },
  });
}
