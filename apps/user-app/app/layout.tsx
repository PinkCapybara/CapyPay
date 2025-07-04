import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import { AppbarClient } from "../components/AppbarClient";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "digital wallet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>
          <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
            <AppbarClient />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
