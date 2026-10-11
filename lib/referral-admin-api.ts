import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type {
  IReferralApplication,
  IReferralApplicationListParams,
  IReferralApplicationStats,
  IReviewApplicationPayload,
} from "@/types/referral.types";

const REFERRAL_ENDPOINT = "/referral";

export async function getReferralApplications(
  params: IReferralApplicationListParams = {},
): Promise<ApiResponse<IReferralApplication[]>> {
  const query = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    status: params.status,
  });
  const { data, message, meta } = await apiRequest<IReferralApplication[]>(
    `${REFERRAL_ENDPOINT}/applications${query}`,
    { method: "GET" },
  );

  return {
    success: true,
    message,
    data,
    meta: meta as PaginationMeta | undefined,
  };
}

async function countApplications(status: string): Promise<number> {
  const response = await getReferralApplications({
    status: status as IReferralApplicationListParams["status"],
    limit: 1,
  });

  return response.meta?.total ?? 0;
}

export async function getReferralApplicationStats(): Promise<IReferralApplicationStats> {
  const [pending, approved, rejected] = await Promise.all([
    countApplications("PENDING"),
    countApplications("APPROVED"),
    countApplications("REJECTED"),
  ]);

  return {
    total: pending + approved + rejected,
    pending,
    approved,
    rejected,
  };
}

export async function reviewReferralApplication(
  id: string,
  payload: IReviewApplicationPayload,
): Promise<IReferralApplication> {
  const { data } = await apiRequest<IReferralApplication>(
    `${REFERRAL_ENDPOINT}/applications/${encodeURIComponent(id)}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}
