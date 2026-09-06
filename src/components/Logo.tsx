/**
 * Kadıköy Acil Tesisat logosu — "Metal Rozet".
 *
 * Fırçalanmış çelik halka + mavi emaye zemin + kabartma krom boru "T" + su damlası.
 *
 * İki varyant var:
 *  - detailed (varsayılan): gradyanlı, gölgeli, gerçekçi hâli. 32px ve üzeri için.
 *  - flat: tek düz renkli sade hâli. Favicon, tek renk baskı ve 24px altı için.
 *
 * SVG gradient/mask id'leri belge genelinde benzersiz olmak zorunda; aynı sayfada
 * birden fazla logo render edilirken her birine farklı `idPrefix` verin.
 */

const DROPLET = "M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z";

interface LogoMarkProps {
  /** Piksel cinsinden kenar uzunluğu. */
  size?: number;
  /** Aynı sayfadaki diğer logolarla id çakışmasını önler. */
  idPrefix?: string;
  /** Sade tek renkli varyant (küçük boyut / tek renk baskı). */
  flat?: boolean;
  className?: string;
}

export function LogoMark({ size = 40, idPrefix = "logo", flat = false, className }: LogoMarkProps) {
  if (flat) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className={className}
        role="img"
        aria-label="Kadıköy Acil Tesisat"
      >
        <circle cx="32" cy="32" r="32" fill="#1e40af" />
        <rect x="15" y="20" width="34" height="9" rx="4.5" fill="#fff" />
        <rect x="11.5" y="16.5" width="5.5" height="16" rx="2" fill="#f59e0b" />
        <rect x="47" y="16.5" width="5.5" height="16" rx="2" fill="#f59e0b" />
        <rect x="27.5" y="28" width="9" height="16" rx="4.5" fill="#fff" />
        <path d={DROPLET} fill="#f59e0b" transform="translate(32 44) scale(.42) translate(-12 -2)" />
      </svg>
    );
  }

  const steel = `${idPrefix}-steel`;
  const enamel = `${idPrefix}-enamel`;
  const chrome = `${idPrefix}-chrome`;
  const tube = `${idPrefix}-tube`;
  const water = `${idPrefix}-water`;
  const tMask = `${idPrefix}-tmask`;
  const shadow = `${idPrefix}-shadow`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Kadıköy Acil Tesisat"
    >
      <defs>
        {/* Fırçalanmış çelik: dönüşümlü açık/koyu bantlar metal dokusunu taklit eder */}
        <linearGradient id={steel} x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(12 .5 .5)">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="12%" stopColor="#64748b" />
          <stop offset="24%" stopColor="#e2e8f0" />
          <stop offset="38%" stopColor="#475569" />
          <stop offset="52%" stopColor="#f8fafc" />
          <stop offset="66%" stopColor="#334155" />
          <stop offset="80%" stopColor="#cbd5e1" />
          <stop offset="92%" stopColor="#475569" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        {/* Mavi emaye zemin — ışık sol üstten */}
        <radialGradient id={enamel} cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#3c6fd8" />
          <stop offset="55%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0d1c52" />
        </radialGradient>
        <linearGradient id={chrome} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="16%" stopColor="#94a3b8" />
          <stop offset="33%" stopColor="#f8fafc" />
          <stop offset="52%" stopColor="#cbd5e1" />
          <stop offset="76%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id={tube} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <radialGradient id={water} cx="36%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#e0f7ff" />
          <stop offset="40%" stopColor="#5cc9f5" />
          <stop offset="78%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        <filter id={shadow} x="-40%" y="-40%" width="180%" height="185%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="1.3" floodColor="#000" floodOpacity=".5" />
        </filter>
        {/* Boru "T" gövdesi; içine kaydırılmış parlama ve gölge çizilir */}
        <mask id={tMask}>
          <rect x="16" y="21" width="32" height="8" rx="4" fill="#fff" />
          <rect x="28" y="25" width="8" height="17" rx="4" fill="#fff" />
        </mask>
      </defs>

      {/* Çelik halka */}
      <circle cx="32" cy="32" r="31" fill={`url(#${steel})`} />
      <circle cx="32" cy="32" r="31" fill="none" stroke="#0f172a" strokeOpacity=".45" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke="#0f172a" strokeOpacity=".35" strokeWidth="1.4" />

      {/* Emaye zemin + üst kenar parlaması */}
      <circle cx="32" cy="32" r="24.5" fill={`url(#${enamel})`} />
      <path
        d="M32 8.5A23.5 23.5 0 0 1 52 20"
        fill="none"
        stroke="#fff"
        strokeOpacity=".28"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Krom boru "T" */}
      <g filter={`url(#${shadow})`}>
        <g mask={`url(#${tMask})`}>
          <rect width="64" height="64" fill={`url(#${tube})`} />
          <rect x="16" y="21" width="32" height="8" rx="4" fill="none" stroke="#f8fafc" strokeWidth="2.2" transform="translate(-1.8 -1.8)" />
          <rect x="28" y="25" width="8" height="17" rx="4" fill="none" stroke="#f8fafc" strokeWidth="2.2" transform="translate(-1.8 -1.8)" />
          <rect x="16" y="21" width="32" height="8" rx="4" fill="none" stroke="#0f172a" strokeOpacity=".7" strokeWidth="2.4" transform="translate(2 2)" />
        </g>
        {/* Rakorlar */}
        <rect x="13.5" y="18" width="4.6" height="14" rx="1.6" fill={`url(#${chrome})`} />
        <rect x="45.9" y="18" width="4.6" height="14" rx="1.6" fill={`url(#${chrome})`} />
      </g>

      {/* Su damlası */}
      <path d={DROPLET} fill={`url(#${water})`} transform="translate(32 42.5) scale(.45) translate(-12 -2)" />
    </svg>
  );
}

interface LogoProps extends LogoMarkProps {
  /** Koyu zeminde (footer) kullanım. */
  theme?: "light" | "dark";
  /** Marka adının altındaki küçük satır. */
  showTagline?: boolean;
}

export default function Logo({
  size = 40,
  idPrefix = "logo",
  flat = false,
  theme = "light",
  showTagline = false,
  className,
}: LogoProps) {
  const dark = theme === "dark";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={size} idPrefix={idPrefix} flat={flat} />
      <span className="flex flex-col justify-center leading-none">
        {/* İsim uzun olduğu için iki satır: dar ekranlarda da header'a sığıyor */}
        <span className={`text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-primary"}`}>
          Kadıköy
        </span>
        <span className="mt-0.5 text-[13px] font-bold tracking-[0.08em] text-secondary">
          ACİL TESİSAT
        </span>
        {showTagline && (
          <span
            className={`hidden sm:block mt-1 text-[9px] font-semibold tracking-[0.15em] ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            7/24 ANADOLU YAKASI
          </span>
        )}
      </span>
    </span>
  );
}
