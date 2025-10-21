"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTRACTS } from "@/lib/contracts";
import { formatWeiToEth } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CreateLoanFormProps {
  availableNFTs: { tokenId: number; locked: boolean }[];
}

export function CreateLoanForm({ availableNFTs }: CreateLoanFormProps) {
  const { address } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState<string>("");
  const [principal, setPrincipal] = useState("");
  const [marginRate, setMarginRate] = useState("");
  const [duration, setDuration] = useState("");

  // Calculated values
  const principalWei = principal ? parseEther(principal) : 0n;
  const marginRateBps = marginRate ? parseFloat(marginRate) * 100 : 0;
  const durationMonths = duration ? parseInt(duration) : 0;

  const margin =
    principalWei && marginRateBps && durationMonths
      ? (principalWei * BigInt(marginRateBps) * BigInt(durationMonths)) / (12n * 10000n)
      : 0n;
  const totalRepayment = principalWei + margin;
  const monthlyPayment = durationMonths ? totalRepayment / BigInt(durationMonths) : 0n;

  // Contract write
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNFT || !principal || !marginRate || !duration) {
      alert("Please fill all fields");
      return;
    }

    try {
      writeContract({
        ...CONTRACTS.LendingPlatform,
        functionName: "createLoanRequest",
        args: [BigInt(selectedNFT), principalWei, BigInt(marginRateBps), BigInt(durationMonths)],
      });
    } catch (err) {
      console.error("Error creating loan:", err);
    }
  };

  const unlockedNFTs = availableNFTs.filter((nft) => !nft.locked);

  if (unlockedNFTs.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          You don't have any unlocked NFTs. Please get your collateral verified by admin first.
        </AlertDescription>
      </Alert>
    );
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <h3 className="text-lg font-semibold">Loan Created Successfully!</h3>
            <p className="text-sm text-muted-foreground">
              Your loan request is now live in the marketplace.
            </p>
            <Button onClick={() => window.location.reload()}>Create Another</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Loan Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select NFT */}
          <div className="space-y-2">
            <Label>Collateral NFT</Label>
            <Select value={selectedNFT} onValueChange={setSelectedNFT}>
              <SelectTrigger>
                <SelectValue placeholder="Select your NFT" />
              </SelectTrigger>
              <SelectContent>
                {unlockedNFTs.map((nft) => (
                  <SelectItem key={nft.tokenId} value={nft.tokenId.toString()}>
                    NFT #{nft.tokenId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Principal */}
          <div className="space-y-2">
            <Label>Principal Amount (ETH)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 50"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>

          {/* Margin Rate */}
          <div className="space-y-2">
            <Label>Annual Margin Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 15"
              value={marginRate}
              onChange={(e) => setMarginRate(e.target.value)}
              max="30"
            />
            <p className="text-xs text-muted-foreground">Maximum 30% per year</p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration (months)</Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              max="60"
            />
            <p className="text-xs text-muted-foreground">Maximum 60 months</p>
          </div>

          {/* Preview */}
          {principal && marginRate && duration && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold">Loan Preview</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Margin:</span>
                <span className="font-medium">{formatWeiToEth(margin)} ETH</span>
                <span className="text-muted-foreground">Total Repayment:</span>
                <span className="font-medium">{formatWeiToEth(totalRepayment)} ETH</span>
                <span className="text-muted-foreground">Monthly Payment:</span>
                <span className="font-medium">{formatWeiToEth(monthlyPayment)} ETH</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isConfirming || !selectedNFT}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirm in Wallet..." : "Creating Loan..."}
              </>
            ) : (
              "Create Loan Request"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
