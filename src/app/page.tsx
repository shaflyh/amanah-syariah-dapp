"use client";

import { Header } from "@/components/layout/header";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import HowItWorks from "@/components/home/how-it-works";
import SmartContractsCard from "@/components/home/smart-contract-card";
import FloatingCTA from "@/components/home/floating-cta";
import Footer from "@/components/layout/footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <SmartContractsCard />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
