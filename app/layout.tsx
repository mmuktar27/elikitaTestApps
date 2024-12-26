"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProviderComponent from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

/* export const metadata: Metadata = {
  title: "E-likita",
  description: "e-likita",
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24,
      },
    },
  });

  const persister = createSyncStoragePersister({
    storage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
    },
  });
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <SessionProviderComponent>
        <html lang="en">
          <head>
            <ThemeModeScript />
          </head>
          <body className={inter.className}>
            {children}

            <Toaster />
          </body>
        </html>
      </SessionProviderComponent>
    </PersistQueryClientProvider>
  );
}
