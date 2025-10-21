"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { Collateral, CollateralMetadata } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get collateral NFT data
 */
export function useCollateral(tokenId: number) {
  const { data, isLoading, error } = useReadContract({
    ...CONTRACTS.CollateralNFT,
    functionName: "getCollateral",
    args: [BigInt(tokenId)],
  });

  return {
    collateral: data as Collateral | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to fetch metadata from IPFS
 */
export function useCollateralMetadata(metadataURI?: string) {
  return useQuery({
    queryKey: ["collateral-metadata", metadataURI],
    queryFn: async () => {
      if (!metadataURI) return null;

      // Convert IPFS URI to HTTP gateway
      const httpUrl = metadataURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

      const response = await fetch(httpUrl);
      if (!response.ok) throw new Error("Failed to fetch metadata");

      return response.json() as Promise<CollateralMetadata>;
    },
    enabled: !!metadataURI,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get collateral with metadata
 */
export function useCollateralWithMetadata(tokenId: number) {
  const { collateral, isLoading: isLoadingCollateral } = useCollateral(tokenId);
  const { data: metadata, isLoading: isLoadingMetadata } = useCollateralMetadata(
    collateral?.metadataURI
  );

  return {
    collateral,
    metadata,
    isLoading: isLoadingCollateral || isLoadingMetadata,
  };
}
