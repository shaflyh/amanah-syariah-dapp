"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LayoutGrid, HandCoins, PiggyBank, FileText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Navigation links configuration
const navLinks = [
  { href: "/marketplace", label: "Marketplace", icon: LayoutGrid },
  { href: "/my-loans", label: "Pinjaman Saya", icon: HandCoins },
  { href: "/my-investments", label: "Investasiku", icon: PiggyBank },
  { href: "/smart-contracts", label: "Kontrak", icon: FileText },
];

export function Header() {
  const { address } = useAccount();
  const pathname = usePathname();
  const isAdmin = address === (process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}` | undefined);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      onClick={() => setSheetOpen(false)}
      className={cn(
        "transition-colors hover:text-foreground",
        pathname === href ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between mx-auto px-4">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3" onClick={() => setSheetOpen(false)}>
            <Image
              src="/logo-amanah-syariah.png"
              alt="Amanah Logo"
              width={180}
              height={120}
              className="rounded-md"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink href="/admin">
                <span className="rounded-md px-3 py-1.5 text-xs bg-muted text-muted-foreground border border-border">
                  Admin
                </span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Actions: Connect Button and Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="none" />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] p-0 flex flex-col">
                {/* Mobile Menu Header */}
                <div className="p-4 flex items-center justify-between border-b">
                  <Link href="/" onClick={() => setSheetOpen(false)}>
                    <Image
                      src="/logo-amanah-syariah.png"
                      alt="Amanah Logo"
                      width={150}
                      height={112}
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Menu Navigation */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 text-base font-medium transition-colors",
                          pathname === link.href
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 text-base font-medium transition-colors",
                          pathname === "/admin"
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <ShieldCheck className="h-5 w-5" />
                        Admin
                      </Link>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 mt-auto border-t space-y-4">
                  <ConnectButton
                    showBalance={false}
                    accountStatus="full" // Shows avatar, ens and address
                    chainStatus="icon"
                  />
                  <Button asChild className="w-full">
                    <Link href="/marketplace" onClick={() => setSheetOpen(false)}>
                      Telusuri Pinjaman
                    </Link>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground pt-2">
                    © {new Date().getFullYear()} Amanah Syariah
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
