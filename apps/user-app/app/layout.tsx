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
          <div className="h-screen overflow-hidden bg-[#F8F4FF]">
            <header className="sticky top-0 z-50 shrink-0 bg-[#F8F4FF]">
              <AppbarClient />
            </header>
            <div>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
