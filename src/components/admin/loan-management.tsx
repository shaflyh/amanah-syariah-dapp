"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTRACTS } from "@/lib/contracts";
import { useAllLoans } from "@/hooks/use-loans";
import {
  formatWeiToEth,
  formatAddress,
  getLoanStatusColor,
  getLoanStatusText,
  calculateFundingProgress,
} from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Loan } from "@/types";

function AcceptPartialFundingButton({ loan }: { loan: Loan }) {
  const [open, setOpen] = useState(false);
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleAccept = () => {
    writeContract({
      ...CONTRACTS.LendingPlatform,
      functionName: "acceptPartialFunding",
      args: [loan.loanId],
    });
  };

  const handleClose = (open: boolean) => {
    if (!isPending && !isConfirming) {
      setOpen(open);
      if (!open) {
        reset();
        if (isSuccess) {
          window.location.reload();
        }
      }
    }
  };

  const fundingProgress = calculateFundingProgress(loan.totalFunded, loan.principal);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Accept Partial
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Partial Funding</DialogTitle>
          <DialogDescription>Activate this loan with the current funding amount</DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will recalculate loan terms based on actual funded amount and activate the
                loan.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Requested:</span>
                <span className="font-medium">{formatWeiToEth(loan.principal)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Actually Funded:</span>
                <span className="font-medium text-blue-600">
                  {formatWeiToEth(loan.totalFunded)} ETH ({fundingProgress.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Will be adjusted:</span>
                <span className="font-medium">Principal, Margin, Monthly Payment</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

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
                onClick={handleAccept}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Confirm..." : "Processing..."}
                  </>
                ) : (
                  "Accept & Activate"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Partial Funding Accepted!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Loan is now active with adjusted terms
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CancelLoanButton({ loan }: { loan: Loan }) {
  const [open, setOpen] = useState(false);
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleCancel = () => {
    writeContract({
      ...CONTRACTS.LendingPlatform,
      functionName: "cancelLoan",
      args: [loan.loanId],
    });
  };

  const handleClose = (open: boolean) => {
    if (!isPending && !isConfirming) {
      setOpen(open);
      if (!open) {
        reset();
        if (isSuccess) {
          window.location.reload();
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Cancel Loan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Loan</DialogTitle>
          <DialogDescription>Cancel this loan and enable refunds for lenders</DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action will cancel the loan, unlock the collateral, and allow lenders to claim
                refunds. This cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan ID:</span>
                <span className="font-medium">#{loan.loanId.toString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Funded:</span>
                <span className="font-medium">{formatWeiToEth(loan.totalFunded)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Borrower:</span>
                <span className="font-medium">{formatAddress(loan.borrower)}</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                No, Keep It
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Confirm..." : "Cancelling..."}
                  </>
                ) : (
                  "Yes, Cancel Loan"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Loan Cancelled</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Lenders can now claim their refunds
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MarkDefaultButton({ loan }: { loan: Loan }) {
  const [open, setOpen] = useState(false);
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleDefault = () => {
    writeContract({
      ...CONTRACTS.LendingPlatform,
      functionName: "markAsDefault",
      args: [loan.loanId],
    });
  };

  const handleClose = (open: boolean) => {
    if (!isPending && !isConfirming) {
      setOpen(open);
      if (!open) {
        reset();
        if (isSuccess) {
          window.location.reload();
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Mark Default
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Loan as Defaulted</DialogTitle>
          <DialogDescription>Mark this loan as defaulted due to missed payments</DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This marks the loan as defaulted. Off-chain legal processes must be initiated to
                recover collateral. This cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan ID:</span>
                <span className="font-medium">#{loan.loanId.toString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid / Total:</span>
                <span className="font-medium">
                  {formatWeiToEth(loan.totalRepaid)} / {formatWeiToEth(loan.totalRepayment)} ETH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payments Remaining:</span>
                <span className="font-medium text-red-600">
                  {loan.paymentsRemaining.toString()}
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

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
                variant="destructive"
                onClick={handleDefault}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Confirm..." : "Marking..."}
                  </>
                ) : (
                  "Mark as Default"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Loan Marked as Defaulted</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Proceed with off-chain collateral recovery
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoanRow({ loan }: { loan: Loan }) {
  const isPending = loan.status === 0;
  const isActive = loan.status === 1;
  const isCompleted = loan.status === 2;
  const isDefaulted = loan.status === 3;
  const isCancelled = loan.status === 4;

  const fundingProgress = calculateFundingProgress(loan.totalFunded, loan.principal);
  const hasPartialFunding = isPending && loan.totalFunded > 0n && loan.totalFunded < loan.principal;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Loan #{loan.loanId.toString()}</h3>
            <p className="text-sm text-muted-foreground">
              Borrower: {formatAddress(loan.borrower)}
            </p>
          </div>
          <Badge className={getLoanStatusColor(loan.status)}>
            {getLoanStatusText(loan.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Principal</p>
            <p className="font-medium">{formatWeiToEth(loan.principal)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Funded</p>
            <p className="font-medium">
              {formatWeiToEth(loan.totalFunded)} ETH ({fundingProgress.toFixed(0)}%)
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">{loan.duration.toString()} months</p>
          </div>
        </div>

        {isActive && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
            <div>
              <p className="text-muted-foreground">Paid</p>
              <p className="font-medium">{formatWeiToEth(loan.totalRepaid)} ETH</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining Payments</p>
              <p className="font-medium">{loan.paymentsRemaining.toString()}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {hasPartialFunding && <AcceptPartialFundingButton loan={loan} />}
          {isPending && <CancelLoanButton loan={loan} />}
          {isActive && <MarkDefaultButton loan={loan} />}
          {(isCompleted || isDefaulted || isCancelled) && (
            <p className="text-sm text-muted-foreground">No actions available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function LoanManagement() {
  const { loans, isLoading } = useAllLoans();

  const pendingLoans = loans.filter((loan) => loan.status === 0);
  const activeLoans = loans.filter((loan) => loan.status === 1);
  const otherLoans = loans.filter((loan) => loan.status > 1);

  return (
    <div className="space-y-6">
      {/* Pending Loans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pending Loans ({pendingLoans.length})</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : pendingLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLoans.map((loan) => (
              <LoanRow key={loan.loanId.toString()} loan={loan} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No pending loans</p>
        )}
      </div>

      {/* Active Loans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Loans ({activeLoans.length})</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : activeLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((loan) => (
              <LoanRow key={loan.loanId.toString()} loan={loan} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active loans</p>
        )}
      </div>

      {/* Other Loans */}
      {otherLoans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Completed/Cancelled/Defaulted ({otherLoans.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherLoans.map((loan) => (
              <LoanRow key={loan.loanId.toString()} loan={loan} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
