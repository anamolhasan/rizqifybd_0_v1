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