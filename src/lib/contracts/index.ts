import CollateralNFTArtifact from "./CollateralNFT.json";
import LendingPlatformArtifact from "./LendingPlatform.json";

export const COLLATERAL_NFT_ADDRESS = process.env
  .NEXT_PUBLIC_COLLATERAL_NFT_ADDRESS as `0x${string}`;
export const LENDING_PLATFORM_ADDRESS = process.env
  .NEXT_PUBLIC_LENDING_PLATFORM_ADDRESS as `0x${string}`;

// Extract ABIs from artifacts
export const CollateralNFTABI = CollateralNFTArtifact.abi;
export const LendingPlatformABI = LendingPlatformArtifact.abi;

// Type helpers
export const CONTRACTS = {
  CollateralNFT: {
    address: COLLATERAL_NFT_ADDRESS,
    abi: CollateralNFTABI,
  },
  LendingPlatform: {
    address: LENDING_PLATFORM_ADDRESS,
    abi: LendingPlatformABI,
  },
} as const;
