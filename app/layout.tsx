import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, websiteJsonLd } from "@/components/JsonLd";
import { RegisterSW } from "@/components/RegisterSW";
import { StickyFooterAd } from "@/components/StickyFooterAd";
import { ADS, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GSC = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

const DEFAULT_TITLE = "Retrasos Cercanías Hoy: Estado de Trenes en Tiempo Real en España";
const DEFAULT_DESC =
  "Consulta retrasos, averías e incidencias de Cercanías, Rodalies y Media Distancia en España. Estado de tu línea y estación en directo, actualizado al minuto.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  keywords: ["retrasos Cercanías hoy", "estado línea C5", "incidencias Rodalies", "avería tren Atocha", "retrasos Renfe"],
  verification: GSC ? { google: GSC } : undefined,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    // Añade app/opengraph-image.png (1200x630) y Next lo enlazará automáticamente.
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESC },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  appleWebApp: { capable: true, title: "RetrasosTrenes", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen font-sans antialiased">
        <JsonLd data={websiteJsonLd()} />
        <Header />
        <main className="mx-auto max-w-3xl px-4 pt-4">{children}</main>
        <Footer />
        <StickyFooterAd slot={ADS.slotSticky} />
        <RegisterSW />

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
            </Script>
          </>
        )}
        {ADS.client && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
