import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loan } from "@/types";
import { formatWeiToEth } from "@/lib/utils";
import { MakePaymentButton } from "./make-payment-button";
import { CalendarCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

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
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardTitle className="text-2xl flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" />
          Jadwal Pembayaran
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Daftar cicilan dan status pembayaran</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {Array.from({ length: Number(loan.duration) }, (_, i) => i + 1).map((paymentNum) => {
            const isPaid = paymentNum <= Number(loan.duration) - Number(loan.paymentsRemaining);

            const isNextPayment =
              paymentNum === Number(loan.duration) - Number(loan.paymentsRemaining) + 1;

            return (
              <div
                key={paymentNum}
                className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  isNextPayment && !isPaid
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                    : isPaid
                    ? "border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/10"
                    : "border-gray-200 dark:border-gray-800 bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isPaid
                        ? "bg-green-500 text-white"
                        : isNextPayment
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {isPaid ? <CheckCircle2 className="w-5 h-5" /> : paymentNum}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Cicilan #{paymentNum}</p>
                      {isNextPayment && !isPaid && (
                        <Badge variant="default" className="bg-blue-500">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Jatuh Tempo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {formatWeiToEth(loan.monthlyPayment)} ETH
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPaid ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Lunas
                    </Badge>
                  ) : isNextPayment ? (
                    <MakePaymentButton
                      loan={loan}
                      paymentNumber={paymentNum}
                      isPaid={isPaid}
                      onSuccess={onPaymentSuccess}
                    />
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      Belum Dibayar
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
            Ringkasan Pembayaran
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <p className="text-xs text-muted-foreground mb-1">Total Sudah Dibayar</p>
              <p className="font-bold text-lg text-green-700 dark:text-green-400">
                {formatWeiToEth(loan.totalRepaid)} ETH
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
              <p className="text-xs text-muted-foreground mb-1">Sisa Pembayaran</p>
              <p className="font-bold text-lg text-orange-700 dark:text-orange-400">
                {formatWeiToEth(loan.totalRepayment - loan.totalRepaid)} ETH
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <p className="text-xs text-muted-foreground mb-1">Cicilan Tersisa</p>
              <p className="font-bold text-lg text-blue-700 dark:text-blue-400">
                {loan.paymentsRemaining.toString()} cicilan
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
