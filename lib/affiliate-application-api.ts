import { apiRequest } from "./api";

import type {
  IAffiliateApplication,
  IAffiliateStatus,
  ISubmitAffiliateApplicationPayload,
} from "@/types/affiliateApplication.types";

// The backend exposes affiliate applications at /api/v1/affiliate-applications.
const AFFILIATE_APPLICATION_ENDPOINT = "/affiliate-applications";

export async function getMyAffiliateApplication(): Promise<IAffiliateStatus> {
  const { data } = await apiRequest<IAffiliateStatus>(
    `${AFFILIATE_APPLICATION_ENDPOINT}/me`,
    { method: "GET" },
  );

  return data;
}

export async function submitAffiliateApplication(
  payload: ISubmitAffiliateApplicationPayload = {},
): Promise<IAffiliateApplication> {
  const { data } = await apiRequest<IAffiliateApplication>(
    AFFILIATE_APPLICATION_ENDPOINT,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return data;
}
