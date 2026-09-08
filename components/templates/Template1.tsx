"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import {
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLock,
  FaBars,
  FaTimes,
  FaImages,
  FaEnvelopeOpenText,
  FaChevronLeft,
  FaChevronRight,
  FaCameraRetro,
  FaInfoCircle,
} from "react-icons/fa";
import { MdOutlineCalendarMonth, MdOutlineSchedule } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import Song from "../song";
import RSVPSection from "../RSVPSection";
import GoogleMapEmbed from "../GoogleMapEmbed";

/* ───────────────────────────────────────────────────────────
   DESIGN TOKENS — Template1-ийн романтик (розово-lavender) палитр
   ─────────────────────────────────────────────────────────── */
const C = {
  primary: "#602846",
  onPrimary: "#ffffff",
  primaryContainer: "#7b3f5e",
  onPrimaryContainer: "#feb0d4",
  onPrimaryFixedVariant: "#4a1f37",
  primaryFixedDim: "#c98aab",
  secondary: "#745664",
  onSecondary: "#ffffff",
  secondaryContainer: "#fdd5e6",
  onSecondaryContainer: "#785a68",
  secondaryFixed: "#f6dbe8",
  secondaryFixedDim: "#e3b6cd",
  background: "#fff8f2",
  onBackground: "#1e1b18",
  surface: "#fff8f2",
  surfaceContainerLow: "#f9f2ec",
  surfaceContainer: "#f3ede7",
  surfaceContainerHigh: "#eee7e1",
  surfaceContainerHighest: "#e8e1dc",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#1e1b18",
  onSurfaceVariant: "#514348",
  outline: "#837379",
  outlineVariant: "#d5c2c8",
  inverseSurface: "#332e30",
  inverseOnSurface: "#f8eef3",
  tertiary: "#443a35",
  onTertiary: "#ffffff",
  accent: "#c9a0b0", // Template2-ийн "gold" ornament-ийн орлуулга — розово-алтан өнгө
};

const HEADLINE_FONT = "'Playfair Display', Georgia, serif";
const BODY_FONT = "'Montserrat', sans-serif";

const F_DISPLAY_LG_MOBILE = {
  fontFamily: HEADLINE_FONT,
  fontSize: 40,
  lineHeight: 1.2,
  fontWeight: 700,
};
const F_HEADLINE_MD = {
  fontFamily: HEADLINE_FONT,
  fontSize: 32,
  lineHeight: 1.3,
  fontWeight: 400,
};
const F_LABEL_CAPS = {
  fontFamily: BODY_FONT,
  fontSize: 12,
  lineHeight: 1.2,
  letterSpacing: "0.2em",
  fontWeight: 600,
  textTransform: "uppercase" as const,
};
const F_BODY_LG = {
  fontFamily: HEADLINE_FONT,
  fontSize: 20,
  lineHeight: 1.6,
  fontStyle: "italic" as const,
  fontWeight: 400,
};
const F_BODY_MD = {
  fontFamily: BODY_FONT,
  fontSize: 15,
  lineHeight: 1.6,
  fontWeight: 400,
};

const KAZ_MONTHS = [
  "Қаңтар",
  "Ақпан",
  "Наурыз",
  "Сәуір",
  "Мамыр",
  "Маусым",
  "Шілде",
  "Тамыз",
  "Қыркүйек",
  "Қазан",
  "Қараша",
  "Желтоқсан",
];

const MON_MONTHS = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

const KAZ_DAYS = [
  "ЖЕКСЕНБІ",
  "ДҮЙСЕНБІ",
  "СЕЙСЕНБІ",
  "СӘРСЕНБІ",
  "БЕЙСЕНБІ",
  "ЖҰМА",
  "СЕНБІ",
];
const MON_DAYS = [
  "НЯМ",
  "ДАВАА",
  "МЯГМАР",
  "ЛХАГВА",
  "ПҮРЭВ",
  "БААСАН",
  "БЯМБА",
];

/* ======================================================================
   BILINGUAL SUPPORT (Kazakh / Mongolian) — Template2-той ижил интерфейс
   ====================================================================== */
export type Lang = "kk" | "mn";

interface T1Translations {
  langButtonLabel: string;
  nav: {
    hero: string;
    photos: string;
    details: string;
    poem: string;
    messages: string;
  };
  heroEyebrow: string;
  tagline: string;
  heroFallback: (maleName: string, femaleName: string) => string;
  organizerTitle: string;
  groomSide: string;
  brideSide: string;
  ourStoryLabel: string;
  weddingMemories: string;
  dateLabel: string;
  timeLabel: string;
  atTime: (time: string) => string;
  venueLabel: string;
  viewOnMap: string;
  extraInfoTitle: string;
  rsvpTitle: string;
  rsvpSubtitle: string;
  footerPoem: string;
  builtWithLove: string;
  paymentLocked: string;
}

