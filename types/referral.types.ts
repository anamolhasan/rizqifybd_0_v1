import type { Role, ReferralApplicationStatus } from "./enums";
import type { IAppUser } from "./user.types";

export interface IReferralApplication {
  id: string;
  appUserId: string;
  status: ReferralApplicationStatus;
  promotionMethod: ReferralPromotionMethod | null;
  promotionUrl: string | null;
  reason: string | null;
  termsAccepted: boolean;
  reviewedById: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  appUser?: (IAppUser & {
    authUser?: { name: string; email: string };
  }) | null;
  reviewedBy?: { name: string; email: string } | null;
}

export interface IReferralMe {
  application: IReferralApplication | null;
  referrer: (IAppUser & { authUser: { name: string; email: string } }) | null;
  referrals: {
    id: string;
    createdAt: string;
    authUser: { name: string; email: string };
  }[];
  referralCode: string;
  eligibility: {
    approved: boolean;
    activeReferredCount: number;
    eligible: boolean;
  };
  referralIncomeEligible: boolean;
}

export interface IPartnerReferralItem {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  isActive: boolean;
}

export interface IPartnerReferralDashboard {
  referralCode: string;
  applicationStatus: ReferralApplicationStatus;
  totalReferredCount: number;
  activeReferredCount: number;
  targetActiveReferrals: number;
  referralIncomeEligible: boolean;
  referrals: IPartnerReferralItem[];
}

export interface IDefaultReferralCode {
  referralCode: string | null;
}

export interface IDefaultReferralSetting {
  referralCode: string | null;
  referrer: {
    name: string;
    email: string;
    role: Role;
  } | null;
}

export interface IReviewApplicationPayload {
  status: ReferralApplicationStatus;
  rejectionReason?: string;
}

export interface IReferralApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface IReferralApplicationListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: ReferralApplicationStatus | "";
}

export type ReferralPromotionMethod =
  | "SOCIAL_MEDIA"
  | "MESSAGING_APPS"
  | "FRIENDS_FAMILY"
  | "COMMUNITY_GROUP"
  | "OTHER";

export interface ISubmitReferralApplicationPayload {
  promotionMethod: ReferralPromotionMethod;
  promotionUrl?: string;
  reason: string;
  termsAccepted: boolean;
}