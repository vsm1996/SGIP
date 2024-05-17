import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AuthProvider from "./auth/Provider";
import NavBar from "./components/navbar";

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
        <AuthProvider>
          <NavBar />
          <main className="z-0 relative">
            <Suspense fallback={<p>Looooader</p>}>
              {children}
            </Suspense>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
