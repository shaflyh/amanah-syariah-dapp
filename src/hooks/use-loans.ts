"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACTS } from "@/lib/contracts";
import { Investment, Loan, LoanStatus } from "@/types";

/**
 * Hook to get total number of loans
 */
export function useTotalLoans() {
  const { data, isLoading, error } = useReadContract({
    ...CONTRACTS.LendingPlatform,
    functionName: "totalLoans",
  });

  return {
    totalLoans: data ? Number(data) : 0,
    isLoading,
    error,
  };
}

/**
 * Hook to get a single loan by ID
 */
export function useLoan(loanId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...CONTRACTS.LendingPlatform,
    functionName: "getLoan",
    args: [BigInt(loanId)],
  });

  return {
    loan: data as Loan | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get all loans
 * Fetches multiple loans in parallel
 */
export function useAllLoans() {
  const { totalLoans, isLoading: isLoadingTotal } = useTotalLoans();

  // Create array of contract calls for all loans
  const contracts = Array.from({ length: totalLoans }, (_, i) => ({
    ...CONTRACTS.LendingPlatform,
    functionName: "getLoan" as const,
    args: [BigInt(i + 1)] as const, // Loan IDs start from 1
  }));

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: contracts as any,
  });

  // Parse and filter results
  const loans: Loan[] = data
    ? data.map((result) => result.result as Loan).filter((loan) => loan !== undefined)
    : [];

  return {
    loans,
    isLoading: isLoadingTotal || isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get loans filtered by status
 */
export function useLoansByStatus(status?: LoanStatus) {
  const { loans, isLoading, error, refetch } = useAllLoans();

  const filteredLoans =
    status !== undefined ? loans.filter((loan) => loan.status === status) : loans;

  return {
    loans: filteredLoans,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get loan investments (lenders)
 */
export function useLoanInvestments(loanId: number) {
  const { data, isLoading, error } = useReadContract({
    ...CONTRACTS.LendingPlatform,
    functionName: "getLoanInvestments",
    args: [BigInt(loanId)],
  });

  return {
    investments: (data as Investment[]) || [],
    isLoading,
    error,
  };
}
