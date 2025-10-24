"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-10">
      <div className="container mx-auto px-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="font-semibold text-foreground">Amanah Syariah</div>
            <div className="mt-2">© 2025 Amanah Syariah — Investasi Halal berbasis Blockchain</div>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="font-medium text-foreground">Platform</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link href="/marketplace" className="hover:underline">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/my-loans" className="hover:underline">
                    Pinjaman Saya
                  </Link>
                </li>
                <li>
                  <Link href="/my-investments" className="hover:underline">
                    Investasiku
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium text-foreground">Legal & Kepatuhan</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link href="/fatwa" className="hover:underline">
                    Fatwa & Kepatuhan
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    Syarat Layanan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <div>
            Smart Contracts (testnet):{" "}
            <Link href="/smart-contracts" className="underline">
              Lihat detail
            </Link>
          </div>
          <div className="mt-2">
            Kontak:{" "}
            <a href="mailto:shafly2000@gmail.com" className="underline">
              shafly2000@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
