"use client";
import { useEffect, useRef, useState } from "react";
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
  tagline: "Бірге болуға серт бердік",
  isoDate: "2024-06-15T19:00",
  invitationHeadline: "Құрметті ағайын-туыс, бауырлар, дос-жарандар!",
  maleParents: "Болат & Сәуле",
  femaleParents: "Қайрат & Гүлнар",
  venueName: `"Sky" palace`,
  venueAddress: "Баян-Өлгий,",
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
const KAZ_MONTHS_CAPS = KAZ_MONTHS.map((m) => m.toUpperCase());
const KAZ_DAYS_FULL = [
  "ЖЕКСЕНБІ",
  "ДҮЙСЕНБІ",
  "СЕЙСЕНБІ",
  "СӘРСЕНБІ",
  "БЕЙСЕНБІ",
  "ЖҰМА",
  "СЕНБІ",
];
const KAZ_DAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"];

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

function formatKazDate(iso: string) {
  const d = new Date(iso);
  return `${KAZ_MONTHS_CAPS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
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
  tagline,
  dateLabel,
}: {
  mainPhoto: string | null;
  maleName: string;
  femaleName: string;
  tagline: string;
  dateLabel: string;
}) {
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
          {tagline}
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
   ====================================================================== */
function InvitationText({
  headline,
  body,
}: {
  headline: string;
  body: string;
}) {
  return (
    <section
      className="py-16 px-6 text-center relative"
      style={{ background: C.surfaceContainerLow }}
    >
      <Reveal className="max-w-lg mx-auto">
        <Icon name="favorite" filled style={{ color: C.primary }} />
        <h2
          className="mb-6 mt-4"
          style={{
            fontFamily: HEADLINE,
            fontWeight: 600,
            fontSize: 26,
            color: C.primary,
            lineHeight: 1.4,
          }}
        >
          {headline}
        </h2>
        <p
          className="leading-relaxed mb-10"
          style={{ fontFamily: BODY, fontSize: 16, color: C.onSurfaceVariant }}
        >
          {body}
        </p>
        <SectionEyebrow label="" />
      </Reveal>
    </section>
  );
}

/* ======================================================================
   Section 3 — PARENTS + EVENT BENTO
   ====================================================================== */
function ParentsAndEventBento({
  maleParents,
  femaleParents,
  isoDate,
}: {
  maleParents: string;
  femaleParents: string;
  isoDate: string | null;
}) {
  const d = isoDate ? new Date(isoDate) : new Date(DEFAULTS.isoDate);
  const time = isoDate ? formatTime(isoDate) : formatTime(DEFAULTS.isoDate);
  const monthCaps = KAZ_MONTHS_CAPS[d.getMonth()];
  const dayCaps = KAZ_DAYS_FULL[d.getDay()];

  return (
    <section
      id="event"
      className="py-16 px-6 relative"
      style={{ background: C.background }}
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* Parents card */}
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
                ТОЙ ИЕЛЕРІ:
              </h3>
              <div className="space-y-4 text-center">
                <div>
                  <p
                    style={{
                      fontFamily: HEADLINE,
                      fontWeight: 600,
                      fontSize: 22,
                      color: C.onSurface,
                    }}
                  >
                    {maleParents}
                  </p>
                  {/* <p
                    style={{
                      fontFamily: BODY,
                      fontSize: 13,
                      color: C.onSurfaceVariant,
                    }}
                  >
                    Жігіт жағынан
                  </p> */}
                </div>
                <div
                  className="h-px w-8 mx-auto"
                  style={{ background: C.outlineVariant }}
                />
                {/* <div>
                  <p
                    style={{
                      fontFamily: HEADLINE,
                      fontWeight: 600,
                      fontSize: 22,
                      color: C.onSurface,
                    }}
                  >
                    {femaleParents}
                  </p>
                  <p
                    style={{
                      fontFamily: BODY,
                      fontSize: 13,
                      color: C.onSurfaceVariant,
                    }}
                  >
                    Қыз жағынан
                  </p>
                </div> */}
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Calendar + clock */}
        <div className="grid grid-cols-2 gap-6">
          <Reveal delay={0.05}>
            <GlassCard
              className="flex flex-col items-center justify-center"
              style={{ padding: 24, height: "100%" }}
            >
              <p
                style={{
                  fontFamily: BODY,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  color: C.secondary,
                  marginBottom: 6,
                }}
              >
                {monthCaps}
              </p>
              <p
                style={{
                  fontFamily: HEADLINE,
                  fontWeight: 700,
                  fontSize: 40,
                  lineHeight: 1,
                  color: C.primary,
                }}
              >
                {d.getDate()}
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
            </GlassCard>
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
            Мерекелік мәліметтер
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
                    КАРТАДАН КӨРУ
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
                  ҚОСЫМША АҚПАРАТ
                </h3>
              </div>
              <div className="space-y-3">
                {extras.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: C.secondaryContainer }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: C.primary }}
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
   ====================================================================== */
function GalleryBento({ images }: { images: string[] }) {
  const [a, b, c] = images;
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
            Біздің хикаямыз
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[a, b].map((src, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div
                className="h-64 rounded-xl bg-cover bg-center"
                style={
                  src
                    ? { backgroundImage: `url('${src}')` }
                    : {
                        background: `linear-gradient(160deg, ${C.secondaryContainer}, ${C.surfaceContainer})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }
                }
              >
                {!src && (
                  <Icon
                    name="image"
                    size={30}
                    style={{ color: C.primary, opacity: 0.35 }}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <div
            className="w-full h-80 rounded-xl bg-cover bg-center"
            style={
              c
                ? { backgroundImage: `url('${c}')` }
                : {
                    background: `linear-gradient(160deg, ${C.surfaceContainer}, ${C.secondaryContainer})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            {!c && (
              <Icon
                name="photo_library"
                size={34}
                style={{ color: C.primary, opacity: 0.35 }}
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ======================================================================
   Section 6 — RSVP  (wraps the existing <RSVPSection/> — untouched)
   ====================================================================== */
function RsvpWrapper({ weddingId }: { weddingId: string }) {
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
            Тойға келетініңізді растаңыз
          </h2>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 13,
              color: C.onSurfaceVariant,
            }}
          >
            Өтініш, жауабыңызды алдын ала беріңіз
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <GlassCard style={{ padding: 32 }}>
            <RSVPSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor={C.surfaceContainerLow}
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
            Тілектер мен лебіздер
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
  const poem = [
    "Біз екеуміз тек екеуміз",
    "Жүректермен бір екенбіз",
    "Мен сен үшін сен мен үшін",
    "Жаралған екенбіз",
  ];

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
          Төлем төленбеген
        </p>
      </div>
    </div>
  );
}

/* ======================================================================
   Bottom navigation — matches the reference HTML's pill-tab nav
   ====================================================================== */
const NAV_ITEMS = [
  { id: "love", icon: "favorite", label: "Love" },
  { id: "gallery", icon: "photo_library", label: "Gallery" },
  { id: "event", icon: "calendar_today", label: "Event" },
  { id: "venue", icon: "location_on", label: "Venue" },
  { id: "rsvp", icon: "edit_note", label: "RSVP" },
];

function BottomNav() {
  const [active, setActive] = useState("love");

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
}: {
  wedding: Wedding;
  hideBottomNav?: boolean;
}) {
  const isoDate = wedding.wedding_date || null;
  const dateLabel = isoDate
    ? formatKazDate(isoDate)
    : formatKazDate(DEFAULTS.isoDate);

  const maleName = wedding.male_name || DEFAULTS.maleName;
  const femaleName = wedding.female_name || DEFAULTS.femaleName;
  const tagline = wedding.description1 || DEFAULTS.tagline;

  const invitationBody =
    wedding.description2 ||
    `Сіздерді балаларымыз ${maleName} мен ${femaleName}нің шаңырақ көтеру тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.`;

  const organizerLines = (wedding.organizer || "").split("\n").filter(Boolean);
  const maleParents = organizerLines[0] || DEFAULTS.maleParents;
  const femaleParents = organizerLines[1] || DEFAULTS.femaleParents;

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

  const galleryImages = [
    ...(wedding.gallery_urls || []),
    wedding.photo3_url,
    wedding.photo4_url,
  ].filter(Boolean) as string[];

  const venuePhoto = wedding.photo5_url || galleryImages[0] || null;
  const isPaymentLocked = String((wedding as any).payment) === "2";
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: C.background, color: C.onSurface, fontFamily: BODY }}
    >
      {isPaymentLocked && <PaymentLockOverlay />}
      <GlobalFonts />
      <Template2Music extra5={wedding.extra5} />

      <Hero
        mainPhoto={wedding.main_photo_url}
        maleName={maleName}
        femaleName={femaleName}
        tagline={tagline}
        dateLabel={dateLabel}
      />

      <InvitationText
        headline={DEFAULTS.invitationHeadline}
        body={invitationBody}
      />

      <ParentsAndEventBento
        maleParents={maleParents}
        femaleParents={femaleParents}
        isoDate={isoDate}
      />

      <VenueSection
        venueName={venueName}
        venueAddress={venueAddress}
        photo={venuePhoto}
        extras={extras}
        latitude={latitude}
        longitude={longitude}
      />

      <GalleryBento images={galleryImages} />

      <RsvpWrapper weddingId={wedding.id} />

      <WishesWrapper weddingId={wedding.id} />

      <Footer
        maleName={maleName}
        femaleName={femaleName}
        dateLabel={dateLabel}
      />

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
