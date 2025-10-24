"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTRACTS } from "@/lib/contracts";
import { formatWeiToEth } from "@/lib/utils";
import { Loader2, CheckCircle2, Wallet } from "lucide-react";

export function WithdrawFees() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Get contract balance
  const { data: balance } = useBalance({
    address: CONTRACTS.LendingPlatform.address,
  });

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleWithdraw = () => {
    writeContract({
      ...CONTRACTS.LendingPlatform,
      functionName: "withdrawFees",
    });
  };

  if (isSuccess && !showSuccess) {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      reset();
      window.location.reload();
    }, 3000);
  }

  const availableFees = balance?.value || 0n;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biaya Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Penarikan Berhasil!</h3>
              <p className="text-sm text-muted-foreground mt-2">Biaya ditransfer ke dompet Anda</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Biaya Platform Tersedia</p>
                    <p className="text-2xl font-bold">{formatWeiToEth(availableFees)} ETH</p>
                  </div>
                </div>
              </div>
            </div>

            {availableFees > 0n ? (
              <>
                <Alert>
                  <AlertDescription>
                    Biaya platform (2%) dikumpulkan dari pinjaman yang diaktifkan. Tarik ke dompet
                    admin.
                  </AlertDescription>
                </Alert>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleWithdraw}
                  disabled={isPending || isConfirming}
                  className="w-full"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isPending ? "Konfirmasi di Dompet..." : "Menarik..."}
                    </>
                  ) : (
                    `Tarik ${formatWeiToEth(availableFees)} ETH`
                  )}
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Tidak ada biaya yang tersedia untuk ditarik
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
