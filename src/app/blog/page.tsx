import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | Tesisat Bilgi ve Önerileri",
  description: "Tesisat hakkında faydalı bilgiler, ipuçları ve öneriler. Tıkanıklık açma, su kaçağı tespiti, ev tesisatı bakım rehberleri.",
};

export default function BlogPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-blue-100">Tesisat hakkında faydalı bilgiler, ipuçları ve rehberler.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`${post.color} h-40 flex items-center justify-center`}>
                  <span className="text-5xl">
                    {post.category === "Tıkanıklık Açma" ? "🔧" : post.category === "Su Kaçağı Tespiti" ? "🔍" : post.category === "Bakım" ? "🛡️" : "📋"}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary bg-blue-50 px-2 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-primary font-semibold text-sm hover:underline">
                    Devamını Oku &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
