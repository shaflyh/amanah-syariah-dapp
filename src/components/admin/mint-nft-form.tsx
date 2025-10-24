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
import { Loader2, Upload, CheckCircle2, X } from "lucide-react";
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
          <CardTitle className="text-2xl">Mint NFT Agunan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Informasi Dasar
                </h3>
              </div>

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
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column - Details & Valuation */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Detail & Penilaian
                </h3>
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
            </div>

            {/* Full Width - Image Upload */}
            <div className="lg:col-span-2 space-y-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Gambar Agunan
                </h3>
              </div>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Pratinjau agunan"
                    className="w-full h-80 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    disabled={step !== "form"}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Klik untuk unggah</span> atau seret dan lepas
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, atau GIF (Maks 10MB)</p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={step !== "form"}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="lg:col-span-2">
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Submit Button */}
            <div className="lg:col-span-2 space-y-3">
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={step !== "form" || !recipientAddress || !name || !estimatedValue}
              >
                {step === "uploading" && (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Mengunggah ke IPFS...
                  </>
                )}
                {step === "minting" && (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isPending ? "Konfirmasi di Dompet..." : "Minting NFT..."}
                  </>
                )}
                {step === "form" && "Mint NFT Agunan"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * Ini akan mengunggah metadata ke IPFS dan mint NFT ke dompet penerima
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
