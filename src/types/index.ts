// Loan status enum matching smart contract
export enum LoanStatus {
  PENDING = 0,
  ACTIVE = 1,
  COMPLETED = 2,
  DEFAULTED = 3,
  CANCELLED = 4,
}

// Loan structure from smart contract
export interface Loan {
  loanId: bigint;
  borrower: `0x${string}`;
  collateralTokenId: bigint;
  principal: bigint;
  margin: bigint;
  totalRepayment: bigint;
  monthlyPayment: bigint;
  duration: bigint;
  status: LoanStatus;
  totalFunded: bigint;
  totalRepaid: bigint;
  paymentsRemaining: bigint;
  createdAt: bigint;
  fundedAt: bigint;
  dueDate: bigint;
}

// Investment structure
export interface Investment {
  lender: `0x${string}`;
  amount: bigint;
  sharePercentage: bigint;
}

// Collateral structure
export interface Collateral {
  metadataURI: string;
  locked: boolean;
  loanId: bigint;
}

// Metadata JSON structure (stored in IPFS)
export interface CollateralMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash of image
  attributes: {
    type: "LAND" | "HOUSE" | "VEHICLE";
    estimatedValue: string; // in ETH
    location?: string;
    area?: string;
    certificateNumber?: string;
    documents: string[]; // Array of IPFS hashes
  };
}
