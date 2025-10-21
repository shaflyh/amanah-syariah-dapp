import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loan } from "@/types";
import { formatWeiToEth } from "@/lib/utils";
import { MakePaymentButton } from "./make-payment-button";

export function PaymentSchedule({
  loan,
  onPaymentSuccess,
}: {
  loan: Loan;
  onPaymentSuccess?: () => void;
}) {
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

            const isNextPayment =
              paymentNum === Number(loan.duration) - Number(loan.paymentsRemaining) + 1;

            return (
              <div
                key={paymentNum}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  isNextPayment && !isPaid ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isPaid
                        ? "bg-green-100 text-green-800"
                        : isNextPayment
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {paymentNum}
                  </div>
                  <div>
                    <p className="font-medium">
                      Payment #{paymentNum}
                      {isNextPayment && !isPaid && (
                        <span className="text-xs text-blue-600 ml-2">(Next Due)</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatWeiToEth(loan.monthlyPayment)} ETH
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPaid ? (
                    <Badge variant="default">Paid ✓</Badge>
                  ) : isNextPayment ? (
                    <MakePaymentButton
                      loan={loan}
                      paymentNumber={paymentNum}
                      isPaid={isPaid}
                      onSuccess={onPaymentSuccess}
                    />
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid:</span>
            <span className="font-medium">{formatWeiToEth(loan.totalRepaid)} ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-medium">
              {formatWeiToEth(loan.totalRepayment - loan.totalRepaid)} ETH
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payments Left:</span>
            <span className="font-medium">{loan.paymentsRemaining.toString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
