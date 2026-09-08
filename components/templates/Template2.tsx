"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import {
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
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
   DESIGN TOKENS — pulled 1:1 from the HTML reference's
   tailwind.config colors / fontFamily / fontSize blocks
   ─────────────────────────────────────────────────────────── */
const C = {
  primary: "#002b14",
  onPrimary: "#ffffff",
  primaryContainer: "#144227",
  onPrimaryContainer: "#7faf8b",
  onPrimaryFixedVariant: "#234f33",
  primaryFixedDim: "#a1d2ad",
  secondary: "#735c00",
  onSecondary: "#ffffff",
  secondaryContainer: "#fed65b",
  onSecondaryContainer: "#745c00",
  secondaryFixed: "#ffe088",
  secondaryFixedDim: "#e9c349",
  background: "#fff8f5",
  onBackground: "#1e1b18",
  surface: "#fff8f5",
  surfaceContainerLow: "#fbf2ed",
  surfaceContainer: "#f5ece7",
  surfaceContainerHigh: "#efe6e2",
  surfaceContainerHighest: "#e9e1dc",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#1e1b18",
  onSurfaceVariant: "#414942",
  outline: "#717971",
  outlineVariant: "#c1c9c0",
  inverseSurface: "#34302c",
  inverseOnSurface: "#f8efea",
  tertiary: "#252521",
  onTertiary: "#ffffff",
  gold: "#D4AF37", // decorative shimmer / ornament gold from HTML's <style> block
};

const F_DISPLAY_LG_MOBILE = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 40,
  lineHeight: 1.2,
  fontWeight: 700,
};
const F_HEADLINE_MD = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 32,
  lineHeight: 1.3,
  fontWeight: 400,
};
const F_LABEL_CAPS = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 12,
  lineHeight: 1.2,
  letterSpacing: "0.2em",
  fontWeight: 600,
  textTransform: "uppercase" as const,
};
const F_BODY_LG = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 20,
  lineHeight: 1.6,
  fontWeight: 400,
};
const F_BODY_MD = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 17,
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

/* ======================================================================
   BILINGUAL SUPPORT (Kazakh / Mongolian) — ported 1:1 from Template1
   ====================================================================== */
export type Lang = "kk" | "mn";