const T1_TRANSLATIONS: Record<Lang, T1Translations> = {
  kk: {
    langButtonLabel: "ҚАЗ",
    nav: {
      hero: "Ғашықтар",
      photos: "Фотолар",
      details: "Мереке",
      poem: "Хикая",
      messages: "Тілектер",
    },
    heroEyebrow: "Үйлену тойына шақыру",
    tagline: "Бірге болуға серт бердік",
    heroFallback: (male, female) =>
      `Ерекше сезімдер бізді біріктірді. ${male} мен ${female} өздерінің ерекше күнінде сіздерді куә болуға шақырады.`,
    organizerTitle: "Той иелері",
    groomSide: "Жігіт жағы",
    brideSide: "Қыз жағы",
    ourStoryLabel: "Біздің хикая",
    weddingMemories: "Той естеліктері",
    dateLabel: "Күні",
    timeLabel: "Уақыты",
    atTime: (time) => `Сағат ${time}-де`,
    venueLabel: "Мекен-жайы / Venue",
    viewOnMap: "КАРТАДАН КӨРУ",
    extraInfoTitle: "ҚОСЫМША АҚПАРАТ",
    rsvpTitle: "Тойға келетініңізді растаңыз",
    rsvpSubtitle: "Өтініш, жауабыңызды алдын ала беріңіз",
    footerPoem:
      "Біз екеуміз тек екеуміз\nЖүректермен бір екенбіз\nМен сен үшін сен мен үшін\nЖаралған екенбіз",
    builtWithLove: "СҮЙІСПЕНШІЛІКПЕН ЖАСАЛДЫ.",
    paymentLocked: "Төлем төленбеген",
  },
  mn: {
    langButtonLabel: "МОН",
    nav: {
      hero: "Хайр",
      photos: "Зурагнууд",
      details: "Ёслол",
      poem: "Түүх",
      messages: "Ерөөлүүд",
    },
    heroEyebrow: "Хуримын урилга",
    tagline: "Хамт байхаар амлалт өглөө",
    heroFallback: (male, female) =>
      `Онцгой мэдрэмж биднийг холбов. ${male}, ${female} хоёр өөрсдийн онцгой өдөрт та бүхнийг гэрч байхыг урьж байна.`,
    organizerTitle: "Хуримын эзэд",
    groomSide: "Хүргэн тал",
    brideSide: "Бэр тал",
    ourStoryLabel: "Бидний түүх",
    weddingMemories: "Хуримын дурсамжууд",
    dateLabel: "Огноо",
    timeLabel: "Цаг",
    atTime: (time) => `${time} цагт`,
    venueLabel: "Байршил / Venue",
    viewOnMap: "ГАЗРЫН ЗУРГААС ХАРАХ",
    extraInfoTitle: "НЭМЭЛТ МЭДЭЭЛЭЛ",
    rsvpTitle: "Хуримд ирэхээ баталгаажуулна уу",
    rsvpSubtitle: "Хариугаа урьдчилан мэдэгдэнэ үү",
    footerPoem:
      "Чамд дурла гэж заяа минь намайг хөтөлсөн\nЧамайг хайрла гэж хорвоо надад тушаасан\nХамгаас илүү гэж бурхан надад шивнэсэн\nХайрлаж явья гэж харин би өөрөө шийдсэн",
    builtWithLove: "ХАЙРААР БҮТЭЭВ.",
    paymentLocked: "Төлбөр төлөгдөөгүй",
  },
};

const LangContext = createContext<{
  lang: Lang;
  t: T1Translations;
  toggleLang: () => void;
}>({
  lang: "kk",
  t: T1_TRANSLATIONS.kk,
  toggleLang: () => {},
});

function useLang() {
  return useContext(LangContext);
}

function pickLang(raw: string | null | undefined, lang: Lang): string {
  if (!raw) return "";
  const labelRe = /\b(kk|mn)\s*:\s*/gi;

  const matches: { label: string; index: number; length: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = labelRe.exec(raw)) !== null) {
    matches.push({
      label: m[1].toLowerCase(),
      index: m.index,
      length: m[0].length,
    });
    if (m[0].length === 0) labelRe.lastIndex++;
  }
  if (matches.length === 0) return raw.trim();

  const parts: Partial<Record<Lang, string>> = {};
  matches.forEach((match, i) => {
    const start = match.index + match.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const value = raw.slice(start, end).trim();
    if (value) parts[match.label as Lang] = value;
  });

  return parts[lang] ?? parts.kk ?? parts.mn ?? raw.trim();
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease-out",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function decodeHtmlEntities(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function MultilineText({
  text,
  style = {},
  className = "",
}: {
  text: string | null | undefined;
  style?: React.CSSProperties;
  className?: string;
}) {
  const decoded = decodeHtmlEntities(text);
  const lines = decoded.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <p
          key={i}
          className={className}
          style={{
            margin: 0,
            marginBottom: i < lines.length - 1 ? 6 : 0,
            ...style,
          }}
        >
          {line === "" ? "\u00A0" : line}
        </p>
      ))}
    </>
  );
}

function OrnamentDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        color: C.secondary,
      }}
    >
      <span
        style={{
          height: 1,
          width: 40,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
        }}
      />
      <FaHeart size={16} style={{ color: C.accent }} />
      <span
        style={{
          height: 1,
          width: 40,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
        }}
      />
    </div>
  );
}

