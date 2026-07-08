"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicMan from "../MusicMan";
import RSVPSection from "../RSVPSection";
import GoogleMapEmbed from "../GoogleMapEmbed";
import Template2Music from "../template2Music";

const C = {
  primary: "#602846",
  primaryContainer: "#7b3f5e",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#feb0d4",
  secondary: "#745664",
  secondaryContainer: "#fdd5e6",
  onSecondaryContainer: "#785a68",
  tertiary: "#443a35",
  surface: "#fff8f2",
  surfaceDim: "#dfd9d3",
  surfaceBright: "#fff8f2",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f9f2ec",
  surfaceContainer: "#f3ede7",
  surfaceContainerHigh: "#eee7e1",
  surfaceContainerHighest: "#e8e1dc",
  surfaceVariant: "#e8e1dc",
  onSurface: "#1e1b18",
  onSurfaceVariant: "#514348",
  outline: "#837379",
  outlineVariant: "#d5c2c8",
  background: "#fff8f2",
};

const HEADLINE = "'Playfair Display', Georgia, serif";
const BODY = "'Montserrat', sans-serif";

const DEFAULTS = {
  maleName: "Арман",
  femaleName: "Аружан",
  isoDate: "2024-06-15T19:00",

  maleParents: "Болат & Сәуле",
  femaleParents: "Қайрат & Гүлнар",
  venueName: `"Sky" palace`,
  venueAddress: "Баян-Өлгий,",
};

/* ======================================================================
   BILINGUAL SUPPORT (Kazakh / Mongolian)
   ====================================================================== */
export type Lang = "kk" | "mn";

interface TranslationSet {
  langButtonLabel: string;
  tagline: string;
  monthsCaps: string[];
  daysFull: string[];
  organizerLabel: string;
  eventDetailsTitle: string;
  extraInfoTitle: string;
  viewOnMap: string;
  ourStory: string;
  rsvpTitle: string;
  rsvpSubtitle: string;
  wishesTitle: string;
  footerPoem: string[];
  paymentLocked: string;
  nav: {
    love: string;
    gallery: string;
    event: string;
    venue: string;
    rsvp: string;
  };
}

const TRANSLATIONS: Record<Lang, TranslationSet> = {
  kk: {
    langButtonLabel: "ҚАЗ",
    tagline: "Бірге болуға серт бердік",
    monthsCaps: [
      "ҚАҢТАР",
      "АҚПАН",
      "НАУРЫЗ",
      "СӘУІР",
      "МАМЫР",
      "МАУСЫМ",
      "ШІЛДЕ",
      "ТАМЫЗ",
      "ҚЫРКҮЙЕК",
      "ҚАЗАН",
      "ҚАРАША",
      "ЖЕЛТОҚСАН",
    ],
    daysFull: [
      "ЖЕКСЕНБІ",
      "ДҮЙСЕНБІ",
      "СЕЙСЕНБІ",
      "СӘРСЕНБІ",
      "БЕЙСЕНБІ",
      "ЖҰМА",
      "СЕНБІ",
    ],
    organizerLabel: "ТОЙ ИЕЛЕРІ:",
    eventDetailsTitle: "Мерекелік мәліметтер",
    extraInfoTitle: "ҚОСЫМША АҚПАРАТ",
    viewOnMap: "КАРТАДАН КӨРУ",
    ourStory: "Біздің хикаямыз",
    rsvpTitle: "Тойға келетініңізді растаңыз",
    rsvpSubtitle: "Өтініш, жауабыңызды алдын ала беріңіз",
    wishesTitle: "Тілектер мен лебіздер",
    footerPoem: [
      "Біз екеуміз тек екеуміз",
      "Жүректермен бір екенбіз",
      "Мен сен үшін сен мен үшін",
      "Жаралған екенбіз",
    ],
    paymentLocked: "Төлем төленбеген",
    nav: {
      love: "Love",
      gallery: "Gallery",
      event: "Event",
      venue: "Venue",
      rsvp: "RSVP",
    },
  },
  mn: {
    langButtonLabel: "МОН",
    tagline: "Хамт байхаар амлалт өглөө",
    monthsCaps: [
      "НЭГДҮГЭЭР САР",
      "ХОЁРДУГААР САР",
      "ГУРАВДУГААР САР",
      "ДӨРӨВДҮГЭЭР САР",
      "ТАВДУГААР САР",
      "ЗУРГАДУГААР САР",
      "ДОЛДУГААР САР",
      "НАЙМДУГААР САР",
      "ЕСДҮГЭЭР САР",
      "АРАВДУГААР САР",
      "АРВАН НЭГДҮГЭЭР САР",
      "АРВАН ХОЁРДУГААР САР",
    ],
    daysFull: ["НЯМ", "ДАВАА", "МЯГМАР", "ЛХАГВА", "ПҮРЭВ", "БААСАН", "БЯМБА"],
    organizerLabel: "ХУРИМЫН ЭЗЭД:",
    eventDetailsTitle: "Баярын дэлгэрэнгүй мэдээлэл",
    extraInfoTitle: "НЭМЭЛТ МЭДЭЭЛЭЛ",
    viewOnMap: "ГАЗРЫН ЗУРГААС ХАРАХ",
    ourStory: "Бидний түүх",
    rsvpTitle: "Хуримд ирэхээ баталгаажуулна уу",
    rsvpSubtitle: "Хариугаа урьдчилан мэдэгдэнэ үү",
    wishesTitle: "Ерөөл хүсэлтүүд",
    footerPoem: [
      "Чамд дурла гэж заяа минь намайг хөтөлсөн",
      "Чамайг хайрла гэж хорвоо надад тушаасан",
      "Хамгаас илүү гэж бурхан надад шивнэсэн",
      "Хайрлаж явья гэж харин би өөрөө шийдсэн",
    ],
    paymentLocked: "Төлбөр төлөгдөөгүй",
    nav: {
      love: "Хайр",
      gallery: "Цомог",
      event: "Ёслол",
      venue: "Байршил",
      rsvp: "RSVP",
    },
  },
};

