import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AuthProvider from "./auth/Provider";
import NavBar from "./components/navbar";
import NichirenLibrary from "./components/nichiren-library";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SGip",
  description: "Sokka Gakkai - Internet Practioners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="aqua">
      <body className={inter.className}>
        <SpeedInsights />
        <Analytics />
        <AuthProvider>
          <NavBar />
          <main className="relative">
            <Suspense fallback={<div className=" loading loading-ring loading-lg"></div>}>
              {children}
            </Suspense>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
