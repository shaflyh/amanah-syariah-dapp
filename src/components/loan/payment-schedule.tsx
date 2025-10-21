import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loan } from "@/types";
import { formatWeiToEth } from "@/lib/utils";

export function PaymentSchedule({ loan }: { loan: Loan }) {
  if (loan.status !== 1) return null; // Only show for ACTIVE loans

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: Number(loan.duration) }, (_, i) => i + 1).map((paymentNum) => {
            const isPaid = paymentNum <= Number(loan.duration) - Number(loan.paymentsRemaining);
            return (
              <div
                key={paymentNum}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {paymentNum}
                  </div>
                  <div>
                    <p className="font-medium">Payment #{paymentNum}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatWeiToEth(loan.monthlyPayment)} ETH
                    </p>
                  </div>
                </div>
                <Badge variant={isPaid ? "default" : "secondary"}>
                  {isPaid ? "Paid" : "Pending"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
