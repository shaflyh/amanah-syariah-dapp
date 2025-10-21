"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLoan, useLoanInvestments } from "@/hooks/use-loans";
import { useCollateralWithMetadata } from "@/hooks/use-collateral";
import { formatAddress, getLoanStatusColor, getLoanStatusText } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { LoanOverview } from "@/components/loan/loan-overview";
import { InvestmentsList } from "@/components/loan/investment-list";
import { PaymentSchedule } from "@/components/loan/payment-schedule";
import { CollateralCard } from "@/components/collateral/collateral-card";
import { FundLoanModal } from "@/components/loan/fund-loan-modal";

export default function LoanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const loanId = parseInt(id);

  const { loan, isLoading: isLoadingLoan, refetch } = useLoan(loanId); // Add refetch
  const { investments, isLoading: isLoadingInvestments } = useLoanInvestments(loanId);
  const {
    collateral,
    metadata,
    isLoading: isLoadingCollateral,
  } = useCollateralWithMetadata(loan ? Number(loan.collateralTokenId) : 0);

  if (isLoadingLoan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading loan details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loan not found</p>
            <Button asChild className="mt-4">
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isPending = loan.status === 0;

  // handle successful funding
  const handleFundingSuccess = () => {
    refetch(); // Refresh loan data
    window.location.reload(); // Or use router.refresh() if using next/navigation
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Button variant="ghost" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Loan #{loan.loanId.toString()}</h1>
              <p className="text-muted-foreground">Borrower: {formatAddress(loan.borrower)}</p>
            </div>
            <Badge className={getLoanStatusColor(loan.status)}>
              {getLoanStatusText(loan.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <LoanOverview loan={loan} />
              <InvestmentsList investments={investments} isLoading={isLoadingInvestments} />
              <PaymentSchedule loan={loan} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <CollateralCard
                tokenId={loan.collateralTokenId}
                collateral={collateral}
                metadata={metadata}
                isLoading={isLoadingCollateral}
              />

              {/* Fund Loan Button - UPDATED */}
              {isPending && <FundLoanModal loan={loan} onSuccess={handleFundingSuccess} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
