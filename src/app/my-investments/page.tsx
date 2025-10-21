import { Header } from "@/components/layout/header";

export default function MyInvestmentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">My Investments</h1>
        <p className="text-muted-foreground mt-2">Coming in Phase 3...</p>
      </main>
    </div>
  );
}
