"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FloatingCard, SlideIn } from "@/components/home/animated-section";
import { Shield, Lock, Zap, Coins, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Syariah Terverifikasi",
    desc: "Akad Murabahah — tanpa riba, tanpa gharar, transparan bagi semua pihak.",
  },
  {
    icon: Lock,
    title: "NFT sebagai Agunan",
    desc: "Aset fisik didigitalkan sebagai NFT, menjadi bukti kepemilikan yang aman dan terverifikasi.",
  },
  {
    icon: Zap,
    title: "Smart Contract Otomatis",
    desc: "Pembayaran, jadwal, dan status pinjaman dikelola otomatis di blockchain.",
  },
  {
    icon: Coins,
    title: "Pendanaan Bersama",
    desc: "Beberapa investor dapat mendanai satu pinjaman, diversifikasi portofolio dengan mudah.",
  },
  {
    icon: TrendingUp,
    title: "Return Transparan",
    desc: "Margin ditetapkan di awal; semua transaksi tercatat di blockchain tanpa biaya tersembunyi.",
  },
  {
    icon: Users,
    title: "Dari Komunitas untuk Komunitas",
    desc: "Platform gotong royong untuk pemberdayaan UMKM dan kesejahteraan umat.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Keunggulan <span className="text-primary">Amanah Syariah</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fitur yang menggabungkan prinsip keuangan syariah dan teknologi blockchain secara
            elegan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <SlideIn key={f.title} delay={i * 0.08}>
                <FloatingCard>
                  <Card className="border-border hover:shadow-md transition">
                    <CardContent className="p-6 flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">{f.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </SlideIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
