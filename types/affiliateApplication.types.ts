import type { AffiliateApplicationStatus } from "./enums";
import type { IAppUser } from "./user.types";

export interface IAffiliateApplication {
  id: string;
  appUserId: string;
  status: AffiliateApplicationStatus;
  reason: string | null;
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

export interface ISubmitAffiliateApplicationPayload {
  reason?: string;
}

export interface IReviewAffiliateApplicationPayload {
  status: AffiliateApplicationStatus;
  rejectionReason?: string;
}

// Shape of GET /affiliate-applications/me: the caller's application (nullable so
// a user who never applied can be offered the apply flow). The affiliate program
// has no derived cache flag, unlike the agent program's `canEarn`.
export interface IAffiliateStatus {
  application: IAffiliateApplication | null;
}

export interface IAffiliateApplicationListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: AffiliateApplicationStatus | "";
}

export interface IAffiliateApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
