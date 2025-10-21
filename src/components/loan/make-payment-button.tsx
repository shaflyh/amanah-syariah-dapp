"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTRACTS } from "@/lib/contracts";
import { Loan } from "@/types";
import { formatWeiToEth } from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface MakePaymentButtonProps {
  loan: Loan;
  paymentNumber: number;
  isPaid: boolean;
  onSuccess?: () => void;
}

export function MakePaymentButton({
  loan,
  paymentNumber,
  isPaid,
  onSuccess,
}: MakePaymentButtonProps) {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);

  const isBorrower = address?.toLowerCase() === loan.borrower.toLowerCase();
  const isActive = loan.status === 1;

  // Contract write
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    try {
      writeContract({
        ...CONTRACTS.LendingPlatform,
        functionName: "makePayment",
        args: [loan.loanId, BigInt(paymentNumber)],
        value: loan.monthlyPayment,
      });
    } catch (err) {
      console.error("Error making payment:", err);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isPending && !isConfirming) {
      setOpen(open);
      if (!open) {
        reset();
        if (isSuccess && onSuccess) {
          onSuccess();
        }
      }
    }
  };

  // Don't show button if not borrower, not active, or already paid
  if (!isBorrower || !isActive || isPaid) {
    return null;
  }

  const isFinalPayment = paymentNumber === Number(loan.duration);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm">Pay Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Make Payment #{paymentNumber}
            {isFinalPayment && " (Final Payment!)"}
          </DialogTitle>
          <DialogDescription>
            {isFinalPayment
              ? "This is your final payment. Your collateral will be unlocked after confirmation."
              : "Make your monthly payment to keep your loan in good standing."}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            {/* Payment Info */}
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Amount:</span>
                <span className="text-xl font-bold">{formatWeiToEth(loan.monthlyPayment)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Number:</span>
                <span className="font-medium">
                  {paymentNumber} of {loan.duration.toString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Paid So Far:</span>
                <span className="font-medium">{formatWeiToEth(loan.totalRepaid)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining After This:</span>
                <span className="font-medium">
                  {formatWeiToEth(loan.totalRepayment - loan.totalRepaid - loan.monthlyPayment)} ETH
                </span>
              </div>
            </div>

            {/* Important Note */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payment will be automatically distributed to all lenders proportionally.
                {isFinalPayment && " Your collateral NFT will be unlocked immediately."}
              </AlertDescription>
            </Alert>

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error.message.includes("insufficient")
                    ? "Insufficient ETH balance"
                    : error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Confirm in Wallet..." : "Processing..."}
                  </>
                ) : (
                  `Pay ${formatWeiToEth(loan.monthlyPayment)} ETH`
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">
                Payment Successful! {isFinalPayment && "🎉"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {isFinalPayment
                  ? "Congratulations! Your loan is now complete and your collateral is unlocked."
                  : "Your payment has been distributed to all lenders."}
              </p>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline block"
            >
              View on Etherscan
            </a>
            <Button onClick={() => handleClose(false)} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
