"use client";

import { useAccount } from "wagmi";
import { useAllLoans } from "./use-loans";
import { Loan, Investment } from "@/types";
import { useMemo } from "react";

/**
 * Hook to get all loans where user is an investor
 */
export function useMyInvestments() {
  const { address } = useAccount();
  const { loans, isLoading, error } = useAllLoans();

  const myInvestments = useMemo(() => {
    if (!address || !loans) return [];

    const investments: Array<{
      loan: Loan;
      investment: Investment;
    }> = [];

    // Check each loan for user's investments
    // Note: This is simplified - in production, use The Graph or indexer
    for (const loan of loans) {
      // We'll need to fetch investments for each loan
      // For now, this is a placeholder - we'll fetch in the component
      investments.push({
        loan,
        investment: {
          lender: address,
          amount: 0n,
          sharePercentage: 0n,
        },
      });
    }

    return investments;
  }, [address, loans]);

  return {
    investments: myInvestments,
    isLoading,
    error,
  };
}
