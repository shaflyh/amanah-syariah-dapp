"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loan, Investment } from "@/types";
import { useLoanInvestments } from "@/hooks/use-loans";
import { formatWeiToEth, getLoanStatusColor, getLoanStatusText } from "@/lib/utils";

interface InvestmentCardProps {
  loan: Loan;
  userAddress: string;
}

export function InvestmentCard({ loan, userAddress }: InvestmentCardProps) {
  const { investments } = useLoanInvestments(Number(loan.loanId));
  const [myInvestment, setMyInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    if (investments) {
      const mine = (investments as Investment[]).find(
        (inv) => inv.lender.toLowerCase() === userAddress.toLowerCase()
      );
      setMyInvestment(mine || null);
    }
  }, [investments, userAddress]);

  if (!myInvestment || myInvestment.amount === 0n) return null;

  // Calculate returns
  const myShare = Number(myInvestment.sharePercentage) / 10000; // Convert from basis points
  const expectedReturn = (loan.totalRepayment * myInvestment.amount) / loan.principal;
  const profit = expectedReturn - myInvestment.amount;
  const received = (loan.totalRepaid * myInvestment.amount) / loan.principal;
  const remaining = expectedReturn - received;

  const isActive = loan.status === 1;
  const isCompleted = loan.status === 2;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">Pinjaman #{loan.loanId.toString()}</h3>
            <p className="text-sm text-muted-foreground">
              Bagian Anda: {(myShare * 100).toFixed(2)}%
            </p>
          </div>
          <Badge className={getLoanStatusColor(loan.status)}>
            {getLoanStatusText(loan.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Investment Amount */}
        <div>
          <p className="text-sm text-muted-foreground">Investasi Anda</p>
          <p className="text-2xl font-bold">{formatWeiToEth(myInvestment.amount)} ETH</p>
        </div>

        {/* Returns */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Imbal Hasil Diharapkan</p>
            <p className="font-medium text-green-600">{formatWeiToEth(expectedReturn)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Keuntungan</p>
            <p className="font-medium text-green-600">+{formatWeiToEth(profit)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Diterima Sejauh Ini</p>
            <p className="font-medium">{formatWeiToEth(received)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tersisa</p>
            <p className="font-medium">{formatWeiToEth(remaining)} ETH</p>
          </div>
        </div>

        {/* Progress */}
        {isActive && (
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progres Pembayaran</span>
              <span className="font-medium">
                {Number(loan.duration) - Number(loan.paymentsRemaining)} /{" "}
                {loan.duration.toString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    ((Number(loan.duration) - Number(loan.paymentsRemaining)) /
                      Number(loan.duration)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ Pinjaman selesai! Anda menerima {formatWeiToEth(expectedReturn)} ETH
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/loan/${loan.loanId}`}>Lihat Detail Pinjaman</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
