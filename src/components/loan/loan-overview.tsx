import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loan } from "@/types";
import { formatWeiToEth, calculateFundingProgress, formatDate } from "@/lib/utils";

export function LoanOverview({ loan }: { loan: Loan }) {
  const fundingProgress = calculateFundingProgress(loan.totalFunded, loan.principal);
  const isPending = loan.status === 0;
  const isActive = loan.status === 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Pinjaman</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Pokok Pinjaman</p>
            <p className="text-2xl font-bold">{formatWeiToEth(loan.principal)} ETH</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Pengembalian</p>
            <p className="text-2xl font-bold">{formatWeiToEth(loan.totalRepayment)} ETH</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Margin</p>
            <p className="text-lg font-semibold">
              {formatWeiToEth(loan.margin)} ETH (
              {((Number(loan.margin) / Number(loan.principal)) * 100).toFixed(1)}%)
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Durasi</p>
            <p className="text-lg font-semibold">{loan.duration.toString()} bulan</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cicilan Bulanan</p>
            <p className="text-lg font-semibold">{formatWeiToEth(loan.monthlyPayment)} ETH</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cicilan Tersisa</p>
            <p className="text-lg font-semibold">
              {loan.paymentsRemaining.toString()} / {loan.duration.toString()}
            </p>
          </div>
        </div>

        {/* Funding Progress */}
        {isPending && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progres Pendanaan</span>
              <span className="font-medium">{fundingProgress.toFixed(1)}%</span>
            </div>
            <Progress value={fundingProgress} />
            <p className="text-sm text-muted-foreground">
              {formatWeiToEth(loan.totalFunded)} / {formatWeiToEth(loan.principal)} ETH terdanai
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t text-sm">
          <div>
            <p className="text-muted-foreground">Dibuat</p>
            <p className="font-medium">{formatDate(loan.createdAt)}</p>
          </div>
          {loan.fundedAt > 0n && (
            <div>
              <p className="text-muted-foreground">Terdanai</p>
              <p className="font-medium">{formatDate(loan.fundedAt)}</p>
            </div>
          )}
          {loan.dueDate > 0n && isActive && (
            <div>
              <p className="text-muted-foreground">Jatuh Tempo Berikutnya</p>
              <p className="font-medium">{formatDate(loan.dueDate)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
