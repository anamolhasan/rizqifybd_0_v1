import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type { IOperatorOffer, IOperatorOfferListParams } from "@/types/operator-offer.types";
import type {
  ICreateOperatorOfferPayload,
  IUpdateOperatorOfferPayload,
} from "@/types/operator-offer.types";

// The backend exposes the operator offer catalogue at /api/v1/operator-offers.
const OPERATOR_OFFERS_ENDPOINT = "/operator-offers";

export async function getOperatorOffers(
  params: IOperatorOfferListParams = {},
): Promise<ApiResponse<IOperatorOffer[]>> {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    operatorId: params.operatorId,
    offerType: params.offerType,
    type: params.type,
    status: params.status,
    isActive:
      params.isActive === undefined ? undefined : String(params.isActive),
    // The list endpoint does not exclude soft-deleted rows by default.
    isDeleted: String(params.isDeleted ?? false),
  });

  const { data, message, meta } = await apiRequest<IOperatorOffer[]>(
    `${OPERATOR_OFFERS_ENDPOINT}${queryString}`,
    {
      method: "GET",
    },
  );

  return { success: true, message, data, meta: meta as PaginationMeta | undefined };
}

export async function createOperatorOffer(
  payload: ICreateOperatorOfferPayload,
): Promise<IOperatorOffer> {
  const { data } = await apiRequest<IOperatorOffer>(OPERATOR_OFFERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}

export async function updateOperatorOffer(
  id: string,
  payload: IUpdateOperatorOfferPayload,
): Promise<IOperatorOffer> {
  const { data } = await apiRequest<IOperatorOffer>(
    `${OPERATOR_OFFERS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function deleteOperatorOffer(id: string): Promise<IOperatorOffer> {
  const { data } = await apiRequest<IOperatorOffer>(
    `${OPERATOR_OFFERS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return data;
}
