import { toIntlPhone } from "@/lib/date";
import type { Musteri } from "@/lib/types";

/**
 * Müşterileri telefon rehberine aktarmak için vCard üretir.
 *
 * Amaç: arama geldiğinde telefonun arayanın adını göstermesi. Web uygulamaları
 * gelen aramaya erişemediği için (iOS ve Android'de telefon katmanı yalnızca
 * yerel uygulamalara açık), numarayı rehbere yazmak tek pratik yol.
 */

/** vCard değerlerinde özel karakterler kaçırılmalı. */
function kacir(deger: string): string {
  return deger
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Rehberde görünecek ad. Mahalle varsa parantez içinde eklenir; arama
 * geldiğinde kimin nereden aradığı tek bakışta anlaşılsın diye.
 */
export function rehberAdi(m: Pick<Musteri, "ad" | "ilce">): string {
  return m.ilce ? `${m.ad} (${m.ilce})` : m.ad;
}

function tekKart(m: Musteri): string {
  const ad = rehberAdi(m);
  const satirlar = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${kacir(ad)};;;`,
    `FN:${kacir(ad)}`,
    `TEL;TYPE=CELL:+${toIntlPhone(m.telefon)}`,
  ];

  if (m.telefon2) satirlar.push(`TEL;TYPE=HOME:+${toIntlPhone(m.telefon2)}`);

  const adres = [m.mahalle, m.adres].filter(Boolean).join(" ");
  if (adres) satirlar.push(`ADR;TYPE=HOME:;;${kacir(adres)};${kacir(m.ilce ?? "")};;;Türkiye`);

  const not = [m.adres_tarifi, m.notlar].filter(Boolean).join(" — ");
  if (not) satirlar.push(`NOTE:${kacir(not)}`);

  satirlar.push("ORG:Müşteri", "END:VCARD");
  return satirlar.join("\r\n");
}

/** Birden fazla müşteriyi tek dosyada birleştirir. */
export function vcardOlustur(musteriler: Musteri[]): string {
  return musteriler.map(tekKart).join("\r\n") + "\r\n";
}

/**
 * vCard'ı indirir. iOS bu dosyayı açtığında "Kişilere Ekle" ekranı gelir.
 * BOM ekliyoruz; bazı Android rehber uygulamaları olmadan Türkçe karakterleri
 * bozuk gösteriyor.
 */
export function vcardIndir(icerik: string, dosyaAdi: string): void {
  const blob = new Blob(["﻿", icerik], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dosyaAdi;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Safari indirmeyi başlatmadan URL iptal edilirse dosya boş iner
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