function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(255, 248, 242, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `0.5px solid ${C.accent}4d`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── ShimmerGold text — romantic rose-gold shimmer, same anim as T2 ─── */
function ShimmerRose({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <style>{`
        @keyframes shimmer-anim-t1 { to { background-position: 200% center; } }
        .shimmer-rose-text {
          background: linear-gradient(90deg, ${C.accent} 0%, #fff0f5 50%, ${C.accent} 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer-anim-t1 3s linear infinite;
        }
      `}</style>
      <span className="shimmer-rose-text" style={style}>
        {children}
      </span>
    </>
  );
}

/* ------------------------------------------------------------------------
   RisingHearts — faint hearts drifting upward, romantic hero overlay
   (decorative layer only, does not change layout/structure)
   ------------------------------------------------------------------------ */
function RisingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const heartPath = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.35);
      ctx.bezierCurveTo(
        size * 0.5,
        -size * 0.35,
        size * 1.15,
        size * 0.25,
        0,
        size * 1.05,
      );
      ctx.bezierCurveTo(
        -size * 1.15,
        size * 0.25,
        -size * 0.5,
        -size * 0.35,
        0,
        size * 0.35,
      );
      ctx.closePath();
    };

    const hearts: {
      x: number;
      y: number;
      size: number;
      speed: number;
      baseOpacity: number;
      drift: number;
      phase: number;
      pulseSpeed: number;
    }[] = [];
    for (let i = 0; i < 18; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 7 + 4,
        speed: Math.random() * 0.25 + 0.08,
        baseOpacity: Math.random() * 0.09 + 0.04,
        drift: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.01,
      });
    }

    let raf: number;
    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const h of hearts) {
        const pulse = 0.6 + 0.4 * Math.sin(t * h.pulseSpeed + h.phase);
        const opacity = h.baseOpacity * pulse;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        heartPath(h.size);
        ctx.fill();
        ctx.restore();
        h.y -= h.speed;
        h.x += h.drift;
        if (h.y < -20) {
          h.y = canvas.height + 20;
          h.x = Math.random() * canvas.width;
        }
        if (h.x < -20) h.x = canvas.width + 20;
        if (h.x > canvas.width + 20) h.x = -20;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function AnalogClock({ time }: { time: string }) {
  const [h, m] = time.split(":").map(Number);
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const tick = () => setSec((new Date().getSeconds() / 60) * 360);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const hourDeg = ((h % 12) / 12) * 360 + (m / 60) * 30;
  const minDeg = (m / 60) * 360;
  return (
    <svg viewBox="0 0 120 120" width="88" height="88">
      <circle
        cx="60"
        cy="60"
        r="58"
        fill={C.surfaceContainerLowest}
        stroke={C.outlineVariant}
        strokeWidth="1.5"
      />
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="none"
        stroke={C.outlineVariant}
        strokeWidth="0.6"
        opacity="0.6"
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const r1 = 46,
          r2 = i % 3 === 0 ? 40 : 43;
        return (
          <line
            key={i}
            x1={60 + r1 * Math.cos(a)}
            y1={60 + r1 * Math.sin(a)}
            x2={60 + r2 * Math.cos(a)}
            y2={60 + r2 * Math.sin(a)}
            stroke={i % 3 === 0 ? C.primary : C.outlineVariant}
            strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
          />
        );
      })}
      <line
        x1="60"
        y1="60"
        x2={60 + 26 * Math.cos(((hourDeg - 90) * Math.PI) / 180)}
        y2={60 + 26 * Math.sin(((hourDeg - 90) * Math.PI) / 180)}
        stroke={C.primary}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="60"
        x2={60 + 37 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={60 + 37 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke={C.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="60"
        x2={60 + 40 * Math.cos(((sec - 90) * Math.PI) / 180)}
        y2={60 + 40 * Math.sin(((sec - 90) * Math.PI) / 180)}
        stroke={C.secondary}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="3.5" fill={C.primary} />
      <circle cx="60" cy="60" r="1.4" fill="#fff" />
    </svg>
  );
}

function CalendarDayCard({
  monthCaps,
  day,
  dayCaps,
}: {
  monthCaps: string;
  day: number;
  dayCaps: string;
}) {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
      <div
        className="flex justify-center gap-3"
        style={{ paddingTop: 8, background: C.primary }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.surfaceContainerLowest,
              opacity: 0.9,
            }}
          />
        ))}
      </div>
      <div style={{ background: C.primary, paddingBottom: 10 }}>
        <p
          style={{
            ...F_LABEL_CAPS,
            textAlign: "center",
            color: C.onPrimary,
            margin: 0,
          }}
        >
          {monthCaps}
        </p>
      </div>
      <div
        style={{
          height: 6,
          background: `repeating-linear-gradient(90deg, ${C.primary} 0 6px, transparent 6px 12px)`,
        }}
      />
      <div
        className="flex flex-col items-center justify-center"
        style={{ padding: "16px 12px 18px" }}
      >
        <p
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 700,
            fontSize: 40,
            lineHeight: 1,
            color: C.primary,
            margin: 0,
          }}
        >
          {day}
        </p>
        <p
          style={{
            ...F_LABEL_CAPS,
            fontSize: 11,
            color: C.secondary,
            marginTop: 8,
          }}
        >
          {dayCaps}
        </p>
      </div>
    </div>
  );
}

