import Image from "next/image";
import Link from "next/link";
import type { GaleriKaydi } from "@/lib/galeri";

interface Props {
  kayitlar: GaleriKaydi[];
  baslik: string;
  altBaslik?: string;
  /** Koyu zeminli bölümlerde kullanım. */
  zemin?: "beyaz" | "gri";
}

/**
 * Sahadan çekilmiş iş fotoğrafları şeridi.
 *
 * Fotoğraflar yalnızca galeri sayfasındaydı; oraya neredeyse kimse girmiyor.
 * Oysa "bu adam gerçekten bu işi yapıyor" mesajını veren tek şey bunlar.
 * Ana sayfada ve mahalle sayfalarında, insanın zaten baktığı yerde gösteriyoruz.
 *
 * Kayıt yoksa hiçbir şey basmaz — boş bir "fotoğraf yok" kutusu güven azaltır.
 */
export default function GaleriSeridi({ kayitlar, baslik, altBaslik, zemin = "beyaz" }: Props) {
  if (kayitlar.length === 0) return null;

  return (
    <section className={`py-16 ${zemin === "gri" ? "bg-gray-50" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{baslik}</h2>
          {altBaslik && <p className="text-gray-600 max-w-2xl mx-auto">{altBaslik}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kayitlar.map((k) => (
            <figure key={k.id} className="group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={k.url}
                  alt={k.baslik}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{k.baslik}</span>
                {k.mahalle && <span className="text-gray-400"> · {k.mahalle}</span>}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/galeri"
            className="inline-block border-2 border-primary text-primary font-semibold py-2.5 px-6 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Tüm Fotoğraflar
          </Link>
        </div>
      </div>
    </section>
  );
}
