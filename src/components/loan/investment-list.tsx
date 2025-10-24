import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAddress, formatWeiToEth } from "@/lib/utils";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor ({investments?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat investasi...</p>
        ) : investments && investments.length > 0 ? (
          <div className="space-y-3">
            {investments.map((investment: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{formatAddress(investment.lender)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatWeiToEth(investment.amount)} ETH
                  </p>
                </div>
                <Badge variant="secondary">
                  {(Number(investment.sharePercentage) / 100).toFixed(2)}%
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada investasi</p>
        )}
      </CardContent>
    </Card>
  );
}