function HeaderBar({
  maleName,
  femaleName,
  extra5,
  onMenuClick,
  navOpen,
}: {
  maleName: string;
  femaleName: string;
  extra5?: string | null;
  onMenuClick: () => void;
  navOpen: boolean;
}) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 110,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        height: 64,
        background: "rgba(255,248,242,0.8)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${C.outlineVariant}4d`,
      }}
    >
      <button
        aria-label="menu"
        onClick={onMenuClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
        }}
      >
        {navOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <h1
        style={{
          ...F_HEADLINE_MD,
          fontSize: 22,
          fontStyle: "italic",
          color: C.primary,
          margin: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "60%",
        }}
      >
        {maleName} &amp; {femaleName}
      </h1>
      <div
        style={{
          color: C.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
        }}
      >
        <Song extra5={extra5} />
      </div>
    </header>
  );
}

function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();

  const navItems = [
    { id: "section-hero", icon: FaHeart, label: t.nav.hero },
    { id: "section-photos", icon: FaImages, label: t.nav.photos },
    { id: "section-details", icon: FaCalendarAlt, label: t.nav.details },
    { id: "section-poem", icon: FaCameraRetro, label: t.nav.poem },
    { id: "section-messages", icon: FaEnvelopeOpenText, label: t.nav.messages },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 115,
          background: "rgba(30,27,24,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />
      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 120,
          background: C.background,
          borderTop: `1px solid ${C.accent}4d`,
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 32px rgba(96,40,70,0.15)",
          padding: "28px 24px calc(28px + env(safe-area-inset-bottom, 0px))",
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: C.outlineVariant,
            margin: "0 auto 20px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                flex: "1 1 30%",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "16px 4px",
                background: C.surfaceContainerLow,
                border: `1px solid ${C.accent}33`,
                borderRadius: 12,
                cursor: "pointer",
                color: C.primary,
              }}
            >
              <Icon size={18} style={{ color: C.secondary }} />
              <span
                style={{
                  ...F_LABEL_CAPS,
                  fontSize: 9.5,
                  color: C.primary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

function HeroSection({
  mainPhotoUrl,
  maleName,
  femaleName,
  description1,
}: {
  mainPhotoUrl?: string | null;
  maleName: string;
  femaleName: string;
  description1?: string | null;
}) {
  const { t } = useLang();
  return (
    <section id="section-hero">
      <div className="relative h-[75vh] w-full overflow-hidden flex items-end justify-center pb-12">
        <div className="absolute inset-0 z-0">
          {mainPhotoUrl ? (
            <img
              src={mainPhotoUrl}
              alt="Негізгі сурет"
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(0.85)",
                display: "block",
                border: "none",
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${C.secondaryContainer} 0%, ${C.surface} 55%, ${C.primaryContainer}33 100%)`,
              }}
            />
          )}
          <RisingHearts />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${C.background}, transparent 65%)`,
              opacity: 0.95,
              zIndex: 2,
            }}
          />
        </div>
        <Reveal
          className="relative text-center"
          style={{ padding: "0 5vw", zIndex: 3 }}
        >
          <p style={{ ...F_LABEL_CAPS, color: C.secondary, marginBottom: 8 }}>
            {t.heroEyebrow}
          </p>
          <h2
            style={{
              ...F_DISPLAY_LG_MOBILE,
              fontStyle: "italic",
              color: C.primary,
              margin: "0 0 16px",
            }}
          >
            {maleName} &amp; {femaleName}
          </h2>
          <p
            style={{
              fontFamily: HEADLINE_FONT,
              fontStyle: "italic",
              fontSize: 16,
              color: C.secondary,
              marginBottom: 16,
            }}
          >
            {t.tagline}
          </p>
          <OrnamentDivider />
        </Reveal>
      </div>

      <Reveal
        className="text-center flex flex-col items-center"
        style={{ padding: "4rem 5vw", gap: "2rem" }}
      >
        <div style={{ maxWidth: 640 }}>
          <h3
            style={{
              fontFamily: HEADLINE_FONT,
              fontSize: 19,
              fontStyle: "italic",
              fontWeight: 400,
              color: C.primary,
              marginBottom: 20,
            }}
          >
            {maleName} &amp; {femaleName}
          </h3>
          {description1 ? (
            <MultilineText
              text={description1}
              style={{
                fontFamily: HEADLINE_FONT,
                fontSize: 15,
                lineHeight: 1.7,
                fontStyle: "italic",
                color: C.onSurfaceVariant,
                whiteSpace: "pre-wrap",
              }}
            />
          ) : (
            <p
              style={{
                fontFamily: HEADLINE_FONT,
                fontSize: 15,
                lineHeight: 1.7,
                fontStyle: "italic",
                color: C.onSurfaceVariant,
              }}
            >
              {t.heroFallback(maleName, femaleName)}
            </p>
          )}
        </div>
        <BsStars size={26} style={{ color: C.accent, marginTop: 8 }} />
      </Reveal>
    </section>
  );
}

function OrganizerSection({
  organizer,
  maleParents,
  femaleParents,
}: {
  organizer: string;
  maleParents?: string | null;
  femaleParents?: string | null;
}) {
  const { t } = useLang();
  const lines = organizer.split("\n").filter(Boolean);
  return (
    <Reveal
      className="text-center"
      style={{ background: C.surfaceContainerLow, padding: "4rem 5vw" }}
    >
      <h4 style={{ ...F_LABEL_CAPS, color: C.secondary, marginBottom: 16 }}>
        {t.organizerTitle}
      </h4>
      <div className="flex flex-col items-center gap-4">
        <GlassCard
          className="rounded-full"
          style={{ padding: "18px 32px", border: `1px solid ${C.secondary}33` }}
        >
          {(lines.length ? lines : [organizer]).map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: HEADLINE_FONT,
                fontSize: 19,
                fontStyle: "italic",
                fontWeight: 400,
                color: C.primary,
                margin: 0,
              }}
            >
              {line}
            </p>
          ))}
        </GlassCard>

        {(maleParents || femaleParents) && (
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {maleParents && (
              <div>
                <p
                  style={{
                    ...F_LABEL_CAPS,
                    color: C.secondary,
                    marginBottom: 4,
                  }}
                >
                  {t.groomSide}
                </p>
                <p
                  style={{
                    ...F_HEADLINE_MD,
                    fontStyle: "italic",
                    color: C.primary,
                    fontSize: 24,
                  }}
                >
                  {maleParents}
                </p>
              </div>
            )}
            {femaleParents && (
              <div>
                <p
                  style={{
                    ...F_LABEL_CAPS,
                    color: C.secondary,
                    marginBottom: 4,
                  }}
                >
                  {t.brideSide}
                </p>
                <p
                  style={{
                    ...F_HEADLINE_MD,
                    fontStyle: "italic",
                    color: C.primary,
                    fontSize: 24,
                  }}
                >
                  {femaleParents}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}

function PhotosSection({
  galleryUrls,
}: {
  galleryUrls: string[] | null | undefined;
}) {
  const { t } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };
  const urls = galleryUrls?.length ? galleryUrls : [];
  if (!urls.length) return <section id="section-photos" />;

  return (
    <section id="section-photos">
      <Reveal
        style={{ background: C.surfaceContainerLowest, padding: "4rem 0" }}
      >
        <div
          className="flex justify-between items-end"
          style={{ padding: "0 5vw", marginBottom: 32 }}
        >
          <div>
            <h4
              style={{
                ...F_LABEL_CAPS,
                fontSize: 11,
                color: C.secondary,
                marginBottom: 4,
              }}
            >
              {t.ourStoryLabel}
            </h4>
            <h3
              style={{
                fontFamily: HEADLINE_FONT,
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: 400,
                color: C.primary,
                margin: 0,
              }}
            >
              {t.weddingMemories}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${C.outlineVariant}`,
                color: C.primary,
                borderRadius: 999,
                background: "none",
                cursor: "pointer",
              }}
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${C.outlineVariant}`,
                color: C.primary,
                borderRadius: 999,
                background: "none",
                cursor: "pointer",
              }}
            >
              <FaChevronRight size={13} />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x pb-4"
          style={{ gap: 16, padding: "0 5vw", scrollbarWidth: "none" }}
        >
          {urls.map((url, i) => (
            <div
              key={i}
              className="snap-center"
              style={{
                width: 280,
                minWidth: 280,
                maxWidth: 280,
                height: 400,
                flex: "0 0 280px",
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${C.secondary}1a`,
                boxSizing: "border-box",
              }}
            >
              <img
                src={url}
                alt={`сурет ${i + 1}`}
                style={{
                  display: "block",
                  border: "none",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function DateTimeCards({
  date,
  time,
}: {
  date: string | null;
  time: string | null;
}) {
  const { t, lang } = useLang();
  if (!date && !time) return null;

  const dObj = date ? new Date() : null; // placeholder, overwritten below in DetailsSection call
  return null; // unused – replaced by DateTimeRomanticCards
}

function DateTimeRomanticCards({
  isoDate,
  lang,
}: {
  isoDate: string | null;
  lang: Lang;
}) {
  const { t } = useLang();
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;

  const months = lang === "mn" ? MON_MONTHS : KAZ_MONTHS;
  const days = lang === "mn" ? MON_DAYS : KAZ_DAYS;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-2 gap-6">
      <Reveal>
        <GlassCard
          className="p-0 text-center flex flex-col items-center overflow-hidden"
          style={{ border: `1px solid ${C.secondary}4d` }}
        >
          <div
            className="flex items-center gap-2"
            style={{ padding: "14px 0 0" }}
          >
            <MdOutlineCalendarMonth size={16} style={{ color: C.secondary }} />
            <span style={{ ...F_LABEL_CAPS, fontSize: 10, color: C.secondary }}>
              {t.dateLabel}
            </span>
          </div>
          <div style={{ padding: 14, width: "100%" }}>
            <CalendarDayCard
              monthCaps={months[d.getMonth()]}
              day={d.getDate()}
              dayCaps={days[d.getDay()]}
            />
          </div>
        </GlassCard>
      </Reveal>
      <Reveal>
        <GlassCard
          className="p-4 text-center flex flex-col items-center justify-center h-full"
          style={{ border: `1px solid ${C.secondary}4d` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MdOutlineSchedule size={16} style={{ color: C.secondary }} />
            <span style={{ ...F_LABEL_CAPS, fontSize: 10, color: C.secondary }}>
              {t.timeLabel}
            </span>
          </div>
          <AnalogClock time={time} />
          <p
            style={{
              fontFamily: HEADLINE_FONT,
              fontSize: 15,
              fontWeight: 500,
              color: C.primary,
              marginTop: 10,
            }}
          >
            {t.atTime(time)}
          </p>
        </GlassCard>
      </Reveal>
    </div>
  );
}

function VenueCard({
  venueName,
  venueAddress,
  photo,
  latitude,
  longitude,
}: {
  venueName: string | null;
  venueAddress: string | null;
  photo: string | null;
  latitude?: any;
  longitude?: any;
}) {
  const { t } = useLang();
  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);
  const mapsHref = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : null;

  return (
    <Reveal style={{ marginTop: 32 }}>
      <GlassCard
        style={{ overflow: "hidden", border: `1px solid ${C.secondary}4d` }}
      >
        <div
          className="w-full relative"
          style={{ padding: "20px 20px 0", background: C.surfaceContainerLow }}
        >
          <div
            className="w-full h-56 relative overflow-hidden"
            style={{
              borderRadius: 16,
              border: `1px solid ${C.accent}4d`,
              boxShadow: `0 10px 30px -12px ${C.primary}40`,
            }}
          >
            {photo ? (
              <img
                src={photo}
                alt={venueName || "venue"}
                className="w-full h-full"
                style={{
                  display: "block",
                  border: "none",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${C.secondaryContainer}55, ${C.surfaceContainer})`,
                }}
              >
                <FaMapMarkerAlt
                  size={36}
                  style={{ color: C.primary, opacity: 0.35 }}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: 32 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
            <FaStar size={14} style={{ color: C.accent }} />
            <h5 style={{ ...F_LABEL_CAPS, color: C.primary, margin: 0 }}>
              {t.venueLabel}
            </h5>
          </div>

          {venueName && (
            <p
              style={{
                fontFamily: HEADLINE_FONT,
                fontSize: 22,
                fontStyle: "italic",
                fontWeight: 500,
                color: C.primary,
                margin: "0 0 8px",
              }}
            >
              {venueName}
            </p>
          )}
          {venueAddress && (
            <p
              style={{
                ...F_BODY_MD,
                fontStyle: "italic",
                color: C.onSurfaceVariant,
                marginBottom: 0,
              }}
            >
              {venueAddress}
            </p>
          )}

          {hasCoords && (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <GoogleMapEmbed
                address={venueAddress || undefined}
                latitude={latitude}
                longitude={longitude}
                accentColor={C.primary}
                height={200}
              />
            </div>
          )}

          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
              style={{
                marginTop: 20,
                padding: "12px 32px",
                background: C.primary,
                color: C.secondaryFixed,
                border: `1px solid ${C.secondary}`,
                ...F_LABEL_CAPS,
                textDecoration: "none",
                borderRadius: 999,
                transition: "background-color 0.2s ease",
                boxShadow: `0 10px 25px -8px ${C.primary}66`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.onPrimaryFixedVariant)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = C.primary)
              }
            >
              <FaMapMarkerAlt size={14} />
              {t.viewOnMap}
            </a>
          )}
        </div>
      </GlassCard>
    </Reveal>
  );
}

