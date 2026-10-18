// Public shapes for the three income programmes (Agent / Referral / Affiliate).
// Every field here is already scoped to the caller server-side: the API never
// exposes commission configuration (rule ids, other agents' rates or anyone
// else's data), so nothing in these types represents private configuration.

export type EarningProgramName = "AGENT" | "REFERRAL" | "AFFILIATE";
export type EarningStatusName = "PENDING" | "AVAILABLE" | "REVERSED";

export interface IEarningView {
  id: string;
  program: EarningProgramName;
  status: EarningStatusName;
  amount: number;
  currency: string;
  ruleType: "FIXED" | "PERCENTAGE";
  ruleValue: number;
  ruleScope: "PRODUCT" | "PRODUCT_VARIANT" | "OPERATOR_OFFER" | "GLOBAL";
  baseAmount: number;
  description: string | null;
  orderId: string | null;
  productOrderId: string | null;
  availableAt: string | null;
  reversedAt: string | null;
  createdAt: string;
}

export interface IEarningsSummary {
  pending: number;
  available: number;
  reversed: number;
}

export interface IAgentDashboard {
  program: "AGENT";
  application: {
    status: string | null;
    appliedAt: string | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
  };
  approved: boolean;
  canEarn: boolean;
  sales: {
    completedOrders: number;
    totalSales: number;
    totalCommission: number;
  };
  earnings: IEarningsSummary;
  wallet: {
    balance: number;
    totalEarned: number;
  };
}

export interface IAgentSale {
  orderId: string;
  operatorOfferId: string;
  targetNumber: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  commissionAmount: number;
  completedAt: string | null;
  createdAt: string;
}

export interface IAffiliateLink {
  id: string;
  code: string;
  productId: string | null;
  label: string | null;
  isActive: boolean;
  clickCount: number;
  attributionCount: number;
  createdAt: string;
}

export interface ICreateAffiliateLinkPayload {
  productId?: string | null;
  label?: string | null;
}

export interface IUpdateAffiliateLinkPayload {
  label?: string | null;
  isActive?: boolean;
}

export interface IAffiliateConversion {
  id: string;
  productOrderId: string;
  productId: string;
  orderAmount: number;
  amount: number;
  currency: string;
  status: EarningStatusName;
  convertedAt: string;
  availableAt: string | null;
  reversedAt: string | null;
}

export interface IAffiliateDashboard {
  program: "AFFILIATE";
  application: {
    status: string | null;
    appliedAt: string | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
  };
  approved: boolean;
  links: {
    total: number;
    active: number;
    clicks: number;
  };
  attribution: {
    customersAttributed: number;
  };
  conversions: {
    total: number;
    orderAmount: number;
    commission: number;
  };
  earnings: IEarningsSummary;
  wallet: {
    balance: number;
    totalEarned: number;
  };
}

export interface IReferralMilestone {
  requiredReferralCount: number;
  activeReferralCount: number;
  qualified: boolean;
  awarded: boolean;
  awardedAt: string | null;
  amount: number;
  currency: string;
  configured: boolean;
  settingKey: string;
}
