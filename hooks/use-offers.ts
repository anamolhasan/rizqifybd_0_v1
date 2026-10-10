"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  createOffer,
  deleteOffer,
  getOffers,
  updateOffer,
} from "@/lib/offer-api";
import type { ApiResponse } from "@/types/api.types";
import type { IOffer, IOfferListParams } from "@/types/offer.types";
import type {
  ICreateProductPayload,
  IUpdateProductPayload,
} from "@/types/product.types";

export const OFFERS_QUERY_KEY = "offers" as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useOffers(params: IOfferListParams = {}) {
  return useQuery<ApiResponse<IOffer[]>, ApiError>({
    queryKey: [OFFERS_QUERY_KEY, params],
    queryFn: () => getOffers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation<IOffer, ApiError, ICreateProductPayload>({
    mutationFn: createOffer,
    onSuccess: (offer) => {
      toast.success("Offer created", {
        description: `“${offer.name}” has been added.`,
      });
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to create offer", {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateOfferVariables {
  id: string;
  payload: IUpdateProductPayload;
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation<IOffer, ApiError, IUpdateOfferVariables>({
    mutationFn: ({ id, payload }) => updateOffer(id, payload),
    onSuccess: (offer) => {
      toast.success("Offer updated", {
        description: `“${offer.name}” has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to update offer", {
        description: describeError(error),
      });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation<IOffer, ApiError, string>({
    mutationFn: deleteOffer,
    onSuccess: (offer) => {
      toast.success("Offer deleted", {
        description: `“${offer.name}” has been removed.`,
      });
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to delete offer", {
        description: describeError(error),
      });
    },
  });
}
