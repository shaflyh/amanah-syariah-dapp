import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { CONTRACTS } from "@/lib/contracts";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("tokenId");
    const address = searchParams.get("address");

    if (!tokenId || !address) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Check owner
    const owner = (await publicClient.readContract({
      ...CONTRACTS.CollateralNFT,
      functionName: "ownerOf",
      args: [BigInt(tokenId)],
    })) as `0x${string}`;

    // Check if locked
    const collateral = (await publicClient.readContract({
      ...CONTRACTS.CollateralNFT,
      functionName: "getCollateral",
      args: [BigInt(tokenId)],
    })) as { locked: boolean };

    return NextResponse.json({
      isOwner: owner.toLowerCase() === address.toLowerCase(),
      locked: collateral.locked,
    });
  } catch (error) {
    return NextResponse.json({ error: "NFT does not exist" }, { status: 404 });
  }
}
