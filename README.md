# SS Passion PG — Website & Admin Dashboard

A full-stack, production-ready website for **SS Passion PG**, built with Next.js 15,
TypeScript, Tailwind CSS, Prisma and PostgreSQL.

## What's included

- Public site: Home, About, Rooms, Room Details, Amenities, Gallery, Location,
  Contact, FAQ, Booking/Enquiry
- Secure Admin Dashboard: Rooms, Enquiries, Gallery, Amenities, FAQ, Site
  Settings — all backed by the database, not hard-coded
- Enquiry form (React Hook Form + Zod) that writes to PostgreSQL
- Floating WhatsApp button with a pre-filled enquiry message
- SEO: metadata, Open Graph tags, `robots.txt`, `sitemap.xml`, LocalBusiness
  structured data
- Responsive, accessible, premium-editorial design system (Tailwind tokens in
  `tailwind.config.ts`)

All business details (address, phone, WhatsApp, email, maps link, social
links) are placeholders until you fill them in — either by editing
`prisma/schema.prisma`'s `SiteSetting` defaults, or, easier, by logging into
`/admin/login` and updating them under **Settings** once the app is running.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

- `DATABASE_URL` — your PostgreSQL connection string (Neon, Supabase, Railway,
  or a local Postgres instance all work)
- `AUTH_SECRET` — any long random string (e.g. `openssl rand -base64 32`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used once by the seed script to create
  your first admin account

## 3. Set up the database

```bash
npm run db:migrate     # creates tables from prisma/schema.prisma
npm run db:seed        # creates your admin user + sample rooms/amenities/FAQ
```

`db:seed` prints the admin email/password it created — **log in and change
the password by creating a new admin user, or rotate `ADMIN_PASSWORD` and
re-run the seed**, since there's no in-app "change password" flow yet.

## 4. Run locally

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## 5. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repo in Vercel.
3. Add the same environment variables (`DATABASE_URL`, `AUTH_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`) in the Vercel project settings.
4. For the database, use a serverless-friendly Postgres provider such as
   **Neon** or **Supabase** and paste its connection string into
   `DATABASE_URL`.
5. After the first deploy, run the migration + seed once against your
   production database:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```
   (run this from your machine with `DATABASE_URL` pointed at production, or
   via Vercel's CLI/terminal).

## 6. Replace placeholder content

| What | Where |
|---|---|
| Business phone, WhatsApp, email, address, Google Maps links, social links, homepage headline/subtext, about text | Admin Dashboard → **Settings** |
| Rooms (price, occupancy, facilities, images) | Admin Dashboard → **Rooms** |
| Amenities | Admin Dashboard → **Amenities** |
| Gallery images | Admin Dashboard → **Gallery** |
| FAQs | Admin Dashboard → **FAQ** |

Image URLs are plain links (e.g. from your own image host, Cloudinary, or
Unsplash while placeholder). To use file uploads instead of URLs, wire in a
storage provider (e.g. Vercel Blob or Cloudinary) — the current build keeps
things dependency-light by accepting direct URLs.

## 7. Project structure

```
prisma/
  schema.prisma     # Room, Amenity, GalleryImage, Enquiry, FAQ, SiteSetting, User
  seed.ts           # creates admin user + sample content
src/
  app/              # Next.js App Router pages + API routes
    api/            # REST endpoints (rooms, enquiries, amenities, gallery, faq, settings, auth)
    admin/          # /admin/login and protected /admin/dashboard/*
  components/
    layout/         # Header, Footer, WhatsApp button
    home/            # Hero, TrustSection, AboutSection, GalleryGrid
    rooms/           # RoomCard, EnquiryForm
    admin/           # AdminSidebar, StatsCard
    ui/              # Button, Input/Label/Select/Textarea primitives
  lib/               # prisma client, auth (JWT sessions), utils, constants
  middleware.ts      # protects /admin/dashboard/*
```

## 8. Notes on functionality already tested end-to-end

The core flow — **Home → Rooms → Room Details → Enquiry → Database → Admin
Dashboard → View Enquiry** — is fully wired: the enquiry form posts to
`/api/enquiries`, which writes to Postgres via Prisma, and the admin
Enquiries page reads, filters, updates status, and deletes from the same
table.

Admin routes are protected by a signed JWT cookie (`middleware.ts` +
`src/lib/auth.ts`), checked both at the middleware layer (page access) and
inside every mutating API route (defense in depth).

## 9. Things you'll likely want to add next

- Image upload (Vercel Blob / Cloudinary / S3) instead of pasting URLs
- Email/SMS notification to the owner on new enquiries
- Pagination on the admin Enquiries table once volume grows
- A "change password" flow for the admin account
