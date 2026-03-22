import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
  description: "Canada province population and housing price index dashboard",
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
              <Link href="/" aria-label="Go to home page">
                <span className="text-xl mr-2">🍁</span>
                <span className="text-lg font-semibold tracking-tight">
                  CanadaStats
                </span>
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="mt-8 border-t border-card-border bg-nav-bg text-nav-fg">
          <div className="mx-auto max-w-7xl px-4 py-5">
            <div className="flex flex-col gap-4 text-base sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-0.5 text-nav-fg">
                <p className="flex flex-wrap items-center gap-2">
                  Data source:{" "}
                  <a
                    href="https://www.statcan.gc.ca/en/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 hover:underline transition-colors hover:text-nav-fg"
                  >
                    Statistics Canada
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19,21H5c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h7v2H5v14h14v-7h2v7C21,20.1,20.1,21,19,21z"></path>
                      <path d="M21 10L19 10 19 5 14 5 14 3 21 3z"></path>
                      <path
                        d="M6.7 8.5H22.3V10.5H6.7z"
                        transform="rotate(-45.001 14.5 9.5)"
                      ></path>
                    </svg>
                  </a>
                </p>
                <p className="text-nav-fg lg:mt-2 ">Last updated: March 2026</p>
              </div>
              <div className="flex items-center gap-4 pt-2 sm:pl-4 sm:pt-0">
                <span className="text-nav-fg">
                  © {new Date().getFullYear()} Miku Watanabe
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/Mik-watanabe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-nav-fg/60 transition-colors hover:text-nav-fg"
                    aria-label="Visit Miku Watanabe's GitHub profile in a new tab"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 128 128"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/miku-watanabe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex text-nav-fg/60 transition-colors"
                    aria-label="Visit Miku Watanabe's LinkedIn profile in a new tab"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 128 128">
                      <path
                        d="M116 3H12a8.91 8.91 0 00-9 8.8v104.42a8.91 8.91 0 009 8.78h104a8.93 8.93 0 009-8.81V11.77A8.93 8.93 0 00116 3z"
                        fill="currentColor"
                        className="transition-colors group-hover:fill-white"
                      />
                      <path
                        d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 11-10.5 10.49 10.5 10.5 0 0110.5-10.49M50.53 48.73h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"
                        fill="currentColor"
                        className="transition-[fill] group-hover:fill-[#1b2e4b]"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
