"use client";

import { SITE_CONFIG } from "@/lib/constants";

export default function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white py-2 text-center text-sm font-medium animate-pulse">
      <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="flex items-center justify-center gap-2">
        <span>🚨</span>
        <span>Acil Tesisat mı? <strong>Hemen Ara: {SITE_CONFIG.phoneFormatted}</strong> — 30 Dakikada Kapınızdayız!</span>
        <span>🚨</span>
      </a>
    </div>
  );
}
