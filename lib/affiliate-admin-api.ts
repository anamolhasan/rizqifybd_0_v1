import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type {
  IAffiliateApplication,
  IAffiliateApplicationListParams,
  IAffiliateApplicationStats,
  IReviewAffiliateApplicationPayload,
} from "@/types/affiliateApplication.types";

const AFFILIATE_APPLICATION_ENDPOINT = "/affiliate-applications";

export async function getAffiliateApplications(
  params: IAffiliateApplicationListParams = {},
): Promise<ApiResponse<IAffiliateApplication[]>> {
  const query = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    status: params.status,
  });
  const { data, message, meta } = await apiRequest<IAffiliateApplication[]>(
    `${AFFILIATE_APPLICATION_ENDPOINT}${query}`,
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
  const response = await getAffiliateApplications({
    status: status as IAffiliateApplicationListParams["status"],
    limit: 1,
  });

  return response.meta?.total ?? 0;
}

export async function getAffiliateApplicationStats(): Promise<IAffiliateApplicationStats> {
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

export async function reviewAffiliateApplication(
  id: string,
  payload: IReviewAffiliateApplicationPayload,
): Promise<IAffiliateApplication> {
  const { data } = await apiRequest<IAffiliateApplication>(
    `${AFFILIATE_APPLICATION_ENDPOINT}/${encodeURIComponent(id)}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}
