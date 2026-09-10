import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog-data";
import { SITE_URL } from "@/lib/constants";
import { ONE_CIKAN_MAHALLELER } from "@/lib/mahalleler";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: `${BASE_URL}`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/hakkimizda`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/hizmetlerimiz`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/hizmetlerimiz/tikaniklik-acma`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/hizmetlerimiz/su-kacagi-tespiti`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/hizmetlerimiz/genel-tesisat`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/hizmetlerimiz/tamir-montaj`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/hizmet-bolgeleri`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/fiyatlar`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/galeri`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/sss`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/iletisim`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  // Mahalle sayfalarını otomatik ekle
  const mahallePages = ONE_CIKAN_MAHALLELER.map((m) => ({
    url: `${BASE_URL}${m.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog yazılarını otomatik ekle
  const blogPages = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...mahallePages, ...blogPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
