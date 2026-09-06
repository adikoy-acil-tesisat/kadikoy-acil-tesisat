"use client";

import { SITE_CONFIG } from "@/lib/constants";

export default function WhatsAppButton() {
  // Mobilde MobileBottomBar ekranın dibini kapladığı için buton onun üstünde
  // konumlanır (bottom-24); md ve üzerinde alt bar olmadığı için bottom-6.
  return (
    <a
      href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 right-6 z-40 bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-full p-4 shadow-lg animate-pulse-glow transition-colors"
      aria-label="WhatsApp ile iletişime geçin"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.63-.5-5.145-1.377l-.365-.218-3.79.948.99-3.637-.24-.38A9.7 9.7 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
      </svg>
    </a>
  );
}
