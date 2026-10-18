import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type {
  IAgentApplication,
  IAgentApplicationListParams,
  IAgentApplicationStats,
  IReviewAgentApplicationPayload,
} from "@/types/agentApplication.types";

const AGENT_APPLICATION_ENDPOINT = "/agent-applications";

export async function getAgentApplications(
  params: IAgentApplicationListParams = {},
): Promise<ApiResponse<IAgentApplication[]>> {
  const query = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    status: params.status,
  });
  const { data, message, meta } = await apiRequest<IAgentApplication[]>(
    `${AGENT_APPLICATION_ENDPOINT}${query}`,
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
  const response = await getAgentApplications({
    status: status as IAgentApplicationListParams["status"],
    limit: 1,
  });

  return response.meta?.total ?? 0;
}

export async function getAgentApplicationStats(): Promise<IAgentApplicationStats> {
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

export async function reviewAgentApplication(
  id: string,
  payload: IReviewAgentApplicationPayload,
): Promise<IAgentApplication> {
  const { data } = await apiRequest<IAgentApplication>(
    `${AGENT_APPLICATION_ENDPOINT}/${encodeURIComponent(id)}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}
