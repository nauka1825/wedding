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
              className="snap-center flex-shrink-0"
              style={{
                minWidth: 280,
                height: 400,
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${C.secondary}1a`,
              }}
            >
              <img
                src={url}
                alt={`сурет ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ display: "block", border: "none" }}
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
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
  latitude?: number | null;
  longitude?: number | null;
}) {
  const { t } = useLang();

  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  const mapsHref = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : venueAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          venueAddress,
        )}`
      : null;

  return (
    <section
      id="section-details"
      style={{ background: C.background, padding: "3rem 5vw" }}
    >
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
              <h5
                style={{ ...F_LABEL_CAPS, color: C.primary, marginBottom: 10 }}
              >
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
              <h5
                style={{ ...F_LABEL_CAPS, color: C.primary, marginBottom: 10 }}
              >
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

      {(venueName || venueAddress) && (
        <Reveal className="text-center" style={{ marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FaStar size={26} style={{ color: C.secondary }} />
          </div>
          <h5
            style={{ ...F_LABEL_CAPS, color: C.primary, margin: "16px 0 8px" }}
          >
            {t.venueLabel}
          </h5>
          {venueName && (
            <p
              style={{
                ...F_BODY_LG,
                color: C.primary,
                fontWeight: 500,
                margin: 0,
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
              }}
            >
              {venueAddress}
            </p>
          )}

          {hasCoords && (
            <div
              style={{
                marginTop: 24,
                maxWidth: 480,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <GoogleMapEmbed
                address={venueAddress || undefined}
                latitude={latitude}
                longitude={longitude}
                accentColor={C.primary}
                height={200}
              />
            </div>
          )}

          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 24,
                padding: "12px 32px",
                background: C.primary,
                color: C.secondaryFixed,
                border: `1px solid ${C.secondary}`,
                ...F_LABEL_CAPS,
                cursor: "pointer",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.onPrimaryFixedVariant)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = C.primary)
              }
            >
              {t.viewOnMap}
            </a>
          ) : (
            <button
              disabled
              style={{
                marginTop: 24,
                padding: "12px 32px",
                background: C.primary,
                color: C.secondaryFixed,
                border: `1px solid ${C.secondary}`,
                opacity: 0.6,
                ...F_LABEL_CAPS,
              }}
            >
              {t.viewOnMap}
            </button>
          )}
        </Reveal>
      )}

      {extras.length > 0 && (
        <Reveal
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {extras.map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-3"
              style={{ maxWidth: 640, margin: "0 auto" }}
            >
              <FaStar
                size={16}
                style={{ color: C.gold, marginTop: 5, flexShrink: 0 }}
              />
              <p style={{ ...F_BODY_LG, color: C.onSurfaceVariant, margin: 0 }}>
                {e}
              </p>
            </div>
          ))}
        </Reveal>
      )}

      {photo5Url && (
        <Reveal style={{ marginTop: 40, overflow: "hidden" }}>
          <img
            src={photo5Url}
            alt="Қосымша сурет"
            className="w-full"
            style={{ display: "block", border: "none", borderRadius: 4 }}
          />
        </Reveal>
      )}
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

  // Only hide the whole section when there's truly nothing to show —
  // previously this returned null whenever description2 (the poem) was
  // empty, which also hid photo3/photo4/links even when those were set.
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

  const latitude = (wedding as any).latitude ?? null;
  const longitude = (wedding as any).longitude ?? null;

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
          photo5Url={wedding.photo5_url}
          latitude={latitude}
          longitude={longitude}
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
