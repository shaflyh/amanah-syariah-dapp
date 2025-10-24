"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FundLoanModal } from "./fund-loan-modal";
import { Loan } from "@/types";
import {
  formatWeiToEth,
  getLoanStatusColor,
  getLoanStatusText,
  calculateFundingProgress,
} from "@/lib/utils";
import { useCollateralWithMetadata } from "@/hooks/use-collateral";
import { Building2, Loader2, ImageIcon } from "lucide-react";

interface LoanCardProps {
  loan: Loan;
}

export function LoanCard({ loan }: LoanCardProps) {
  const fundingProgress = calculateFundingProgress(loan.totalFunded, loan.principal);
  const isPending = loan.status === 0;

  // Fetch collateral metadata to get the image
  const { metadata, isLoading: isLoadingMetadata } = useCollateralWithMetadata(
    Number(loan.collateralTokenId)
  );

  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group pt-0">
      {/* Collateral Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {isLoadingMetadata ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : metadata?.image ? (
          <>
            <img
              src={metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
              alt={metadata.name || "Collateral"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground opacity-30" />
          </div>
        )}

        {/* Status Badge - Floating on Image */}
        <div className="absolute top-3 right-3">
          <Badge className={`${getLoanStatusColor(loan.status)} shadow-lg`}>
            {getLoanStatusText(loan.status)}
          </Badge>
        </div>

        {/* Loan ID & Collateral Type - Bottom Left */}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-lg font-bold drop-shadow-lg">Pinjaman #{loan.loanId.toString()}</h3>
          {metadata && (
            <div className="flex items-center gap-1 mt-1">
              <Building2 className="w-3 h-3" />
              <p className="text-xs font-medium drop-shadow-lg">
                {metadata.attributes.type} • NFT #{loan.collateralTokenId.toString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <CardContent className="space-y-4">
        {/* Principal Amount */}
        <div>
          <p className="text-sm text-muted-foreground">Pokok Pinjaman</p>
          <p className="text-2xl font-bold">{formatWeiToEth(loan.principal)} ETH</p>
        </div>

        {/* Funding Progress (for PENDING loans) */}
        {isPending && (
          <div className="space-y-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-orange-900 dark:text-orange-100">
                Progres Pendanaan
              </span>
              <span className="font-bold text-orange-700 dark:text-orange-300">
                {fundingProgress.toFixed(0)}%
              </span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {formatWeiToEth(loan.totalFunded)} / {formatWeiToEth(loan.principal)} ETH terdanai
            </p>
          </div>
        )}

        {/* Loan Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="font-bold">
              {((Number(loan.margin) / Number(loan.principal)) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">Durasi</p>
            <p className="font-bold">{loan.duration.toString()} bulan</p>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">Cicilan/bulan</p>
            <p className="font-bold">{formatWeiToEth(loan.monthlyPayment)} ETH</p>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">Total Return</p>
            <p className="font-bold">{formatWeiToEth(loan.totalRepayment)} ETH</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1" size="lg">
          <Link href={`/loan/${loan.loanId}`}>Lihat Detail</Link>
        </Button>
        {isPending && (
          <div className="flex-1">
            <FundLoanModal loan={loan} onSuccess={() => window.location.reload()} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
