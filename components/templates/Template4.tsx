"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicPlayer from "../MusicPlayer";
import RSVPSection from "../RSVPSection";
export type Lang = "kk" | "mn";

// ─── DESIGN TOKENS (from the roseGold / Cormorant Garamond reference) ───
const C = {
  bg1: "#fff6f8",
  bg2: "#ffedf1",
  bg3: "#ffe3ea",
  rose50: "#fff5f7",
  rose100: "#ffe8ed",
  rose200: "#ffd0da",
  rose300: "#f8a5b8",
  rose400: "#e56b87",
  rose500: "#be385d",
  rose600: "#9b2447",
  rose700: "#751a35",
  rose800: "#531326",
  rose900: "#380d1a",
  dusty: "#b76378",
  burgundy: "#6d2138",
  gold: "#c59d5f",
  champagne: "#f7ede2",
  text: "#552533",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Marcellus&display=swap');";

// ─── DEFAULT WEDDING ───
const DEFAULT_WEDDING: Wedding = {
  id: "preview",
  created_at: "2026-01-01T00:00:00.000Z",
  male_name: "",
  female_name: "",
  wedding_date: "2026-09-14T17:00",
  venue_name: "",
  venue_address: "",
  organizer: "",
  phone: "",
  template: "azure",
  main_photo_url: null,
  gallery_urls: null,
  photo3_url: null,
  photo4_url: null,
  photo5_url: null,
  description1: "",
  description2: null,
  link1: null,
  link2: null,
  extra1: "",
  extra2: "",
  extra3: null,
  extra4: null,
  extra5: null,
  latitude: null,
  longitude: null,
  payment: null,
};

// ─── useInView ───
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted, threshold]);

  return { ref, inView: mounted ? inView : false };
}

// ─── FadeIn (scroll reveal) ───
function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView();
  const translate =
    from === "bottom"
      ? "translateY(24px)"
      : from === "top"
        ? "translateY(-24px)"
        : from === "left"
          ? "translateX(-24px)"
          : "translateX(24px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0)" : translate,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Icons ───
const IconDiamond = ({
  size = 10,
  color = C.rose500,
}: {
  size?: number;
  color?: string;
}) => (
  <span
    style={{
      fontSize: size,
      color,
      lineHeight: 1,
      display: "inline-block",
      transform: "rotate(45deg)",
    }}
  >
    ◆
  </span>
);

