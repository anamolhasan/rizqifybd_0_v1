import { apiRequest } from "./api";

import type {
  IAgentApplication,
  IAgentStatus,
  ISubmitAgentApplicationPayload,
} from "@/types/agentApplication.types";

// The backend exposes agent applications at /api/v1/agent-applications.
const AGENT_APPLICATION_ENDPOINT = "/agent-applications";

export async function getMyAgentApplication(): Promise<IAgentStatus> {
  const { data } = await apiRequest<IAgentStatus>(
    `${AGENT_APPLICATION_ENDPOINT}/me`,
    { method: "GET" },
  );

  return data;
}

export async function submitAgentApplication(
  payload: ISubmitAgentApplicationPayload = {},
): Promise<IAgentApplication> {
  const { data } = await apiRequest<IAgentApplication>(
    AGENT_APPLICATION_ENDPOINT,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return data;
}
