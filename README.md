# 🕌 Amanah Syariah - Platform P2P Lending Syariah Terdesentralisasi

<div align="center">

![Amanah Syariah](https://img.shields.io/badge/Blockchain-Ethereum-blue)
<!-- ![Next.js](https://img.shields.io/badge/Next.js-15-black) -->
![License](https://img.shields.io/badge/license-MIT-green)

**Platform pembiayaan peer-to-peer berbasis blockchain yang sesuai prinsip syariah**

[Demo Live](https://amanah-syariah.vercel.app/) | [Smart Contracts NFT Collateral](https://sepolia.etherscan.io/address/0xAf6f2c6E380c9ccA1122e7e8D7DF4B94f12ea0f1#code) | [Smart Contracts Lending](https://sepolia.etherscan.io/address/0x2e8b2Cf575506675E68D5FEACf3333F8c51c0C9B#code) | [Dokumentasi](#fitur-utama)

</div>

---

## 📋 Tentang Proyek

**Amanah Syariah** adalah platform pembiayaan peer-to-peer (P2P) terdesentralisasi yang dibangun dengan teknologi blockchain Ethereum. Platform ini memungkinkan individu untuk mengajukan pinjaman dengan agunan berbasis NFT (Non-Fungible Token) dan investor untuk mendanai peluang pembiayaan yang menguntungkan, semuanya beroperasi sesuai prinsip-prinsip keuangan syariah.

### 🎯 Submission Infinity Hackathon OJK - Ekraf

Proyek ini merupakan **submission resmi** untuk **Infinity Hackathon OJK - Ekraf** dengan tema:

**"Akselerasi Ekonomi Kreatif Melalui Inovasi Digital & Desentralisasi"**

**Sub-tema:** DeFi for Creative Economy - Pemanfaatan prinsip dan teknologi keuangan terdesentralisasi (DeFi) untuk mendukung aspek pendanaan, monetisasi, dan pengelolaan aset dalam industri kreatif.

Amanah Syariah hadir sebagai solusi inovatif yang menggabungkan teknologi blockchain dengan prinsip keuangan syariah, membuka akses pembiayaan terdesentralisasi bagi para pelaku ekonomi kreatif di Indonesia.

---

## ✨ Fitur Utama

### 🏦 Untuk Peminjam
- **Pengajuan Pinjaman dengan NFT Agunan**: Gunakan aset digital (tanah, rumah, kendaraan) sebagai agunan
- **Sistem Margin Syariah**: Tanpa bunga, menggunakan sistem margin yang sesuai prinsip syariah
- **Cicilan Bulanan Fleksibel**: Durasi pinjaman hingga 60 bulan
- **Dashboard Pinjaman**: Pantau status pinjaman dan jadwal pembayaran secara real-time

### 💰 Untuk Investor/Pemberi Dana
- **Marketplace Pinjaman**: Jelajahi dan danai peluang investasi yang terbuka
- **Pendanaan Fleksibel**: Danai sebagian atau seluruh pinjaman
- **Imbal Hasil Transparan**: Lihat proyeksi keuntungan sebelum berinvestasi
- **Distribusi Otomatis**: Pembayaran dari peminjam otomatis terdistribusi ke semua investor secara proporsional
- **Portfolio Tracking**: Pantau semua investasi aktif dan historis

### 🔐 Keamanan & Transparansi
- **Smart Contract Teraudit**: Semua transaksi dijalankan melalui smart contract Ethereum
- **NFT Collateral**: Agunan direpresentasikan sebagai NFT dengan metadata IPFS
- **On-Chain Transparency**: Semua transaksi tercatat di blockchain dan dapat diverifikasi
- **Status Real-time**: Pantau status pinjaman dan pembayaran secara real-time

### 👨‍💼 Panel Admin
- **Manajemen Pinjaman**: Terima pendanaan parsial, batalkan, atau tandai pinjaman gagal bayar
- **Mint NFT Agunan**: Buat NFT untuk agunan yang telah diverifikasi
- **Penarikan Biaya Platform**: Kelola biaya platform (2%)

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js 15** dengan Turbopack untuk performa optimal
- **TypeScript** untuk type safety
- **Tailwind CSS v4** untuk styling modern
- **shadcn/ui** untuk komponen UI yang konsisten
- **Framer Motion** untuk animasi yang menarik

### Blockchain & Web3
- **Wagmi v2** - React hooks untuk Ethereum
- **RainbowKit** - Wallet connection yang mudah
- **Viem v2** - Utilities Ethereum tingkat rendah
- **TanStack Query v5** - State management asinkron
- **Ethereum Sepolia Testnet** - Jaringan blockchain

### Storage
- **IPFS via Pinata** - Penyimpanan terdesentralisasi untuk metadata NFT

### Smart Contracts
- **CollateralNFT**: Manajemen NFT agunan
- **LendingPlatform**: Logika peminjaman dan pembayaran

---

## 🚀 Cara Memulai

### Prasyarat
- Node.js 18.x atau lebih baru
- npm atau yarn
- MetaMask atau wallet Ethereum lainnya
- ETH Sepolia testnet (dapat diperoleh dari faucet)

### Instalasi

1. **Clone repository**
```bash
git clone https://github.com/your-username/amanah-syariah-dapp.git
cd amanah-syariah-dapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Buat file `.env.local` dan isi dengan:
```env
# WalletConnect Project ID (dapatkan dari https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Admin wallet address
NEXT_PUBLIC_ADMIN_ADDRESS=0xYourAdminAddress

# Smart Contract Addresses (Sepolia)
NEXT_PUBLIC_COLLATERAL_NFT_ADDRESS=0xYourCollateralNFTAddress
NEXT_PUBLIC_LENDING_PLATFORM_ADDRESS=0xYourLendingPlatformAddress

# Pinata IPFS Credentials
PINATA_JWT=your_pinata_jwt
PINATA_API_KEY=your_api_key
PINATA_SECRET_API_KEY=your_secret_key

# Chain ID (Sepolia)
NEXT_PUBLIC_CHAIN_ID=11155111
```

4. **Jalankan development server**
```bash
npm run dev
```

5. **Buka browser**
```
http://localhost:3000
```

### Build untuk Production

```bash
npm run build
npm start
```

---

## 📁 Struktur Proyek

```
amanah-syariah-dapp/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── marketplace/        # Halaman marketplace
│   │   ├── my-loans/           # Halaman pinjaman user
│   │   ├── my-investments/     # Halaman investasi user
│   │   ├── loan/[id]/          # Detail pinjaman
│   │   ├── admin/              # Panel admin
│   │   └── api/                # API routes (IPFS upload)
│   ├── components/             # React components
│   │   ├── loan/               # Komponen terkait pinjaman
│   │   ├── investment/         # Komponen investasi
│   │   ├── collateral/         # Komponen agunan
│   │   ├── admin/              # Komponen admin
│   │   ├── layout/             # Layout components
│   │   ├── home/               # Homepage components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-loans.ts        # Hooks untuk data pinjaman
│   │   ├── use-collateral.ts   # Hooks untuk data agunan
│   │   └── use-investments.ts  # Hooks untuk data investasi
│   ├── lib/                    # Utilities & configurations
│   │   ├── contracts/          # Smart contract ABIs
│   │   ├── wagmi.ts            # Wagmi configuration
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── .env.local                  # Environment variables (tidak di-commit)
```

---

## 🎨 Fitur UI/UX

- **Dark Mode Support**: Mode gelap untuk kenyamanan mata
- **Responsive Design**: Optimal di semua ukuran layar
- **Loading States**: Feedback visual untuk setiap aksi
- **Error Handling**: Pesan error yang jelas dan membantu
- **Toast Notifications**: Notifikasi real-time untuk aksi user
- **Animasi Smooth**: Transisi halus dengan Framer Motion
- **Bahasa Indonesia**: Seluruh interface dalam Bahasa Indonesia yang natural

---

## 🔗 Smart Contract Integration

### CollateralNFT Contract
- Mint NFT agunan untuk peminjam
- Lock/unlock NFT saat pinjaman aktif
- Metadata IPFS untuk detail agunan

### LendingPlatform Contract
- Buat permintaan pinjaman
- Danai pinjaman (full/partial)
- Bayar cicilan bulanan
- Distribusi otomatis ke investor
- Manajemen status pinjaman (Active, Completed, Defaulted)
- Biaya platform 2%

---

## 📊 Alur Pengguna

### Alur Peminjam
1. Admin memverifikasi agunan dan mint NFT
2. Peminjam membuat permintaan pinjaman dengan NFT
3. Pinjaman muncul di marketplace dengan status "Terbuka untuk Pendanaan"
4. Investor mendanai pinjaman
5. Setelah terdanai penuh (atau admin menerima pendanaan parsial), pinjaman menjadi aktif
6. Peminjam membayar cicilan bulanan
7. Setelah lunas, NFT agunan dibuka kembali

### Alur Investor
1. Jelajahi marketplace untuk pinjaman yang terbuka
2. Lihat detail pinjaman (agunan, margin rate, durasi, dll)
3. Danai pinjaman (sebagian atau penuh)
4. Terima pembagian pembayaran cicilan secara otomatis dan proporsional
5. Pantau portfolio investasi di dashboard

---

## 🌟 Keunggulan Amanah Syariah

1. **Sesuai Prinsip Syariah**: Menggunakan sistem margin, bukan bunga
2. **Terdesentralisasi**: Tidak ada middleman, transaksi peer-to-peer
3. **Transparan**: Semua data tercatat on-chain
4. **Aman**: Smart contract yang telah diaudit
5. **Inklusif**: Akses pembiayaan untuk semua kalangan
6. **Efisien**: Biaya platform hanya 2%
7. **Real-time**: Status pinjaman dan pembayaran terupdate langsung
8. **User-Friendly**: Interface yang mudah dipahami dalam Bahasa Indonesia

---

## 🤝 Kontribusi

Kami terbuka untuk kontribusi! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

## 📞 Kontak

**Tim Amanah Syariah**

- Email: shafly2000@gmail.com
- GitHub: [Amanah Syariah Repository](https://github.com/your-repo)

---

## 🙏 Acknowledgments

- **OJK (Otoritas Jasa Keuangan)** - Regulator keuangan Indonesia
- **Ekraf (Kementerian Ekonomi Kreatif)** - Pendukung ekonomi kreatif
- **ABI (Asosiasi Blockchain Indonesia)** - Komunitas blockchain Indonesia
- **BlockDevId** - Komunitas developer blockchain Indonesia
- **Infinity Hackathon** - Platform untuk inovasi blockchain

---

<div align="center">

**Dibuat dengan ❤️ untuk Infinity Hackathon OJK - Ekraf 2025**

*Memajukan Ekonomi Kreatif Indonesia melalui Teknologi Blockchain*

</div>
