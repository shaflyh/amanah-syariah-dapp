"use client";

import { useReadContract, useAccount } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get user's NFT balance
 */
export function useUserNFTBalance() {
  const { address } = useAccount();

  const { data, isLoading, error } = useReadContract({
    ...CONTRACTS.CollateralNFT,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    balance: data ? Number(data) : 0,
    isLoading,
    error,
  };
}

/**
 * Hook to get all NFTs owned by user
 * Note: This is a simplified version. In production, you'd use The Graph or indexer.
 */
export function useUserNFTs() {
  const { address } = useAccount();
  const { data: totalSupply } = useReadContract({
    ...CONTRACTS.CollateralNFT,
    functionName: "totalSupply",
  });

  // This queries all NFTs to find user's - not efficient but OK for testnet
  return useQuery({
    queryKey: ["user-nfts", address],
    queryFn: async () => {
      if (!address || !totalSupply) return [];

      const total = Number(totalSupply);
      const userNFTs = [];

      // Check each NFT (1 to totalSupply)
      for (let tokenId = 1; tokenId <= total; tokenId++) {
        try {
          const owner = await fetch(
            `/api/check-nft-owner?tokenId=${tokenId}&address=${address}`
          ).then((r) => r.json());

          if (owner.isOwner) {
            userNFTs.push({
              tokenId,
              locked: owner.locked,
            });
          }
        } catch (err) {
          console.error(`Error checking NFT ${tokenId}:`, err);
        }
      }

      return userNFTs;
    },
    enabled: !!address && !!totalSupply,
  });
}
