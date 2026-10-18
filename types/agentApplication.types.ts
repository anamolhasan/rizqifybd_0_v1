import type { AgentApplicationStatus } from "./enums";
import type { IAppUser } from "./user.types";

export interface IAgentApplication {
  id: string;
  appUserId: string;
  status: AgentApplicationStatus;
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

export interface ISubmitAgentApplicationPayload {
  reason?: string;
}

export interface IReviewAgentApplicationPayload {
  status: AgentApplicationStatus;
  rejectionReason?: string;
}

// Shape of GET /agent-applications/me: the caller's application (nullable so a
// user who never applied can be offered the apply flow) plus the derived
// reseller/commission cache flag.
export interface IAgentStatus {
  application: IAgentApplication | null;
  canEarn: boolean;
}

export interface IAgentApplicationListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: AgentApplicationStatus | "";
}

export interface IAgentApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}