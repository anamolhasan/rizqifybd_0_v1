import type { ReferralApplicationStatus } from "./enums";
import type { IAppUser } from "./user.types";

export interface IReferralApplication {
  id: string;
  appUserId: string;
  status: ReferralApplicationStatus;
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
  eligibility: {
    approved: boolean;
    activeReferredCount: number;
    eligible: boolean;
  };
  referralIncomeEligible: boolean;
}

export interface IReviewApplicationPayload {
  status: ReferralApplicationStatus;
  rejectionReason?: string;
}