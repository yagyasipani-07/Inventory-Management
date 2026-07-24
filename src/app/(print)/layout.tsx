import { Inter } from "next/font/google";
import "@/src/styles/globals.css"; // Ensure styles are loaded
import { QueryProvider } from "@/src/components/providers/query-provider"; // Load query client

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Print | Paras Plywoods ERP",
  description: "Printable Document",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} print-mode`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
