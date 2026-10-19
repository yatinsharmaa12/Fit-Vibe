import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/page";

// Optimize font loading with display swap and preload
const inter = Outfit({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "FitVibe",
  description: "FitVibe - Track your fitness journey with AI-powered pose detection",
  keywords: ["fitness", "workout", "pose detection", "AI fitness"],
  authors: [{ name: "FitVibe Team" }],
};

// Separate viewport export (Next.js 15+ requirement)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
