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
  getReferralApplications,
  getReferralApplicationStats,
  reviewReferralApplication,
} from "@/lib/referral-admin-api";
import type { ApiResponse } from "@/types/api.types";
import type {
  IReferralApplication,
  IReferralApplicationListParams,
  IReferralApplicationStats,
  IReviewApplicationPayload,
} from "@/types/referral.types";

export const REFERRAL_APPLICATIONS_QUERY_KEY = [
  "referral",
  "applications",
] as const;

export const REFERRAL_APPLICATION_STATS_QUERY_KEY = [
  "referral",
  "applications",
  "stats",
] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useReferralApplications(
  params: IReferralApplicationListParams,
) {
  return useQuery<ApiResponse<IReferralApplication[]>, ApiError>({
    queryKey: [...REFERRAL_APPLICATIONS_QUERY_KEY, params],
    queryFn: () => getReferralApplications(params),
    placeholderData: keepPreviousData,
  });
}

export function useReferralApplicationStats() {
  return useQuery<IReferralApplicationStats, ApiError>({
    queryKey: REFERRAL_APPLICATION_STATS_QUERY_KEY,
    queryFn: getReferralApplicationStats,
  });
}

export interface IReviewApplicationVariables {
  id: string;
  payload: IReviewApplicationPayload;
}

export function useReviewReferralApplication() {
  const queryClient = useQueryClient();

  return useMutation<IReferralApplication, ApiError, IReviewApplicationVariables>({
    mutationFn: ({ id, payload }) => reviewReferralApplication(id, payload),
    onSuccess: (application) => {
      const approved = application.status === "APPROVED";
      toast.success(
        approved ? "Application approved" : "Application rejected",
        {
          description: approved
            ? "The applicant is now eligible to earn referral income."
            : "The rejection reason has been recorded.",
        },
      );
      queryClient.invalidateQueries({
        queryKey: REFERRAL_APPLICATIONS_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error("Failed to review application", {
        description: describeError(error),
      });
    },
  });
}
