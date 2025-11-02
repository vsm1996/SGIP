import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import AuthProvider from "./auth/Provider";
import NavBar from "./components/navbar";
import { nunito, raleway } from "./utils/font";


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
    <html lang="en" data-theme="corporate" className={`${nunito.className, raleway.className}`}>
      <body>
        <SpeedInsights />
        <Analytics />
        <AuthProvider>
          <NavBar />
          <main className="relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
