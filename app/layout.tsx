
import { Inter, Urbanist, Poppins } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/providers/ClientProvider";
import { PageProvider } from "@/components/shared";


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

export const metadata = {
  title: "e-likita",
  description:
    "Harnessing the power of tech to bridge healthcare delivery gaps by providing clinical decision support to the health workers.",
  icon: "/public/favicon.ico",
  image: "/public/favicon.ico",
};

export default async  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${inter.variable} ${poppins.variable}`}
        suppressHydrationWarning={true}
      >
        <PageProvider>
    
        <ClientProviders>{children}</ClientProviders>
        </PageProvider>
      </body>
    </html>
  );
}
