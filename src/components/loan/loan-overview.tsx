import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loan } from "@/types";
import { formatWeiToEth, calculateFundingProgress, formatDate } from "@/lib/utils";
import { Coins, TrendingUp, Calendar, Percent, Clock, CreditCard } from "lucide-react";

export function LoanOverview({ loan }: { loan: Loan }) {
  const fundingProgress = calculateFundingProgress(loan.totalFunded, loan.principal);
  const isPending = loan.status === 0;
  const isActive = loan.status === 1;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Coins className="w-6 h-6" />
          Ringkasan Pinjaman
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Detail informasi pinjaman</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Pokok Pinjaman</p>
            </div>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {formatWeiToEth(loan.principal)} ETH
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Total Pengembalian
              </p>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">
              {formatWeiToEth(loan.totalRepayment)} ETH
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Percent className="w-5 h-5 text-muted-foreground mt-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Margin</p>
              <div className="flex flex-row gap-2 items-center">
                <p className="font-bold">{formatWeiToEth(loan.margin)} ETH</p>
                <p className="text-xs text-muted-foreground">
                  ({((Number(loan.margin) / Number(loan.principal)) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 text-muted-foreground mt-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Durasi</p>
              <p className="font-bold">{loan.duration.toString()} bulan</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <CreditCard className="w-5 h-5 text-muted-foreground mt-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cicilan Bulanan</p>
              <p className="font-bold">{formatWeiToEth(loan.monthlyPayment)} ETH</p>
            </div>
          </div>
        </div>

        {/* Payments Progress */}
        {isActive && (
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Progres Pembayaran
              </p>
              <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {loan.paymentsRemaining.toString()} / {loan.duration.toString()} tersisa
              </p>
            </div>
            <Progress
              value={
                ((Number(loan.duration) - Number(loan.paymentsRemaining)) / Number(loan.duration)) *
                100
              }
              className="h-2"
            />
          </div>
        )}

        {/* Funding Progress */}
        {isPending && (
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Progres Pendanaan
              </p>
              <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                {fundingProgress.toFixed(1)}%
              </p>
            </div>
            <Progress value={fundingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatWeiToEth(loan.totalFunded)} / {formatWeiToEth(loan.principal)} ETH terdanai
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-xs text-muted-foreground">Dibuat</p>
              <p className="font-medium text-sm">{formatDate(loan.createdAt)}</p>
            </div>
          </div>
          {loan.fundedAt > 0n && (
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Terdanai</p>
                <p className="font-medium text-sm">{formatDate(loan.fundedAt)}</p>
              </div>
            </div>
          )}
          {loan.dueDate > 0n && isActive && (
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Jatuh Tempo Berikutnya</p>
                <p className="font-medium text-sm">{formatDate(loan.dueDate)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
