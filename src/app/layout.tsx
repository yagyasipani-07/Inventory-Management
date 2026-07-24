import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/src/components/auth/AuthProvider";
import { NetworkStatus } from "@/src/components/shared/NetworkStatus";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Paras Plywoods — Inventory ERP",
    template: "%s | Paras Plywoods",
  },
  description:
    "Production-quality ERP Inventory Management System for Paras Plywoods warehouse operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <NetworkStatus />
              {children}
              <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                style: { borderRadius: "8px" },
              }}
            />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
