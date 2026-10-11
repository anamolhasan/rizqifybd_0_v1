import { apiRequest } from "./api";

import type { IDefaultReferralSetting } from "@/types/referral.types";

// The backend exposes system settings at /api/v1/settings.
const SETTINGS_ENDPOINT = "/settings";

export async function getReferralDefaultSetting(): Promise<IDefaultReferralSetting> {
  const { data } = await apiRequest<IDefaultReferralSetting>(
    `${SETTINGS_ENDPOINT}/referral-default`,
    { method: "GET" },
  );

  return data;
}

export async function updateReferralDefaultSetting(payload: {
  referralCode: string;
}): Promise<IDefaultReferralSetting> {
  const { data } = await apiRequest<IDefaultReferralSetting>(
    `${SETTINGS_ENDPOINT}/referral-default`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );

  return data;
}