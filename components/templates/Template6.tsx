"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import RSVPSection from "../RSVPSection";
import GoogleMapEmbed from "../GoogleMapEmbed";
import Song from "../song";
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

export type Lang = "kk" | "mn";

/* ───────────────────────────────────────────────────────────
   DESIGN TOKENS — white background, neutral #171717 text,
   navy (#00416A) kept only for decorative accents/icons/CTA
   ─────────────────────────────────────────────────────────── */
const C = {
  background: "#ffffff",
  textPrimary: "#171717",
  textSecondary: "rgba(23,23,23,0.68)",
  textMuted: "rgba(23,23,23,0.5)",
  accent: "#00416A",
  accentSoft: "#3d4f7c",
  surfaceContainerLow: "#fafafa",
  surfaceContainer: "#f5f5f5",
  surfaceContainerHigh: "#efefef",
  surfaceContainerLowest: "#ffffff",
  outlineVariant: "rgba(23,23,23,0.14)",
};

const HEADLINE = "'Optima', sans-serif";
const CURSIVE = "'Monsieur La Doulaise', cursive";
const BODY = "'Optima', sans-serif";

interface T6Translations {
  nav: {
    hero: string;
    photos: string;
    details: string;
    poem: string;
    messages: string;
  };
  calendarMonths: string[];
  calendarDays: string[];
  photoWord: string;
  invitationLine1: string;
  invitationLine2: string;
  invitationConnector: string;
  invitationLine3: string;
  organizerTitle: string;
  organizerSubtitle: string;
  parentsTitle: string;
  groomSide: string;
  brideSide: string;
  timeLabel: string;
  dateLabel: string;
  venueLabel: string;
  viewOnMap: string;
  extraInfoTitle: string;
  wishesTitle: string;
  rsvpSubtitle: string;
  galleryTitle: string;
  galleryCaption: string;
  paymentLocked: string;
  footerPoem: string[];
  builtWithLove: string;
}

const T6: Record<Lang, T6Translations> = {
  kk: {
    nav: {
      hero: "Махаббат",
      photos: "Фотолар",
      details: "Мәліметтер",
      poem: "Хикая",
      messages: "Тілектер",
    },
    calendarMonths: [
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
    ],
    calendarDays: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"],
    photoWord: "сурет",
    invitationLine1:
      "Құрметті ағайын-туыс, құда-жекжат, дос-жаран, әріптестер мен көршілер!",
    invitationLine2: "Сіздерді ұлымыз",
    invitationConnector: "пен келініміз",
    invitationLine3:
      "ның үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!",
    organizerTitle: "Той иелері",
    organizerSubtitle: "Ата анасы",
    parentsTitle: "Ата-аналары",
    groomSide: "Күйеу жақ",
    brideSide: "Келін жақ",
    timeLabel: "Уақыты",
    dateLabel: "Күні",
    venueLabel: "Мекен жайымыз",
    viewOnMap: "КАРТАДАН КӨРУ",
    extraInfoTitle: "ҚОСЫМША АҚПАРАТ",
    wishesTitle: "Тілектер",
    rsvpSubtitle: "Сіздің келуіңіз біз үшін үлкен мәртебе!",
    galleryTitle: "Суреттер жиынтығы",
    galleryCaption: "❤️ Біздің махаббатымыздың естеліктері ❤️",
    paymentLocked: "Төлем төленбеген",
    footerPoem: [
      "Біз екеуміз тек екеуміз",
      "Жүректермен бір екенбіз",
      "Мен сен үшін сен мен үшін",
      "Жаралған екенбіз",
    ],
    builtWithLove: "СҮЙІСПЕНШІЛІКПЕН ЖАСАЛДЫ.",
  },
  mn: {
    nav: {
      hero: "Хайр",
      photos: "Зургууд",
      details: "Дэлгэрэнгүй",
      poem: "Түүх",
      messages: "Ерөөл",
    },
    calendarMonths: [
      "Нэгдүгээр сар",
      "Хоёрдугаар сар",
      "Гуравдугаар сар",
      "Дөрөвдүгээр сар",
      "Тавдугаар сар",
      "Зургадугаар сар",
      "Долдугаар сар",
      "Наймдугаар сар",
      "Есдүгээр сар",
      "Аравдугаар сар",
      "Арван нэгдүгээр сар",
      "Арван хоёрдугаар сар",
    ],
    calendarDays: ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"],
    photoWord: "зураг",
    invitationLine1:
      "Эрхэм хүндэт ахан дүүс, төрөл төрөгсөд, худ ураг, найз нөхөд, хамтран ажиллагсад болон хөршүүд ээ!",
    invitationLine2: "Таныг хүү",
    invitationConnector: "болон бэр",
    invitationLine3: "-ийн хуримын ёслолд хүндэт зочноор урьж байна!",
    organizerTitle: "Хурим эзэд",
    organizerSubtitle: "Эцэг эх",
    parentsTitle: "Эцэг эхчүүд",
    groomSide: "Хүргэн тал",
    brideSide: "Бэр тал",
    timeLabel: "Цаг",
    dateLabel: "Огноо",
    venueLabel: "Байршил, хаяг",
    viewOnMap: "ГАЗРЫН ЗУРГААС ХАРАХ",
    extraInfoTitle: "НЭМЭЛТ МЭДЭЭЛЭЛ",
    wishesTitle: "Ерөөл хүсэлт",
    rsvpSubtitle: "Таны ирэх нь бидний хувьд том хүндэтгэл!",
    galleryTitle: "Зургийн цомог",
    galleryCaption: "❤️ Бидний хайрын дурсамжууд ❤️",
    paymentLocked: "Төлбөр төлөгдөөгүй",
    footerPoem: [
      "Чамд дурла гэж заяа минь намайг хөтөлсөн",
      "Чамайг хайрла гэж хорвоо надад тушаасан",
      "Хамгаас илүү гэж бурхан надад шивнэсэн",
      "Хайрлаж явья гэж харин би өөрөө шийдсэн",
    ],
    builtWithLove: "ХАЙРААР БҮТЭЭВ.",
  },
};

