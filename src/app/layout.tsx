import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViralArcade - Your One-Stop Gaming Destination",
  description: "ViralArcade is an innovative web-based gaming platform that hosts multiple viral and engaging games within a single web application.",
  keywords: ["viral games", "online games", "meme quiz", "ai roast", "would you rather", "lie detector", "gaming platform"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
