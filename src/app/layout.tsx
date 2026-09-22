import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "go-bs — Bikram Sambat date conversion for Go",
    template: "%s — go-bs",
  },
  description:
    "A dependency-free Go library for converting dates between Gregorian (AD) and Bikram Sambat (BS), Nepal's calendar. Supports BS 1979–2100 with verified calendar data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          MIT licensed.{" "}
          <a
            href="https://github.com/suprimkhatri77/go-bs"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            View source on GitHub
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
