"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { toIntlPhone } from "@/lib/date";
import { tarihKisa, saatKisa } from "@/lib/format";
import type { Talep } from "@/lib/types";

const DURUMLAR: Record<string, { etiket: string; bg: string; renk: string }> = {
  yeni: { etiket: "Yeni", bg: "bg-blue-100", renk: "text-blue-700" },
  arandi: { etiket: "Arandı", bg: "bg-amber-100", renk: "text-amber-700" },
  ise_donustu: { etiket: "İşe döndü", bg: "bg-green-100", renk: "text-green-700" },
  kapandi: { etiket: "Kapandı", bg: "bg-gray-100", renk: "text-gray-600" },
};

const SEKMELER = [
  { key: "acik", etiket: "Açık" },
  { key: "tumu", etiket: "Tümü" },
];

/** "2026-09-12T08:30:00Z" -> "12 Eyl 11:30" */
function zaman(iso: string): string {
  const d = new Date(iso);
  return `${tarihKisa(iso.slice(0, 10))} ${saatKisa(
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  )}`;
}

/**
 * Siteden gelen talepler.
 *
 * İletişim formu yalnızca WhatsApp penceresi açıyordu; pencere açılmazsa talep
 * kayboluyordu. Artık her form kaydı buraya düşüyor ve hiçbiri gözden kaçmıyor.
 */
export default function TaleplerPage() {
  const [talepler, setTalepler] = useState<Talep[]>([]);
  const [sekme, setSekme] = useState("acik");
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState("");

  const yukle = useCallback(async () => {
    try {
      const { data, error } = await createClient()
        .from("talepler")
        .select("*")
        .order("olusturma_tarihi", { ascending: false })
        .limit(200);
      if (error) throw error;
      setTalepler((data as Talep[]) ?? []);
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
    () =>
      sekme === "acik"
        ? talepler.filter((t) => t.durum === "yeni" || t.durum === "arandi")
        : talepler,
    [talepler, sekme]
  );

  const yeniSayisi = talepler.filter((t) => t.durum === "yeni").length;

  async function durumDegistir(t: Talep, durum: string) {
    const oncekiler = talepler;
    setTalepler((prev) => prev.map((x) => (x.id === t.id ? { ...x, durum } : x)));
    const { error } = await createClient().from("talepler").update({ durum }).eq("id", t.id);
    if (error) {
      setTalepler(oncekiler);
      setHata("Güncellenemedi. " + dbHataMesaji(error));
    }
  }

  async function sil(t: Talep) {
    if (!confirm(`${t.ad} adlı talep silinsin mi?`)) return;
    const oncekiler = talepler;
    setTalepler((prev) => prev.filter((x) => x.id !== t.id));
    const { error } = await createClient().from("talepler").delete().eq("id", t.id);
    if (error) {
      setTalepler(oncekiler);
      setHata("Silinemedi. " + dbHataMesaji(error));
    }
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
        <h1 className="text-xl font-bold text-gray-900">
          Site Talepleri{yeniSayisi > 0 && <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-0.5 rounded-full align-middle">{yeniSayisi} yeni</span>}
        </h1>
        <p className="text-sm text-gray-500">İletişim formundan gelen istekler</p>
      </div>

      {hata && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">{hata}</div>
      )}

      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl">
        {SEKMELER.map((s) => (
          <button
            key={s.key}
            onClick={() => setSekme(s.key)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              sekme === s.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
            }`}
          >
            {s.etiket}
          </button>
        ))}
      </div>

      {gosterilen.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
          <span className="text-4xl block mb-2">📭</span>
          <p className="text-gray-500 text-sm">
            {sekme === "acik" ? "Bekleyen talep yok." : "Henüz talep gelmemiş."}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Siteden form dolduran müşteriler buraya düşer.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {gosterilen.map((t) => {
            const d = DURUMLAR[t.durum] ?? DURUMLAR.yeni;
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{t.ad}</p>
                    <p className="text-sm text-gray-500">{t.telefon}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${d.bg} ${d.renk}`}>
                      {d.etiket}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{zaman(t.olusturma_tarihi)}</p>
                  </div>
                </div>

                {t.mesaj && (
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap border-l-2 border-gray-200 pl-2.5">
                    {t.mesaj}
                  </p>
                )}

                {t.sayfa && t.sayfa !== "/iletisim" && (
                  <p className="text-xs text-gray-400 mt-1.5">Geldiği sayfa: {t.sayfa}</p>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <a
                    href={`tel:+${toIntlPhone(t.telefon)}`}
                    onClick={() => t.durum === "yeni" && durumDegistir(t, "arandi")}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-semibold text-center"
                  >
                    Ara
                  </a>
                  <a
                    href={`https://wa.me/${toIntlPhone(t.telefon)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => t.durum === "yeni" && durumDegistir(t, "arandi")}
                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-semibold text-center"
                  >
                    WhatsApp
                  </a>
                  <Link
                    href={`/admin/isler/yeni?ad=${encodeURIComponent(t.ad)}&telefon=${encodeURIComponent(t.telefon)}&aciklama=${encodeURIComponent(t.mesaj ?? "")}`}
                    onClick={() => durumDegistir(t, "ise_donustu")}
                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-semibold text-center"
                  >
                    İşe çevir
                  </Link>
                </div>

                {t.durum !== "kapandi" && t.durum !== "ise_donustu" && (
                  <button
                    onClick={() => durumDegistir(t, "kapandi")}
                    className="w-full mt-2 text-xs text-gray-400 py-1"
                  >
                    İşe dönüşmedi, kapat
                  </button>
                )}
                {(t.durum === "kapandi" || t.durum === "ise_donustu") && (
                  <button onClick={() => sil(t)} className="w-full mt-2 text-xs text-red-400 py-1">
                    Sil
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
