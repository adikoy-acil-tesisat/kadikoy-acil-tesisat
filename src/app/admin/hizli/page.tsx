"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { todayISO } from "@/lib/date";
import { HIZMET_TURLERI, ILCELER, type Musteri } from "@/lib/types";

/** Yarının tarihi, yerel saate göre. */
function yarin(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return todayISO(d);
}

/**
 * Hızlı iş kaydı.
 *
 * Normal akışta önce müşteri aranır/oluşturulur, sonra iş eklenir — telefon
 * elde, müşteri adres tarif ederken bu çok yavaş kalıyor. Burada tek ekranda
 * hem müşteri hem iş oluşuyor. Aynı numara zaten kayıtlıysa yeni müşteri
 * açmak yerine mevcut kayda bağlanır.
 */
export default function HizliKayitPage() {
  const router = useRouter();
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [ad, setAd] = useState("");
  const [telefon, setTelefon] = useState("");
  const [ilce, setIlce] = useState("");
  const [adres, setAdres] = useState("");
  const [hizmetTuru, setHizmetTuru] = useState("tikaniklik_acma");
  const [aciklama, setAciklama] = useState("");
  const [bugun, setBugun] = useState(true);

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    if (!ad.trim() || !telefon.trim()) {
      alert("Ad ve telefon zorunlu.");
      return;
    }

    setKaydediliyor(true);
    const supabase = createClient();

    try {
      // Aynı numara kayıtlı mı? Biçim farklarını yok sayarak son 10 haneye bakıyoruz
      const rakam = telefon.replace(/\D/g, "").replace(/^(90|0)/, "");
      const { data: mevcutlar } = await supabase.from("musteriler").select("id, telefon");
      const mevcut = (mevcutlar as Pick<Musteri, "id" | "telefon">[] | null)?.find(
        (m) => m.telefon.replace(/\D/g, "").replace(/^(90|0)/, "") === rakam
      );

      let musteriId = mevcut?.id;

      if (!musteriId) {
        const { data, error } = await supabase
          .from("musteriler")
          .insert({
            ad: ad.trim(),
            telefon: telefon.trim(),
            ilce: ilce || null,
            adres: adres.trim() || null,
            kaynak: "telefon",
          })
          .select()
          .single();
        if (error || !data) {
          alert("Müşteri eklenemedi. " + dbHataMesaji(error));
          return;
        }
        musteriId = data.id;
      }

      const { data: yeniIs, error: isHata } = await supabase
        .from("isler")
        .insert({
          musteri_id: musteriId,
          hizmet_turu: hizmetTuru,
          tarih: bugun ? todayISO() : yarin(),
          aciklama: aciklama.trim() || null,
          ilce: ilce || null,
          adres: adres.trim() || null,
          durum: "beklemede",
          odeme_durumu: "odenmedi",
        })
        .select()
        .single();

      if (isHata || !yeniIs) {
        alert("İş eklenemedi. " + dbHataMesaji(isHata));
        return;
      }

      router.push(`/admin/isler/${yeniIs.id}`);
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-gray-900">Hızlı Kayıt</h1>
        <Link href="/admin/isler/yeni" className="text-blue-600 text-sm font-medium">
          Detaylı form
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Telefondayken doldur. Müşteri ve iş tek seferde oluşur.
      </p>

      <form onSubmit={kaydet} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad *</label>
          <input
            type="text"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            required
            autoFocus
            placeholder="Müşteri adı"
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon *</label>
          <input
            type="tel"
            inputMode="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            required
            placeholder="05XX XXX XX XX"
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Numara kayıtlıysa mevcut müşteriye bağlanır.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hizmet</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(HIZMET_TURLERI).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setHizmetTuru(key)}
                className={`py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                  hizmetTuru === key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mahalle</label>
          <select
            value={ilce}
            onChange={(e) => setIlce(e.target.value)}
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçin</option>
            {ILCELER.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Adres</label>
          <input
            type="text"
            value={adres}
            onChange={(e) => setAdres(e.target.value)}
            placeholder="Cadde, bina, daire"
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Not</label>
          <textarea
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            rows={2}
            placeholder="Müşteri ne anlattı?"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base resize-none outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3.5">
          <input
            type="checkbox"
            checked={bugun}
            onChange={(e) => setBugun(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="text-sm text-gray-700">{bugun ? "Bugüne kaydediliyor" : "Yarına kaydediliyor"}</span>
        </label>

        <button
          type="submit"
          disabled={kaydediliyor}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl text-lg"
        >
          {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
