"use client";

import dynamic from "next/dynamic";

// Dynamically import Providers with SSR disabled to prevent indexedDB errors
const Providers = dynamic(() => import("./providers").then((mod) => mod.Providers), {
  ssr: false,
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
