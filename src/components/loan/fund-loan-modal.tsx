"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTRACTS } from "@/lib/contracts";
import { Loan } from "@/types";
import { formatWeiToEth } from "@/lib/utils";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FundLoanModalProps {
  loan: Loan;
  onSuccess?: () => void;
}

export function FundLoanModal({ loan, onSuccess }: FundLoanModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const amountWei = amount ? parseEther(amount) : 0n;
  const remainingToFund = loan.principal - loan.totalFunded;
  const wouldExceed = amountWei > remainingToFund;

  // Contract write
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFund = async () => {
    if (!amount || wouldExceed) {
      alert("Silakan masukkan jumlah yang valid");
      return;
    }

    try {
      writeContract({
        ...CONTRACTS.LendingPlatform,
        functionName: "fundLoan",
        args: [loan.loanId],
        value: amountWei,
      });
    } catch (err) {
      console.error("Error funding loan:", err);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isPending && !isConfirming) {
      setOpen(open);
      if (!open) {
        // Reset form when closing
        setAmount("");
        reset();
        if (isSuccess && onSuccess) {
          onSuccess();
        }
      }
    }
  };

  const handleMaxClick = () => {
    setAmount(formatEther(remainingToFund));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="w-full py-6 text-md" size="lg">
          Danai Pinjaman
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Danai Pinjaman #{loan.loanId.toString()}</DialogTitle>
          <DialogDescription>
            Investasikan dana pada pinjaman ini dan dapatkan imbal hasil dari cicilan bulanan
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            {/* Loan Info */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pokok Pinjaman:</span>
                <span className="font-medium">{formatWeiToEth(loan.principal)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sudah Terdanai:</span>
                <span className="font-medium">{formatWeiToEth(loan.totalFunded)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tersisa:</span>
                <span className="font-medium">{formatWeiToEth(remainingToFund)} ETH</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Imbal Hasil Diharapkan:</span>
                <span className="font-medium text-green-600">
                  {formatWeiToEth(loan.totalRepayment)} ETH (
                  {((Number(loan.margin) / Number(loan.principal)) * 100).toFixed(1)}% margin)
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Jumlah Pendanaan (ETH)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isPending || isConfirming}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMaxClick}
                  disabled={isPending || isConfirming}
                >
                  Maks
                </Button>
              </div>
              {wouldExceed && (
                <p className="text-xs text-red-500">
                  Jumlah melebihi sisa pendanaan yang dibutuhkan
                </p>
              )}
            </div>

            {/* Your Share Preview */}
            {amount && !wouldExceed && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <p className="text-sm font-medium text-blue-900">Pratinjau Investasi Anda</p>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Bagian Anda:</span>
                  <span className="font-medium text-blue-900">
                    {((amountWei * 10000n) / loan.principal / 100n).toString()}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Imbal Hasil Diharapkan:</span>
                  <span className="font-medium text-blue-900">
                    {formatWeiToEth((amountWei * loan.totalRepayment) / loan.principal)} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Keuntungan:</span>
                  <span className="font-medium text-green-600">
                    +
                    {formatWeiToEth((amountWei * loan.totalRepayment) / loan.principal - amountWei)}{" "}
                    ETH
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error.message.includes("insufficient")
                    ? "Saldo ETH tidak mencukupi"
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
                Batal
              </Button>
              <Button
                onClick={handleFund}
                disabled={!amount || wouldExceed || isPending || isConfirming}
                className="flex-1"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Konfirmasi di Dompet..." : "Mendanai..."}
                  </>
                ) : (
                  `Danai ${amount || "0"} ETH`
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Pendanaan Berhasil!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Anda telah berhasil mendanai {amount} ETH
              </p>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline block"
            >
              Lihat di Etherscan
            </a>
            <Button onClick={() => handleClose(false)} className="mt-4">
              Tutup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
