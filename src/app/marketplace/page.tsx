"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { LoanCard } from "@/components/loan/loan-card";
import { Button } from "@/components/ui/button";
import { useLoansByStatus } from "@/hooks/use-loans";
import { LoanStatus } from "@/types";

export default function MarketplacePage() {
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | undefined>(LoanStatus.PENDING);

  const { loans, isLoading, error, refetch } = useLoansByStatus(selectedStatus);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">Jelajahi dan danai permintaan pinjaman</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStatus === undefined ? "default" : "outline"}
              onClick={() => setSelectedStatus(undefined)}
            >
              Semua Pinjaman
            </Button>
            <Button
              variant={selectedStatus === LoanStatus.PENDING ? "default" : "outline"}
              onClick={() => setSelectedStatus(LoanStatus.PENDING)}
            >
              Terbuka untuk Pendanaan
            </Button>
            <Button
              variant={selectedStatus === LoanStatus.ACTIVE ? "default" : "outline"}
              onClick={() => setSelectedStatus(LoanStatus.ACTIVE)}
            >
              Aktif
            </Button>
            <Button
              variant={selectedStatus === LoanStatus.COMPLETED ? "default" : "outline"}
              onClick={() => setSelectedStatus(LoanStatus.COMPLETED)}
            >
              Selesai
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat pinjaman...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Gagal memuat pinjaman</p>
              <Button onClick={() => refetch()} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Loans Grid */}
          {!isLoading && !error && loans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <LoanCard key={loan.loanId.toString()} loan={loan} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && loans.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Tidak ada pinjaman ditemukan</p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedStatus !== undefined
                  ? "Coba pilih filter lain"
                  : "Jadilah yang pertama membuat pinjaman!"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
