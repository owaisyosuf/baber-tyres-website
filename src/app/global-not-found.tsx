import type { Metadata } from "next";
import "./(site)/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyContact } from "@/components/layout/StickyContact";
import { inter, sora } from "@/lib/fonts";
import NotFound from "./(site)/not-found";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * The 404 for URLs that match no route at all. It bypasses the site layout, so
 * it wraps the same branded page in the same header, footer, and fonts.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text">
        <Header />
        <main className="flex-1">
          <NotFound />
        </main>
        <Footer />
        <StickyContact />
      </body>
    </html>
  );
}
