"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLoan, useLoanInvestments } from "@/hooks/use-loans";
import { useCollateralWithMetadata } from "@/hooks/use-collateral";
import { formatAddress, getLoanStatusColor, getLoanStatusText } from "@/lib/utils";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Memuat detail pinjaman...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Card className="border-dashed">
              <CardContent className="py-20 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">
                  Pinjaman tidak ditemukan
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Pinjaman dengan ID ini tidak ada atau telah dihapus
                </p>
                <Button asChild size="lg">
                  <Link href="/marketplace">Kembali ke Marketplace</Link>
                </Button>
              </CardContent>
            </Card>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            {/* Back Button */}
            <Button variant="ghost" size="lg" asChild className="w-fit">
              <Link href="/marketplace">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Marketplace
              </Link>
            </Button>

            {/* Custom Header for Detail Page */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">Pinjaman #{loan.loanId.toString()}</h1>
                    <Badge className={getLoanStatusColor(loan.status)}>
                      {getLoanStatusText(loan.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Peminjam:</span>{" "}
                      <span className="font-mono">{formatAddress(loan.borrower)}</span>
                    </div>
                  </div>
                </div>

                {/* Fund Loan Button - Moved to Header */}
                {isPending && (
                  <div className="flex-shrink-0">
                    <FundLoanModal loan={loan} onSuccess={handleFundingSuccess} />
                  </div>
                )}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <LoanOverview loan={loan} />
                <InvestmentsList investments={investments} isLoading={isLoadingInvestments} />
                <PaymentSchedule loan={loan} onPaymentSuccess={handleFundingSuccess} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <CollateralCard
                  tokenId={loan.collateralTokenId}
                  collateral={collateral}
                  metadata={metadata}
                  isLoading={isLoadingCollateral}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
