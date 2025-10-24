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
          Terima Pendanaan Parsial
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terima Pendanaan Parsial</DialogTitle>
          <DialogDescription>
            Aktifkan pinjaman ini dengan jumlah pendanaan saat ini
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ini akan menghitung ulang ketentuan pinjaman berdasarkan jumlah yang sebenarnya
                didanai dan mengaktifkan pinjaman.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diminta:</span>
                <span className="font-medium">{formatWeiToEth(loan.principal)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Terdanai Aktual:</span>
                <span className="font-medium text-blue-600">
                  {formatWeiToEth(loan.totalFunded)} ETH ({fundingProgress.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Akan disesuaikan:</span>
                <span className="font-medium">Pokok, Margin, Cicilan Bulanan</span>
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
                Batal
              </Button>
              <Button
                onClick={handleAccept}
                disabled={isPending || isConfirming}
                className="flex-1"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Konfirmasi..." : "Memproses..."}
                  </>
                ) : (
                  "Terima & Aktifkan"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Pendanaan Parsial Diterima!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Pinjaman sekarang aktif dengan ketentuan yang disesuaikan
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Tutup</Button>
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
          Batalkan Pinjaman
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batalkan Pinjaman</DialogTitle>
          <DialogDescription>
            Batalkan pinjaman ini dan aktifkan pengembalian dana untuk pemberi pinjaman
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tindakan ini akan membatalkan pinjaman, membuka agunan, dan memungkinkan pemberi
                pinjaman mengklaim pengembalian dana. Ini tidak dapat dibatalkan.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Pinjaman:</span>
                <span className="font-medium">#{loan.loanId.toString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Terdanai:</span>
                <span className="font-medium">{formatWeiToEth(loan.totalFunded)} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Peminjam:</span>
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
                Tidak, Biarkan
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
                    {isPending ? "Konfirmasi..." : "Membatalkan..."}
                  </>
                ) : (
                  "Ya, Batalkan Pinjaman"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Pinjaman Dibatalkan</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Pemberi pinjaman sekarang dapat mengklaim pengembalian dana mereka
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Tutup</Button>
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
          Tandai Gagal Bayar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tandai Pinjaman sebagai Gagal Bayar</DialogTitle>
          <DialogDescription>
            Tandai pinjaman ini sebagai gagal bayar karena pembayaran terlewat
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ini menandai pinjaman sebagai gagal bayar. Proses hukum off-chain harus dimulai
                untuk memulihkan agunan. Ini tidak dapat dibatalkan.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Pinjaman:</span>
                <span className="font-medium">#{loan.loanId.toString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dibayar / Total:</span>
                <span className="font-medium">
                  {formatWeiToEth(loan.totalRepaid)} / {formatWeiToEth(loan.totalRepayment)} ETH
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cicilan Tersisa:</span>
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
                Batal
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
                    {isPending ? "Konfirmasi..." : "Menandai..."}
                  </>
                ) : (
                  "Tandai sebagai Gagal Bayar"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Pinjaman Ditandai sebagai Gagal Bayar</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Lanjutkan dengan pemulihan agunan off-chain
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Tutup</Button>
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
            <h3 className="text-lg font-semibold">Pinjaman #{loan.loanId.toString()}</h3>
            <p className="text-sm text-muted-foreground">
              Peminjam: {formatAddress(loan.borrower)}
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
            <p className="text-muted-foreground">Pokok Pinjaman</p>
            <p className="font-medium">{formatWeiToEth(loan.principal)} ETH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Terdanai</p>
            <p className="font-medium">
              {formatWeiToEth(loan.totalFunded)} ETH ({fundingProgress.toFixed(0)}%)
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Durasi</p>
            <p className="font-medium">{loan.duration.toString()} bulan</p>
          </div>
        </div>

        {isActive && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
            <div>
              <p className="text-muted-foreground">Dibayar</p>
              <p className="font-medium">{formatWeiToEth(loan.totalRepaid)} ETH</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cicilan Tersisa</p>
              <p className="font-medium">{loan.paymentsRemaining.toString()}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {hasPartialFunding && <AcceptPartialFundingButton loan={loan} />}
          {isPending && <CancelLoanButton loan={loan} />}
          {isActive && <MarkDefaultButton loan={loan} />}
          {(isCompleted || isDefaulted || isCancelled) && (
            <p className="text-sm text-muted-foreground">Tidak ada aksi tersedia</p>
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
        <h2 className="text-xl font-semibold mb-4">
          Pinjaman Terbuka untuk Pendanaan ({pendingLoans.length})
        </h2>
        {isLoading ? (
          <p className="text-muted-foreground">Memuat...</p>
        ) : pendingLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLoans.map((loan) => (
              <LoanRow key={loan.loanId.toString()} loan={loan} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada pinjaman yang terbuka untuk pendanaan
          </p>
        )}
      </div>

      {/* Active Loans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pinjaman Aktif ({activeLoans.length})</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Memuat...</p>
        ) : activeLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((loan) => (
              <LoanRow key={loan.loanId.toString()} loan={loan} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Tidak ada pinjaman aktif</p>
        )}
      </div>

      {/* Other Loans */}
      {otherLoans.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Selesai/Dibatalkan/Gagal Bayar ({otherLoans.length})
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
