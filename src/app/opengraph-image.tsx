import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * WhatsApp, Facebook ve X'te link paylaşıldığında görünen önizleme görseli.
 *
 * WhatsApp bu görseli sohbet içinde küçük gösteriyor; bu yüzden az öğe ve
 * büyük yazı kullanıyoruz. Telefon numarası en büyük öğe: linke tıklamadan da
 * okunabilsin, arama oradan başlasın.
 */

export const alt = "Kadıköy Acil Tesisat — 7/24 tıkanıklık açma ve su kaçağı tespiti";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1e40af 0%, #12276b 100%)",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Üst: logo + isim */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 22,
              background: "#ffffff",
              display: "flex",
              position: "relative",
            }}
          >
            {/* Boru "T" — apple-icon ile aynı biçim */}
            <div style={{ position: "absolute", left: 14, top: 24, width: 8, height: 24, borderRadius: 3, background: "#f59e0b" }} />
            <div style={{ position: "absolute", left: 70, top: 24, width: 8, height: 24, borderRadius: 3, background: "#f59e0b" }} />
            <div style={{ position: "absolute", left: 18, top: 28, width: 56, height: 15, borderRadius: 8, background: "#1e40af" }} />
            <div style={{ position: "absolute", left: 39, top: 40, width: 15, height: 24, borderRadius: 8, background: "#1e40af" }} />
            <div
              style={{
                position: "absolute",
                left: 39,
                top: 60,
                width: 15,
                height: 15,
                background: "#f59e0b",
                borderRadius: "0 50% 50% 50%",
                transform: "rotate(45deg)",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: "#ffffff", letterSpacing: -1 }}>
              Kadıköy Acil Tesisat
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#f59e0b", letterSpacing: 3 }}>
              KADIKÖY&apos;ÜN 21 MAHALLESİ
            </div>
          </div>
        </div>

        {/* Orta: ne yapıyoruz */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#ffffff", lineHeight: 1.15 }}>
            7/24 Tıkanıklık Açma
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#ffffff", lineHeight: 1.15 }}>
            Kırmadan Su Kaçağı Tespiti
          </div>
        </div>

        {/* Alt: telefon — en büyük öğe */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "#f59e0b",
            borderRadius: 999,
            padding: "20px 46px",
            alignSelf: "flex-start",
          }}
        >
          <div style={{ fontSize: 40 }}>📞</div>
          <div style={{ fontSize: 62, fontWeight: 800, color: "#ffffff", letterSpacing: -1 }}>
            {SITE_CONFIG.phoneFormatted}
          </div>
        </div>
      </div>
    ),
    size
  );
}
