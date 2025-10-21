"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/home/animated-section";
import { CheckCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Cara Kerja Singkat</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Proses sederhana & transparan — dari pengajuan hingga pelunasan.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardContent className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <h3 className="font-semibold text-foreground">Pengajuan & Verifikasi</h3>
              <p className="text-sm text-muted-foreground">
                Unggah dokumen; admin melakukan verifikasi. Jika disetujui, NFT agunan dimint.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-secondary" /> Verifikasi dokumen
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <h3 className="font-semibold text-foreground">Pendanaan Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Investor menilai collateral & mendanai sesuai porsi; pembagian return ditangani
                otomatis.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-secondary" /> Pendanaan terukur
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <h3 className="font-semibold text-foreground">Pembayaran & Unlock</h3>
              <p className="text-sm text-muted-foreground">
                Smart contract menegakkan jadwal pembayaran; ketika lunas, NFT di-unlock kembali ke
                pemilik.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-secondary" /> Smart contract
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
