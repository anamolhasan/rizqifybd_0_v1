"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import {
  changeOperatorOfferStatus,
  createOperatorOffer,
  deleteOperatorOffer,
  getOperatorOfferById,
  getOperatorOffers,
  updateOperatorOffer,
} from "@/lib/operator-offer-api";
import type { ApiResponse } from "@/types/api.types";
import type { IOperatorOffer, IOperatorOfferListParams } from "@/types/operator-offer.types";
import type {
  ICreateOperatorOfferPayload,
  IUpdateOperatorOfferPayload,
} from "@/types/operator-offer.types";
import type { OperatorOfferStatusAction } from "@/lib/operator-offer-api";

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

export function useOperatorOfferById(id: string | null | undefined) {
  return useQuery<IOperatorOffer, ApiError>({
    queryKey: [OPERATOR_OFFERS_QUERY_KEY, "detail", id],
    queryFn: () => getOperatorOfferById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
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

export interface IChangeOperatorOfferStatusVariables {
  id: string;
  action: OperatorOfferStatusAction;
}

// Administrative availability action (pause/resume/archive). Refreshes the
// catalogue so the new status badge renders without a manual reload.
export function useChangeOperatorOfferStatus() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");
  const te = useTranslations("enums");

  return useMutation<
    IOperatorOffer,
    ApiError,
    IChangeOperatorOfferStatusVariables
  >({
    mutationFn: ({ id, action }) => changeOperatorOfferStatus(id, action),
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: [OPERATOR_OFFERS_QUERY_KEY] });
      toast.success(t("offerStatusUpdated"), {
        description: t("offerStatusUpdatedDescription", {
          name: offer.name,
          status: te(`offerStatus.${offer.status}`),
        }),
      });
    },
    onError: (error) => {
      toast.error(t("offerStatusUpdateFailed"), {
        description: describeError(error),
      });
    },
  });
}