const LangContext = createContext<{
  lang: Lang;
  t: TranslationSet;
  toggleLang: () => void;
}>({
  lang: "kk",
  t: TRANSLATIONS.kk,
  toggleLang: () => {},
});

function useLang() {
  return useContext(LangContext);
}

/* Small fixed-position pill for switching between Kazakh / Mongolian */
function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-[60] flex items-center gap-1 rounded-full px-3 py-1.5 transition-transform active:scale-95"
      style={{
        background: "rgba(255,248,242,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${C.outlineVariant}`,
        boxShadow: "0 6px 16px rgba(96,40,70,0.15)",
        fontFamily: BODY,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: C.primary,
      }}
      aria-label="Switch language / Хэл сэлгэх"
    >
      <span style={{ opacity: lang === "kk" ? 1 : 0.4 }}>ҚАЗ</span>
      <span style={{ opacity: 0.35 }}>/</span>
      <span style={{ opacity: lang === "mn" ? 1 : 0.4 }}>МОН</span>
    </button>
  );
}

/* ======================================================================
   Shared hooks / small helpers
   ====================================================================== */
function useInView(threshold = 0.15) {
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
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const { ref, visible } = useInView(0.12);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Icon({
  name,
  size = 24,
  filled = false,
  className = "",
  style = {},
}: {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
        ...style,
      }}
    >
      {name}
    </span>
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
        background: "rgba(255,248,242,0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(196,160,176,0.2)",
        borderRadius: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <div className="h-px w-12" style={{ background: C.outlineVariant }} />
      <Icon name="all_inclusive" style={{ color: C.secondary, opacity: 0.5 }} />
      <div className="h-px w-12" style={{ background: C.outlineVariant }} />
    </div>
  );
}

