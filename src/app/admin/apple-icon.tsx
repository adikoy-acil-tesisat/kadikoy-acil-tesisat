import { ImageResponse } from "next/og";

/**
 * iPhone ana ekran ikonu.
 *
 * iOS apple-touch-icon için SVG kabul etmiyor, PNG şart. Bu yüzden logoyu
 * derleme sırasında PNG'ye çeviriyoruz. iOS ikonu kendi köşe yuvarlamasıyla
 * maskelediği için tasarım kenardan kenara (full-bleed) çizilir.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#1e40af",
        }}
      >
        {/* Sol rakor */}
        <div style={{ position: "absolute", left: 26, top: 44, width: 15, height: 44, borderRadius: 5, background: "#f59e0b" }} />
        {/* Sağ rakor */}
        <div style={{ position: "absolute", left: 139, top: 44, width: 15, height: 44, borderRadius: 5, background: "#f59e0b" }} />
        {/* Yatay boru */}
        <div style={{ position: "absolute", left: 34, top: 52, width: 112, height: 28, borderRadius: 14, background: "#ffffff" }} />
        {/* Dikey boru */}
        <div style={{ position: "absolute", left: 76, top: 76, width: 28, height: 44, borderRadius: 14, background: "#ffffff" }} />
        {/* Su damlası: bir köşesi sivri kare, 45° döndürülünce damla olur */}
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 116,
            width: 28,
            height: 28,
            background: "#f59e0b",
            borderRadius: "0 50% 50% 50%",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    size
  );
}
