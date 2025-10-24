import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collateral, CollateralMetadata } from "@/types";

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
    <Card>
      <CardHeader>
        <CardTitle>Agunan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat agunan...</p>
        ) : (
          <>
            {/* NFT ID */}
            <div>
              <p className="text-sm text-muted-foreground">NFT ID</p>
              <p className="text-lg font-semibold">#{tokenId.toString()}</p>
            </div>

            {/* Lock Status */}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={collateral?.locked ? "destructive" : "secondary"}>
                {collateral?.locked ? "Terkunci" : "Terbuka"}
              </Badge>
            </div>

            {/* Metadata */}
            {metadata ? (
              <>
                {/* Image */}
                {metadata.image && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
                      alt={metadata.name}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                )}

                {/* Name & Description */}
                <div>
                  <p className="font-semibold">{metadata.name}</p>
                  <p className="text-sm text-muted-foreground">{metadata.description}</p>
                </div>

                {/* Attributes */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipe</p>
                    <p className="font-medium">{metadata.attributes.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nilai Estimasi</p>
                    <p className="font-medium">{metadata.attributes.estimatedValue}</p>
                  </div>
                  {metadata.attributes.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">Lokasi</p>
                      <p className="font-medium">{metadata.attributes.location}</p>
                    </div>
                  )}
                  {metadata.attributes.area && (
                    <div>
                      <p className="text-sm text-muted-foreground">Luas</p>
                      <p className="font-medium">{metadata.attributes.area}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Metadata tidak tersedia</p>
            )}

            {/* View on Etherscan */}
            <Button variant="outline" className="w-full" asChild>
              <a
                href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_COLLATERAL_NFT_ADDRESS}?a=${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat di Etherscan
              </a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
