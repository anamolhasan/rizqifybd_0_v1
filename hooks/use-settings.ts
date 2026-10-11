"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  getReferralDefaultSetting,
  updateReferralDefaultSetting,
} from "@/lib/settings-api";
import type { IDefaultReferralSetting } from "@/types/referral.types";

export const REFERRAL_DEFAULT_SETTING_QUERY_KEY = [
  "settings",
  "referral-default",
] as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useReferralDefaultSetting() {
  return useQuery<IDefaultReferralSetting, ApiError>({
    queryKey: REFERRAL_DEFAULT_SETTING_QUERY_KEY,
    queryFn: getReferralDefaultSetting,
  });
}

export function useUpdateReferralDefaultSetting() {
  const queryClient = useQueryClient();

  return useMutation<
    IDefaultReferralSetting,
    ApiError,
    { referralCode: string }
  >({
    mutationFn: updateReferralDefaultSetting,
    onSuccess: (setting) => {
      toast.success("Default referral code updated", {
        description: setting.referrer
          ? `“${setting.referrer.name}” is now the default referrer.`
          : "The default referral code is now cleared.",
      });
      queryClient.invalidateQueries({
        queryKey: REFERRAL_DEFAULT_SETTING_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error("Failed to update default referral code", {
        description: describeError(error),
      });
    },
  });
}