"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getAffiliateApplications,
  getAffiliateApplicationStats,
  reviewAffiliateApplication,
} from "@/lib/affiliate-admin-api";
import { ApiError } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  IAffiliateApplication,
  IAffiliateApplicationListParams,
  IAffiliateApplicationStats,
  IReviewAffiliateApplicationPayload,
} from "@/types/affiliateApplication.types";

export const AFFILIATE_APPLICATIONS_QUERY_KEY = [
  "affiliate-applications",
] as const;

export const AFFILIATE_APPLICATION_STATS_QUERY_KEY = [
  "affiliate-applications",
  "stats",
] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useAffiliateApplications(
  params: IAffiliateApplicationListParams,
) {
  return useQuery<ApiResponse<IAffiliateApplication[]>, ApiError>({
    queryKey: [...AFFILIATE_APPLICATIONS_QUERY_KEY, params],
    queryFn: () => getAffiliateApplications(params),
    placeholderData: keepPreviousData,
  });
}

export function useAffiliateApplicationStats() {
  return useQuery<IAffiliateApplicationStats, ApiError>({
    queryKey: AFFILIATE_APPLICATION_STATS_QUERY_KEY,
    queryFn: getAffiliateApplicationStats,
  });
}

export interface IReviewAffiliateApplicationVariables {
  id: string;
  payload: IReviewAffiliateApplicationPayload;
}

export function useReviewAffiliateApplication() {
  const queryClient = useQueryClient();

  return useMutation<
    IAffiliateApplication,
    ApiError,
    IReviewAffiliateApplicationVariables
  >({
    mutationFn: ({ id, payload }) => reviewAffiliateApplication(id, payload),
    onSuccess: (application) => {
      const approved = application.status === "APPROVED";
      toast.success(
        approved ? "Application approved" : "Application rejected",
        {
          description: approved
            ? "The applicant is now an approved affiliate."
            : "The rejection reason has been recorded.",
        },
      );
      queryClient.invalidateQueries({
        queryKey: AFFILIATE_APPLICATIONS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: AFFILIATE_APPLICATION_STATS_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error("Failed to review application", {
        description: describeError(error),
      });
    },
  });
}
