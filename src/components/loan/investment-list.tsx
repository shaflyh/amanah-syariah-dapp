import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAddress, formatWeiToEth } from "@/lib/utils";
import { Users, Loader2, TrendingUp, Wallet } from "lucide-react";

interface Investment {
  lender: string;
  amount: bigint;
  sharePercentage: bigint;
}

export function InvestmentsList({
  investments,
  isLoading,
}: {
  investments: Investment[] | undefined;
  isLoading: boolean;
}) {
  const totalInvested = investments?.reduce((acc, inv) => acc + inv.amount, 0n) || 0n;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6" />
              Investor
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {investments?.length || 0} pemberi pinjaman
            </p>
          </div>
          {investments && investments.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Terdanai</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {formatWeiToEth(totalInvested)} ETH
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Memuat investasi...</p>
          </div>
        ) : investments && investments.length > 0 ? (
          <div className="space-y-3">
            {investments.map((investment: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-2 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 hover:border-green-300 dark:hover:border-green-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold font-mono text-sm">
                      {formatAddress(investment.lender)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {formatWeiToEth(investment.amount)} ETH
                      </p>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 text-sm px-3 py-1"
                >
                  {(Number(investment.sharePercentage) / 100).toFixed(2)}%
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-semibold text-muted-foreground mb-1">Belum ada investasi</p>
            <p className="text-xs text-muted-foreground">
              Investor akan muncul di sini setelah mendanai pinjaman
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
