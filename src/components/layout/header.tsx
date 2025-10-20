"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function Header() {
  const { address } = useAccount();
  const isAdmin = address === (process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}`);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Amanah Syariah
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            {address && (
              <>
                <Link href="/my-loans" className="hover:text-primary">
                  My Loans
                </Link>
                <Link href="/my-investments" className="hover:text-primary">
                  My Investments
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="hover:text-primary">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Connect Button */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
