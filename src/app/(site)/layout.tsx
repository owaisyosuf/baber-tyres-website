import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyContact } from "@/components/layout/StickyContact";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { getShopSettings } from "@/lib/sanity/settings";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Site-wide defaults (FR-G1). Pages override the title and description; the
// template turns a page title into "<title> | Shop name".
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getShopSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo.title,
      template: `%s | ${settings.shopName}`,
    },
    description: settings.seo.description,
    applicationName: settings.shopName,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-accent font-semibold text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <Header />
        {/* tabIndex lets the skip link move focus here; the ring is dropped
            because a whole-page outline on a non-interactive region is noise. */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 scroll-mt-16 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
        <StickyContact />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
