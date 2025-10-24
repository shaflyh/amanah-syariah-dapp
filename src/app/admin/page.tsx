"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { MintNFTForm } from "@/components/admin/mint-nft-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawFees } from "@/components/admin/withdraw-fees";
import { LoanManagement } from "@/components/admin/loan-management";
import { HandCoins, Sparkles, Wallet } from "lucide-react";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const isAdmin = address === (process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}`);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Silakan hubungkan dompet Anda</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Anda tidak memiliki otorisasi untuk mengakses halaman ini. Hanya untuk admin.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                    <HandCoins className="w-6 h-6" />
                  </div>
                  <h1 className="text-4xl font-bold">Panel Admin</h1>
                </div>
                <p className="text-emerald-100 text-lg">
                  Kelola NFT agunan, pinjaman, dan tarik biaya platform
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/10 rounded-full"></div>
            </div>

            {/* Full Width Tabs */}
            <Tabs defaultValue="loans" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-14 p-1">
                <TabsTrigger value="mint" className="text-base">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Mint NFT
                </TabsTrigger>
                <TabsTrigger value="loans" className="text-base">
                  <HandCoins className="w-4 h-4 mr-2" />
                  Kelola Pinjaman
                </TabsTrigger>
                <TabsTrigger value="fees" className="text-base">
                  <Wallet className="w-4 h-4 mr-2" />
                  Tarik Biaya
                </TabsTrigger>
              </TabsList>

              <TabsContent value="loans" className="mt-6">
                <LoanManagement />
              </TabsContent>

              <TabsContent value="mint" className="mt-6">
                <MintNFTForm />
              </TabsContent>

              <TabsContent value="fees" className="mt-6">
                <div className="max-w-2xl mx-auto">
                  <WithdrawFees />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
