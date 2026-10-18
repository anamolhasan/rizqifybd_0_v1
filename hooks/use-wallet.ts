"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import { getMyWallet } from "@/lib/wallet-api";
import type { IWalletSummary } from "@/types/wallet.types";

export const WALLET_QUERY_KEY = "wallet" as const;
export const MY_WALLET_QUERY_KEY = [WALLET_QUERY_KEY, "me"] as const;

export function useMyWallet(options: { enabled?: boolean } = {}) {
  return useQuery<IWalletSummary, ApiError>({
    queryKey: MY_WALLET_QUERY_KEY,
    queryFn: getMyWallet,
    enabled: options.enabled ?? true,
    retry: false,
    staleTime: 30 * 1000,
  });
}
