"use client";

import Link from "next/link";
import { toIntlPhone } from "@/lib/date";
import { para, saatKisa, tarihKisa, gunAdi } from "@/lib/format";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, type Is } from "@/lib/types";

/**
 * Panelin sunum parçaları.
 *
 * Veri çekmezler; yalnızca aldıkları veriyi gösterirler. Sayfadan ayrı
 * durmaları hem sayfayı kısaltıyor hem de tek başlarına denenebilmelerini
 * sağlıyor.
 */

/** Saate göre selamlama — panel gün içinde defalarca açılıyor. */
export function selam(): string {
  const s = new Date().getHours();
  if (s < 6) return "İyi geceler";
  if (s < 12) return "Günaydın";
  if (s < 18) return "İyi günler";
  return "İyi akşamlar";
}

/** Ad ve soyadın baş harfleri: "Ahmet Yılmaz" -> "AY" */
function basHarfler(ad: string): string {
  const p = ad.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toLocaleUpperCase("tr-TR");
}

/** Durum rengi — kartın sol kenarındaki şerit. */
const DURUM_SERIT: Record<string, string> = {
  beklemede: "bg-amber-400",
  devam_ediyor: "bg-blue-500",
  tamamlandi: "bg-green-500",
  iptal: "bg-gray-300",
};

export function IsSatiri({ job }: { job: Is }) {
  const durum = DURUM_MAP[job.durum] || DURUM_MAP.beklemede;
  const odeme = ODEME_DURUM_MAP[job.odeme_durumu] || ODEME_DURUM_MAP.odenmedi;
  const musteri = job.musteri as { ad: string; telefon: string; ilce?: string } | null;
  const ad = musteri?.ad || "Müşteri Silinmiş";

  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <span className={`w-1.5 shrink-0 ${DURUM_SERIT[job.durum] ?? "bg-gray-300"}`} aria-hidden />

      <Link href={`/admin/isler/${job.id}`} className="flex-1 min-w-0 p-3.5 active:bg-gray-50">
        <div className="flex items-start gap-3">
          {/* Baş harf rozeti — listeyi göz ucuyla taramayı kolaylaştırır */}
          <span className="w-10 h-10 shrink-0 rounded-full bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center">
            {basHarfler(ad)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-gray-900 truncate">{ad}</p>
              {job.tutar != null && (
                <span className="font-bold text-gray-900 shrink-0">{para(job.tutar)}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">
              {job.saat && `🕐 ${saatKisa(job.saat)}`}
              {musteri?.ilce && `${job.saat ? " • " : ""}📍 ${musteri.ilce}`}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {HIZMET_TURLERI[job.hizmet_turu] || job.hizmet_turu}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${durum.bg} ${durum.color}`}>
                {durum.label}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${odeme.bg} ${odeme.color}`}>
                {odeme.label}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Ara düğmesi — işi açmadan doğrudan müşteriyi aramak en sık yapılan şey */}
      {musteri?.telefon && (
        <a
          href={`tel:+${toIntlPhone(musteri.telefon)}`}
          className="w-14 shrink-0 flex items-center justify-center border-l border-gray-100 text-green-600 active:bg-green-50"
          aria-label={`${ad} müşterisini ara`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
      )}
    </div>
  );
}

interface OzetKartProps {
  etiket: string;
  deger: string;
  renk: string;
  ikon: React.ReactNode;
  alt?: React.ReactNode;
  href?: string;
}

export function OzetKart({ etiket, deger, renk, ikon, alt, href }: OzetKartProps) {
  const govde = (
    <>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-gray-500 font-medium">{etiket}</p>
        <span className={`${renk} opacity-80`}>{ikon}</span>
      </div>
      <p className={`text-xl font-bold ${renk} tabular-nums`}>{deger}</p>
      {alt}
    </>
  );

  const cls = "bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100";
  return href ? (
    <Link href={href} className={`${cls} active:bg-gray-50 block`}>{govde}</Link>
  ) : (
    <div className={cls}>{govde}</div>
  );
}

/** Son 7 günün tahsilatı — panelin tek grafiği, gidişatı bir bakışta gösterir. */
export function HaftaGrafigi({ gunler }: { gunler: { tarih: string; tutar: number }[] }) {
  const enBuyuk = Math.max(...gunler.map((g) => g.tutar), 1);
  const toplam = gunler.reduce((s, g) => s + g.tutar, 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-bold text-gray-900">Son 7 Gün</h2>
        <span className="text-sm font-bold text-green-600 tabular-nums">{para(toplam)}</span>
      </div>

      {toplam === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">Bu hafta henüz tahsilat yok.</p>
      ) : (
        <div className="flex items-end justify-between gap-1.5 h-24">
          {gunler.map((g) => (
            <div key={g.tarih} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <span className="text-[10px] text-gray-400 tabular-nums">
                {g.tutar > 0 ? Math.round(g.tutar / 1000) + "b" : ""}
              </span>
              <div
                className={`w-full rounded-t-md ${g.tutar > 0 ? "bg-green-500" : "bg-gray-100"}`}
                style={{ height: `${Math.max((g.tutar / enBuyuk) * 100, 3)}%` }}
                title={`${tarihKisa(g.tarih)}: ${para(g.tutar)}`}
              />
              <span className="text-[10px] text-gray-400">{gunAdi(g.tarih).slice(0, 3)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
