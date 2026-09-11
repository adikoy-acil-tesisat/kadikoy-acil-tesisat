"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { toIntlPhone, todayISO, gunEkleISO } from "@/lib/date";
import { para, tarihKisa } from "@/lib/format";
import { odemeToplamlari } from "@/lib/tahsilat";
import type { Musteri, Is, Odeme } from "@/lib/types";

/** Kaç aydır uğramayanlar gösterilsin. */
const ESIKLER = [
  { ay: 3, etiket: "3 ay+" },
  { ay: 6, etiket: "6 ay+" },
  { ay: 12, etiket: "1 yıl+" },
];

/** Aynı kişiye bu kadar gün geçmeden tekrar yazılmasın. */
const SESSIZLIK_GUNU = 90;

interface Satir {
  musteri: Musteri;
  sonIs: string;
  aySayisi: number;
  toplamHarcama: number;
  isSayisi: number;
}

/** İki tarih arasındaki tam ay farkı. */
function ayFarki(iso: string): number {
  const [y, a, g] = iso.split("-").map(Number);
  const simdi = new Date();
  let fark = (simdi.getFullYear() - y) * 12 + (simdi.getMonth() + 1 - a);
  if (simdi.getDate() < g) fark -= 1;
  return Math.max(0, fark);
}

function sureMetni(ay: number): string {
  if (ay < 12) return `${ay} ay önce`;
  const yil = Math.floor(ay / 12);
  const kalan = ay % 12;
  return kalan === 0 ? `${yil} yıl önce` : `${yil} yıl ${kalan} ay önce`;
}

/**
 * Geri kazanım listesi.
 *
 * Bir tesisatçının en ucuz iş kaynağı, daha önce memnun kalmış müşteridir.
 * Panel bu veriyi tutuyordu ama kullanmıyordu: kimin aylardır uğramadığını
 * görecek bir yer yoktu. Burası o listeyi çıkarıyor, en uzun süredir
 * görünmeyeni en üste koyuyor.
 */
