import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Wei to ETH with specified decimals
 */
export function formatWeiToEth(wei: bigint, decimals = 4): string {
  return Number(formatEther(wei)).toFixed(decimals);
}

/**
 * Format address to short version
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get loan status badge color
 */
export function getLoanStatusColor(status: number) {
  const colors = {
    0: "bg-yellow-100 text-yellow-800", // PENDING
    1: "bg-blue-100 text-blue-800", // ACTIVE
    2: "bg-green-100 text-green-800", // COMPLETED
    3: "bg-red-100 text-red-800", // DEFAULTED
    4: "bg-gray-100 text-gray-800", // CANCELLED
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
}

/**
 * Get loan status text
 */
export function getLoanStatusText(status: number): string {
  const texts = {
    0: "Pending",
    1: "Active",
    2: "Completed",
    3: "Defaulted",
    4: "Cancelled",
  };
  return texts[status as keyof typeof texts] || "Unknown";
}

/**
 * Calculate funding progress percentage
 */
export function calculateFundingProgress(totalFunded: bigint, principal: bigint): number {
  if (principal === 0n) return 0;
  return Number((totalFunded * 100n) / principal);
}

/**
 * Format date from timestamp
 */
export function formatDate(timestamp: bigint): string {
  if (timestamp === 0n) return "N/A";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