interface T2Translations {
  langButtonLabel: string;
  nav: {
    hero: string;
    photos: string;
    details: string;
    poem: string;
    messages: string;
  };
  heroEyebrow: string;
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

const T2_TRANSLATIONS: Record<Lang, T2Translations> = {
  kk: {
    langButtonLabel: "ҚАЗ",
    nav: {
      hero: "Есімдер",
      photos: "Фотолар",
      details: "Мәліметтер",
      poem: "Хикая",
      messages: "Тілектер",
    },
    heroEyebrow: "Үйлену тойына шақыру",
    heroFallback: (male, female) =>
      `Құрметті ағайын-туыс, құда-жекжат, дос-жаран, әріптестер мен көршілер! Сіздерді ұлымыз ${male} пен келініміз ${female}-ның үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!`,
    organizerTitle: "Той иелері",
    groomSide: "Күйеу жақ",
    brideSide: "Келін жақ",
    ourStoryLabel: "Біздің хикая",
    weddingMemories: "Той естеліктері",
    dateLabel: "Күні / Date",
    timeLabel: "Уақыты / Time",
    atTime: (time) => `Сағат ${time}-де`,
    venueLabel: "Мекен-жайы / Venue",
    viewOnMap: "КАРТАДАН КӨРУ",
    extraInfoTitle: "ҚОСЫМША АҚПАРАТ",
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Сіздің келуіңіз біз үшін үлкен мәртебе!",
    footerPoem:
      "Біз екеуміз тек екеуміз\nЖүректермен бір екенбіз\nМен сен үшін сен мен үшін\nЖаралған екенбіз",
    builtWithLove: "СҮЙІСПЕНШІЛІКПЕН ЖАСАЛДЫ.",
    paymentLocked: "Төлем төленбеген",
  },
  mn: {
    langButtonLabel: "МОН",
    nav: {
      hero: "Нэрс",
      photos: "Зурагнууд",
      details: "Мэдээлэл",
      poem: "Түүх",
      messages: "Ерөөлүүд",
    },
    heroEyebrow: "Хуримын урилга",
    heroFallback: (male, female) =>
      `Эрхэм ах эгч дүү нар, худ худгуй, найз нөхөд, хамт олон, хөрш зэргэлдээ нар аа! Хүү маань ${male} болон бэр маань ${female}-ийн хуримын баярт цагаан дэрвэлгэрийн хүндэт зочин болохыг урьж байна!`,
    organizerTitle: "Хуримын эзэд",
    groomSide: "Хүргэн тал",
    brideSide: "Бэр тал",
    ourStoryLabel: "Бидний түүх",
    weddingMemories: "Хуримын дурсамжууд",
    dateLabel: "Огноо / Date",
    timeLabel: "Цаг / Time",
    atTime: (time) => `${time} цагт`,
    venueLabel: "Байршил / Venue",
    viewOnMap: "ГАЗРЫН ЗУРГААС ХАРАХ",
    extraInfoTitle: "НЭМЭЛТ МЭДЭЭЛЭЛ",
    rsvpTitle: "RSVP",
    rsvpSubtitle: "Таны ирэх нь бидний хувьд том хүндэтгэл!",
    footerPoem:
      "Чамд дурла гэж заяа минь намайг хөтөлсөн\nЧамайг хайрла гэж хорвоо надад тушаасан\nХамгаас илүү гэж бурхан надад шивнэсэн\nХайрлаж явья гэж харин би өөрөө шийдсэн",
    builtWithLove: "ХАЙРААР БҮТЭЭВ.",
    paymentLocked: "Төлбөр төлөгдөөгүй",
  },
};

const LangContext = createContext<{
  lang: Lang;
  t: T2Translations;
  toggleLang: () => void;
}>({
  lang: "kk",
  t: T2_TRANSLATIONS.kk,
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

/* ------------------------------------------------------------------------
   parseLatLngFromString — the latitude column can now hold a plain number
   (old records), a "lat,lng" string, or a full Google Maps URL. This pulls
   real coordinates out of any of those shapes. Supported URL forms:
     - "47.918873,106.917702"                          (plain "lat,lng")
     - https://www.google.com/maps/@47.918,106.917,15z  (@lat,lng,zoom)
     - .../place/.../!3d47.918!4d106.917                (place-detail data)
     - https://maps.google.com/?q=47.918,106.917        (q= query param)
     - https://www.google.com/maps?ll=47.918,106.917    (ll= query param)
   Short links (goo.gl/maps, maps.app.goo.gl) cannot be parsed client-side
   since they redirect — those need to be expanded before saving.
   ------------------------------------------------------------------------ */
function parseLatLngFromString(
  raw: string | null | undefined,
): { lat: number; lng: number } | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;

  const plainMatch = str.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (plainMatch) {
    return { lat: parseFloat(plainMatch[1]), lng: parseFloat(plainMatch[2]) };
  }

  const atMatch = str.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  const placeMatch = str.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (placeMatch) {
    return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
  }

  const qMatch = str.match(
    /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  );
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }

  return null;
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
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
      />
      <FaHeart size={16} style={{ color: C.gold }} />
      <span
        style={{
          height: 1,
          width: 40,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
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
        background: "rgba(255, 248, 245, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `0.5px solid ${C.gold}4d`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── ShimmerGold text — exact match of HTML's .shimmer-gold class ─── */
function ShimmerGold({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <style>{`
        @keyframes shimmer-anim { to { background-position: 200% center; } }
        .shimmer-gold-text {
          background: linear-gradient(90deg, #D4AF37 0%, #FFF8E1 50%, #D4AF37 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer-anim 3s linear infinite;
        }
      `}</style>
      <span className="shimmer-gold-text" style={style}>
        {children}
      </span>
    </>
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
        background: "rgba(255,248,245,0.8)",
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
          transition: "color 0.3s ease",
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
      {/* backdrop */}
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
      {/* sliding panel */}
      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 120,
          background: C.background,
          borderTop: `1px solid ${C.gold}4d`,
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 32px rgba(0,43,20,0.15)",
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
                border: `1px solid ${C.gold}33`,
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

const HERO_STOCK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn5oZgkek4iAV6h71GC-QhCepDCkhbQ93URmx38u8uY-Adz4ZhbQGYtmfV2PCvW0zgPtJATdCd7kQclvZNuBygcNXNJyATmH5522hwEh5aBuJy633v4qsZrupS6JFpkjqTuM8DKjdj9SPygqBIlgqsny3lL3Q6DYDNlkfmVopO8TBH9RIWjXi-Bcbds5HLC1btsg0Qu7ixUTtgA113YLN6PeIfabXS0_b3YTBAY5wUJtGJbCa4bvE";

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
          <img
            src={mainPhotoUrl || HERO_STOCK_IMAGE}
            alt="Негізгі сурет"
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(0.85)",
              display: "block",
              border: "none",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${C.background}, transparent 65%)`,
              opacity: 0.95,
            }}
          />
        </div>
        <Reveal
          className="relative z-10 text-center"
          style={{ padding: "0 5vw" }}
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
              fontFamily: "'Playfair Display', serif",
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
                fontFamily: "'EB Garamond', serif",
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
                fontFamily: "'EB Garamond', serif",
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
        <BsStars size={26} style={{ color: C.gold, marginTop: 8 }} />
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
                fontFamily: "'Playfair Display', serif",
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
                fontFamily: "'Playfair Display', serif",
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
                borderRadius: 8,
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

/* ------------------------------------------------------------------------
   Date / time summary cards — unchanged from before, still using T2 tokens
   ------------------------------------------------------------------------ */
function DateTimeCards({
  date,
  time,
}: {
  date: string | null;
  time: string | null;
}) {
  const { t } = useLang();
  if (!date && !time) return null;

  return (
    <div className="flex flex-col gap-6">
      {date && (
        <Reveal>
          <GlassCard
            className="p-6 text-center flex flex-col items-center"
            style={{ border: `1px solid ${C.secondary}4d` }}
          >
            <MdOutlineCalendarMonth
              size={38}
              style={{ color: C.secondary, marginBottom: 12 }}
            />
            <h5 style={{ ...F_LABEL_CAPS, color: C.primary, marginBottom: 10 }}>
              {t.dateLabel}
            </h5>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 19,
                lineHeight: 1.4,
                fontWeight: 500,
                color: C.primary,
                margin: 0,
              }}
            >
              {date}
            </p>
          </GlassCard>
        </Reveal>
      )}
      {time && (
        <Reveal>
          <GlassCard
            className="p-6 text-center flex flex-col items-center"
            style={{ border: `1px solid ${C.secondary}4d` }}
          >
            <MdOutlineSchedule
              size={38}
              style={{ color: C.secondary, marginBottom: 12 }}
            />
            <h5 style={{ ...F_LABEL_CAPS, color: C.primary, marginBottom: 10 }}>
              {t.timeLabel}
            </h5>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 19,
                lineHeight: 1.4,
                fontWeight: 500,
                color: C.primary,
                margin: 0,
              }}
            >
              {t.atTime(time)}
            </p>
          </GlassCard>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------
   VenueCard — restyled to match Template1's VenueSection layout:
   a single glass card with a photo banner on top, then the venue name,
   address, embedded map and a "view on map" pill button inside the same
   card — instead of the previous plain icon + text block.
   ------------------------------------------------------------------------ */
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
  const mapsHref = latitude || "https://maps.app.goo.gl/CFuAhiAHpKMHssta9";
  return (
    <Reveal style={{ marginTop: 32 }}>
      <GlassCard
        style={{
          overflow: "hidden",
          border: `1px solid ${C.secondary}4d`,
        }}
      >
        <div
          className="w-full relative"
          style={{ padding: "20px 20px 0", background: C.surfaceContainerLow }}
        >
          <div
            className="w-full h-56 relative overflow-hidden"
            style={{
              borderRadius: 16,
              border: `1px solid ${C.gold}4d`,
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
            <FaStar size={14} style={{ color: C.gold }} />
            <h5 style={{ ...F_LABEL_CAPS, color: C.primary, margin: 0 }}>
              {t.venueLabel}
            </h5>
          </div>

          {venueName && (
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
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

          <div style={{ marginBottom: 20 }}>
            <GoogleMapEmbed
              address={venueAddress || undefined}
              latitude={latitude}
              longitude={longitude}
              accentColor={C.primary}
              height={200}
            />
          </div>

          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
              style={{
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

/* ------------------------------------------------------------------------
   ExtraInfoCard — the "extras" list, now boxed in its own glass card with
   an icon + uppercase title header, matching Template1's info card.
   ------------------------------------------------------------------------ */
function ExtraInfoCard({ extras }: { extras: (string | null | undefined)[] }) {
  const { t } = useLang();
  const clean = extras.filter(Boolean) as string[];
  if (clean.length === 0) return null;

  return (
    <Reveal style={{ marginTop: 24 }}>
      <GlassCard style={{ padding: 28, border: `1px solid ${C.secondary}4d` }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <FaInfoCircle size={15} style={{ color: C.gold }} />
          <h5 style={{ ...F_LABEL_CAPS, color: C.primary, margin: 0 }}>
            {t.extraInfoTitle}
          </h5>
        </div>
        <div className="flex flex-col gap-3">
          {clean.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <FaStar
                size={13}
                style={{ color: C.gold, marginTop: 5, flexShrink: 0 }}
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
  date,
  time,
  venueName,
  venueAddress,
  extras,
  photo5Url,
  latitude,
  longitude,
}: {
  date: string | null;
  time: string | null;
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
      <DateTimeCards date={date} time={time} />

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
              fontFamily: "'Playfair Display', serif",
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
            className={`grid gap-3 ${
              hasPhoto3 && hasPhoto4 ? "grid-cols-2" : "grid-cols-1"
            }`}
            style={{ marginTop: 32 }}
          >
            {hasPhoto3 && (
              <div
                className="h-72"
                style={{
                  borderRadius: 8,
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
                  borderRadius: 8,
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
              lightColor="#f7f0dc"
              lang={lang}
            />
          </div>
          <div
            style={{ borderTop: `1px solid ${C.secondary}22`, paddingTop: 40 }}
          >
            <MessageSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor="#f7f0dc"
              borderColor="border-amber-100"
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
      className="flex flex-col items-center text-center footer-gradient-bg"
      style={{
        gap: 32,
        padding: "4rem 5vw",
        color: C.secondaryFixed,
      }}
    >
      <style>{`
        @keyframes footer-gradient-move {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .footer-gradient-bg {
          background: linear-gradient(
            120deg,
            ${C.primary} 0%,
            ${C.primaryContainer} 35%,
            #2a1f00 60%,
            ${C.primary} 100%
          );
          background-size: 300% 300%;
          animation: footer-gradient-move 10s ease-in-out infinite;
        }
      `}</style>
      <div style={{ maxWidth: 420 }}>
        <p
          style={{
            ...F_BODY_LG,
            fontStyle: "italic",
            color: "rgba(255,224,136,0.9)",
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
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            }}
          />
          <FaHeart style={{ color: C.secondaryFixedDim }} />
          <span
            style={{
              height: 1,
              width: "100%",
              maxWidth: 60,
              opacity: 0.3,
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            }}
          />
        </div>
        <ShimmerGold
          style={{ ...F_HEADLINE_MD, fontStyle: "italic", fontWeight: 700 }}
        >
          {maleName} &amp; {femaleName}
        </ShimmerGold>
      </div>
      <p
        style={{
          ...F_LABEL_CAPS,
          fontSize: 10,
          color: "rgba(255,224,136,0.5)",
          letterSpacing: "0.2em",
        }}
      >
        © {new Date().getFullYear()} {maleName.toUpperCase()} &amp;{" "}
        {femaleName.toUpperCase()}. {t.builtWithLove}
      </p>
    </footer>
  );
}

/* ─── GlobalStyles ─── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@400;600&display=swap');
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
      style={{
        background: "#000000",
        zIndex: 9999,
      }}
    >
      <div className="text-center px-6">
        <FaLock
          size={40}
          style={{ color: "#ffffff", opacity: 0.7, marginBottom: 16 }}
        />
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
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
   MAIN
   ───────────────────────────────────────────────────────────── */
export default function Template2({
  wedding,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = T2_TRANSLATIONS[lang];
  const toggleLang = () => setLang((prev) => (prev === "kk" ? "mn" : "kk"));

  const isoDate = wedding.wedding_date || null;
  const dateObj = isoDate ? new Date(isoDate) : null;
  const months = lang === "mn" ? MON_MONTHS : KAZ_MONTHS;
  const date =
    dateObj && !Number.isNaN(dateObj.getTime())
      ? `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
      : null;
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

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

  // latitude талбарт Google Maps URL (эсвэл "lat,lng" мөр) орсон эсэхийг
  // шалгаад тэндээс, эсвэл хуучин тоон талбаруудаас (backward compatible)
  // бодит координатыг гаргаж авна.

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
          fontFamily: "'EB Garamond', serif",
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
          date={date}
          time={time}
          venueName={venueNameText}
          venueAddress={venueAddressText}
          extras={extras}
          photo5Url={venuePhoto}
          latitude={wedding.latitude}
          longitude={wedding.longitude}
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
