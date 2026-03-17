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
  title: "CanadaStats",
  description: "Canada province population and housing price dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b border-card-border bg-nav-bg text-nav-fg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍁</span>
              <span className="text-lg font-semibold tracking-tight">CanadaStats</span>
            </div>
            <p className="hidden text-sm text-nav-fg/60 sm:block">
              Population & Housing Price Dashboard
            </p>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