export default function GeriKazanimPage() {
  const [satirlar, setSatirlar] = useState<Satir[]>([]);
  const [esik, setEsik] = useState(6);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState("");
  /** Bu oturumda "ulaşıldı" işaretlenenler — liste anında güncellensin. */
  const [ulasilan, setUlasilan] = useState<Set<string>>(new Set());

  const yukle = useCallback(async () => {
    try {
      const supabase = createClient();
      const [musteriRes, isRes] = await Promise.all([
        supabase.from("musteriler").select("*"),
        supabase.from("isler").select("id, musteri_id, tarih, tutar, durum").eq("durum", "tamamlandi"),
      ]);
      if (musteriRes.error) throw musteriRes.error;
      if (isRes.error) throw isRes.error;

      const musteriler = (musteriRes.data as Musteri[]) ?? [];
      const isler = (isRes.data as Is[]) ?? [];

      const odemeRes = isler.length
        ? await supabase.from("odemeler").select("is_id, tutar").in("is_id", isler.map((i) => i.id))
        : { data: [] };
      const odenen = odemeToplamlari((odemeRes.data as Pick<Odeme, "is_id" | "tutar">[]) ?? []);

      // Müşteri başına: son tamamlanan iş, iş sayısı, tahsil edilen toplam
      const ozet = new Map<string, { sonIs: string; adet: number; toplam: number }>();
      for (const is of isler) {
        if (!is.musteri_id) continue;
        const v = ozet.get(is.musteri_id) ?? { sonIs: "", adet: 0, toplam: 0 };
        ozet.set(is.musteri_id, {
          sonIs: is.tarih > v.sonIs ? is.tarih : v.sonIs,
          adet: v.adet + 1,
          toplam: v.toplam + (odenen.get(is.id) ?? 0),
        });
      }

      const bugun = todayISO();
      const sessizlikSonu = gunEkleISO(-SESSIZLIK_GUNU);

      const liste: Satir[] = [];
      for (const m of musteriler) {
        const v = ozet.get(m.id);
        // Hiç tamamlanmış işi olmayan kayıtlar geri kazanım adayı değil
        if (!v || !v.sonIs) continue;
        // Yakın zamanda zaten ulaşılmışsa tekrar rahatsız etme
        if (m.son_iletisim && m.son_iletisim > sessizlikSonu) continue;

        liste.push({
          musteri: m,
          sonIs: v.sonIs,
          aySayisi: ayFarki(v.sonIs > bugun ? bugun : v.sonIs),
          toplamHarcama: v.toplam,
          isSayisi: v.adet,
        });
      }

      liste.sort((a, b) => b.aySayisi - a.aySayisi);
      setSatirlar(liste);
    } catch (e) {
      setHata(dbHataMesaji(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    yukle();
  }, [yukle]);

  const gosterilen = useMemo(
    () => satirlar.filter((s) => s.aySayisi >= esik && !ulasilan.has(s.musteri.id)),
    [satirlar, esik, ulasilan]
  );

  /** Mesaj/arama sonrası işaretlenir; 90 gün boyunca listede çıkmaz. */
  async function ulasildiIsaretle(m: Musteri) {
    setUlasilan((prev) => new Set(prev).add(m.id));
    const supabase = createClient();
    const { error } = await supabase
      .from("musteriler")
      .update({ son_iletisim: todayISO() })
      .eq("id", m.id);
    if (error) {
      setUlasilan((prev) => {
        const y = new Set(prev);
        y.delete(m.id);
        return y;
      });
      setHata("İşaretlenemedi. " + dbHataMesaji(error));
    }
  }

  /** Satış değil, hatırlatma dili. Reklam gibi okunan mesaj rahatsız eder. */
  function mesaj(s: Satir): string {
    const yer = s.musteri.ilce ? `${s.musteri.ilce}'deki` : "";
    return encodeURIComponent(
      `Merhaba ${s.musteri.ad}, Kadıköy Acil Tesisat'tan yazıyorum. ` +
        `${yer} adresinizde tesisat işinizi yapmıştık. ` +
        `Tesisatla ilgili bir ihtiyacınız olursa bu numaradan bana ulaşabilirsiniz. İyi günler.`
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Geri Kazanım</h1>
        <p className="text-sm text-gray-500">Uzun süredir uğramayan müşteriler</p>
      </div>

      {hata && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">{hata}</div>
      )}

      <div className="flex gap-2">
        {ESIKLER.map((e) => (
          <button
            key={e.ay}
            onClick={() => setEsik(e.ay)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              esik === e.ay ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {e.etiket}
          </button>
        ))}
      </div>

      {gosterilen.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
          <span className="text-4xl block mb-2">👍</span>
          <p className="text-gray-500 text-sm">
            Bu aralıkta ulaşılmayı bekleyen müşteri yok.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{gosterilen.length}</span> müşteri
            {esik === 12 ? " bir yıldır" : ` ${esik} aydır`} uğramamış.
          </p>

          <div className="space-y-2.5">
            {gosterilen.map((s) => (
              <div key={s.musteri.id} className="bg-white rounded-xl border border-gray-100 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/admin/musteriler/${s.musteri.id}`} className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.musteri.ad}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {s.musteri.ilce && `📍 ${s.musteri.ilce} • `}
                      {s.isSayisi} iş • {para(s.toplamHarcama)}
                    </p>
                  </Link>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-amber-600">{sureMetni(s.aySayisi)}</p>
                    <p className="text-xs text-gray-400">{tarihKisa(s.sonIs)}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <a
                    href={`tel:+${toIntlPhone(s.musteri.telefon)}`}
                    onClick={() => ulasildiIsaretle(s.musteri)}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-semibold text-center"
                  >
                    Ara
                  </a>
                  <a
                    href={`https://wa.me/${toIntlPhone(s.musteri.telefon)}?text=${mesaj(s)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => ulasildiIsaretle(s.musteri)}
                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-semibold text-center"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => ulasildiIsaretle(s.musteri)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-semibold"
                  >
                    Şimdilik geç
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Ulaştığınız müşteri {SESSIZLIK_GUNU} gün boyunca bu listede çıkmaz. Aynı kişiye
            üst üste yazmak iş getirmez, rahatsız eder.
          </p>
        </>
      )}
    </div>
  );
}
