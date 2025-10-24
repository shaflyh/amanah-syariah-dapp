"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { MintNFTForm } from "@/components/admin/mint-nft-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawFees } from "@/components/admin/withdraw-fees";
import { LoanManagement } from "@/components/admin/loan-management";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Panel Admin</h1>
            <p className="text-muted-foreground">Kelola NFT agunan, pinjaman, dan biaya platform</p>
          </div>

          <Tabs defaultValue="loans" className="w-full">
            <TabsList>
              <TabsTrigger value="loans">Kelola Pinjaman</TabsTrigger>
              <TabsTrigger value="mint">Mint NFT</TabsTrigger>
              <TabsTrigger value="fees">Biaya Platform</TabsTrigger>
            </TabsList>

            <TabsContent value="loans" className="space-y-6">
              <LoanManagement />
            </TabsContent>

            <TabsContent value="mint" className="space-y-6">
              <div className="max-w-2xl">
                <MintNFTForm />
              </div>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6">
              <div className="max-w-2xl">
                <WithdrawFees />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
