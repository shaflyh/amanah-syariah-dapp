import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold">Investasi Halal, Rezeki Berkah</h1>
            <p className="text-xl text-muted-foreground">
              Platform P2P Lending Syariah berbasis Blockchain dengan NFT sebagai agunan digital dan
              Smart Contract untuk enforce akad Murabahah
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/marketplace">Browse Loans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/my-loans">Create Loan</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16">
              <div>
                <div className="text-4xl font-bold text-primary">🔐</div>
                <div className="text-sm text-muted-foreground mt-2">Blockchain Secured</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">☪️</div>
                <div className="text-sm text-muted-foreground mt-2">Syariah Compliant</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">🎨</div>
                <div className="text-sm text-muted-foreground mt-2">NFT Collateral</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
