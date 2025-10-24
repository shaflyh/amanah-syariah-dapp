"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { LoanCard } from "@/components/loan/loan-card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useLoansByStatus } from "@/hooks/use-loans";
import { LoanStatus } from "@/types";
import { Store, Loader2 } from "lucide-react";

export default function MarketplacePage() {
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | undefined>(LoanStatus.PENDING);

  const { loans, isLoading, error, refetch } = useLoansByStatus(selectedStatus);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            <PageHeader
              icon={Store}
              title="Marketplace"
              description="Jelajahi dan danai permintaan pinjaman yang sesuai dengan prinsip syariah"
            />

            {/* Filters */}
            <div className="bg-card rounded-xl border p-4 shadow-sm">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedStatus === undefined ? "default" : "outline"}
                  onClick={() => setSelectedStatus(undefined)}
                  size="lg"
                >
                  Semua Pinjaman
                </Button>
                <Button
                  variant={selectedStatus === LoanStatus.PENDING ? "default" : "outline"}
                  onClick={() => setSelectedStatus(LoanStatus.PENDING)}
                  size="lg"
                >
                  Terbuka untuk Pendanaan
                </Button>
                <Button
                  variant={selectedStatus === LoanStatus.ACTIVE ? "default" : "outline"}
                  onClick={() => setSelectedStatus(LoanStatus.ACTIVE)}
                  size="lg"
                >
                  Aktif
                </Button>
                <Button
                  variant={selectedStatus === LoanStatus.COMPLETED ? "default" : "outline"}
                  onClick={() => setSelectedStatus(LoanStatus.COMPLETED)}
                  size="lg"
                >
                  Selesai
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-20">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Memuat pinjaman...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20 bg-card rounded-xl border border-destructive/50">
                <p className="text-destructive text-lg font-semibold mb-2">Gagal memuat pinjaman</p>
                <p className="text-muted-foreground mb-6">Terjadi kesalahan saat mengambil data</p>
                <Button onClick={() => refetch()} size="lg">
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Loans Grid */}
            {!isLoading && !error && loans.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedStatus === LoanStatus.PENDING && "Terbuka untuk Pendanaan"}
                    {selectedStatus === LoanStatus.ACTIVE && "Pinjaman Aktif"}
                    {selectedStatus === LoanStatus.COMPLETED && "Pinjaman Selesai"}
                    {selectedStatus === undefined && "Semua Pinjaman"}
                  </h2>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {loans.length} pinjaman
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loans.map((loan) => (
                    <LoanCard key={loan.loanId.toString()} loan={loan} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && loans.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card">
                <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-semibold text-muted-foreground mb-2">
                  Tidak ada pinjaman ditemukan
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedStatus !== undefined
                    ? "Coba pilih filter lain untuk melihat lebih banyak pinjaman"
                    : "Jadilah yang pertama membuat pinjaman!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
