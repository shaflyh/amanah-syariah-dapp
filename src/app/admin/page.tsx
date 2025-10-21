"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { MintNFTForm } from "@/components/admin/mint-nft-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const isAdmin = address === (process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}`);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please connect your wallet</p>
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
              You are not authorized to access this page. Admin access only.
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
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage collateral NFTs and loans</p>
          </div>

          <Tabs defaultValue="mint" className="w-full">
            <TabsList>
              <TabsTrigger value="mint">Mint NFT</TabsTrigger>
              <TabsTrigger value="loans">Manage Loans (Coming Soon)</TabsTrigger>
            </TabsList>

            <TabsContent value="mint" className="space-y-6">
              <div className="max-w-2xl">
                <MintNFTForm />
              </div>
            </TabsContent>

            <TabsContent value="loans" className="space-y-6">
              <p className="text-muted-foreground">
                Loan management features coming in Phase 6B...
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
