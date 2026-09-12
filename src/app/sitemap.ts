import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "https://example.com";
  const routes = [
    "",
    "/about",
    "/rooms",
    "/amenities",
    "/gallery",
    "/location",
    "/contact",
    "/faq",
    "/booking",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
