import { apiRequest } from "./api";

import type { IWalletSummary } from "@/types/wallet.types";

// The backend exposes the acting user's wallet at /api/v1/wallet.
const WALLET_ENDPOINT = "/wallet";

export async function getMyWallet(): Promise<IWalletSummary> {
  const { data } = await apiRequest<IWalletSummary>(`${WALLET_ENDPOINT}/me`, {
    method: "GET",
  });

  return data;
}
