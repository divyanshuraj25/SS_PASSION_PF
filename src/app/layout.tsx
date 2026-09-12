import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { prisma } from "@/lib/prisma";
import { FALLBACK_SETTINGS } from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
    return settings ?? { id: "singleton", updatedAt: new Date(), ...FALLBACK_SETTINGS };
  } catch {
    return { id: "singleton", updatedAt: new Date(), ...FALLBACK_SETTINGS };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.businessName} — Comfortable PG & Hostel Stay`,
      template: `%s | ${settings.businessName}`,
    },
    description: settings.heroSubtext,
    openGraph: {
      title: settings.businessName,
      description: settings.heroSubtext,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: settings.businessName,
              description: settings.heroSubtext,
              telephone: settings.phone,
              email: settings.email,
              address: settings.address,
            }),
          }}
        />
        <Header businessName={settings.businessName} />
        <main>{children}</main>
        <Footer settings={settings as any} />
        <WhatsAppButton whatsapp={settings.whatsapp} />
      </body>
    </html>
  );
}
