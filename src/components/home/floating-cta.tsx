"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FloatingCTA() {
  return (
    <div className="fixed right-4 bottom-6 z-50 md:hidden">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:bg-primary/95"
      >
        <span>Pinjam / Invest</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
