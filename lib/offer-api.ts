import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type { IOffer, IOfferListParams } from "@/types/offer.types";
import type {
  ICreateProductPayload,
  IUpdateProductPayload,
} from "@/types/product.types";

// The backend exposes its telecom offer/product catalogue at /api/v1/products.
const OFFERS_ENDPOINT = "/products";

export async function getOffers(
  params: IOfferListParams = {},
): Promise<ApiResponse<IOffer[]>> {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    operatorId: params.operatorId,
    type: params.type,
    isActive:
      params.isActive === undefined ? undefined : String(params.isActive),
    // The list endpoint does not exclude soft-deleted rows by default.
    isDeleted: String(params.isDeleted ?? false),
  });

  const { data, message, meta } = await apiRequest<IOffer[]>(
    `${OFFERS_ENDPOINT}${queryString}`,
    {
      method: "GET",
    },
  );

  return { success: true, message, data, meta: meta as PaginationMeta | undefined };
}

export async function createOffer(
  payload: ICreateProductPayload,
): Promise<IOffer> {
  const { data } = await apiRequest<IOffer>(OFFERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}

export async function updateOffer(
  id: string,
  payload: IUpdateProductPayload,
): Promise<IOffer> {
  const { data } = await apiRequest<IOffer>(
    `${OFFERS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function deleteOffer(id: string): Promise<IOffer> {
  const { data } = await apiRequest<IOffer>(
    `${OFFERS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );

  return data;
}
