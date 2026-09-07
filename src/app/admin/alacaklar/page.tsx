"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { toIntlPhone } from "@/lib/date";
import { para, tarihKisa } from "@/lib/format";
import { HIZMET_TURLERI, type Is, type Musteri, type Odeme } from "@/lib/types";

type Satir = {
  is: Is;
  musteri: Musteri | null;
  tutar: number;
  odenen: number;
  kalan: number;
  gun: number;
};

/** İki tarih arası gün farkı. */
function gunFarki(iso: string): number {
  const fark = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(fark / 86_400_000));
}

/** Yaşlandırma kovası — ne kadar bekleyen alacak. */
function kova(gun: number): { etiket: string; renk: string } {
  if (gun >= 90) return { etiket: "90+ gün", renk: "bg-red-100 text-red-700" };
  if (gun >= 60) return { etiket: "60+ gün", renk: "bg-orange-100 text-orange-700" };
  if (gun >= 30) return { etiket: "30+ gün", renk: "bg-amber-100 text-amber-700" };
  return { etiket: `${gun} gün`, renk: "bg-gray-100 text-gray-600" };
}

export default function AlacaklarPage() {
  const [satirlar, setSatirlar] = useState<Satir[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function yukle() {
      try {
        const supabase = createClient();
        // Tamamlanmış ama tam tahsil edilmemiş işler
        const { data: isler, error } = await supabase
          .from("isler")
          .select("*, musteri:musteriler(*)")
          .eq("durum", "tamamlandi")
          .neq("odeme_durumu", "odendi")
          .not("tutar", "is", null)
          .order("tarih", { ascending: true });

        if (error) {
          if (!cancelled) setHata(dbHataMesaji(error));
          return;
        }

        const liste = (isler as Is[]) || [];
        if (liste.length === 0) {
          if (!cancelled) setSatirlar([]);
          return;
        }

        // Kısmi tahsilatları düş
        const { data: odemeler } = await supabase
          .from("odemeler")
          .select("is_id, tutar")
          .in("is_id", liste.map((i) => i.id));

        const odenenMap = new Map<string, number>();
        for (const o of (odemeler as Pick<Odeme, "is_id" | "tutar">[]) || []) {
          odenenMap.set(o.is_id, (odenenMap.get(o.is_id) ?? 0) + Number(o.tutar));
        }

        const hesaplanan: Satir[] = liste
          .map((is) => {
            const tutar = Number(is.tutar) || 0;
            const odenen = odenenMap.get(is.id) ?? 0;
            return {
              is,
              musteri: (is.musteri as Musteri) ?? null,
              tutar,
              odenen,
              kalan: tutar - odenen,
              gun: gunFarki(is.tarih),
            };
          })
          .filter((s) => s.kalan > 0)
          .sort((a, b) => b.gun - a.gun);

        if (!cancelled) setSatirlar(hesaplanan);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    yukle();
    return () => {
      cancelled = true;
    };
  }, []);

  const toplam = satirlar.reduce((s, r) => s + r.kalan, 0);
  const otuzArti = satirlar.filter((r) => r.gun >= 30);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Alacaklar</h1>
        <Link href="/admin/finans" className="text-blue-600 text-sm font-medium">Finans</Link>
      </div>

      {hata && <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">{hata}</div>}

      {/* Özet */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600 font-medium">Toplam Alacak</p>
          <p className="text-2xl font-bold text-red-700">{para(toplam)}</p>
          <p className="text-xs text-red-500">{satirlar.length} iş</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-amber-600 font-medium">30 Günü Geçen</p>
          <p className="text-2xl font-bold text-amber-700">{para(otuzArti.reduce((s, r) => s + r.kalan, 0))}</p>
          <p className="text-xs text-amber-500">{otuzArti.length} iş</p>
        </div>
      </div>

      {satirlar.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
          <p className="text-3xl mb-2">✓</p>
          <p className="text-gray-500">Bekleyen alacağın yok.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {satirlar.map((r) => {
            const k = kova(r.gun);
            const mesaj = encodeURIComponent(
              `Merhaba${r.musteri ? " " + r.musteri.ad : ""}, ${tarihKisa(r.is.tarih)} tarihli ` +
                `${HIZMET_TURLERI[r.is.hizmet_turu] ?? "tesisat"} işimizden ` +
                `${r.kalan.toLocaleString("tr-TR")} ₺ bakiye görünüyor. ` +
                `Uygun olduğunuzda hatırlatmak istedim, teşekkürler.`
            );

            return (
              <div key={r.is.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{r.musteri?.ad ?? "—"}</p>
                    <p className="text-xs text-gray-500">
                      {tarihKisa(r.is.tarih)} • {HIZMET_TURLERI[r.is.hizmet_turu] ?? r.is.hizmet_turu}
                      {r.musteri?.ilce && ` • ${r.musteri.ilce}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-red-600">{para(r.kalan)}</p>
                    {r.odenen > 0 && (
                      <p className="text-xs text-gray-400">{para(r.odenen)} tahsil edildi</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${k.renk}`}>{k.etiket}</span>
                  <div className="flex gap-2 ml-auto">
                    <Link
                      href={`/admin/isler/${r.is.id}`}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      Detay
                    </Link>
                    {r.musteri?.telefon && (
                      <>
                        <a
                          href={`tel:+${toIntlPhone(r.musteri.telefon)}`}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          Ara
                        </a>
                        <a
                          href={`https://wa.me/${toIntlPhone(r.musteri.telefon)}?text=${mesaj}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          Hatırlat
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
