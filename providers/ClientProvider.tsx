"use client";

import { ThemeModeScript } from "flowbite-react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Toaster } from "@/components/ui/toaster";
import SessionProviderComponent from "@/providers/SessionProvider";
import LoadingProvider from "@/components/shared/AppLoader";
import Head from "next/head";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : null,
});

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <ThemeModeScript />
      </Head>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <SessionProviderComponent>
          <LoadingProvider>
            {children}
            <Toaster />
          </LoadingProvider>
        </SessionProviderComponent>
      </PersistQueryClientProvider>
    </>
  );
}
