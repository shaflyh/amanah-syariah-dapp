"use client";

import { useAccount } from "wagmi";
import { AlertCircle } from "lucide-react";

import { Header } from "@/components/layout/header";
import { CreateLoanForm } from "@/components/loan/create-loan-form";
import { LoanCard } from "@/components/loan/loan-card";
import { useAllLoans } from "@/hooks/use-loans";
import { useUserNFTs } from "@/hooks/use-user-nfts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Separate by status
  const activeLoans = myLoans.filter((loan) => loan.status === 1);
  const pendingLoans = myLoans.filter((loan) => loan.status === 0);
  const completedLoans = myLoans.filter((loan) => loan.status === 2);

  // Check for overdue payments (simple check - in production would check dates)
  const hasOverdue = activeLoans.some((loan) => loan.dueDate < BigInt(Date.now() / 1000));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Loans</h1>
            <p className="text-muted-foreground">Create loan requests and manage your borrowings</p>
          </div>

          {/* Overdue Alert */}
          {hasOverdue && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have overdue payments! Please make payments immediately to avoid default.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active ({activeLoans.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingLoans.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedLoans.length})</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {isLoadingLoans ? (
                <p className="text-muted-foreground">Loading loans...</p>
              ) : activeLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeLoans.map((loan) => (
                    <LoanCard key={loan.loanId.toString()} loan={loan} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No active loans</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              {isLoadingLoans ? (
                <p className="text-muted-foreground">Loading loans...</p>
              ) : pendingLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingLoans.map((loan) => (
                    <LoanCard key={loan.loanId.toString()} loan={loan} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No pending loans waiting for funding</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {isLoadingLoans ? (
                <p className="text-muted-foreground">Loading loans...</p>
              ) : completedLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedLoans.map((loan) => (
                    <LoanCard key={loan.loanId.toString()} loan={loan} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No completed loans yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              {isLoadingNFTs ? (
                <p className="text-muted-foreground">Loading your NFTs...</p>
              ) : (
                <div className="max-w-2xl">
                  <CreateLoanForm availableNFTs={userNFTs || []} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
