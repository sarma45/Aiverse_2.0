import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/providers/SmoothScrolling";
import AuthProvider from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIVerse Omega - The Universal AI Nexus",
  description: "Global infrastructure for specialized AI discovery, orchestration, and monetization.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#0a0a0a] text-white`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
