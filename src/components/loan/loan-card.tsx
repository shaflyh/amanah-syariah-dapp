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

interface LoanCardProps {
  loan: Loan;
}

export function LoanCard({ loan }: LoanCardProps) {
  const fundingProgress = calculateFundingProgress(loan.totalFunded, loan.principal);

  const isPending = loan.status === 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">Pinjaman #{loan.loanId.toString()}</h3>
            <p className="text-sm text-muted-foreground">
              NFT Agunan #{loan.collateralTokenId.toString()}
            </p>
          </div>
          <Badge className={getLoanStatusColor(loan.status)}>
            {getLoanStatusText(loan.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Principal Amount */}
        <div>
          <p className="text-sm text-muted-foreground">Pokok Pinjaman</p>
          <p className="text-2xl font-bold">{formatWeiToEth(loan.principal)} ETH</p>
        </div>

        {/* Funding Progress (for PENDING loans) */}
        {isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progres Pendanaan</span>
              <span className="font-medium">{fundingProgress.toFixed(0)}%</span>
            </div>
            <Progress value={fundingProgress} />
            <p className="text-xs text-muted-foreground">
              {formatWeiToEth(loan.totalFunded)} / {formatWeiToEth(loan.principal)} ETH
            </p>
          </div>
        )}

        {/* Loan Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tingkat Margin</p>
            <p className="font-medium">
              {((Number(loan.margin) / Number(loan.principal)) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Durasi</p>
            <p className="font-medium">{loan.duration.toString()} bulan</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cicilan Bulanan</p>
            <p className="font-medium">{formatWeiToEth(loan.monthlyPayment)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Pengembalian</p>
            <p className="font-medium">{formatWeiToEth(loan.totalRepayment)} ETH</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
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
