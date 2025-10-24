"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { InvestmentCard } from "@/components/investment/investment-card";
import { useAllLoans } from "@/hooks/use-loans";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatWeiToEth } from "@/lib/utils";
import { useMemo } from "react";

export default function MyInvestmentsPage() {
  const { address, isConnected } = useAccount();
  const { loans, isLoading } = useAllLoans();

  // Calculate totals (simplified - in production use proper data fetching)
  const stats = useMemo(() => {
    let totalInvested = 0n;
    let totalReceived = 0n;
    let expectedReturn = 0n;

    // This is simplified - actual implementation would fetch investment data
    return {
      totalInvested: formatWeiToEth(totalInvested),
      totalReceived: formatWeiToEth(totalReceived),
      expectedReturn: formatWeiToEth(expectedReturn),
      activeInvestments: 0,
    };
  }, [loans]);

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

  const activeLoans = loans.filter((loan) => loan.status === 1);
  const completedLoans = loans.filter((loan) => loan.status === 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Investasiku</h1>
            <p className="text-muted-foreground">
              Pantau portofolio pembiayaan dan imbal hasil Anda
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Investasi</p>
                <p className="text-2xl font-bold">{stats.totalInvested} ETH</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Diterima</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalReceived} ETH</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Imbal Hasil Diharapkan</p>
                <p className="text-2xl font-bold">{stats.expectedReturn} ETH</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold">{stats.activeInvestments}</p>
              </CardContent>
            </Card>
          </div>

          {/* Investment List */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="all">Semua Investasi</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {isLoading ? (
                <p className="text-muted-foreground">Memuat investasi...</p>
              ) : activeLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeLoans.map((loan) => (
                    <InvestmentCard
                      key={loan.loanId.toString()}
                      loan={loan}
                      userAddress={address!}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Belum ada investasi aktif</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Danai pinjaman di marketplace untuk mulai mendapat imbal hasil
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {isLoading ? (
                <p className="text-muted-foreground">Memuat investasi...</p>
              ) : completedLoans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedLoans.map((loan) => (
                    <InvestmentCard
                      key={loan.loanId.toString()}
                      loan={loan}
                      userAddress={address!}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Tidak ada investasi yang selesai</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              {isLoading ? (
                <p className="text-muted-foreground">Memuat investasi...</p>
              ) : loans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loans.map((loan) => (
                    <InvestmentCard
                      key={loan.loanId.toString()}
                      loan={loan}
                      userAddress={address!}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Tidak ada investasi ditemukan</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
