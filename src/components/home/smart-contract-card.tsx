"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import copy from "copy-to-clipboard";

export default function SmartContractsCard() {
  const address =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x0000000000000000000000000000000000000000";
  const etherscan = process.env.NEXT_PUBLIC_ETHERSCAN_PREFIX ?? "https://sepolia.etherscan.io";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    copy(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1700);
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <Card className="border-border">
          <CardContent className="md:flex md:items-center md:justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                Smart Contract
              </Badge>
              <h3 className="text-lg font-semibold text-foreground">
                Alamat Kontrak untuk Verifikasi
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Alamat kontrak disediakan agar publik dapat memverifikasi transaksi dan logika
                kontrak.
              </p>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <div className="rounded-md bg-card text-card-foreground px-3 py-2 text-sm font-mono select-all border border-border">
                  {address}
                </div>

                <button
                  onClick={handleCopy}
                  className="text-sm px-3 py-2 rounded-md border border-border bg-muted text-muted-foreground hover:bg-muted/90"
                >
                  {copied ? "Tersalin!" : "Salin Alamat"}
                </button>

                <a
                  className="text-sm px-3 py-2 rounded-md border border-border bg-muted text-muted-foreground hover:bg-muted/90"
                  href={`${etherscan}/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat di Etherscan
                </a>
              </div>
            </div>

            <div className="mt-4 md:mt-0 max-w-sm">
              <p className="text-sm text-muted-foreground">
                Catatan: saat ini demo berjalan di testnet. Untuk mainnet, lihat dokumentasi &
                repositori.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
