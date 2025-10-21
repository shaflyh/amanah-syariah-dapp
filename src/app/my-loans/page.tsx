"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { CreateLoanForm } from "@/components/loan/create-loan-form";
import { LoanCard } from "@/components/loan/loan-card";
import { useAllLoans } from "@/hooks/use-loans";
import { useUserNFTs } from "@/hooks/use-user-nfts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyLoansPage() {
  const { address, isConnected } = useAccount();
  const { loans, isLoading: isLoadingLoans } = useAllLoans();
  const { data: userNFTs, isLoading: isLoadingNFTs } = useUserNFTs();

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

  // Filter loans created by current user
  const myLoans = loans.filter((loan) => loan.borrower.toLowerCase() === address?.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Loans</h1>
            <p className="text-muted-foreground">Create loan requests and manage your borrowings</p>
          </div>

          <Tabs defaultValue="create" className="w-full">
            <TabsList>
              <TabsTrigger value="create">Create Loan</TabsTrigger>
              <TabsTrigger value="my-loans">My Loans ({myLoans.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              {isLoadingNFTs ? (
                <p className="text-muted-foreground">Loading your NFTs...</p>
              ) : (
                <CreateLoanForm availableNFTs={userNFTs || []} />
              )}
            </TabsContent>

            <TabsContent value="my-loans" className="space-y-6">
              {isLoadingLoans ? (
                <p className="text-muted-foreground">Loading loans...</p>
              ) : myLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myLoans.map((loan) => (
                    <LoanCard key={loan.loanId.toString()} loan={loan} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">You haven't created any loans yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
