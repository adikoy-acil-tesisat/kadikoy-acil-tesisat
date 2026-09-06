import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-blue-200 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
        {items.map((item, i) => (
          <span key={i}>
            {" / "}
            {item.href ? (
              <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
