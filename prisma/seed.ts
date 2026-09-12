import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const email = process.env.ADMIN_EMAIL || "admin@sspassionpg.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "SS Passion PG Admin", email, passwordHash },
  });

  // --- Site settings (singleton row) ---
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {},
  });

  // --- Rooms ---
  const rooms = [
    {
      slug: "single-room",
      name: "Single Room",
      type: "Single Room",
      occupancy: 1,
      price: 9000,
      description:
        "A private room designed for residents who value quiet, personal space. Comes with a study table, wardrobe and attached bathroom.",
      facilities: ["Attached Bathroom", "Study Table", "Wardrobe", "Wi-Fi", "Power Backup"],
      images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1600"],
      totalUnits: 6,
      availableUnits: 2,
    },
    {
      slug: "double-sharing",
      name: "Double Sharing",
      type: "Double Sharing",
      occupancy: 2,
      price: 6500,
      description:
        "A comfortable shared room for two, balancing affordability with privacy. Includes individual storage and a shared study area.",
      facilities: ["Attached Bathroom", "Individual Wardrobe", "Wi-Fi", "Housekeeping"],
      images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1600"],
      totalUnits: 10,
      availableUnits: 4,
    },
    {
      slug: "triple-sharing",
      name: "Triple Sharing",
      type: "Triple Sharing",
      occupancy: 3,
      price: 5000,
      description:
        "Our most budget-friendly option, ideal for residents looking for a social living environment without compromising on essentials.",
      facilities: ["Common Bathroom", "Wardrobe", "Wi-Fi", "Common Area Access"],
      images: ["https://images.unsplash.com/photo-1595526051245-4506e0005bd0?q=80&w=1600"],
      totalUnits: 8,
      availableUnits: 0,
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: {},
      create: {
        ...room,
        isAvailable: room.availableUnits > 0,
      },
    });
  }

  // --- Amenities ---
  const amenities = [
    { name: "High-Speed Wi-Fi", icon: "Wifi" },
    { name: "24/7 Security", icon: "ShieldCheck" },
    { name: "CCTV Surveillance", icon: "Camera" },
    { name: "Power Backup", icon: "BatteryCharging" },
    { name: "Clean & Sanitized Rooms", icon: "Sparkles" },
    { name: "Regular Housekeeping", icon: "Brush" },
    { name: "Clean Drinking Water", icon: "GlassWater" },
    { name: "Common Area", icon: "Sofa" },
    { name: "Parking", icon: "SquareParking" },
    { name: "Study Area", icon: "BookOpen" },
    { name: "Laundry", icon: "WashingMachine" },
    { name: "Attached Bathroom", icon: "ShowerHead" },
  ];

  for (let i = 0; i < amenities.length; i++) {
    const existing = await prisma.amenity.findFirst({ where: { name: amenities[i].name } });
    if (!existing) {
      await prisma.amenity.create({ data: { ...amenities[i], sortOrder: i } });
    }
  }

  // --- FAQs ---
  const faqs = [
    {
      question: "What room types are available?",
      answer: "We offer Single Rooms, Double Sharing and Triple Sharing options, each with different pricing and privacy levels. Visit our Rooms page for current availability.",
    },
    {
      question: "What amenities are included?",
      answer: "All residents get access to Wi-Fi, housekeeping, power backup, drinking water and common areas. Room-specific facilities are listed on each room's detail page.",
    },
    {
      question: "Is Wi-Fi available?",
      answer: "Yes, high-speed Wi-Fi is available throughout the property.",
    },
    {
      question: "Is parking available?",
      answer: "Yes, parking is available on the premises. Please mention your vehicle at the time of enquiry.",
    },
    {
      question: "Is housekeeping provided?",
      answer: "Yes, regular housekeeping is provided for all rooms and common areas.",
    },
    {
      question: "Is security available?",
      answer: "Yes, the premises has 24/7 security and CCTV surveillance for resident safety.",
    },
    {
      question: "How can I book a room?",
      answer: "Submit an enquiry through our Booking page or WhatsApp us directly. Our team will confirm availability and guide you through the next steps.",
    },
    {
      question: "What documents are required?",
      answer: "A valid government ID proof is required at check-in. Our team will share the complete list when you confirm your booking.",
    },
    {
      question: "What is the minimum stay?",
      answer: "Please contact us directly for current minimum stay terms, as they may vary by room type and season.",
    },
  ];

  for (let i = 0; i < faqs.length; i++) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faqs[i].question } });
    if (!existing) {
      await prisma.fAQ.create({ data: { ...faqs[i], sortOrder: i } });
    }
  }

  // --- Gallery placeholders ---
  const gallery = [
    { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200", alt: "Single room interior", category: "ROOMS" as const },
    { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200", alt: "Double sharing room", category: "ROOMS" as const },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200", alt: "Common lounge area", category: "COMMON_AREAS" as const },
    { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200", alt: "Building exterior", category: "EXTERIOR" as const },
    { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1200", alt: "Study area", category: "FACILITIES" as const },
    { url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1200", alt: "Neighbourhood surroundings", category: "SURROUNDINGS" as const },
  ];

  for (let i = 0; i < gallery.length; i++) {
    const existing = await prisma.galleryImage.findFirst({ where: { url: gallery[i].url } });
    if (!existing) {
      await prisma.galleryImage.create({ data: { ...gallery[i], sortOrder: i } });
    }
  }

  console.log("Seed complete. Admin login:", email, "/", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
