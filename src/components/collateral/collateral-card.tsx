import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collateral, CollateralMetadata } from "@/types";
import { ExternalLink, Lock, LockOpen, Loader2, Building2, MapPin, Ruler } from "lucide-react";

export function CollateralCard({
  tokenId,
  collateral,
  metadata,
  isLoading,
}: {
  tokenId: bigint;
  collateral: Collateral | undefined;
  metadata: CollateralMetadata | undefined | null;
  isLoading: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r  dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Agunan</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">NFT Collateral</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="font-mono">
              #{tokenId.toString()}
            </Badge>
            <Badge variant={collateral?.locked ? "destructive" : "default"}>
              {collateral?.locked ? (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Terkunci
                </>
              ) : (
                <>
                  <LockOpen className="w-3 h-3 mr-1" />
                  Terbuka
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Memuat agunan...</p>
          </div>
        ) : metadata ? (
          <>
            {/* Image */}
            {metadata.image && (
              <div className="relative overflow-hidden bg-muted">
                <img
                  src={metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
                  alt={metadata.name}
                  className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-semibold text-lg">{metadata.name}</p>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Description */}
              {metadata.description && (
                <p className="text-sm text-muted-foreground">{metadata.description}</p>
              )}

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">Tipe</p>
                    <p className="font-semibold">{metadata.attributes.type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">Nilai Estimasi</p>
                    <p className="font-bold text-lg text-green-700 dark:text-green-400">
                      {metadata.attributes.estimatedValue}
                    </p>
                  </div>
                </div>

                {metadata.attributes.location && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Lokasi</p>
                      <p className="font-medium">{metadata.attributes.location}</p>
                    </div>
                  </div>
                )}

                {metadata.attributes.area && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Ruler className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Luas</p>
                      <p className="font-medium">{metadata.attributes.area}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* View on Etherscan */}
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_COLLATERAL_NFT_ADDRESS}?a=${tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Lihat di Etherscan
                </a>
              </Button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Metadata tidak tersedia</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
