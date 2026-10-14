"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  createOperatorOffer,
  deleteOperatorOffer,
  getOperatorOffers,
  updateOperatorOffer,
} from "@/lib/operator-offer-api";
import type { ApiResponse } from "@/types/api.types";
import type { IOperatorOffer, IOperatorOfferListParams } from "@/types/operator-offer.types";
import type {
  ICreateOperatorOfferPayload,
  IUpdateOperatorOfferPayload,
} from "@/types/operator-offer.types";

export const OPERATOR_OFFERS_QUERY_KEY = "operator-offers" as const;

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useOperatorOffers(params: IOperatorOfferListParams = {}) {
  return useQuery<ApiResponse<IOperatorOffer[]>, ApiError>({
    queryKey: [OPERATOR_OFFERS_QUERY_KEY, params],
    queryFn: () => getOperatorOffers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateOperatorOffer() {
  const queryClient = useQueryClient();

  return useMutation<IOperatorOffer, ApiError, ICreateOperatorOfferPayload>({
    mutationFn: createOperatorOffer,
    onSuccess: (offer) => {
      toast.success("Offer created", {
        description: `“${offer.name}” has been added.`,
      });
      queryClient.invalidateQueries({ queryKey: [OPERATOR_OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to create offer", {
        description: describeError(error),
      });
    },
  });
}

export interface IUpdateOperatorOfferVariables {
  id: string;
  payload: IUpdateOperatorOfferPayload;
}

export function useUpdateOperatorOffer() {
  const queryClient = useQueryClient();

  return useMutation<IOperatorOffer, ApiError, IUpdateOperatorOfferVariables>({
    mutationFn: ({ id, payload }) => updateOperatorOffer(id, payload),
    onSuccess: (offer) => {
      toast.success("Offer updated", {
        description: `“${offer.name}” has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: [OPERATOR_OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to update offer", {
        description: describeError(error),
      });
    },
  });
}

export function useDeleteOperatorOffer() {
  const queryClient = useQueryClient();

  return useMutation<IOperatorOffer, ApiError, string>({
    mutationFn: deleteOperatorOffer,
    onSuccess: (offer) => {
      toast.success("Offer deleted", {
        description: `“${offer.name}” has been removed.`,
      });
      queryClient.invalidateQueries({ queryKey: [OPERATOR_OFFERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Failed to delete offer", {
        description: describeError(error),
      });
    },
  });
}
