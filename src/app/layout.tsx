import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileCTABar } from "@/components/site/MobileCTABar";
import { Analytics } from "@/components/site/Analytics";
import { JsonLd } from "@/components/site/JsonLd";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site.config";

/**
 * Typography
 * ----------
 * One family across the whole site: Archivo, a grotesk with a full weight
 * range. Display sizes run at 300 with tight negative tracking; UI and body sit
 * at 400/500. Self-hosted from npm (@fontsource-variable/archivo), so the page
 * makes no request to Google, nothing blocks render, and there is no CLS.
 *
 * To change the face, swap the import above and update --font-sans-custom in
 * globals.css. Nothing else references a typeface.
 */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Columbus Black Car Service | Chartered Car",
    template: "%s | Chartered Car",
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-build="9">
      <body className="min-h-dvh bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pb-[3.5rem] lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCTABar />
        <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
        <Analytics />
      </body>
    </html>
  );
}
