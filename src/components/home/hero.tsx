"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/home/animated-section";
import { AnimatedStats } from "@/components/home/animated-stats";

export default function Hero() {
  return (
    // Set position to relative to act as an anchor for the absolutely positioned image
    <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center">
      {/* Decorative background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 pt-20 pb-28 md:pt-28 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text Content */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <FadeIn>
              <Badge variant="secondary" className="mb-4">
                Platform P2P Syariah Berbasis Blockchain
              </Badge>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Bangun Masa Depan Ekonomi Syariah. Investasi Aman & Transparan.
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-6 text-base md:text-lg text-muted-foreground">
                Kami merevolusi P2P lending dengan transparansi blockchain. Setiap akad tercatat
                permanen, agunan digital terjamin, dan keuntungan dibagi secara adil—semua berjalan
                otomatis sesuai prinsip syariah.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                  <Link href="/marketplace">
                    Mulai Investasi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/my-loans">Ajukan Pendanaan</Link>
                </Button>
              </div>
            </FadeIn>

            {/* Stats Section */}
            <FadeIn delay={0.4}>
              <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                <AnimatedStats value={100} suffix="%" label="Transparansi On-Chain" />
                <AnimatedStats value={100} suffix="%" label="Kepatuhan Syariah" />
                <AnimatedStats value={18} prefix="~" suffix="%" label="Potensi Imbal Hasil p.a." />
              </div>
            </FadeIn>
          </div>

          {/* Right Column (Placeholder on small screens) */}
          {/* This div is now just to keep the grid structure. The image itself is positioned absolutely. */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 lg:w-1/2 flex justify-center pointer-events-none">
        <FadeIn delay={0.3}>
          <Image
            src="/hijab-phone.webp"
            alt="Wanita menggunakan platform Amanah Syariah"
            width={450} // Adjust size as needed
            height={550}
            className="w-auto h-auto max-h-[70vh] lg:max-h-[90vh]"
            quality={100}
            priority
          />
        </FadeIn>
      </div>
    </section>
  );
}
