import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/helper/SessionWrapper";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A.H HANDICRAFT",
  description: "Discover handmade trophies and handicrafts online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <SessionWrapper>
          <Navbar />
          <main className="pt-16">{children}</main>
        </SessionWrapper>
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        <Analytics />
      </body>
    </html>
  );
}
