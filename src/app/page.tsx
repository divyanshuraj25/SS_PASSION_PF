import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FALLBACK_SETTINGS } from "@/lib/constants";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { AboutSection } from "@/components/home/AboutSection";
import { RoomCard } from "@/components/rooms/RoomCard";

async function getData() {
  try {
    const [settings, rooms, faqs] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: "singleton" } }),
      prisma.room.findMany({ orderBy: { sortOrder: "asc" }, take: 3 }),
      prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
    ]);
    return { settings: settings ?? FALLBACK_SETTINGS, rooms, faqs };
  } catch {
    return { settings: FALLBACK_SETTINGS, rooms: [], faqs: [] };
  }
}

export default async function HomePage() {
  const { settings, rooms, faqs } = await getData();

  return (
    <>
      <Hero headline={settings.heroHeadline} subtext={settings.heroSubtext} />
      <TrustSection />
      <AboutSection aboutText={settings.aboutText} />

      <section className="section border-b border-line">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Our Rooms</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">Find Your Fit</h2>
            </div>
            <Link href="/rooms" className="inline-flex items-center gap-1.5 font-medium text-emerald hover:text-emerald-dark">
              View all rooms <ArrowRight size={16} />
            </Link>
          </div>

          {rooms.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-ink/60">Room information will appear here once added from the admin dashboard.</p>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section">
          <div className="container-page">
            <p className="eyebrow">Good to Know</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Frequently Asked Questions</h2>
            <div className="mt-8 divide-y divide-line border-t border-line">
              {faqs.map((faq) => (
                <div key={faq.id} className="py-5">
                  <p className="font-medium text-ink">{faq.question}</p>
                  <p className="mt-1.5 text-sm text-ink/65">{faq.answer}</p>
                </div>
              ))}
            </div>
            <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 font-medium text-emerald hover:text-emerald-dark">
              View all FAQs <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
