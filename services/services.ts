import { buildQueryString } from "@/lib/query";
import { serverFetch } from "@/lib/api/server-fetch";
import type { ApiResponse, ListQueryParams } from "@/types/api.types";
import type { IUser } from "@/types/user.types";
import type { IOrder } from "@/types/order.types";
import type { IProduct } from "@/types/product.types";
import type { IOperator } from "@/types/operator.types";
import type { IWithdrawal } from "@/types/withdrawal.types";
import type { IWalletSummary, IWalletTransaction } from "@/types/wallet.types";
import type {
  IReferralApplication,
  IReferralMe,
  IPartnerReferralDashboard,
  IDefaultReferralCode,
} from "@/types/referral.types";
import type { IAgentApplication } from "@/types/agentApplication.types";

export const userService = {
  async getUsers(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IUser[]>>(`/users${query}`);
  },
  async getUserById(id: string) {
    return serverFetch<ApiResponse<IUser>>(`/users/${id}`);
  },
};

export const orderService = {
  async getAllOrders(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IOrder[]>>(`/orders${query}`);
  },
  async getMyOrders(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IOrder[]>>(`/orders/my${query}`);
  },
  async getMyOrder(id: string) {
    return serverFetch<ApiResponse<IOrder>>(`/orders/my/${id}`);
  },
};

export const productService = {
  async getProducts(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IProduct[]>>(`/products${query}`);
  },
  async getProductById(id: string) {
    return serverFetch<ApiResponse<IProduct>>(`/products/${id}`);
  },
};

export const operatorService = {
  async getOperators(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IOperator[]>>(`/operators${query}`);
  },
  async getOperatorById(id: string) {
    return serverFetch<ApiResponse<IOperator>>(`/operators/${id}`);
  },
};

export const withdrawalService = {
  async getAllWithdrawals(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IWithdrawal[]>>(`/withdrawals${query}`);
  },
  async getMyWithdrawals(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IWithdrawal[]>>(`/withdrawals/my${query}`);
  },
};

export const walletService = {
  async getMyWallet() {
    return serverFetch<ApiResponse<IWalletSummary>>("/wallet/me");
  },
  async getMyWalletTransactions(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IWalletTransaction[]>>(
      `/wallet/transactions${query}`,
    );
  },
};

export const referralService = {
  async getAllApplications(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IReferralApplication[]>>(
      `/referral/applications${query}`,
    );
  },
  async getMyReferral() {
    return serverFetch<ApiResponse<IReferralMe>>("/referral/me");
  },
  async getDefaultReferralCode() {
    return serverFetch<ApiResponse<IDefaultReferralCode>>(
      "/referral/default-code",
    );
  },
  async getPartnerReferral() {
    return serverFetch<ApiResponse<IPartnerReferralDashboard>>(
      "/referral/partner",
    );
  },
};

export const agentApplicationService = {
  async getAllApplications(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IAgentApplication[]>>(
      `/agent-applications${query}`,
    );
  },
  async getMyApplication() {
    return serverFetch<ApiResponse<IAgentApplication>>("/agent-applications/me");
  },
};