function formatKazDate(iso: string, t: TranslationSet) {
  const d = new Date(iso);
  return `${t.monthsCaps[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------------
   HTML-entity decode + multiline text renderer.
   Form fields (organizer / description1 / description2) are stored with
   raw entities like "&amp;" and with "\n" line breaks from a <textarea>.
   These helpers decode the entities and reproduce the line breaks exactly
   as they were typed.
   ------------------------------------------------------------------------ */
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

function FloatingPetals() {
  const [petals, setPetals] = useState<
    {
      id: number;
      left: number;
      size: number;
      duration: number;
      opacity: number;
      symbol: string;
    }[]
  >([]);
  const idRef = useRef(0);
  const symbols = ["🌸", "✨", "🍃", "❤️"];

  useEffect(() => {
    const interval = setInterval(() => {
      idRef.current += 1;
      const id = idRef.current;
      const petal = {
        id,
        left: Math.random() * 100,
        size: Math.random() * 10 + 10,
        duration: Math.random() * 3 + 5,
        opacity: Math.random(),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      };
      setPetals((prev) => [...prev.slice(-24), petal]);
      setTimeout(() => {
        setPetals((prev) => prev.filter((p) => p.id !== id));
      }, 8000);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <style>{`
        @keyframes petal-fall-t1 {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: var(--op, 0.8); }
          90% { opacity: var(--op, 0.8); }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}vw`,
            fontSize: p.size,
            top: 0,
            ["--op" as any]: p.opacity,
            animation: `petal-fall-t1 ${p.duration}s linear forwards`,
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
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
    <svg viewBox="0 0 120 120" width="112" height="112">
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

/* ======================================================================
   Section 1 — HERO
   ====================================================================== */
function Hero({
  mainPhoto,
  maleName,
  femaleName,
  dateLabel,
}: {
  mainPhoto: string | null;
  maleName: string;
  femaleName: string;
  dateLabel: string;
}) {
  const { t } = useLang();
  return (
    <header
      id="love"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {mainPhoto ? (
          <div
            className="w-full h-full bg-cover bg-center scale-105"
            style={{ backgroundImage: `url('${mainPhoto}')` }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.secondaryContainer} 0%, ${C.surface} 55%, ${C.primaryContainer}22 100%)`,
            }}
          >
            <Icon
              name=""
              size={72}
              filled
              style={{ color: C.primaryContainer, opacity: 0.25 }}
            />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${C.primary}33 0%, transparent 45%, ${C.background} 100%)`,
          }}
        />
      </div>

      <FloatingPetals />

      <div className="relative z-20 text-center px-6">
        <div
          className="mb-4 inline-block"
          style={{ animation: "rotate-slow-t1 20s linear infinite" }}
        >
          <Icon
            name="filter_vintage"
            size={44}
            style={{ color: C.secondary, opacity: 0.4 }}
          />
        </div>
        <h1
          className="leading-tight mb-2"
          style={{
            fontFamily: HEADLINE,
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 10vw, 3.4rem)",
            background: `linear-gradient(90deg, ${C.primary} 0%, #C4A0B0 50%, ${C.primary} 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer-t1 4s linear infinite",
          }}
        >
          {maleName} &amp; {femaleName}
        </h1>
        <p
          className="italic mb-8"
          style={{ fontFamily: HEADLINE, fontSize: 20, color: C.primary }}
        >
          {t.tagline}
        </p>
        <div className="mt-8">
          <span
            style={{
              fontFamily: BODY,
              fontSize: 12,
              letterSpacing: "0.3em",
              fontWeight: 600,
              color: C.secondary,
            }}
          >
            {dateLabel}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes shimmer-t1 { to { background-position: 200% center; } }
        @keyframes rotate-slow-t1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </header>
  );
}

/* ======================================================================
   Section 2 — INVITATION TEXT
   Only rendered when description1 (the "invitation speech") is present.
   ====================================================================== */
