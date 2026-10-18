import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type {
  ICreateOrderPayload,
  ICreateOrderWithWalletPayload,
  ICreateOrderWithWalletResult,
  IOrder,
  IOrderListParams,
  IPayOrderResult,
} from "@/types/order.types";
import type { OrderStatus } from "@/types/enums";

// The backend exposes order operations at /api/v1/orders.
const ORDERS_ENDPOINT = "/orders";

export async function createOrder(payload: ICreateOrderPayload): Promise<IOrder> {
  const { data } = await apiRequest<IOrder>(ORDERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}

// Creates an operator-offer order and pays for it from the authenticated user's
// wallet in a single atomic backend call. Pass a stable idempotencyKey so that
// retrying a failed request resolves to the original order instead of charging
// the wallet twice.
export async function purchaseOfferWithWallet(
  payload: ICreateOrderWithWalletPayload,
): Promise<ICreateOrderWithWalletResult> {
  const { data } = await apiRequest<ICreateOrderWithWalletResult>(
    `${ORDERS_ENDPOINT}/wallet`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

// Fetches one of the authenticated user's own orders. The backend scopes this
// query to the caller (userId OR sellerId), so foreign order ids return 404.
export async function getMyOrder(orderId: string): Promise<IOrder> {
  const { data } = await apiRequest<IOrder>(
    `${ORDERS_ENDPOINT}/my/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
    },
  );

  return data;
}

export async function initiateOrderPayment(
  orderId: string,
): Promise<IPayOrderResult> {
  const { data } = await apiRequest<IPayOrderResult>(
    `${ORDERS_ENDPOINT}/${encodeURIComponent(orderId)}/pay`,
    {
      method: "POST",
    },
  );

  return data;
}

// Lists the authenticated user's own orders (as buyer or seller). The backend
// scopes the query and only exposes these filters.
export async function getMyOrders(
  params: IOrderListParams = {},
): Promise<ApiResponse<IOrder[]>> {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    status: params.status,
    paymentStatus: params.paymentStatus,
    operatorOfferId: params.operatorOfferId,
  });

  const { data, message, meta } = await apiRequest<IOrder[]>(
    `${ORDERS_ENDPOINT}/my${queryString}`,
    {
      method: "GET",
    },
  );

  return { success: true, message, data, meta: meta as PaginationMeta | undefined };
}

// Lists every order for staff (ORDER_STAFF_ROLES). Adds a customer search and a
// userId filter on top of the shared list params.
export async function getAllOrders(
  params: IOrderListParams = {},
): Promise<ApiResponse<IOrder[]>> {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    searchTerm: params.searchTerm,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    status: params.status,
    paymentStatus: params.paymentStatus,
    operatorOfferId: params.operatorOfferId,
    userId: params.userId,
  });

  const { data, message, meta } = await apiRequest<IOrder[]>(
    `${ORDERS_ENDPOINT}${queryString}`,
    {
      method: "GET",
    },
  );

  return { success: true, message, data, meta: meta as PaginationMeta | undefined };
}

// Staff-only fulfilment transition. The backend rejects transitions that are not
// allowed from the order's current status.
export async function changeOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<IOrder> {
  const { data } = await apiRequest<IOrder>(
    `${ORDERS_ENDPOINT}/${encodeURIComponent(orderId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  return data;
}

// Pays an existing PENDING order from the buyer's wallet. Idempotent server-side
// so a retried request never debits the wallet twice.
export async function payOrderWithWallet(
  orderId: string,
): Promise<ICreateOrderWithWalletResult> {
  const { data } = await apiRequest<ICreateOrderWithWalletResult>(
    `${ORDERS_ENDPOINT}/${encodeURIComponent(orderId)}/pay/wallet`,
    {
      method: "POST",
    },
  );

  return data;
}