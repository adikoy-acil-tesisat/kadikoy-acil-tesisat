"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { todayISO } from "@/lib/date";
import { HIZMET_TURLERI, MAHALLELER, type Musteri } from "@/lib/types";

export default function YeniIsPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Musteri[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Musteri | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [loading, setLoading] = useState(false);

  // New customer fields
  const [yeniAd, setYeniAd] = useState("");
  const [yeniTelefon, setYeniTelefon] = useState("");
  const [yeniIlce, setYeniIlce] = useState("");

  // Job fields
  const [hizmetTuru, setHizmetTuru] = useState("tikaniklik_acma");
  const [tarih, setTarih] = useState(todayISO());
  const [saat, setSaat] = useState("");
  const [tutar, setTutar] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [ilce, setIlce] = useState("");
  const [adres, setAdres] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      const supabase = createClient();
      const { data } = await supabase.from("musteriler").select("*").order("olusturma_tarihi", { ascending: false }).limit(200);
      const liste = (data as Musteri[]) || [];
      setCustomers(liste);

      // Müşteri kartındaki "+ Yeni İş" bağlantısı o müşteriyi seçili getirir.
      // useSearchParams yerine adres çubuğu okunuyor; sayfa zaten istemci
      // tarafında ve böylece Suspense sarmalayıcısına gerek kalmıyor.
      const sorgu = new URLSearchParams(window.location.search);

      // Takvimdeki "bu güne iş ekle" bağlantısı tarihi hazır getirir.
      const istenenTarih = sorgu.get("tarih");
      if (istenenTarih && /^d{4}-d{2}-d{2}$/.test(istenenTarih)) setTarih(istenenTarih);

      // Site talebinden geliniyorsa müşteri henüz kayıtlı değil; yeni müşteri
      // formunu ad ve telefonla açıyoruz.
      const talepAd = sorgu.get("ad");
      const talepTel = sorgu.get("telefon");
      if (talepAd && talepTel) {
        setShowNewCustomer(true);
        setYeniAd(talepAd);
        setYeniTelefon(talepTel);
        const talepAciklama = sorgu.get("aciklama");
        if (talepAciklama) setAciklama(talepAciklama);
      }

      const istenen = sorgu.get("musteri");
      if (istenen) {
        const bulunan = liste.find((m) => m.id === istenen);
        if (bulunan) {
          setSelectedCustomer(bulunan);
          if (bulunan.ilce) setIlce(bulunan.ilce);
          if (bulunan.adres) setAdres(bulunan.adres);
        }
      }
    }
    loadCustomers();
  }, []);

  const filteredCustomers = search.length >= 2
    ? customers.filter((c) =>
        c.ad.toLowerCase().includes(search.toLowerCase()) ||
        c.telefon.includes(search)
      )
    : [];

  function selectCustomer(c: Musteri) {
    setSelectedCustomer(c);
    setSearch("");
    if (c.ilce) setIlce(c.ilce);
    if (c.adres) setAdres(c.adres);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Müşterisiz iş kaydı sessizce oluşmasın
    if (!selectedCustomer && !showNewCustomer) {
      alert("Lütfen bir müşteri seçin veya yeni müşteri oluşturun.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    let musteriId = selectedCustomer?.id;

    // Yeni müşteri oluştur
    if (showNewCustomer && yeniAd && yeniTelefon) {
      const { data, error } = await supabase
        .from("musteriler")
        .insert({ ad: yeniAd, telefon: yeniTelefon, ilce: yeniIlce || null })
        .select()
        .single();
      if (error) { alert("Müşteri eklenemedi. " + dbHataMesaji(error)); setLoading(false); return; }
      musteriId = data.id;
    }

    // İş kaydı oluştur
    const { error } = await supabase.from("isler").insert({
      musteri_id: musteriId || null,
      hizmet_turu: hizmetTuru,
      tarih,
      saat: saat || null,
      tutar: tutar ? parseFloat(tutar) : null,
      aciklama: aciklama || null,
      ilce: ilce || null,
      adres: adres || null,
      durum: "beklemede",
      odeme_durumu: "odenmedi",
    });

    if (error) { alert("İş eklenemedi. " + dbHataMesaji(error)); setLoading(false); return; }
    router.push("/admin/isler");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Yeni İş Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer selection */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Müşteri</label>

          {selectedCustomer ? (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">{selectedCustomer.ad}</p>
                <p className="text-sm text-gray-500">{selectedCustomer.telefon} {selectedCustomer.ilce && `• ${selectedCustomer.ilce}`}</p>
              </div>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="text-red-500 text-sm font-medium">Değiştir</button>
            </div>
          ) : showNewCustomer ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Yeni Müşteri</span>
                <button type="button" onClick={() => setShowNewCustomer(false)} className="text-blue-600 text-sm">Mevcut Seç</button>
              </div>
              <input type="text" value={yeniAd} onChange={(e) => setYeniAd(e.target.value)} required placeholder="Ad Soyad *" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="tel" value={yeniTelefon} onChange={(e) => setYeniTelefon(e.target.value)} required placeholder="Telefon * (05XX XXX XX XX)" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={yeniIlce} onChange={(e) => { setYeniIlce(e.target.value); setIlce(e.target.value); }} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Mahalle Seçin</option>
                {MAHALLELER.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Müşteri ara (isim veya telefon)..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {filteredCustomers.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredCustomers.map((c) => (
                    <button key={c.id} type="button" onClick={() => selectCustomer(c)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                      <p className="font-medium text-sm">{c.ad}</p>
                      <p className="text-xs text-gray-500">{c.telefon} {c.ilce && `• ${c.ilce}`}</p>
                    </button>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => setShowNewCustomer(true)} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                + Yeni Müşteri Oluştur
              </button>
            </div>
          )}
        </div>

        {/* Service type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Hizmet Türü</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(HIZMET_TURLERI).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setHizmetTuru(key)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  hizmetTuru === key
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tarih</label>
            <input type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Saat</label>
            <input type="time" value={saat} onChange={(e) => setSaat(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tutar (₺)</label>
          <input type="number" value={tutar} onChange={(e) => setTutar(e.target.value)} placeholder="Örn: 500" inputMode="numeric" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* District & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mahalle</label>
            <select value={ilce} onChange={(e) => setIlce(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Seçin</option>
              {MAHALLELER.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adres</label>
            <input type="text" value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Adres bilgisi" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
          <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} rows={3} placeholder="İş detayları, not..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl text-lg transition-colors"
        >
          {loading ? "Kaydediliyor..." : "İşi Kaydet"}
        </button>
      </form>
    </div>
  );
}
