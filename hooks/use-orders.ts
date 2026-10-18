"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  changeOrderStatus,
  createOrder,
  getAllOrders,
  getMyOrder,
  getMyOrders,
  initiateOrderPayment,
  payOrderWithWallet,
  purchaseOfferWithWallet,
} from "@/lib/order-api";
import { ApiError } from "@/lib/api";
import { WALLET_QUERY_KEY } from "@/hooks/use-wallet";
import type { ApiResponse } from "@/types/api.types";
import type {
  ICreateOrderPayload,
  ICreateOrderWithWalletPayload,
  ICreateOrderWithWalletResult,
  IOrder,
  IOrderListParams,
  IPayOrderResult,
} from "@/types/order.types";
import type { OrderStatus } from "@/types/enums";

export const ORDERS_QUERY_KEY = "orders" as const;

// Reads a single order the signed-in customer owns. Disabled until an id is
// available so callers can pass a not-yet-resolved route param safely.
export function useMyOrder(orderId: string | null | undefined) {
  return useQuery<IOrder, ApiError>({
    queryKey: [ORDERS_QUERY_KEY, "detail", orderId],
    queryFn: () => getMyOrder(orderId as string),
    enabled: Boolean(orderId),
    retry: false,
    staleTime: 30 * 1000,
  });
}

// Lists the signed-in customer's own orders with server-side paging/filtering.
export function useMyOrders(params: IOrderListParams = {}) {
  return useQuery<ApiResponse<IOrder[]>, ApiError>({
    queryKey: [ORDERS_QUERY_KEY, "my", params],
    queryFn: () => getMyOrders(params),
    placeholderData: (previousData) => previousData,
  });
}

// Lists every order for staff. Kept under a distinct key from the customer list
// so the two paginated views never share cached pages.
export function useAllOrders(params: IOrderListParams = {}) {
  return useQuery<ApiResponse<IOrder[]>, ApiError>({
    queryKey: [ORDERS_QUERY_KEY, "all", params],
    queryFn: () => getAllOrders(params),
    placeholderData: (previousData) => previousData,
  });
}

function describeError(error: ApiError): string {
  if (error.errorSources?.length) {
    return error.errorSources.map((source) => source.message).join(", ");
  }
  return error.message;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<IOrder, ApiError, ICreateOrderPayload>({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      toast.success(t("orderCreated"), {
        description: t("orderCreatedDescription"),
      });
    },
    onError: (error) => {
      toast.error(t("orderCreateFailed"), {
        description: describeError(error),
      });
    },
  });
}

export function usePurchaseOfferWithWallet() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<
    ICreateOrderWithWalletResult,
    ApiError,
    ICreateOrderWithWalletPayload
  >({
    mutationFn: purchaseOfferWithWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
      toast.success(t("orderPaid"), {
        description: t("orderPaidDescription"),
      });
    },
    onError: (error) => {
      toast.error(t("orderCreateFailed"), {
        description: describeError(error),
      });
    },
  });
}

export function useInitiateOrderPayment() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<IPayOrderResult, ApiError, string>({
    mutationFn: initiateOrderPayment,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      toast.success(t("paymentInitiated"), {
        description: t("paymentInitiatedDescription"),
      });
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
    },
    onError: (error) => {
      toast.error(t("paymentInitiateFailed"), {
        description: describeError(error),
      });
    },
  });
}

// Pays an existing PENDING order from the wallet. Invalidates both the order
// lists and the wallet balance so the debit and new status render immediately.
export function usePayOrderWithWallet() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");

  return useMutation<ICreateOrderWithWalletResult, ApiError, string>({
    mutationFn: payOrderWithWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
      toast.success(t("walletPaymentSucceeded"), {
        description: t("walletPaymentSucceededDescription"),
      });
    },
    onError: (error) => {
      toast.error(t("walletPaymentFailed"), {
        description: describeError(error),
      });
    },
  });
}

export interface IChangeOrderStatusVariables {
  id: string;
  status: OrderStatus;
}

// Staff-only fulfilment transition. The backend validates the transition and,
// for COMPLETED/CANCELLED/FAILED, settles or revokes commissions — so every
// order-derived view is invalidated afterwards.
export function useChangeOrderStatus() {
  const queryClient = useQueryClient();
  const t = useTranslations("toast");
  const te = useTranslations("enums");

  return useMutation<IOrder, ApiError, IChangeOrderStatusVariables>({
    mutationFn: ({ id, status }) => changeOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
      toast.success(t("orderStatusUpdated"), {
        description: t("orderStatusUpdatedDescription", {
          status: te(`orderStatus.${order.status}`),
        }),
      });
    },
    onError: (error) => {
      toast.error(t("orderStatusUpdateFailed"), {
        description: describeError(error),
      });
    },
  });
}