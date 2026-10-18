import { buildQueryString } from "@/lib/query";
import { serverFetch } from "@/lib/api/server-fetch";
import type { ApiResponse, ListQueryParams } from "@/types/api.types";
import type { IUser } from "@/types/user.types";
import type { IOrder } from "@/types/order.types";
import type { IOperatorOffer } from "@/types/operator-offer.types";
import type { IOperator } from "@/types/operator.types";
import type { IWithdrawal } from "@/types/withdrawal.types";
import type { IWalletSummary, IWalletTransaction } from "@/types/wallet.types";
import type {
  IReferralApplication,
  IReferralMe,
  IPartnerReferralDashboard,
  IDefaultReferralCode,
} from "@/types/referral.types";
import type { IAgentApplication, IAgentStatus } from "@/types/agentApplication.types";
import type {
  IAffiliateApplication,
  IAffiliateStatus,
} from "@/types/affiliateApplication.types";
import type {
  IAffiliateConversion,
  IAffiliateDashboard,
  IAffiliateLink,
  IAgentDashboard,
  IAgentSale,
  ICreateAffiliateLinkPayload,
  IEarningView,
  IReferralMilestone,
  IUpdateAffiliateLinkPayload,
} from "@/types/program.types";

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

export const operatorOfferService = {
  async getOperatorOffers(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IOperatorOffer[]>>(`/operator-offers${query}`);
  },
  async getOperatorOfferById(id: string) {
    return serverFetch<ApiResponse<IOperatorOffer>>(`/operator-offers/${id}`);
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
  async getMilestone() {
    return serverFetch<ApiResponse<IReferralMilestone>>("/referral/milestone");
  },
  async getEarnings(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IEarningView[]>>(
      `/referral/earnings${query}`,
    );
  },
};

// ─── Income programmes ───────────────────────────────────────────────────────
// The dashboard endpoints are readable by any authenticated account (an
// applicant must be able to see where their application stands); the sales,
// links, conversions and earnings endpoints return 403 until the relevant
// application is approved, so callers tolerate that and render the
// approved-only panels conditionally.
export const agentService = {
  async getDashboard() {
    return serverFetch<ApiResponse<IAgentDashboard>>("/agent/dashboard");
  },
  async getMySales(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IAgentSale[]>>(`/agent/sales${query}`);
  },
  async getMyEarnings(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IEarningView[]>>(`/agent/earnings${query}`);
  },
};

export const affiliateService = {
  async getDashboard() {
    return serverFetch<ApiResponse<IAffiliateDashboard>>("/affiliate/dashboard");
  },
  async getMyLinks(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IAffiliateLink[]>>(`/affiliate/links${query}`);
  },
  async createLink(payload: ICreateAffiliateLinkPayload) {
    return serverFetch<ApiResponse<IAffiliateLink>>("/affiliate/links", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async updateLink(id: string, payload: IUpdateAffiliateLinkPayload) {
    return serverFetch<ApiResponse<IAffiliateLink>>(`/affiliate/links/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  async getMyConversions(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IAffiliateConversion[]>>(
      `/affiliate/conversions${query}`,
    );
  },
  async getMyEarnings(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IEarningView[]>>(
      `/affiliate/earnings${query}`,
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
    return serverFetch<ApiResponse<IAgentStatus>>("/agent-applications/me");
  },
};

export const affiliateApplicationService = {
  async getAllApplications(params: ListQueryParams = {}) {
    const query = buildQueryString(params);
    return serverFetch<ApiResponse<IAffiliateApplication[]>>(
      `/affiliate-applications${query}`,
    );
  },
  async getMyApplication() {
    return serverFetch<ApiResponse<IAffiliateStatus>>(
      "/affiliate-applications/me",
    );
  },
};