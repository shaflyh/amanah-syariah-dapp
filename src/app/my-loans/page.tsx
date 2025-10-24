"use client";

import { useAccount } from "wagmi";
import { AlertCircle, Wallet, Loader2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { CreateLoanForm } from "@/components/loan/create-loan-form";
import { LoanCard } from "@/components/loan/loan-card";
import { PageHeader } from "@/components/ui/page-header";
import { useAllLoans } from "@/hooks/use-loans";
import { useUserNFTs } from "@/hooks/use-user-nfts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export default function MyLoansPage() {
  const { address, isConnected } = useAccount();
  const { loans, isLoading: isLoadingLoans } = useAllLoans();
  const { data: userNFTs, isLoading: isLoadingNFTs } = useUserNFTs();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="text-center py-20">
              <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold text-muted-foreground">
                Silakan hubungkan dompet Anda
              </p>
            </div>
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
  const hasOverdue = activeLoans.some(
    (loan) => loan.dueDate < BigInt(Math.floor(Date.now() / 1000))
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            <PageHeader
              icon={Wallet}
              title="Pinjaman Saya"
              description="Buat permintaan pinjaman dan kelola pinjaman Anda dengan agunan NFT"
            />

            {/* Overdue Alert */}
            {hasOverdue && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Anda memiliki tunggakan pembayaran! Segera lakukan pembayaran untuk menghindari
                  gagal bayar.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-14 p-1">
                <TabsTrigger value="active" className="text-base">
                  Aktif ({activeLoans.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-base">
                  Pendanaan ({pendingLoans.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-base">
                  Selesai ({completedLoans.length})
                </TabsTrigger>
                <TabsTrigger value="create" className="text-base">
                  Buat Baru
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {isLoadingLoans ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat pinjaman...</p>
                  </div>
                ) : activeLoans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeLoans.map((loan) => (
                      <LoanCard key={loan.loanId.toString()} loan={loan} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                      <p className="text-lg font-semibold text-muted-foreground mb-2">
                        Tidak ada pinjaman aktif
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pinjaman yang terdanai penuh akan muncul di sini
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                {isLoadingLoans ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat pinjaman...</p>
                  </div>
                ) : pendingLoans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingLoans.map((loan) => (
                      <LoanCard key={loan.loanId.toString()} loan={loan} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                      <p className="text-lg font-semibold text-muted-foreground mb-2">
                        Tidak ada pinjaman yang menunggu pendanaan
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Buat pinjaman baru untuk mendapatkan pendanaan
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {isLoadingLoans ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat pinjaman...</p>
                  </div>
                ) : completedLoans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedLoans.map((loan) => (
                      <LoanCard key={loan.loanId.toString()} loan={loan} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                      <p className="text-lg font-semibold text-muted-foreground mb-2">
                        Belum ada pinjaman yang selesai
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pinjaman yang telah dilunasi akan muncul di sini
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="create" className="mt-6">
                {isLoadingNFTs ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat NFT Anda...</p>
                  </div>
                ) : (
                  <CreateLoanForm availableNFTs={userNFTs || []} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