const LangContext = createContext<{
  lang: Lang;
  t: T6Translations;
  toggleLang: () => void;
}>({
  lang: "kk",
  t: T6.kk,
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
   parseLatLngFromString — ported 1:1 from Template2/5 so all templates
   behave consistently regardless of what shape `latitude` holds.
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

function formatEventDate(
  iso: string | null | undefined,
  months: string[],
): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

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
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView(0.12);
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
}: {
  text: string | null | undefined;
  style?: React.CSSProperties;
}) {
  const decoded = decodeHtmlEntities(text);
  const lines = decoded.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <p
          key={i}
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

/* ─── Clock & calendar (unique Template6 flourishes, recolored) ─── */
function AnimatedClock({ time, visible }: { time: string; visible: boolean }) {
  const [h, m] = time.split(":").map(Number);
  const hourDeg = ((h % 12) / 12) * 360 + (m / 60) * 30;
  const minDeg = (m / 60) * 360;
  const [secDeg, setSecDeg] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const tick = () => setSecDeg((new Date().getSeconds() / 60) * 360);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      style={{ overflow: "visible" }}
    >
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="#fafafa"
        stroke={`${C.accent}66`}
        strokeWidth="0.8"
      />
      <circle
        cx="40"
        cy="40"
        r="33"
        fill="none"
        stroke={`${C.accent}26`}
        strokeWidth="0.4"
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const r1 = 28,
          r2 = i % 3 === 0 ? 24 : 26;
        return (
          <line
            key={i}
            x1={40 + r1 * Math.cos(a)}
            y1={40 + r1 * Math.sin(a)}
            x2={40 + r2 * Math.cos(a)}
            y2={40 + r2 * Math.sin(a)}
            stroke={i % 3 === 0 ? C.accent : `${C.accent}55`}
            strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
          />
        );
      })}
      <line
        x1="40"
        y1="40"
        x2={40 + 15 * Math.cos(((hourDeg - 90) * Math.PI) / 180)}
        y2={40 + 15 * Math.sin(((hourDeg - 90) * Math.PI) / 180)}
        stroke={C.accent}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 21 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={40 + 21 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke={C.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="40"
        x2={40 + 23 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={40 + 23 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke={`${C.accent}cc`}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="40" cy="40" r="2.5" fill={C.accent} />
      <circle cx="40" cy="40" r="1.2" fill="#fff" />
    </svg>
  );
}

function AnimatedCalendar({ dateStr }: { dateStr?: string | null }) {
  const { t } = useLang();
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const firstDow = (() => {
    const v = new Date(year, month, 1).getDay();
    return v === 0 ? 6 : v - 1;
  })();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ position: "relative", margin: "0 auto", maxWidth: 300 }}>
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "#ffffff",
          border: `1px solid ${C.outlineVariant}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            background: C.accent,
            padding: "14px 16px 12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: HEADLINE,
              fontSize: 14,
              letterSpacing: "0.3em",
              color: "#ffffff",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {t.calendarMonths[month]} · {year}
          </p>
        </div>
        <div
          style={{
            background: C.surfaceContainerLow,
            borderBottom: `0.5px solid ${C.outlineVariant}`,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}
          >
            {t.calendarDays.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  padding: "5px 0",
                  fontFamily: HEADLINE,
                  fontSize: 11.5,
                  color: C.textSecondary,
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "6px 8px 12px", background: "#ffffff" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 2,
              textAlign: "center",
            }}
          >
            {cells.map((cell, idx) => {
              if (!cell) return <div key={idx} />;
              const isTarget = cell === day;
              if (isTarget)
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "3px 0",
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: C.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: HEADLINE,
                          fontSize: 14,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {cell}
                      </span>
                    </div>
                  </div>
                );
              return (
                <div key={idx} style={{ padding: "4px 0" }}>
                  <span
                    style={{
                      fontFamily: HEADLINE,
                      fontSize: 14,
                      color: C.textMuted,
                    }}
                  >
                    {cell}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function GallerySwiper({ urls }: { urls: string[] }) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (child)
      el.scrollTo({
        left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
        behavior: "smooth",
      });
    setActive(i);
  };
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % urls.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
  };
  useEffect(() => {
    if (urls.length <= 1) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [urls.length]);
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.offsetWidth / 2;
    let closest = 0,
      minDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  };
  return (
    <div>
      <style>{`@keyframes t6-progress{from{width:0%}to{width:100%}}`}</style>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={resetTimer}
        onMouseDown={resetTimer}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {urls.map((url, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 overflow-hidden"
            style={{
              width: 280,
              minWidth: 280,
              maxWidth: 280,
              height: 380,
              borderRadius: 16,
              border: `1px solid ${C.outlineVariant}`,
              transition: "transform 0.35s ease, box-shadow 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.94)",
              boxShadow:
                active === i
                  ? "0 10px 30px rgba(0,0,0,0.10)"
                  : "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={url}
              alt={`${t.photoWord}-${i + 1}`}
              className="w-full h-full object-cover"
              style={{
                display: "block",
                border: "none",
                opacity: active === i ? 1 : 0.7,
                transition: "opacity 0.35s ease",
              }}
            />
          </div>
        ))}
      </div>
      {urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              className="transition-all duration-300 overflow-hidden relative"
              style={{
                width: active === i ? 22 : 6,
                height: 2,
                background: `${C.accent}44`,
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: C.accent,
                    animation: "t6-progress 5s linear forwards",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span
        style={{
          height: 1,
          width: 40,
          background: `linear-gradient(90deg, transparent, ${C.accent}66, transparent)`,
        }}
      />
      <FaHeart size={14} style={{ color: C.accent, opacity: 0.7 }} />
      <span
        style={{
          height: 1,
          width: 40,
          background: `linear-gradient(90deg, transparent, ${C.accent}66, transparent)`,
        }}
      />
    </div>
  );
}

function GlassCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        border: `1px solid ${C.outlineVariant}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ShimmerNavy({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <style>{`
        @keyframes t6-shimmer { to { background-position: 200% center; } }
        .t6-shimmer-text {
          background: linear-gradient(90deg, ${C.accent} 0%, #8fa0d6 50%, ${C.accent} 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: t6-shimmer 3s linear infinite;
        }
      `}</style>
      <span className="t6-shimmer-text" style={style}>
        {children}
      </span>
    </>
  );
}

/* ─── Header + Nav Drawer — ported structurally from Template2 ─── */
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
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${C.outlineVariant}`,
      }}
    >
      <button
        aria-label="menu"
        onClick={onMenuClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.textPrimary,
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
          fontFamily: CURSIVE,
          fontSize: 24,
          color: C.textPrimary,
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
          color: C.textPrimary,
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
          background: "rgba(0,0,0,0.35)",
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
          background: "#ffffff",
          borderTop: `1px solid ${C.outlineVariant}`,
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
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
                border: `1px solid ${C.outlineVariant}`,
                borderRadius: 12,
                cursor: "pointer",
                color: C.textPrimary,
              }}
            >
              <Icon size={18} style={{ color: C.accent }} />
              <span
                style={{
                  fontFamily: BODY,
                  fontSize: 9.5,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: C.textPrimary,
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

/* ─── Hero ─── */
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
      <div className="relative h-[62vh] w-full overflow-hidden">
        {mainPhotoUrl ? (
          <img
            src={mainPhotoUrl}
            alt="hero"
            className="w-full h-full object-cover"
            style={{ display: "block", border: "none" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: C.surfaceContainerLow }}
          >
            <FaHeart size={40} style={{ color: `${C.accent}55` }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, #ffffff 0%, transparent 55%)`,
          }}
        />
      </div>

      <Reveal
        className="text-center px-6"
        style={{ marginTop: -12, position: "relative", zIndex: 2 }}
      >
        {description1 ? (
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <MultilineText
              text={description1}
              style={{
                fontFamily: BODY,
                fontSize: 15,
                lineHeight: 1.8,
                fontStyle: "italic",
                color: C.textSecondary,
                whiteSpace: "pre-wrap",
              }}
            />
          </div>
        ) : (
          <p
            style={{
              fontFamily: HEADLINE,
              fontSize: 14,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.textSecondary,
              lineHeight: 2,
              margin: 0,
            }}
          >
            {t.invitationLine1}
          </p>
        )}

        <p
          style={{
            fontFamily: HEADLINE,
            fontSize: 14,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.textSecondary,
            margin: "12px 0 0",
          }}
        >
          {t.invitationLine2}
        </p>
        <p
          className={CURSIVE}
          style={{
            fontFamily: CURSIVE,
            color: C.textPrimary,
            fontSize: 40,
            lineHeight: 1.1,
            margin: "6px 0 2px",
          }}
        >
          {maleName}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            margin: "6px 0",
          }}
        >
          <span
            style={{
              height: 1,
              width: 28,
              background: `linear-gradient(to right, transparent, ${C.accent}66)`,
            }}
          />
          <p
            style={{
              fontFamily: HEADLINE,
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: C.textSecondary,
              margin: 0,
            }}
          >
            {t.invitationConnector}
          </p>
          <span
            style={{
              height: 1,
              width: 28,
              background: `linear-gradient(to left, transparent, ${C.accent}66)`,
            }}
          />
        </div>
        <p
          className={CURSIVE}
          style={{
            fontFamily: CURSIVE,
            color: C.textPrimary,
            fontSize: 40,
            lineHeight: 1.1,
            margin: "2px 0 12px",
          }}
        >
          {femaleName}
        </p>
        <p
          style={{
            fontFamily: HEADLINE,
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.textSecondary,
            lineHeight: 1.9,
            margin: 0,
          }}
        >
          {t.invitationLine3}
        </p>

        <div style={{ marginTop: 20 }}>
          <GoldDivider />
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Organizer ─── */
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
      <p
        style={{
          fontFamily: HEADLINE,
          fontSize: 12,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: C.textSecondary,
          marginBottom: 16,
        }}
      >
        {t.organizerTitle}
      </p>
      <div className="flex flex-col items-center gap-4">
        <GlassCard style={{ borderRadius: 999, padding: "18px 32px" }}>
          {(lines.length ? lines : [organizer]).map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: HEADLINE,
                fontSize: 18,
                fontStyle: "italic",
                color: C.textPrimary,
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
                    fontFamily: HEADLINE,
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  {t.groomSide}
                </p>
                <p
                  style={{
                    fontFamily: HEADLINE,
                    fontStyle: "italic",
                    color: C.textPrimary,
                    fontSize: 22,
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
                    fontFamily: HEADLINE,
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: C.textSecondary,
                    marginBottom: 4,
                  }}
                >
                  {t.brideSide}
                </p>
                <p
                  style={{
                    fontFamily: HEADLINE,
                    fontStyle: "italic",
                    color: C.textPrimary,
                    fontSize: 22,
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

/* ─── Date/time card (clock+calendar merged) ─── */
function DateTimeCard({
  isoDate,
  date,
  time,
}: {
  isoDate: string | null;
  date: string | null;
  time: string | null;
}) {
  const { t } = useLang();
  const { ref, visible } = useInView(0.2);
  if (!date && !time) return null;
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isoDate && (
        <Reveal>
          <AnimatedCalendar dateStr={isoDate} />
        </Reveal>
      )}
      <Reveal>
        <GlassCard
          style={{
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
            height: "100%",
          }}
        >
          <p
            style={{
              fontFamily: HEADLINE,
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.textSecondary,
              marginBottom: 12,
            }}
          >
            {t.timeLabel}
          </p>
          {time && (
            <div className="flex flex-col items-center gap-3">
              <AnimatedClock time={time} visible={visible} />
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accent,
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                <FaClock size={11} style={{ color: "#fff" }} />
                <span
                  style={{
                    fontFamily: HEADLINE,
                    fontSize: 18,
                    letterSpacing: "0.2em",
                    color: "#fff",
                  }}
                >
                  {time}
                </span>
              </div>
            </div>
          )}
          {date && (
            <p
              style={{
                fontFamily: HEADLINE,
                fontSize: 20,
                fontStyle: "italic",
                color: C.textPrimary,
                marginTop: 16,
              }}
            >
              {date}
            </p>
          )}
        </GlassCard>
      </Reveal>
    </div>
  );
}

/* ─── Venue card — shared GoogleMapEmbed, same as Template2 ─── */
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
  if (!venueName && !venueAddress) return null;

  const parsedFromLat = parseLatLngFromString(latitude);
  const numericLat =
    parsedFromLat?.lat ??
    (typeof latitude === "number" && !Number.isNaN(latitude) ? latitude : null);
  const numericLng =
    parsedFromLat?.lng ??
    (typeof longitude === "number" && !Number.isNaN(longitude)
      ? longitude
      : null);
  const hasCoords = numericLat != null && numericLng != null;

  const mapsHref = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${numericLat},${numericLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venueName, venueAddress].filter(Boolean).join(", "))}`;

  return (
    <Reveal style={{ marginTop: 32 }}>
      <GlassCard style={{ overflow: "hidden", borderRadius: 20 }}>
        {photo && (
          <div
            className="w-full relative"
            style={{
              padding: "20px 20px 0",
              background: C.surfaceContainerLow,
            }}
          >
            <div
              className="w-full h-56 relative overflow-hidden"
              style={{
                borderRadius: 16,
                border: `1px solid ${C.outlineVariant}`,
              }}
            >
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
            </div>
          </div>
        )}

        <div style={{ padding: 32 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
            <FaStar size={13} style={{ color: C.accent }} />
            <p
              style={{
                fontFamily: HEADLINE,
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.textSecondary,
                margin: 0,
              }}
            >
              {t.venueLabel}
            </p>
          </div>

          {venueName && (
            <p
              style={{
                fontFamily: HEADLINE,
                fontSize: 22,
                fontStyle: "italic",
                color: C.textPrimary,
                margin: "0 0 8px",
              }}
            >
              {venueName}
            </p>
          )}
          {venueAddress && (
            <div className="flex items-start gap-1.5">
              <FaMapMarkerAlt
                size={12}
                style={{ color: C.accent, marginTop: 4, flexShrink: 0 }}
              />
              <p
                style={{
                  fontFamily: BODY,
                  fontSize: 15,
                  color: C.textSecondary,
                  margin: 0,
                }}
              >
                {venueAddress}
              </p>
            </div>
          )}

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <GoogleMapEmbed
              address={venueAddress || undefined}
              latitude={hasCoords ? numericLat! : undefined}
              longitude={hasCoords ? numericLng! : undefined}
              accentColor={C.accent}
              height={200}
            />
          </div>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
            style={{
              padding: "12px 32px",
              background: C.accent,
              color: "#fff",
              fontFamily: HEADLINE,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 999,
              boxShadow: `0 10px 25px -8px ${C.accent}88`,
            }}
          >
            <FaMapMarkerAlt size={14} />
            {t.viewOnMap}
          </a>
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
      <GlassCard style={{ padding: 28, borderRadius: 20 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <FaInfoCircle size={15} style={{ color: C.accent }} />
          <p
            style={{
              fontFamily: HEADLINE,
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.textSecondary,
              margin: 0,
            }}
          >
            {t.extraInfoTitle}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {clean.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <FaStar
                size={12}
                style={{ color: C.accent, marginTop: 5, flexShrink: 0 }}
              />
              <p
                style={{
                  fontFamily: BODY,
                  fontSize: 15,
                  color: C.textSecondary,
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
  date,
  time,
  venueName,
  venueAddress,
  photo,
  latitude,
  longitude,
  extras,
}: {
  isoDate: string | null;
  date: string | null;
  time: string | null;
  venueName: string | null;
  venueAddress: string | null;
  photo: string | null;
  latitude?: any;
  longitude?: any;
  extras: (string | null | undefined)[];
}) {
  return (
    <section
      id="section-details"
      style={{ background: C.background, padding: "3rem 5vw" }}
    >
      <DateTimeCard isoDate={isoDate} date={date} time={time} />
      <VenueCard
        venueName={venueName}
        venueAddress={venueAddress}
        photo={photo}
        latitude={latitude}
        longitude={longitude}
      />
      <ExtraInfoCard extras={extras} />
    </section>
  );
}

/* ─── Photos ─── */
function PhotosSection({
  galleryUrls,
}: {
  galleryUrls: string[] | null | undefined;
}) {
  const { t } = useLang();
  const urls = galleryUrls?.length ? galleryUrls : [];
  if (!urls.length) return <section id="section-photos" />;
  return (
    <section id="section-photos">
      <Reveal
        style={{ background: C.surfaceContainerLow, padding: "4rem 5vw" }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: BODY,
            fontSize: 14,
            color: C.textSecondary,
            marginBottom: 8,
          }}
        >
          {t.galleryCaption}
        </p>
        <h3
          className="text-center"
          style={{
            fontFamily: HEADLINE,
            fontSize: 22,
            fontStyle: "italic",
            color: C.textPrimary,
            marginBottom: 24,
          }}
        >
          {t.galleryTitle}
        </h3>
        <GallerySwiper urls={urls} />
      </Reveal>
    </section>
  );
}

/* ─── Poem & Couple (description2 + photo3/4 + instagram links) ─── */
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
      style={{ background: C.background, padding: "4rem 5vw" }}
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
          <FaCameraRetro size={22} style={{ color: C.accent }} />
        </div>
        {hasPoem && (
          <MultilineText
            text={poem}
            style={{
              fontFamily: HEADLINE,
              fontStyle: "italic",
              fontSize: 17,
              color: C.textSecondary,
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
                  border: `1px solid ${C.outlineVariant}`,
                }}
              >
                <img
                  src={photo3!}
                  alt="photo-3"
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
                  border: `1px solid ${C.outlineVariant}`,
                }}
              >
                <img
                  src={photo4!}
                  alt="photo-4"
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
                  background: C.accent,
                  color: "#fff",
                  fontFamily: HEADLINE,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: 999,
                }}
              >
                <FaCameraRetro size={13} /> Instagram
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
                  background: C.accent,
                  color: "#fff",
                  fontFamily: HEADLINE,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: 999,
                }}
              >
                <FaCameraRetro size={13} /> Instagram
              </a>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}

/* ─── Messages (RSVP + wishes) ─── */
function MessagesSection({ weddingId }: { weddingId: string }) {
  const { t, lang } = useLang();
  return (
    <section
      id="section-messages"
      style={{ background: C.surfaceContainerLow, padding: "4rem 5vw" }}
    >
      <Reveal>
        <GlassCard
          style={{
            borderRadius: 20,
            padding: 40,
            maxWidth: 560,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: HEADLINE,
              fontSize: 22,
              fontStyle: "italic",
              color: C.textPrimary,
              marginBottom: 8,
            }}
          >
            {t.wishesTitle}
          </p>
          <p
            style={{
              fontFamily: BODY,
              fontStyle: "italic",
              color: C.textSecondary,
              marginBottom: 32,
            }}
          >
            {t.rsvpSubtitle}
          </p>
          <div style={{ marginBottom: 40 }}>
            <RSVPSection
              weddingId={weddingId}
              accentColor={C.accent}
              lightColor={C.surfaceContainerLow}
              lang={lang}
            />
          </div>
          <div
            style={{
              borderTop: `1px solid ${C.outlineVariant}`,
              paddingTop: 40,
            }}
          >
            <MessageSection
              weddingId={weddingId}
              accentColor={C.accent}
              lightColor={C.surfaceContainerLow}
              borderColor="border-neutral-200"
              lang={lang}
            />
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

/* ─── Footer ─── */
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
      className="flex flex-col items-center text-center"
      style={{
        gap: 32,
        padding: "4rem 5vw",
        background: C.accent,
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 420 }}>
        {t.footerPoem.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: HEADLINE,
              fontStyle: "italic",
              fontSize: 17,
              color: "rgba(255,255,255,0.9)",
              margin: i === 0 ? 0 : "6px 0 0",
            }}
          >
            {line}
          </p>
        ))}
        <div
          className="flex items-center justify-center gap-4"
          style={{ margin: "20px 0 16px" }}
        >
          <span
            style={{
              height: 1,
              width: 60,
              background: "rgba(255,255,255,0.35)",
            }}
          />
          <FaHeart style={{ color: "rgba(255,255,255,0.7)" }} />
          <span
            style={{
              height: 1,
              width: 60,
              background: "rgba(255,255,255,0.35)",
            }}
          />
        </div>
        <ShimmerNavy
          style={{
            fontFamily: HEADLINE,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 28,
          }}
        >
          {maleName} &amp; {femaleName}
        </ShimmerNavy>
      </div>
      <p
        style={{
          fontFamily: HEADLINE,
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        © {new Date().getFullYear()} {maleName.toUpperCase()} &amp;{" "}
        {femaleName.toUpperCase()}. {t.builtWithLove}
      </p>
    </footer>
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

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap');
      * { box-sizing: border-box; }
      img { border: none !important; outline: none !important; }
      body, #__next { background: ${C.background} !important; }
      ::-webkit-scrollbar { display: none; }
    `}</style>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN — Template2-той бүрэн ижил бүтэц/дараалал
   ───────────────────────────────────────────────────────────── */
export default function Template6({
  wedding,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const t = T6[lang];
  const toggleLang = () => setLang((prev) => (prev === "kk" ? "mn" : "kk"));

  const isoDate = wedding.wedding_date || null;
  const date = formatEventDate(wedding.wedding_date, t.calendarMonths);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  const organizerText = pickLang(wedding.organizer, lang) || null;
  const venueNameText = pickLang(wedding.venue_name, lang) || null;
  const venueAddressText = pickLang(wedding.venue_address, lang) || null;
  const description1Text = pickLang(wedding.description1, lang) || null;
  const description2Text = pickLang(wedding.description2, lang) || null;
  const maleParents = pickLang((wedding as any).male_parents, lang) || null;
  const femaleParents = pickLang((wedding as any).female_parents, lang) || null;

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
          fontFamily: BODY,
          background: C.background,
          color: C.textPrimary,
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
            maleParents={maleParents}
            femaleParents={femaleParents}
          />
        )}

        <DetailsSection
          isoDate={isoDate}
          date={date}
          time={time}
          venueName={venueNameText}
          venueAddress={venueAddressText}
          photo={venuePhoto}
          latitude={(wedding as any).latitude}
          longitude={(wedding as any).longitude}
          extras={extras}
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