function InvitationText({ body }: { body: string | null }) {
  if (!body) return null;

  return (
    <section
      className="py-16 px-6 text-center relative"
      style={{ background: C.surfaceContainerLow }}
    >
      <Reveal className="max-w-lg mx-auto">
        <Icon name="favorite" filled style={{ color: C.primary }} />
        <div className="mb-10">
          <MultilineText
            text={body}
            style={{
              fontFamily: HEADLINE,
              fontSize: 14,
              color: C.onSurfaceVariant,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          />
        </div>
        <SectionEyebrow label="" />
      </Reveal>
    </section>
  );
}

/* ======================================================================
   Section 3 — PARENTS + EVENT BENTO
   ====================================================================== */
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
    <GlassCard
      style={{
        padding: 0,
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* spiral-binding holes, like a hanging tear-off calendar page */}
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
      {/* month banner */}
      <div style={{ background: C.primary, paddingBottom: 10 }}>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 12,
            letterSpacing: "0.15em",
            fontWeight: 700,
            color: C.onPrimary,
            textAlign: "center",
            margin: 0,
          }}
        >
          {monthCaps}
        </p>
      </div>
      {/* torn edge under the banner */}
      <div
        style={{
          height: 6,
          background: `repeating-linear-gradient(90deg, ${C.primary} 0 6px, transparent 6px 12px)`,
        }}
      />
      <div
        className="flex flex-col items-center justify-center"
        style={{ padding: "18px 12px 20px" }}
      >
        <p
          style={{
            fontFamily: HEADLINE,
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1,
            color: C.primary,
            margin: 0,
          }}
        >
          {day}
        </p>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 12,
            letterSpacing: "0.15em",
            fontWeight: 600,
            color: C.secondary,
            marginTop: 8,
          }}
        >
          {dayCaps}
        </p>
      </div>
    </GlassCard>
  );
}

function ParentsAndEventBento({
  organizerText,
  isoDate,
}: {
  organizerText: string;
  isoDate: string | null;
}) {
  const { t } = useLang();
  const d = isoDate ? new Date(isoDate) : new Date(DEFAULTS.isoDate);
  const time = isoDate ? formatTime(isoDate) : formatTime(DEFAULTS.isoDate);
  const monthCaps = t.monthsCaps[d.getMonth()];
  const dayCaps = t.daysFull[d.getDay()];

  return (
    <section
      id="event"
      className="py-16 px-6 relative"
      style={{ background: C.background }}
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* Parents / organizer card — shows exactly what was typed */}
        <Reveal>
          <GlassCard style={{ padding: 32 }}>
            <div className="flex flex-col items-center">
              <Icon
                name="family_history"
                size={30}
                style={{ color: C.primary, marginBottom: 12 }}
              />
              <h3
                className="mb-4"
                style={{
                  fontFamily: BODY,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  color: C.secondary,
                }}
              >
                {t.organizerLabel}
              </h3>
              <div className="text-center">
                <MultilineText
                  text={organizerText}
                  style={{
                    fontFamily: HEADLINE,
                    fontWeight: 600,
                    fontSize: 15,
                    color: C.onSurface,
                    whiteSpace: "pre-wrap",
                  }}
                />
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Calendar + clock */}
        <div className="grid grid-cols-2 gap-6">
          <Reveal delay={0.05}>
            <CalendarDayCard
              monthCaps={monthCaps}
              day={d.getDate()}
              dayCaps={dayCaps}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <GlassCard
              className="flex flex-col items-center justify-center"
              style={{ padding: 24, height: "100%" }}
            >
              <AnalogClock time={time} />
              <p
                style={{
                  fontFamily: BODY,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  color: C.secondary,
                  marginTop: 8,
                }}
              >
                {time}
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ======================================================================
   Section 4 — VENUE (+ Google Map)
   ====================================================================== */
