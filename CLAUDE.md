# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Amanah Syariah is a Web3 P2P Sharia-compliant lending platform (dApp) built with Next.js 15, enabling users to request loans using NFT-backed collateral and allowing lenders to invest in loan opportunities. The platform operates on Ethereum Sepolia testnet.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start
```

Note: This project uses Next.js with Turbopack enabled for faster development and builds.

## Code Style

- Prettier is configured (see `.prettierrc.cjs`)
- Use double quotes, 2-space tabs, semicolons
- Line length limit: 100 characters
- TypeScript strict mode enabled
- Path alias: `@/*` maps to `./src/*`

## Architecture

### Smart Contract Integration

The dApp interacts with two main Ethereum smart contracts deployed on Sepolia:

1. **CollateralNFT** (`NEXT_PUBLIC_COLLATERAL_NFT_ADDRESS`): Manages NFT collateral (land, house, vehicle)
2. **LendingPlatform** (`NEXT_PUBLIC_LENDING_PLATFORM_ADDRESS`): Handles loan creation, funding, and repayment

Contract ABIs are stored in `src/lib/contracts/` as JSON artifacts. Contract addresses and ABIs are centrally exported from `src/lib/contracts/index.ts` via the `CONTRACTS` constant.

### Web3 Stack

- **Wagmi v2**: Ethereum hooks and utilities for contract interactions
- **RainbowKit**: Wallet connection UI
- **Viem v2**: Low-level Ethereum utilities
- **TanStack Query v5**: Async state management

Configuration:
- Wagmi config: `src/lib/wagmi.ts`
- Providers setup: `src/app/providers.tsx` (wraps entire app)
- Chain: Sepolia only

### State Management Pattern

Smart contract state is accessed via custom React hooks in `src/hooks/`:

- `use-loans.ts`: Fetch loans, filter by status, get loan investments
  - `useTotalLoans()`, `useLoan(id)`, `useAllLoans()`, `useLoansByStatus(status)`, `useLoanInvestments(id)`
- `use-collateral.ts`: Fetch user's collateral NFTs
- `use-investments.ts`: Fetch user's investment history
- `use-user-nfts.tsx`: Component-level hook for user NFT data

These hooks use wagmi's `useReadContract` and `useReadContracts` for batch queries. They return typed data matching interfaces in `src/types/index.ts`.

### Type System

Core types defined in `src/types/index.ts`:

- `Loan`: Complete loan structure from smart contract
- `LoanStatus`: Enum (PENDING, ACTIVE, COMPLETED, DEFAULTED, CANCELLED)
- `Investment`: Lender investment data
- `Collateral`: NFT collateral data
- `CollateralMetadata`: IPFS metadata structure for collateral assets

All blockchain addresses use Viem's `0x${string}` type for type safety.

### IPFS Integration

File uploads (collateral documents, images) use Pinata:
- API routes: `src/app/api/upload-to-ipfs/` and `src/app/api/upload-metadata/`
- Credentials: Configured in `.env.local` (PINATA_JWT, PINATA_API_KEY, PINATA_SECRET_API_KEY)
- Pattern: Client uploads to Next.js API route, which proxies to Pinata and returns IPFS hash

### UI Components

Organized by feature in `src/components/`:
- `ui/`: shadcn/ui components (Radix UI + Tailwind)
- `loan/`: Loan-specific components
- `admin/`: Admin dashboard components
- `investment/`: Investment-related components
- `collateral/`: Collateral management components
- `home/`: Homepage components (includes framer-motion animations)
- `layout/`: Navigation and layout components

shadcn/ui configuration in `components.json` (New York style, RSC enabled).

### Routing Structure

Next.js 15 App Router (`src/app/`):
- `/` - Homepage
- `/marketplace` - Browse available loans
- `/loan/[id]` - Individual loan details
- `/my-loans` - User's borrowed loans
- `/my-investments` - User's investments
- `/admin` - Admin dashboard (restricted to NEXT_PUBLIC_ADMIN_ADDRESS)
- `/api/*` - Server API routes for IPFS uploads and NFT checks

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect Cloud project ID
- `NEXT_PUBLIC_ADMIN_ADDRESS`: Admin wallet address
- `NEXT_PUBLIC_COLLATERAL_NFT_ADDRESS`: CollateralNFT contract address
- `NEXT_PUBLIC_LENDING_PLATFORM_ADDRESS`: LendingPlatform contract address
- `PINATA_JWT`, `PINATA_API_KEY`, `PINATA_SECRET_API_KEY`: Pinata credentials
- `NEXT_PUBLIC_CHAIN_ID`: 11155111 (Sepolia)

## Key Patterns

### Contract Interactions

Always use the centralized CONTRACTS export:
```typescript
import { CONTRACTS } from "@/lib/contracts";

const { data } = useReadContract({
  ...CONTRACTS.LendingPlatform,
  functionName: "getLoan",
  args: [loanId],
});
```

### Batch Contract Reads

For fetching multiple loans or NFTs, use `useReadContracts` with an array of contract calls for parallel execution.

### BigInt Handling

Smart contract numbers are returned as `bigint`. Convert for display or comparison:
```typescript
const loanAmount = Number(loan.principal); // or use formatEther from viem
```

### Client Components

Web3 hooks require client-side rendering. Always use `"use client"` directive at the top of files using wagmi hooks.

## Styling

- Tailwind CSS v4 with PostCSS
- CSS variables for theming (defined in `src/app/globals.css`)
- Dark mode support via `next-themes`
- Animation library: `framer-motion` for homepage animations
- Utility: `tailwind-merge` for conditional class merging
- Toast notifications: `sonner`