function ExtraInfoCard({ extras }: { extras: (string | null | undefined)[] }) {
  const { t } = useLang();
  const clean = extras.filter(Boolean) as string[];
  if (clean.length === 0) return null;

  return (
    <Reveal style={{ marginTop: 24 }}>
      <GlassCard style={{ padding: 28, border: `1px solid ${C.secondary}4d` }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <FaInfoCircle size={15} style={{ color: C.accent }} />
          <h5 style={{ ...F_LABEL_CAPS, color: C.primary, margin: 0 }}>
            {t.extraInfoTitle}
          </h5>
        </div>
        <div className="flex flex-col gap-3">
          {clean.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <FaStar
                size={13}
                style={{ color: C.accent, marginTop: 5, flexShrink: 0 }}
              />
              <p
                style={{
                  ...F_BODY_MD,
                  fontSize: 15,
                  color: C.onSurfaceVariant,
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {e}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </Reveal>
  );
}

function DetailsSection({
  isoDate,
  lang,
  venueName,
  venueAddress,
  extras,
  photo5Url,
  latitude,
  longitude,
}: {
  isoDate: string | null;
  lang: Lang;
  venueName: string | null;
  venueAddress: string | null;
  extras: (string | null | undefined)[];
  photo5Url: string | null;
  latitude?: any;
  longitude?: any;
}) {
  return (
    <section
      id="section-details"
      style={{ background: C.background, padding: "3rem 5vw" }}
    >
      <DateTimeRomanticCards isoDate={isoDate} lang={lang} />

      <VenueCard
        venueName={venueName}
        venueAddress={venueAddress}
        photo={photo5Url}
        latitude={latitude}
        longitude={longitude}
      />

      <ExtraInfoCard extras={extras} />
    </section>
  );
}

function PoemAndCoupleSection({
  poem,
  photo3,
  photo4,
  link1,
  link2,
}: {
  poem: string | null;
  photo3: string | null;
  photo4: string | null;
  link1: string | null;
  link2: string | null;
}) {
  const hasPhoto3 = Boolean(photo3);
  const hasPhoto4 = Boolean(photo4);
  const hasPhotos = hasPhoto3 || hasPhoto4;
  const hasLinks = Boolean(link1) || Boolean(link2);
  const hasPoem = Boolean(poem);

  if (!hasPoem && !hasPhotos && !hasLinks) return null;

  return (
    <section
      id="section-poem"
      style={{ background: C.surfaceContainerLow, padding: "4rem 5vw" }}
    >
      <Reveal
        className="text-center"
        style={{ maxWidth: 640, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <FaCameraRetro size={24} style={{ color: C.secondary }} />
        </div>
        {hasPoem && (
          <MultilineText
            text={poem}
            style={{
              fontFamily: HEADLINE_FONT,
              fontStyle: "italic",
              fontSize: 17,
              color: C.onSurfaceVariant,
              lineHeight: 1.9,
              whiteSpace: "pre-wrap",
            }}
          />
        )}

        {hasPhotos && (
          <div
            className={`grid gap-3 ${hasPhoto3 && hasPhoto4 ? "grid-cols-2" : "grid-cols-1"}`}
            style={{ marginTop: 32 }}
          >
            {hasPhoto3 && (
              <div
                className="h-72"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.secondary}1a`,
                }}
              >
                <img
                  src={photo3!}
                  alt="Жігіттің суреті"
                  className="w-full h-full object-cover"
                  style={{ display: "block", border: "none" }}
                />
              </div>
            )}
            {hasPhoto4 && (
              <div
                className="h-72"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.secondary}1a`,
                }}
              >
                <img
                  src={photo4!}
                  alt="Қыздың суреті"
                  className="w-full h-full object-cover"
                  style={{ display: "block", border: "none" }}
                />
              </div>
            )}
          </div>
        )}

        {hasLinks && (
          <div
            className="flex justify-center gap-4 flex-wrap"
            style={{ marginTop: 28 }}
          >
            {link1 && (
              <a
                href={link1}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
                style={{
                  padding: "10px 24px",
                  background: C.primary,
                  color: C.secondaryFixed,
                  ...F_LABEL_CAPS,
                  fontSize: 11,
                  textDecoration: "none",
                  borderRadius: 999,
                  border: `1px solid ${C.secondary}`,
                }}
              >
                <FaCameraRetro size={13} />
                Instagram
              </a>
            )}
            {link2 && (
              <a
                href={link2}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
                style={{
                  padding: "10px 24px",
                  background: C.primary,
                  color: C.secondaryFixed,
                  ...F_LABEL_CAPS,
                  fontSize: 11,
                  textDecoration: "none",
                  borderRadius: 999,
                  border: `1px solid ${C.secondary}`,
                }}
              >
                <FaCameraRetro size={13} />
                Instagram
              </a>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}

function MessagesSection({ weddingId }: { weddingId: string }) {
  const { t, lang } = useLang();
  return (
    <section
      id="section-messages"
      style={{ background: C.background, padding: "4rem 5vw" }}
    >
      <Reveal>
        <GlassCard
          className="p-10 mx-auto text-center"
          style={{ maxWidth: 560, border: `2px solid ${C.secondary}33` }}
        >
          <h3
            style={{
              ...F_HEADLINE_MD,
              fontStyle: "italic",
              color: C.primary,
              marginBottom: 8,
            }}
          >
            {t.rsvpTitle}
          </h3>
          <p
            style={{
              ...F_BODY_MD,
              fontStyle: "italic",
              color: C.onSurfaceVariant,
              marginBottom: 32,
            }}
          >
            {t.rsvpSubtitle}
          </p>
          <div style={{ marginBottom: 40 }}>
            <RSVPSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor={C.secondaryFixed}
              lang={lang}
            />
          </div>
          <div
            style={{ borderTop: `1px solid ${C.secondary}22`, paddingTop: 40 }}
          >
            <MessageSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor={C.secondaryFixed}
              borderColor="border-[#d5c2c8]"
              lang={lang}
            />
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

function FooterSection({
  maleName,
  femaleName,
}: {
  maleName: string;
  femaleName: string;
}) {
  const { t } = useLang();
  return (
    <footer
      className="flex flex-col items-center text-center footer-gradient-bg-t1"
      style={{ gap: 32, padding: "4rem 5vw", color: C.secondaryFixed }}
    >
      <style>{`
        @keyframes footer-gradient-move-t1 {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .footer-gradient-bg-t1 {
          background: linear-gradient(
            120deg,
            ${C.primary} 0%,
            ${C.primaryContainer} 35%,
            #2a1520 60%,
            ${C.primary} 100%
          );
          background-size: 300% 300%;
          animation: footer-gradient-move-t1 10s ease-in-out infinite;
        }
      `}</style>
      <div style={{ maxWidth: 420 }}>
        <p
          style={{
            ...F_BODY_LG,
            color: "rgba(253,213,230,0.9)",
            whiteSpace: "pre-line",
            marginBottom: 32,
          }}
        >
          {t.footerPoem}
        </p>
        <div
          className="flex items-center justify-center gap-4"
          style={{ marginBottom: 16 }}
        >
          <span
            style={{
              height: 1,
              width: "100%",
              maxWidth: 60,
              opacity: 0.3,
              background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            }}
          />
          <FaHeart style={{ color: C.secondaryFixedDim }} />
          <span
            style={{
              height: 1,
              width: "100%",
              maxWidth: 60,
              opacity: 0.3,
              background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            }}
          />
        </div>
        <ShimmerRose
          style={{ ...F_HEADLINE_MD, fontStyle: "italic", fontWeight: 700 }}
        >
          {maleName} &amp; {femaleName}
        </ShimmerRose>
      </div>
      <p
        style={{
          ...F_LABEL_CAPS,
          fontSize: 10,
          color: "rgba(253,213,230,0.5)",
          letterSpacing: "0.2em",
        }}
      >
        © {new Date().getFullYear()} {maleName.toUpperCase()} &amp;{" "}
        {femaleName.toUpperCase()}. {t.builtWithLove}
      </p>
    </footer>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;600&display=swap');
      * { box-sizing: border-box; }
      img { border: none !important; outline: none !important; }
      body, #__next { background: ${C.background} !important; }
      ::-webkit-scrollbar { display: none; }
    `}</style>
  );
}

function PaymentLockOverlay() {
  const { t } = useLang();
  return (
    <div
      className="fixed inset-0 h-full w-full flex items-center justify-center"
      style={{ background: "#000000", zIndex: 9999 }}
    >
      <div className="text-center px-6">
        <FaLock
          size={40}
          style={{ color: "#ffffff", opacity: 0.7, marginBottom: 16 }}
        />
        <p
          style={{
            fontFamily: HEADLINE_FONT,
            fontWeight: 600,
            fontSize: 22,
            color: "#ffffff",
          }}
        >
          {t.paymentLocked}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN — Template2-той бүрэн ижил бүтэц/дараалал, зөвхөн
   өнгө (C), фонт (Playfair+Montserrat) болон текстүүд өөр
   ───────────────────────────────────────────────────────────── */
export default function Template1({
  wedding,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = T1_TRANSLATIONS[lang];
  const toggleLang = () => setLang((prev) => (prev === "kk" ? "mn" : "kk"));

  const isoDate = wedding.wedding_date || null;

  const organizerText = pickLang(wedding.organizer, lang) || null;
  const venueNameText = pickLang(wedding.venue_name, lang) || null;
  const venueAddressText = pickLang(wedding.venue_address, lang) || null;
  const description1Text = pickLang(wedding.description1, lang) || null;
  const description2Text = pickLang(wedding.description2, lang) || null;

  const extras = [
    pickLang(wedding.extra1, lang),
    pickLang(wedding.extra2, lang),
    pickLang(wedding.extra3, lang),
    pickLang(wedding.extra4, lang),
  ].filter(Boolean);

  const isPaymentLocked = String((wedding as any).payment) === "2";

  const galleryImages = (wedding.gallery_urls || []).filter(
    Boolean,
  ) as string[];
  const venuePhoto = wedding.photo5_url || galleryImages[3] || null;

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      <GlobalStyles />
      {isPaymentLocked && <PaymentLockOverlay />}

      <div className="fixed inset-0 z-0" style={{ background: C.background }} />

      <HeaderBar
        maleName={wedding.male_name}
        femaleName={wedding.female_name}
        extra5={wedding.extra5}
        onMenuClick={() => setNavOpen((v) => !v)}
        navOpen={navOpen}
      />

      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />

      <div
        className="relative z-10 min-h-screen overflow-y-auto"
        style={{
          fontFamily: BODY_FONT,
          background: C.background,
          paddingTop: 64,
          paddingBottom: 24,
        }}
      >
        <HeroSection
          mainPhotoUrl={wedding.main_photo_url}
          maleName={wedding.male_name}
          femaleName={wedding.female_name}
          description1={description1Text}
        />

        {organizerText && (
          <OrganizerSection
            organizer={organizerText}
            maleParents={(wedding as any).male_parents}
            femaleParents={(wedding as any).female_parents}
          />
        )}

        <DetailsSection
          isoDate={isoDate}
          lang={lang}
          venueName={venueNameText}
          venueAddress={venueAddressText}
          extras={extras}
          photo5Url={venuePhoto}
          latitude={(wedding as any).latitude}
          longitude={(wedding as any).longitude}
        />

        <PhotosSection galleryUrls={wedding.gallery_urls} />

        <PoemAndCoupleSection
          poem={description2Text}
          photo3={wedding.photo3_url || null}
          photo4={wedding.photo4_url || null}
          link1={wedding.link1 || null}
          link2={wedding.link2 || null}
        />

        <MessagesSection weddingId={wedding.id} />

        <FooterSection
          maleName={wedding.male_name}
          femaleName={wedding.female_name}
        />
      </div>
    </LangContext.Provider>
  );
}
