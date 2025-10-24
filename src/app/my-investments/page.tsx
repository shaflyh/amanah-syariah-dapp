"use client";

import { useAccount } from "wagmi";
import { Header } from "@/components/layout/header";
import { InvestmentCard } from "@/components/investment/investment-card";
import { PageHeader } from "@/components/ui/page-header";
import { useAllLoans } from "@/hooks/use-loans";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatWeiToEth } from "@/lib/utils";
import { useMemo } from "react";
import { TrendingUp, Wallet, Loader2 } from "lucide-react";

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

  const activeLoans = loans.filter((loan) => loan.status === 1);
  const completedLoans = loans.filter((loan) => loan.status === 2);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            <PageHeader
              icon={TrendingUp}
              title="Investasiku"
              description="Pantau portofolio pembiayaan dan imbal hasil dari investasi syariah Anda"
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Total Investasi</p>
                  <p className="text-3xl font-bold">{stats.totalInvested} ETH</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Total Diterima</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalReceived} ETH</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Imbal Hasil Diharapkan
                  </p>
                  <p className="text-3xl font-bold">{stats.expectedReturn} ETH</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Investasi Aktif</p>
                  <p className="text-3xl font-bold">{stats.activeInvestments}</p>
                </CardContent>
              </Card>
            </div>

            {/* Investment List */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-14 p-1">
                <TabsTrigger value="all" className="text-base">
                  Semua Investasi
                </TabsTrigger>
                <TabsTrigger value="active" className="text-base">
                  Aktif
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-base">
                  Selesai
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat investasi...</p>
                  </div>
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
                  <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                      <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <p className="text-lg font-semibold text-muted-foreground mb-2">
                        Belum ada investasi aktif
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Danai pinjaman di marketplace untuk mulai mendapat imbal hasil
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat investasi...</p>
                  </div>
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
                  <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                      <p className="text-lg font-semibold text-muted-foreground mb-2">
                        Tidak ada investasi yang selesai
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Investasi yang sudah lunas akan muncul di sini
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">Memuat investasi...</p>
                  </div>
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
                  <Card className="border-dashed">
                    <CardContent className="py-20 text-center">
                      <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <p className="text-lg font-semibold text-muted-foreground mb-2">
                        Tidak ada investasi ditemukan
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mulai berinvestasi untuk melihat portfolio Anda
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
