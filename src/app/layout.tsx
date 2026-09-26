import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { Footer } from "@/components/SiteLinks";
import { LANGUAGES } from "@/lib/languages";
import {
  AUTHOR,
  FEED_ALTERNATES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [AUTHOR],
  creator: AUTHOR.name,
  keywords: [
    "Bikram Sambat",
    "Nepali calendar",
    "Nepali date",
    "BS to AD",
    "AD to BS",
    "date converter",
    "Go",
    "Golang",
    "go-bs",
    "TypeScript",
    "JavaScript",
    "bikram-sambat-ts",
    "React",
    "Nepali date picker",
    "Nepali calendar component",
    "bikram-sambat-react",
    "Nepal",
  ],
  alternates: { types: FEED_ALTERNATES },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    ...LANGUAGES.map((language) => ({
      "@type": "SoftwareSourceCode",
      "@id": `${SITE_URL}/#software-${language.id}`,
      name: language.packageName,
      codeRepository: language.repoUrl,
      programmingLanguage: { "@type": "ComputerLanguage", name: language.programmingLanguage ?? language.name },
      license: "https://opensource.org/licenses/MIT",
      author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
      url: `${SITE_URL}/docs${language.prefix}/getting-started`,
    })),
  ],
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
        <script
          type="application/ld+json"
          // JSON.stringify output can't close the script tag unless a value
          // contains "</", which none of these constants do.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
