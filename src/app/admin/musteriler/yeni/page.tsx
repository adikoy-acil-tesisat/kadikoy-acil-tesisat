"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { ILCELER, KAYNAKLAR } from "@/lib/types";

export default function YeniMusteriPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ad, setAd] = useState("");
  const [telefon, setTelefon] = useState("");
  const [telefon2, setTelefon2] = useState("");
  const [ilce, setIlce] = useState("");
  const [mahalle, setMahalle] = useState("");
  const [adres, setAdres] = useState("");
  const [adresTarifi, setAdresTarifi] = useState("");
  const [notlar, setNotlar] = useState("");
  const [kaynak, setKaynak] = useState("telefon");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("musteriler").insert({
      ad,
      telefon,
      telefon2: telefon2 || null,
      ilce: ilce || null,
      mahalle: mahalle || null,
      adres: adres || null,
      adres_tarifi: adresTarifi || null,
      notlar: notlar || null,
      kaynak,
    });

    if (error) { alert("Müşteri kaydedilemedi. " + dbHataMesaji(error)); setLoading(false); return; }
    router.push("/admin/musteriler");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Yeni Müşteri</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad *</label>
          <input type="text" value={ad} onChange={(e) => setAd(e.target.value)} required placeholder="Müşteri adı" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon *</label>
          <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} required placeholder="05XX XXX XX XX" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">2. Telefon</label>
          <input type="tel" value={telefon2} onChange={(e) => setTelefon2(e.target.value)} placeholder="Varsa alternatif numara" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">İlçe</label>
            <select value={ilce} onChange={(e) => setIlce(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Seçin</option>
              {ILCELER.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mahalle</label>
            <input type="text" value={mahalle} onChange={(e) => setMahalle(e.target.value)} placeholder="Mahalle" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Adres</label>
          <input type="text" value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Açık adres" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Adres Tarifi</label>
          <input type="text" value={adresTarifi} onChange={(e) => setAdresTarifi(e.target.value)} placeholder="Ör: Kırmızı apartman, 3. kat" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nereden Buldu?</label>
          <select value={kaynak} onChange={(e) => setKaynak(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {Object.entries(KAYNAKLAR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notlar</label>
          <textarea value={notlar} onChange={(e) => setNotlar(e.target.value)} rows={3} placeholder="Müşteri hakkında not..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl text-lg transition-colors">
          {loading ? "Kaydediliyor..." : "Müşteriyi Kaydet"}
        </button>
      </form>
    </div>
  );
}