function VenueSection({
  venueName,
  venueAddress,
  photo,
  extras,
  latitude,
  longitude,
}: {
  venueName: string;
  venueAddress: string;
  photo: string | null;
  extras: string[];
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
    : null;

  return (
    <section
      id="venue"
      className="py-16 px-6 relative overflow-hidden"
      style={{ background: C.surfaceContainerHigh }}
    >
      <div className="max-w-lg mx-auto">
        <Reveal className="text-center mb-8">
          <Icon
            name="location_on"
            size={30}
            style={{ color: C.primary, marginBottom: 12 }}
          />
          <h2
            style={{
              fontFamily: HEADLINE,
              fontWeight: 600,
              fontSize: 26,
              color: C.primary,
            }}
          >
            {t.eventDetailsTitle}
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <GlassCard style={{ overflow: "hidden", marginBottom: 24 }}>
            <div className="w-full h-48 bg-cover bg-center relative">
              {photo ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${photo}')` }}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${C.secondaryContainer}, ${C.surfaceContainer})`,
                  }}
                >
                  <Icon
                    name="celebration"
                    size={40}
                    style={{ color: C.primary, opacity: 0.4 }}
                  />
                </div>
              )}
            </div>
            <div style={{ padding: 32 }}>
              <h3
                style={{
                  fontFamily: HEADLINE,
                  fontWeight: 600,
                  fontSize: 22,
                  marginBottom: 8,
                  color: C.onSurface,
                }}
              >
                {venueName}
              </h3>
              <p
                style={{
                  fontFamily: BODY,
                  fontSize: 15,
                  color: C.onSurfaceVariant,
                  marginBottom: 20,
                }}
              >
                {venueAddress}
              </p>

              {hasCoords && (
                <>
                  <GoogleMapEmbed
                    address={venueAddress}
                    latitude={latitude}
                    longitude={longitude}
                    accentColor={C.primary}
                    height={200}
                    className="mb-5"
                  />

                  <a
                    href={mapsHref!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-colors"
                    style={{
                      background: C.primary,
                      color: C.onPrimary,
                      fontFamily: BODY,
                      fontSize: 12,
                      letterSpacing: "0.15em",
                      fontWeight: 600,
                      boxShadow: `0 10px 25px -5px ${C.primary}33`,
                    }}
                  >
                    <Icon name="directions" size={16} />
                    {t.viewOnMap}
                  </a>
                </>
              )}
            </div>
          </GlassCard>
        </Reveal>

        {extras.length > 0 && (
          <Reveal delay={0.1}>
            <GlassCard style={{ padding: 28 }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="info" style={{ color: C.primary }} />
                <h3
                  style={{
                    fontFamily: BODY,
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                    color: C.secondary,
                  }}
                >
                  {t.extraInfoTitle}
                </h3>
              </div>
              <div className="space-y-3">
                {extras.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon
                        name="auto_awesome"
                        size={16}
                        filled
                        style={{ color: C.primary }}
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: BODY,
                        fontSize: 14,
                        color: C.onSurfaceVariant,
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
        )}
      </div>
    </section>
  );
}

/* ======================================================================
   Section 5 — GALLERY BENTO
   All images except the last one scroll horizontally as a swiper; the
   last image is shown large, full-width, below the swiper.
   ====================================================================== */
function GalleryBento({ images }: { images: string[] }) {
  const { t } = useLang();
  const last = images.length > 0 ? images[images.length - 1] : null;
  const rest = images.length > 1 ? images.slice(0, -1) : [];
  const isEmpty = images.length === 0;

  return (
    <section
      id="gallery"
      className="py-16 px-6"
      style={{ background: C.background }}
    >
      <div className="max-w-lg mx-auto">
        <Reveal>
          <h2
            className="text-center mb-10"
            style={{
              fontFamily: HEADLINE,
              fontWeight: 600,
              fontSize: 26,
              color: C.primary,
            }}
          >
            {t.ourStory}
          </h2>
        </Reveal>

        {isEmpty && (
          <Reveal>
            <div
              className="w-full h-64 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(160deg, ${C.secondaryContainer}, ${C.surfaceContainer})`,
              }}
            >
              <Icon
                name="photo_library"
                size={34}
                style={{ color: C.primary, opacity: 0.35 }}
              />
            </div>
          </Reveal>
        )}

        {rest.length > 0 && (
          <Reveal>
            <div
              className="flex gap-3 overflow-x-auto pb-3 mb-3 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {rest.map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-56 h-64 rounded-xl bg-cover bg-center snap-start"
                  style={{ backgroundImage: `url('${src}')` }}
                />
              ))}
            </div>
          </Reveal>
        )}

        {last && (
          <Reveal delay={0.12}>
            <div
              className="w-full h-80 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url('${last}')` }}
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ======================================================================
   Section 5b — POEM + COUPLE PHOTOS
   Shown only when description2 (the poem/verse) is present. Below the
   poem, photo3_url / photo4_url appear in a grid (when present), and
   below that, link1 / link2 appear as Instagram-style buttons.
   ====================================================================== */
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
  if (!poem) return null;

  const hasPhoto3 = Boolean(photo3);
  const hasPhoto4 = Boolean(photo4);
  const hasPhotos = hasPhoto3 || hasPhoto4;
  const hasLinks = Boolean(link1) || Boolean(link2);

  return (
    <section
      className="py-16 px-6"
      style={{ background: C.surfaceContainerLow }}
    >
      <div className="max-w-lg mx-auto text-center">
        <Reveal>
          <Icon
            name="auto_stories"
            style={{ color: C.primary, marginBottom: 12 }}
          />
          <div className="mb-2">
            <MultilineText
              text={poem}
              style={{
                fontFamily: HEADLINE,
                fontStyle: "italic",
                fontSize: 16,
                color: C.onSurfaceVariant,
                lineHeight: 1.9,
                whiteSpace: "pre-wrap",
              }}
            />
          </div>
        </Reveal>

        {hasPhotos && (
          <Reveal delay={0.08}>
            <div
              className={`grid gap-3 mt-8 ${
                hasPhoto3 && hasPhoto4 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {hasPhoto3 && (
                <div
                  className="h-72 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${photo3}')` }}
                />
              )}
              {hasPhoto4 && (
                <div
                  className="h-72 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${photo4}')` }}
                />
              )}
            </div>
          </Reveal>
        )}

        {hasLinks && (
          <Reveal delay={0.14}>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              {link1 && (
                <a
                  href={link1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
                  style={{
                    background: C.primary,
                    color: C.onPrimary,
                    fontFamily: BODY,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    boxShadow: `0 10px 25px -5px ${C.primary}33`,
                  }}
                >
                  <Icon name="photo_camera" size={16} />
                  Instagram
                </a>
              )}
              {link2 && (
                <a
                  href={link2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
                  style={{
                    background: C.primary,
                    color: C.onPrimary,
                    fontFamily: BODY,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    boxShadow: `0 10px 25px -5px ${C.primary}33`,
                  }}
                >
                  <Icon name="photo_camera" size={16} />
                  Instagram
                </a>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ======================================================================
   Section 6 — RSVP  (wraps the existing <RSVPSection/> — untouched)
   ====================================================================== */
function RsvpWrapper({ weddingId }: { weddingId: string }) {
  const { t, lang } = useLang();
  return (
    <section
      id="rsvp"
      className="py-16 px-6 pb-32"
      style={{ background: C.surfaceContainerHighest }}
    >
      <div className="max-w-lg mx-auto">
        <Reveal className="text-center mb-8">
          <Icon
            name="edit_note"
            size={34}
            style={{ color: C.primary, marginBottom: 12 }}
          />
          <h2
            style={{
              fontFamily: HEADLINE,
              fontWeight: 600,
              fontSize: 26,
              color: C.primary,
              marginBottom: 8,
            }}
          >
            {t.rsvpTitle}
          </h2>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 13,
              color: C.onSurfaceVariant,
            }}
          >
            {t.rsvpSubtitle}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <GlassCard style={{ padding: 32 }}>
            <RSVPSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor={C.surfaceContainerLow}
              lang={lang}
            />
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ======================================================================
   Section 7 — WISHES / COMMENTS (wraps <MessageSection/> — untouched)
   ====================================================================== */
function WishesWrapper({ weddingId }: { weddingId: string }) {
  const { t, lang } = useLang();
  return (
    <section
      id="comments"
      className="py-16 px-6 relative"
      style={{ background: C.background }}
    >
      <div className="max-w-lg mx-auto">
        <Reveal className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12"
              fill={C.primary}
              style={{ opacity: 0.4 }}
              viewBox="0 0 100 100"
            >
              <path d="M50 10 C60 30 90 40 90 50 C90 60 60 70 50 90 C40 70 10 60 10 50 C10 40 40 30 50 10" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: HEADLINE,
              fontWeight: 600,
              fontSize: 26,
              color: C.primary,
              letterSpacing: "0.02em",
            }}
          >
            {t.wishesTitle}
          </h2>
          <div
            className="h-px w-24 mx-auto mt-4"
            style={{
              background: `linear-gradient(to right, transparent, ${C.primary}4d, transparent)`,
            }}
          />
        </Reveal>
        <Reveal delay={0.08}>
          <GlassCard style={{ padding: 32 }}>
            <MessageSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor={C.surfaceContainerLow}
              borderColor="border-[#d5c2c8]"
              lang={lang}
            />
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ======================================================================
   Footer helpers — GoldDivider, FloralDots
   ====================================================================== */
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1 max-w-[60px]"
        style={{
          background: `linear-gradient(to right, transparent, ${C.primary}66)`,
        }}
      />
      <Icon
        name="filter_vintage"
        size={18}
        style={{ color: C.primary, opacity: 0.6 }}
      />
      <div
        className="h-px flex-1 max-w-[60px]"
        style={{
          background: `linear-gradient(to left, transparent, ${C.primary}66)`,
        }}
      />
    </div>
  );
}

function FloralDots() {
  return (
    <div className="flex items-center justify-center gap-2 my-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: i === 1 ? 6 : 4,
            height: i === 1 ? 6 : 4,
            borderRadius: "50%",
            background: C.secondary,
            opacity: i === 1 ? 0.6 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

/* ======================================================================
   Section 8 — FOOTER (poem + floating hearts)
   ====================================================================== */
function Footer({
  maleName,
  femaleName,
  dateLabel,
}: {
  maleName: string;
  femaleName: string;
  dateLabel: string;
}) {
  const { t } = useLang();
  const poem = t.footerPoem;

  return (
    <div
      className="text-center py-12 mt-4"
      style={{
        position: "relative",
        overflow: "hidden",
        background: C.background,
      }}
    >
      <style>{`
        @keyframes floatHeart-t1 {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-320px) scale(0.6); opacity: 0; }
        }
        @keyframes shimmer-gold-t1 { to { background-position: 200% center; } }
        .shimmer-gold-t1 {
          background: linear-gradient(90deg, ${C.primary} 0%, #C4A0B0 50%, ${C.primary} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-gold-t1 4s linear infinite;
        }
      `}</style>

      <Reveal>
        <GoldDivider className="mb-5 mx-8" />

        {poem.map((line, i) => (
          <p
            key={i}
            className={i === 0 ? "mt-4" : "mt-2"}
            style={{
              fontSize: 16,
              fontFamily: HEADLINE,
              fontStyle: "italic",
              color: C.onSurfaceVariant,
            }}
          >
            {line}
          </p>
        ))}

        <FloralDots />

        <p
          className="shimmer-gold-t1 uppercase mt-4"
          style={{
            fontSize: 18,
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: "0.4em",
          }}
        >
          {maleName} &amp; {femaleName}
        </p>

        {dateLabel && (
          <p
            className="mt-2"
            style={{
              fontSize: 14,
              fontFamily: BODY,
              letterSpacing: "0.24em",
              color: C.outline,
            }}
          >
            {dateLabel}
          </p>
        )}

        <div style={{ marginTop: 20 }}>
          <FloralDots />
        </div>
      </Reveal>

      {[...Array(10)].map((_, i) => (
        <Icon
          key={i}
          name="favorite"
          filled
          style={{
            position: "absolute",
            bottom: 0,
            left: `${10 + i * 15}%`,
            color: C.primary,
            opacity: 0.25,
            fontSize: 12 + ((i * 37) % 8),
            animation: `floatHeart-t1 ${4 + i}s linear infinite`,
            animationDelay: `${i * 0.8}s`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
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
        <Icon
          name="lock"
          size={40}
          style={{ color: "#ffffff", opacity: 0.7, marginBottom: 16 }}
        />
        <p
          style={{
            fontFamily: HEADLINE,
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

/* ======================================================================
   Bottom navigation — matches the reference HTML's pill-tab nav
   ====================================================================== */
function BottomNav() {
  const { t } = useLang();
  const [active, setActive] = useState("love");

  const NAV_ITEMS = [
    { id: "love", icon: "favorite", label: t.nav.love },
    { id: "gallery", icon: "photo_library", label: t.nav.gallery },
    { id: "event", icon: "calendar_today", label: t.nav.event },
    { id: "venue", icon: "location_on", label: t.nav.venue },
    { id: "rsvp", icon: "edit_note", label: t.nav.rsvp },
  ];

  useEffect(() => {
    const onScroll = () => {
      let current = "love";
      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-20 flex justify-around items-center px-4 z-50"
      style={{
        background: "rgba(255,248,242,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: `1px solid ${C.secondary}33`,
        boxShadow: "0 -4px 12px rgba(123,63,94,0.08)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      {NAV_ITEMS.map(({ id, icon, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="flex flex-col items-center justify-center transition-all duration-300"
            style={{
              color: isActive ? C.onSecondaryContainer : C.secondary,
              background: isActive ? C.secondaryContainer : "transparent",
              borderRadius: 999,
              padding: isActive ? "6px 14px" : "6px 10px",
              transform: isActive ? "scale(1.08)" : "scale(1)",
              opacity: isActive ? 1 : 0.7,
            }}
          >
            <Icon name={icon} filled={isActive} size={22} />
            <span
              style={{
                fontFamily: BODY,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

/* ======================================================================
   Global fonts (Playfair Display + Montserrat + Material Symbols) —
   loaded exactly like the reference HTML's <link> tags.
   ====================================================================== */
function GlobalFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 300,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
    `}</style>
  );
}

/* ======================================================================
   MAIN
   ====================================================================== */
export default function Template1({
  wedding,
  hideBottomNav = false,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  hideBottomNav?: boolean;
  defaultLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = TRANSLATIONS[lang];
  const toggleLang = () => setLang((prev) => (prev === "kk" ? "mn" : "kk"));

  const isoDate = wedding.wedding_date || null;
  const dateLabel = isoDate
    ? formatKazDate(isoDate, t)
    : formatKazDate(DEFAULTS.isoDate, t);

  const maleName = wedding.male_name || DEFAULTS.maleName;
  const femaleName = wedding.female_name || DEFAULTS.femaleName;

  const organizerText = wedding.organizer
    ? wedding.organizer
    : `${DEFAULTS.maleParents}\n${DEFAULTS.femaleParents}`;

  const venueName = wedding.venue_name || DEFAULTS.venueName;
  const venueAddress = wedding.venue_address || DEFAULTS.venueAddress;

  const latitude = (wedding as any).latitude ?? null;
  const longitude = (wedding as any).longitude ?? null;

  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
  ].filter(Boolean) as string[];

  // photo3_url / photo4_url are shown in their own PoemAndCoupleSection now,
  // so they're excluded from the main gallery to avoid duplication.
  const galleryImages = [...(wedding.gallery_urls || [])].filter(
    Boolean,
  ) as string[];

  const venuePhoto = wedding.photo5_url || galleryImages[0] || null;
  const isPaymentLocked = String((wedding as any).payment) === "2";

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      <div
        className="min-h-screen overflow-x-hidden"
        style={{
          background: C.background,
          color: C.onSurface,
          fontFamily: BODY,
        }}
      >
        {isPaymentLocked && <PaymentLockOverlay />}
        <GlobalFonts />
        <Template2Music extra5={wedding.extra5} />

        <LanguageToggle />

        <Hero
          mainPhoto={wedding.main_photo_url}
          maleName={maleName}
          femaleName={femaleName}
          dateLabel={dateLabel}
        />

        <InvitationText body={wedding.description1 || null} />

        <ParentsAndEventBento organizerText={organizerText} isoDate={isoDate} />

        <VenueSection
          venueName={venueName}
          venueAddress={venueAddress}
          photo={venuePhoto}
          extras={extras}
          latitude={latitude}
          longitude={longitude}
        />

        <GalleryBento images={galleryImages} />

        <PoemAndCoupleSection
          poem={wedding.description2 || null}
          photo3={wedding.photo3_url || null}
          photo4={wedding.photo4_url || null}
          link1={wedding.link1 || null}
          link2={wedding.link2 || null}
        />

        <RsvpWrapper weddingId={wedding.id} />

        <WishesWrapper weddingId={wedding.id} />

        <Footer
          maleName={maleName}
          femaleName={femaleName}
          dateLabel={dateLabel}
        />

        {!hideBottomNav && <BottomNav />}
      </div>
    </LangContext.Provider>
  );
}