const IconCalendar = ({
  size = 16,
  color = C.rose600,
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconPin = ({
  size = 22,
  color = C.rose600,
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconArrow = ({
  size = 13,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const IconLock = ({
  size = 40,
  color = "#ffffff",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

// ─── FloralVine (ornamental divider, matches reference SVG vine) ───
function FloralVine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <svg
        width="200"
        height="24"
        viewBox="0 0 200 24"
        fill="none"
        style={{ color: C.rose300 }}
      >
        <path
          d="M10 12 C 40 4, 70 20, 100 12 C 130 4, 160 20, 190 12"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="100" cy="12" r="3" fill={C.rose500} />
        <circle cx="75" cy="14" r="1.5" fill={C.rose300} />
        <circle cx="125" cy="14" r="1.5" fill={C.rose300} />
        <circle cx="45" cy="9" r="1.5" fill={C.rose300} />
        <circle cx="155" cy="9" r="1.5" fill={C.rose300} />
      </svg>
    </div>
  );
}

// ─── SectionDivider (line + diamond + music-note glyph, matches reference) ───
function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 px-10 py-3 opacity-90">
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(to right, transparent, ${C.rose300})`,
        }}
      />
      <div className="flex items-center gap-1.5" style={{ color: C.rose500 }}>
        <IconDiamond size={9} />
        <svg width="26" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C11.5 5 8.5 7.5 5 8c3.5.5 6.5 3 7 6 .5-3 3.5-5.5 7-6-3.5-.5-6.5-3-7-6z" />
          <circle cx="12" cy="18" r="1.5" />
          <circle cx="6" cy="19" r="1" />
          <circle cx="18" cy="19" r="1" />
        </svg>
        <IconDiamond size={9} />
      </div>
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(to left, transparent, ${C.rose300})`,
        }}
      />
    </div>
  );
}

// ─── AnimatedClock (kept as a bespoke touch, restyled to the rose palette) ───
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
      viewBox="0 0 64 64"
      width="64"
      height="64"
      style={{ overflow: "visible" }}
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill={C.rose50}
        stroke={C.rose300}
        strokeWidth="1"
      />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke={C.rose200}
        strokeWidth="0.5"
      />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const r1 = 22,
          r2 = i % 3 === 0 ? 18.5 : 20;
        return (
          <line
            key={i}
            x1={32 + r1 * Math.cos(a)}
            y1={32 + r1 * Math.sin(a)}
            x2={32 + r2 * Math.cos(a)}
            y2={32 + r2 * Math.sin(a)}
            stroke={i % 3 === 0 ? C.rose700 : C.rose300}
            strokeWidth={i % 3 === 0 ? 1.1 : 0.6}
          />
        );
      })}
      <line
        x1="32"
        y1="32"
        x2={32 + 12 * Math.cos(((hourDeg - 90) * Math.PI) / 180)}
        y2={32 + 12 * Math.sin(((hourDeg - 90) * Math.PI) / 180)}
        stroke={C.rose800}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="32"
        x2={32 + 17 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={32 + 17 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke={C.rose800}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="32"
        x2={32 + 19 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={32 + 19 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke={C.rose500}
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="2" fill={C.rose800} />
      <circle cx="32" cy="32" r="0.9" fill="#fff" />
    </svg>
  );
}

// ─── AnimatedCalendar ───
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
const KAZ_DAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"];

function AnimatedCalendar({ dateStr }: { dateStr?: string | null }) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const year = d.getFullYear(),
    month = d.getMonth(),
    day = d.getDate();
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
    <div className="mt-3 pt-4" style={{ borderTop: `1px solid ${C.rose100}` }}>
      <p
        className="font-semibold text-center mb-2"
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 17,
          color: C.rose800,
        }}
      >
        {KAZ_MONTHS[month]} {year}
      </p>
      <div
        className="grid grid-cols-7 gap-y-1 text-center"
        style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
      >
        {KAZ_DAYS.map((wd, i) => (
          <div
            key={wd}
            className="py-1"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: i >= 5 ? C.rose500 : "rgba(90,50,60,0.55)",
            }}
          >
            {wd}
          </div>
        ))}
        {cells.map((cell, idx) => {
          const dow = idx % 7;
          const isWeekend = dow === 5 || dow === 6;
          const isTarget = cell === day;
          return (
            <div key={idx} className="py-1 flex items-center justify-center">
              {cell && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: isTarget ? 700 : 500,
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: isTarget ? C.rose600 : "transparent",
                    color: isTarget
                      ? "#fff"
                      : isWeekend
                        ? "rgba(120,45,68,0.55)"
                        : "rgba(90,50,60,0.8)",
                    boxShadow: isTarget ? `0 3px 10px ${C.rose300}` : "none",
                  }}
                >
                  {cell}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GallerySwiper ───
function GallerySwiper({ urls }: { urls: string[] }) {
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
    <div className="relative px-6">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={resetTimer}
        onMouseDown={resetTimer}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2"
        style={{ scrollbarWidth: "none" }}
      >
        {urls.map((url, i) => (
          <div
            key={i}
            className="snap-center shrink-0 overflow-hidden bg-white group"
            style={{
              width: "82%",
              maxWidth: 340,
              borderRadius: 16,
              border: "2px solid rgba(255,255,255,0.85)",
              boxShadow: "0 8px 24px rgba(155,36,71,0.12)",
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              <img
                src={url}
                alt={`сурет ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{ transform: active === i ? "scale(1.03)" : "scale(1)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.35), transparent 55%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {urls.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              aria-label={`Сурет ${i + 1}`}
              style={{
                width: active === i ? 16 : 6,
                height: 6,
                borderRadius: 999,
                background: active === i ? C.rose500 : C.rose200,
                transition: "all .3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PaymentLockOverlay ───
function PaymentLockOverlay() {
  return (
    <div
      className="fixed inset-0 h-full w-full flex items-center justify-center"
      style={{ background: "#000", zIndex: 9999 }}
    >
      <div className="text-center px-6">
        <IconLock size={40} color="#ffffff" />
        <p
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#ffffff",
            marginTop: 16,
          }}
        >
          Төлем төленбеген
        </p>
      </div>
    </div>
  );
}

// ─── MAIN ───
export default function Template4({
  wedding: raw,
  defaultLang = "kk",
}: {
  wedding: Wedding;
  defaultLang?: Lang;
}) {
  const wedding: Wedding = {
    ...DEFAULT_WEDDING,
    ...Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== null && v !== "" && v !== undefined,
      ),
    ),
  };

  const isPaymentLocked = String((raw as any).payment) === "2";
  const maleParents = (wedding as any).male_parents ?? null;
  const femaleParents = (wedding as any).female_parents ?? null;

  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;
  const mapHref =
    wedding.link1 ||
    (wedding.venue_address
      ? `https://2gis.kz/search/${encodeURIComponent(wedding.venue_address)}`
      : null);

  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroInView = useInView(0.05);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${C.bg1} 0%, ${C.bg2} 55%, ${C.bg3} 100%)`,
        color: C.text,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {isPaymentLocked && <PaymentLockOverlay />}

      <style>{`
        ${FONT_IMPORT}
        * { box-sizing:border-box; }
        img { border:none !important; outline:none !important; }
        .t4-hide-scroll::-webkit-scrollbar { display:none; }

        @keyframes t4-shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        .t4-shimmer-text {
          background: linear-gradient(90deg, ${C.rose700} 0%, #c44f6f 35%, #e895a9 50%, #c44f6f 65%, ${C.rose700} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: t4-shimmer 6s ease-in-out infinite;
        }
        @keyframes t4-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .t4-float { animation: t4-float 6s ease-in-out infinite; }
        @keyframes t4-heart { 0% { transform:translateY(0) rotate(0deg); opacity:0; } 55% { opacity:.7; } 100% { transform:translateY(-180px) translateX(var(--tx,0px)) rotate(360deg); opacity:0; } }
      `}</style>

      {/* Top hairline */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(to right, ${C.rose100}, ${C.rose500}, ${C.rose200}, ${C.rose500}, ${C.rose100})`,
        }}
      />

      {/* Ambient blurred corner accents */}
      <div
        className="absolute top-0 left-0 w-36 h-36 pointer-events-none blur-2xl"
        style={{
          background: `radial-gradient(circle, ${C.rose200}55, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-96 right-0 w-48 h-48 pointer-events-none blur-2xl t4-float"
        style={{
          background: `radial-gradient(circle, ${C.gold}30, transparent 70%)`,
        }}
      />

      {/* ─── HERO ─── */}
      <header ref={heroInView.ref} className="relative pt-0 pb-6 text-center">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4 / 5" }}
        >
          <img
            src={wedding.main_photo_url || "/images/duzka1.jpg"}
            alt="Гол зураг"
            className="w-full h-full object-cover object-top transition-transform duration-1000"
            style={{
              transform: heroLoaded ? "scale(1.0)" : "scale(1.08)",
              opacity: heroInView.inView ? 1 : 0,
              transitionProperty: "transform, opacity",
              filter: "saturate(1.02)",
            }}
            onLoad={() => setHeroLoaded(true)}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-44"
            style={{
              background: `linear-gradient(to top, ${C.bg2}, ${C.bg2}cc, transparent)`,
            }}
          />
        </div>

        {/* Invitation heading */}
        <div className="px-6 pt-7 space-y-4">
          <FadeIn delay={80}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.18em",
                color: C.rose800,
                textTransform: "uppercase",
              }}
            >
              Құрметті сіз(дер)ді қызымыз
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <h1
              className="t4-shimmer-text"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: "clamp(2.6rem,12vw,3.6rem)",
                lineHeight: 1.08,
              }}
            >
              {wedding.female_name}
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 600,
                fontSize: "clamp(1.6rem,7vw,2.1rem)",
                letterSpacing: "0.1em",
                color: C.rose700,
                marginTop: 4,
              }}
            >
              – НЫҢ
            </p>
          </FadeIn>

          <FadeIn delay={340}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                color: "#612133",
                lineHeight: 1.65,
                maxWidth: 320,
                margin: "0 auto",
                textTransform: "uppercase",
              }}
            >
              Ұзату тойына арналған салтанатты ақ дастарханымыздың қадірлі
              қонағы болуға шақырамыз!
            </p>
          </FadeIn>
        </div>
      </header>

      <SectionDivider />

      {/* ─── photo3 ─── */}
      {wedding.photo3_url && (
        <FadeIn className="px-6 mt-2">
          <div
            className="overflow-hidden"
            style={{
              borderRadius: 16,
              border: `2px solid rgba(255,255,255,0.85)`,
              boxShadow: "0 8px 24px rgba(155,36,71,0.1)",
            }}
          >
            <img
              src={wedding.photo3_url}
              alt="Ер"
              className="w-full object-cover"
              style={{ maxHeight: 440, objectPosition: "center top" }}
            />
          </div>
        </FadeIn>
      )}

      {/* ─── HOSTS / ТОЙ ИЕЛЕРІ ─── */}
      {wedding.organizer && (
        <FadeIn className="py-6 px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: C.rose300 }} />
            <span
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "'Marcellus',serif",
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: C.rose700,
              }}
            >
              <IconDiamond size={7} /> Той иелері <IconDiamond size={7} />
            </span>
            <div className="w-8 h-px" style={{ background: C.rose300 }} />
          </div>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "rgba(155,36,71,0.85)",
              marginBottom: 6,
            }}
          >
            Ата-анасы
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#55192b",
            }}
          >
            {wedding.organizer}
          </h2>

          <div className="flex items-center justify-center gap-1.5 mt-3 mb-1">
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: C.rose300 }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: C.rose400 }}
            />
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: C.rose300 }}
            />
          </div>
          <FloralVine className="mt-2" />

          {(maleParents || femaleParents) && (
            <div
              className="mt-6 pt-5"
              style={{ borderTop: `1px solid ${C.rose100}` }}
            >
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "rgba(155,36,71,0.75)",
                  marginBottom: 12,
                }}
              >
                Ата-аналары
              </p>
              <div className="flex flex-col items-center gap-3">
                {maleParents && (
                  <div>
                    <p
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.rose500,
                        marginBottom: 3,
                      }}
                    >
                      Күйеу жақ
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontWeight: 600,
                        fontSize: 17,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#55192b",
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
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: C.rose500,
                        marginBottom: 3,
                      }}
                    >
                      Келін жақ
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontWeight: 600,
                        fontSize: 17,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#55192b",
                      }}
                    >
                      {femaleParents}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </FadeIn>
      )}

      {/* ─── Description ─── */}
      {wedding.description1 && (
        <FadeIn className="px-6 mt-2">
          <div
            className="relative px-7 py-7 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: `1px solid ${C.rose200}`,
              boxShadow: "0 8px 24px rgba(155,36,71,0.07)",
            }}
          >
            <span
              className="absolute -top-4 left-5 text-5xl leading-none"
              style={{
                color: C.rose200,
                fontFamily: "'Cormorant Garamond',serif",
              }}
            >
              &ldquo;
            </span>
            <p
              className="italic text-center"
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                color: "#8c3a55",
                fontSize: 18,
                lineHeight: 1.7,
              }}
            >
              {wedding.description1}
            </p>
            <span
              className="absolute -bottom-6 right-5 text-5xl leading-none rotate-180 block"
              style={{
                color: C.rose200,
                fontFamily: "'Cormorant Garamond',serif",
              }}
            >
              &rdquo;
            </span>
          </div>
        </FadeIn>
      )}

      {/* ─── GALLERY ─── */}
      {!!wedding.gallery_urls?.length && (
        <FadeIn className="py-6">
          <div className="flex items-center justify-center gap-3 mb-5 px-6">
            <div className="w-10 h-px" style={{ background: C.rose300 }} />
            <h3
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 13,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: C.rose700,
              }}
            >
              Суреттер жиынтығы
            </h3>
            <div className="w-10 h-px" style={{ background: C.rose300 }} />
          </div>
          <GallerySwiper urls={wedding.gallery_urls} />
        </FadeIn>
      )}

      {/* ─── EVENT DATE & CALENDAR ─── */}
      {(date || time || wedding.wedding_date) && (
        <FadeIn className="py-6 px-6">
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              background: "rgba(255,255,255,0.82)",
              border: `1px solid ${C.rose200}`,
              boxShadow: "0 4px 18px rgba(155,36,71,0.07)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 mb-3"
              style={{
                color: C.rose600,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              <IconCalendar size={15} />
              <span>Той салтанаты</span>
            </div>

            {date && (
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 700,
                  fontSize: 28,
                  color: "#55192b",
                }}
              >
                {date}
              </h3>
            )}

            {time && (
              <div className="flex flex-col items-center gap-3 mt-3">
                <AnimatedClock time={time} visible={heroInView.inView} />
                <div
                  className="inline-block px-4 py-1.5 rounded-full"
                  style={{
                    background: C.rose50,
                    border: `1px solid ${C.rose200}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: C.rose800,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    Басталу уақыты: {time}
                  </p>
                </div>
              </div>
            )}

            {wedding.wedding_date && (
              <AnimatedCalendar dateStr={wedding.wedding_date} />
            )}
          </div>
        </FadeIn>
      )}

      {/* ─── VENUE ─── */}
      {(wedding.venue_name || wedding.venue_address) && (
        <FadeIn className="py-4 px-6 text-center">
          <div
            className="relative rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: `1px solid ${C.rose200}`,
              boxShadow: "0 4px 18px rgba(155,36,71,0.07)",
            }}
          >
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ background: C.rose100 }}
            >
              <IconPin size={22} color={C.rose600} />
            </div>
            <h4
              style={{
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: C.rose600,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Мекенжайы
            </h4>
            {wedding.venue_name && (
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#55192b",
                  marginBottom: 4,
                }}
              >
                {wedding.venue_name}
              </h3>
            )}
            {wedding.venue_address && (
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(155,36,71,0.8)",
                  lineHeight: 1.6,
                  maxWidth: 280,
                  margin: "0 auto 20px",
                }}
              >
                {wedding.venue_address}
              </p>
            )}
          </div>
        </FadeIn>
      )}

      <SectionDivider />

      {/* ─── RSVP ─── */}
      <div className="px-6 py-6">
        <FadeIn>
          <div className="text-center mb-5">
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: C.rose600,
                fontWeight: 700,
                display: "block",
                marginBottom: 4,
              }}
            >
              Құрметті қонақ
            </span>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 24,
                color: "#55192b",
              }}
            >
              Қатысуыңызды растаңыз
            </h3>
            <p
              style={{
                fontSize: 11,
                color: "rgba(155,36,71,0.8)",
                marginTop: 4,
              }}
            >
              Тойға келетініңізді алдын ала хабарлауыңызды сұраймыз
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${C.rose200}`,
              boxShadow: "0 4px 18px rgba(155,36,71,0.09)",
            }}
          >
            <RSVPSection
              weddingId={wedding.id}
              accentColor={C.burgundy}
              lightColor={C.rose100}
              lang={defaultLang}
            />
          </div>
        </FadeIn>
      </div>

      {/* ─── WISHES ─── */}
      <div className="px-6 py-4 mb-2">
        <FadeIn>
          <div className="text-center mb-4">
            <h3
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 24,
                color: "#55192b",
              }}
            >
              Ақ тілектер
            </h3>
            <p style={{ fontSize: 11, color: C.rose500 }}>
              Қалыңдыққа арналған жүрекжарды лебіздер
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${C.rose200}`,
              boxShadow: "0 4px 18px rgba(155,36,71,0.09)",
            }}
          >
            <MessageSection
              weddingId={wedding.id}
              accentColor={C.burgundy}
              lightColor={C.rose100}
              borderColor="border-rose-100"
              lang={defaultLang}
            />
          </div>
        </FadeIn>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="relative pt-4 pb-14 px-6 text-center overflow-hidden">
        <FloralVine className="mb-6" />

        <p
          className="t4-shimmer-text"
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {wedding.male_name} {wedding.female_name}
        </p>
        {date && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 16,
              letterSpacing: "0.12em",
              color: "rgba(155,36,71,0.7)",
              marginTop: 6,
            }}
          >
            {date}
          </p>
        )}

        <div className="flex items-center justify-center gap-1.5 my-6">
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: `${C.rose500}33` }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `${C.rose500}66` }}
          />
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: C.rose500 }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `${C.rose500}66` }}
          />
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: `${C.rose500}33` }}
          />
        </div>

        <div
          className="flex items-center justify-center gap-2 mb-2"
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: `${C.rose500}cc`,
          }}
        >
          <span>Күтеміз</span>
          <span>•</span>
          <span>Құрметпен той иелері</span>
        </div>
        <p
          className="italic"
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 16,
            color: C.rose700,
          }}
        >
          «Қыз – өріс, қыз – елдің көркі»
        </p>

        {/* Floating hearts, subtle */}
        {[...Array(6)].map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            width={12 + (i % 3) * 4}
            height={12 + (i % 3) * 4}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${12 + i * 14}%`,
              animation: `t4-heart ${5 + i}s linear infinite`,
              animationDelay: `${i * 0.9}s`,
              pointerEvents: "none",
              ["--tx" as any]: `${(i % 2 === 0 ? 1 : -1) * 16}px`,
            }}
          >
            <g fill={`${C.rose200}88`}>
              <circle cx="20" cy="9" r="7" />
              <circle cx="31" cy="17" r="7" />
              <circle cx="27" cy="30" r="7" />
              <circle cx="13" cy="30" r="7" />
              <circle cx="9" cy="17" r="7" />
            </g>
            <circle cx="20" cy="20" r="4" fill={`${C.rose100}aa`} />
          </svg>
        ))}
      </footer>

      {/* Bottom hairline */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(to right, ${C.rose100}, ${C.rose500}, ${C.rose200}, ${C.rose500}, ${C.rose100})`,
        }}
      />

      <MusicPlayer />
    </div>
  );
}
