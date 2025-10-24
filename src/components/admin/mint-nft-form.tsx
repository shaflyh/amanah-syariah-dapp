"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTRACTS } from "@/lib/contracts";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { CollateralMetadata } from "@/types";

export function MintNFTForm() {
  const [step, setStep] = useState<"form" | "uploading" | "minting" | "success">("form");

  // Form fields
  const [recipientAddress, setRecipientAddress] = useState("");
  const [collateralType, setCollateralType] = useState<"LAND" | "HOUSE" | "VEHICLE">("LAND");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // IPFS data
  const [metadataURI, setMetadataURI] = useState("");

  // Contract interaction
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload and mint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("uploading");

    try {
      let imageIPFSUrl = "";

      // 1. Upload image if provided
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);

        const imageResponse = await fetch("/api/upload-to-ipfs", {
          method: "POST",
          body: imageFormData,
        });

        if (!imageResponse.ok) throw new Error("Failed to upload image");

        const imageData = await imageResponse.json();
        imageIPFSUrl = imageData.ipfsUrl;
      }

      // 2. Create metadata JSON
      const metadata: CollateralMetadata = {
        name: name || `${collateralType} #${Date.now()}`,
        description: description || `${collateralType} collateral`,
        image: imageIPFSUrl,
        attributes: {
          type: collateralType,
          estimatedValue: `${estimatedValue} ETH`,
          location: location || undefined,
          area: area || undefined,
          certificateNumber: certificateNumber || undefined,
          documents: [], // Can add document upload later
        },
      };

      // 3. Upload metadata JSON to IPFS
      const metadataResponse = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (!metadataResponse.ok) throw new Error("Failed to upload metadata");

      const metadataData = await metadataResponse.json();
      setMetadataURI(metadataData.ipfsUrl);

      // 4. Mint NFT
      setStep("minting");
      writeContract({
        ...CONTRACTS.CollateralNFT,
        functionName: "mintCollateral",
        args: [recipientAddress as `0x${string}`, metadataData.ipfsUrl],
      });
    } catch (err) {
      console.error("Error:", err);
      setStep("form");
      alert("Failed to upload or mint. Check console for details.");
    }
  };

  // Reset form
  const handleReset = () => {
    setStep("form");
    setRecipientAddress("");
    setName("");
    setDescription("");
    setEstimatedValue("");
    setLocation("");
    setArea("");
    setCertificateNumber("");
    setImageFile(null);
    setImagePreview("");
    setMetadataURI("");
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">NFT Berhasil Di-mint!</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Penerima: {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
              </p>
              <p className="text-muted-foreground">Metadata: {metadataURI}</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block"
              >
                Lihat di Etherscan
              </a>
            </div>
            <Button onClick={handleReset} className="mt-4">
              Mint NFT Lain
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Mint NFT Agunan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label>Alamat Penerima (Dompet Peminjam) *</Label>
            <Input
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
              disabled={step !== "form"}
            />
          </div>

          {/* Collateral Type */}
          <div className="space-y-2">
            <Label>Tipe Agunan *</Label>
            <Select
              value={collateralType}
              onValueChange={(value: any) => setCollateralType(value)}
              disabled={step !== "form"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LAND">Tanah</SelectItem>
                <SelectItem value="HOUSE">Rumah</SelectItem>
                <SelectItem value="VEHICLE">Kendaraan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Nama *</Label>
            <Input
              placeholder="contoh: Tanah Jakarta Selatan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={step !== "form"}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              placeholder="Deskripsi singkat agunan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={step !== "form"}
            />
          </div>

          {/* Estimated Value */}
          <div className="space-y-2">
            <Label>Nilai Estimasi (ETH) *</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="contoh: 62.5"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              required
              disabled={step !== "form"}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input
              placeholder="contoh: Jakarta Selatan, Indonesia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={step !== "form"}
            />
          </div>

          {/* Area (for Land/House) */}
          {(collateralType === "LAND" || collateralType === "HOUSE") && (
            <div className="space-y-2">
              <Label>Luas</Label>
              <Input
                placeholder="contoh: 500 m²"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={step !== "form"}
              />
            </div>
          )}

          {/* Certificate Number */}
          <div className="space-y-2">
            <Label>Nomor Sertifikat</Label>
            <Input
              placeholder="contoh: SHM 12345"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              disabled={step !== "form"}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Gambar Agunan</Label>
            <div className="border-2 border-dashed rounded-lg p-4">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    disabled={step !== "form"}
                  >
                    Hapus Gambar
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Klik untuk unggah gambar</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                    disabled={step !== "form"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={step !== "form" || !recipientAddress || !name || !estimatedValue}
          >
            {step === "uploading" && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengunggah ke IPFS...
              </>
            )}
            {step === "minting" && (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Konfirmasi di Dompet..." : "Minting NFT..."}
              </>
            )}
            {step === "form" && "Mint NFT"}
          </Button>

          <p className="text-xs text-muted-foreground">
            * Ini akan mengunggah metadata ke IPFS dan mint NFT ke dompet penerima
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
