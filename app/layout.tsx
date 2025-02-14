"use client";
import type { Metadata } from "next";
import { Inter, Urbanist, Poppins } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProviderComponent from "@/providers/SessionProvider";
import LoadingProvider from "@/components/shared/AppLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "auto",
  variable: "--font-urbanist",
});

const poppins = Poppins({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

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
        <LoadingProvider>
          <html lang="en">
            <head>
              <ThemeModeScript />
            </head>
            <body
              className={`${urbanist.variable}  ${inter.variable} ${poppins.variable}`}
            >
              {children}

              <Toaster />
            </body>
          </html>
        </LoadingProvider>
      </SessionProviderComponent>
    </PersistQueryClientProvider>
  );
}
