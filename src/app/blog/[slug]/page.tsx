import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getAllSlugs } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/constants";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  // Simple markdown-like rendering
  const paragraphs = post.content.split("\n\n");

  // Related posts
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> {" / "}
            <Link href="/blog" className="hover:text-white">Blog</Link> {" / "}
            <span className="text-white">{post.category}</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">{post.category}</span>
            <span className="text-xs text-blue-200">{new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">{post.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {paragraphs.map((p, i) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              // Headings
              if (trimmed.startsWith("## ")) {
                return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{trimmed.replace("## ", "")}</h2>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{trimmed.replace("### ", "")}</h3>;
              }

              // Lists
              if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n").filter((line) => line.trim().startsWith("- "));
                return (
                  <ul key={i} className="space-y-2 my-4">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                        <span>{item.replace(/^- /, "")}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              // Table (basic)
              if (trimmed.startsWith("|")) {
                const rows = trimmed.split("\n").filter((r) => r.trim() && !r.trim().startsWith("|--"));
                const [headRow, ...bodyRows] = rows;
                const splitCells = (row: string) => row.split("|").filter((c) => c.trim());
                return (
                  <div key={i} className="overflow-x-auto my-6">
                    <table className="w-full border-collapse text-sm">
                      {headRow && (
                        <thead>
                          <tr className="bg-gray-100">
                            {splitCells(headRow).map((cell, ci) => (
                              <th key={ci} className="px-4 py-2 text-left font-bold text-gray-900">
                                {cell.trim()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {bodyRows.map((row, ri) => (
                          <tr key={ri} className="border-b border-gray-100">
                            {splitCells(row).map((cell, ci) => (
                              <td key={ci} className="px-4 py-2 text-left text-gray-600">
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Bold text processing
              const processText = (text: string) => {
                const parts = text.split(/(\*\*[^*]+\*\*)/g);
                return parts.map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              // Regular paragraph
              return <p key={i} className="text-gray-600 leading-relaxed my-4">{processText(trimmed)}</p>;
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Profesyonel Tesisat Hizmeti İçin Bizi Arayın</h2>
            <p className="text-blue-100 mb-6">Kadıköy&apos;de 7/24 hizmetinizdeyiz.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                Hemen Ara: {SITE_CONFIG.phoneFormatted}
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-colors">
                WhatsApp ile Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diğer Yazılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-xs font-medium text-primary bg-blue-50 px-2 py-1 rounded-full">{r.category}</span>
                <h3 className="font-bold text-gray-900 mt-3 mb-2 line-clamp-2">{r.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
