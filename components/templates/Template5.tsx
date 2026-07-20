"use client";
import { useEffect, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import RSVPSection from "@/components/RSVPSection";
import Song from "../song";

const HEADLINE = "'EB Garamond', Georgia, serif";
const BODY = "'DM Sans', sans-serif";

const COLORS = {
  primary: "#44664a",
  primaryDark: "#2d4e33",
  secondary: "#3a6842",
  tertiary: "#51634f",
  primaryContainer: "#7a9e7e",
  secondaryContainer: "#b9ecbd",
  background: "#f7faf5",
  surfaceLow: "#f1f4ef",
  surfaceHighest: "#e0e3de",
  outlineVariant: "#c2c8bf",
  onSurfaceVariant: "#424842",
};

function getWeddingDateObj(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getWeddingDay(d: Date) {
  return d.getUTCDate();
}

function getWeddingMonthName(d: Date) {
  return new Intl.DateTimeFormat("kk-KZ", {
    month: "long",
    timeZone: "UTC",
  }).format(d);
}

function Icon({
  name,
  size = 20,
  filled = false,
  color,
  style = {},
}: {
  name: string;
  size?: number;
  filled?: boolean;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        lineHeight: 1,
        color,
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        display: "inline-block",
        ...style,
      }}
    >
      {name}
    </span>
  );
}

function GlobalFonts() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");
      .material-symbols-outlined {
        vertical-align: middle;
      }
    `}</style>
  );
}

function Eyebrow({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <div
        className="h-px w-8"
        style={{
          background: `linear-gradient(to right, transparent, ${color}70)`,
        }}
      />
      <p
        style={{
          fontFamily: BODY,
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 600,
          color,
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </p>
      <div
        className="h-px w-8"
        style={{
          background: `linear-gradient(to left, transparent, ${color}70)`,
        }}
      />
    </div>
  );
}

/* ─── SVG "99" quotation mark ─── */
function QuoteMarkSVG({ color, size = 56 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 64 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.4, display: "block", margin: "0 auto" }}
    >
      <path
        d="M14.5 2C7 2 2 8 2 15.5C2 23 7 28.5 14 28.5C16.3 28.5 18.3 27.9 20 26.9C18.6 33.5 13.8 39.5 6.5 43.5L9 46C20.5 40.5 27 30.5 27 18.5C27 8.5 21.5 2 14.5 2Z"
        fill={color}
      />
      <path
        d="M49.5 2C42 2 37 8 37 15.5C37 23 42 28.5 49 28.5C51.3 28.5 53.3 27.9 55 26.9C53.6 33.5 48.8 39.5 41.5 43.5L44 46C55.5 40.5 62 30.5 62 18.5C62 8.5 56.5 2 49.5 2Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── Small ring/gem icon ─── */
function IcRingSmall({ color }: { color: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id="t5-quote-gem-g" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" />
          <stop offset="45%" stopColor="#F2F7F0" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <circle
        cx="30"
        cy="35"
        r="15"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        opacity="0.7"
      />
      <line
        x1="30"
        y1="25"
        x2="30"
        y2="19"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <polygon
        points="30,10 24.5,17.5 30,25 35.5,17.5"
        fill="url(#t5-quote-gem-g)"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

function QuoteSection({ text }: { text: string }) {
  return (
    <section
      className="relative overflow-hidden text-center py-16 px-6 mt-10"
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.primaryContainer}55 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `${COLORS.background}cc` }}
      />
      <div className="max-w-2xl mx-auto relative z-10">
        <QuoteMarkSVG color={COLORS.primaryContainer} size={60} />
        <p
          className="italic leading-relaxed px-4 mt-2"
          style={{ fontFamily: HEADLINE, fontSize: 24, color: "#191c1a" }}
        >
          {text}
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div
            className="h-[0.5px] w-12"
            style={{ background: COLORS.outlineVariant }}
          />
          <IcRingSmall color={COLORS.primary} />
          <div
            className="h-[0.5px] w-12"
            style={{ background: COLORS.outlineVariant }}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Merged gallery (gallery_urls + photo3 + photo4) ─── */
function GallerySection({
  galleryUrls,
  photo3Url,
  photo4Url,
}: {
  galleryUrls: string[] | null | undefined;
  photo3Url: string | null;
  photo4Url: string | null;
}) {
  const urls = [
    ...(galleryUrls || []),
    ...(photo3Url ? [photo3Url] : []),
    ...(photo4Url ? [photo4Url] : []),
  ].filter(Boolean);

  if (!urls.length) return null;

  const [main, ...rest] = urls;

  return (
    <section id="section-gallery" className="mt-8 px-5">
      <div className="text-center mb-6">
        <Eyebrow text="Жылы естеліктер" color={COLORS.primaryContainer} />
        <h2
          className="text-3xl"
          style={{ fontFamily: HEADLINE, fontWeight: 400, color: "#191c1a" }}
        >
          Суреттер топтамасы
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ background: COLORS.primaryContainer }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="md:col-span-2 overflow-hidden rounded-xl h-64 md:h-80"
          style={{
            border: `1px solid ${COLORS.outlineVariant}`,
            boxShadow: "0 10px 30px -10px rgba(61,107,69,0.15)",
          }}
        >
          <img
            src={main}
            alt="Негізгі сурет"
            className="w-full h-full object-cover"
          />
        </div>

        {rest.map((url, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl h-56"
            style={{
              border: `1px solid ${COLORS.outlineVariant}`,
              boxShadow: "0 10px 30px -10px rgba(61,107,69,0.12)",
            }}
          >
            <img
              src={url}
              alt={`сурет ${i + 2}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function VenueMapCard({
  address,
  venueName,
  venueAddress,
  latitude,
  longitude,
}: {
  address: string | null;
  venueName: string | null;
  venueAddress: string | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  if (!venueName && !venueAddress) return null;

  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  const mapQuery = hasCoords
    ? `${latitude},${longitude}`
    : encodeURIComponent(
        [venueName, venueAddress].filter(Boolean).join(", ") ||
          "Алматы, Қазақстан",
      );

  const embedSrc = `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`;

  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        [venueName, venueAddress].filter(Boolean).join(", "),
      )}`;

  return (
    <div className="relative mt-4">
      <div
        className="overflow-hidden rounded-3xl h-64"
        style={{
          border: `1px solid ${COLORS.outlineVariant}`,
          background: `linear-gradient(135deg, #e5ece2 0%, #d7e2d2 100%)`,
        }}
      >
        <iframe
          title="Той өтетін орынның картасы"
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* overlapping glass card */}
      <div
        className="absolute left-4 right-4 bottom-[-56px] rounded-2xl px-6 py-5 text-left"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid ${COLORS.outlineVariant}`,
          boxShadow: "0 12px 30px -8px rgba(61,107,69,0.25)",
        }}
      >
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-1"
          style={{ fontFamily: BODY, color: COLORS.secondary, fontWeight: 700 }}
        >
          {address}
        </p>
        {venueName && (
          <h4
            className="text-xl mb-3"
            style={{ fontFamily: HEADLINE, fontWeight: 500, color: "#191c1a" }}
          >
            {venueName}
          </h4>
        )}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            color: "#fff",
            background: COLORS.primaryDark,
          }}
        >
          <Icon name="near_me" size={16} color="#fff" />
          КАРТАДАН КӨРУ
        </a>
      </div>

      {/* spacer so following content clears the overlapping card */}
      <div style={{ height: 64 }} />
    </div>
  );
}

/* ─── Header bar with Song ─── */
function HeaderBar({
  maleName,
  femaleName,
  extra5,
}: {
  maleName: string;
  femaleName: string;
  extra5?: string | null;
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
        height: 60,
        background: `${COLORS.background}cc`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${COLORS.outlineVariant}80`,
      }}
    >
      <div style={{ width: 32, height: 32 }} />
      <h1
        style={{
          fontFamily: HEADLINE,
          fontSize: 19,
          fontWeight: 500,
          color: COLORS.primary,
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
          color: COLORS.primary,
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

/* ─── Persistent bottom nav bar with scroll-spy ─── */
const BOTTOM_NAV_ITEMS = [
  { id: "section-hero", icon: "home", label: "Басты бет" },
  { id: "section-story", icon: "auto_stories", label: "Тарихымыз" },
  { id: "section-details", icon: "location_on", label: "Орын" },
  { id: "section-gallery", icon: "photo_library", label: "Фотолар" },
  { id: "section-rsvp", icon: "how_to_reg", label: "RSVP" },
];

function BottomNavBar() {
  const [active, setActive] = useState("section-hero");

  useEffect(() => {
    const sections = BOTTOM_NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 8px calc(10px + env(safe-area-inset-bottom, 0px))",
        background: `${COLORS.surfaceLow}e6`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: `1px solid ${COLORS.outlineVariant}80`,
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 -4px 20px rgba(61,107,69,0.08)",
      }}
    >
      {BOTTOM_NAV_ITEMS.map(({ id, icon, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: isActive ? "6px 14px" : "6px 10px",
              borderRadius: 999,
              background: isActive ? COLORS.secondaryContainer : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.25s ease, padding 0.25s ease",
            }}
          >
            <Icon
              name={icon}
              size={20}
              filled={isActive}
              color={isActive ? COLORS.primaryDark : COLORS.onSurfaceVariant}
            />
            <span
              style={{
                fontFamily: BODY,
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? COLORS.primaryDark : COLORS.onSurfaceVariant,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
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
          color="#ffffff"
          style={{ opacity: 0.7, marginBottom: 16 }}
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

export default function Template5({ wedding }: { wedding: Wedding }) {
  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  const weddingDateObj = getWeddingDateObj(wedding.wedding_date);

  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
    wedding.extra5,
  ].filter(Boolean);

  const quoteText =
    wedding.description1 ||
    "Махаббат дегеніміз — бір-біріңе қарау емес, бірге бір бағытқа қарау.";

  const invitationText =
    "Құрметті қонақтар! Балаларымыздың жаңа шаңырақ көтеруіне арналған салтанатты тойымыздың куәсі болып, ақ дастарханымыздан дәм татуға шақырамыз!";

  const isPaymentLocked = String((wedding as any).payment) === "2";

  return (
    <div
      className="min-h-screen"
      style={{
        background: COLORS.background,
        fontFamily: BODY,
        color: "#191c1a",
      }}
    >
      {isPaymentLocked && <PaymentLockOverlay />}

      <GlobalFonts />

      <HeaderBar
        maleName={wedding.male_name}
        femaleName={wedding.female_name}
        extra5={wedding.extra5}
      />

      <div style={{ height: 60 }} />

      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(to right, ${COLORS.primaryContainer}, #a8c5a0, ${COLORS.primaryContainer})`,
        }}
      />

      {/* Hero */}
      <section
        id="section-hero"
        className="relative w-full h-[60vh] overflow-hidden"
      >
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Басты сурет"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, #C5D9C0 0%, ${COLORS.background} 50%, #C5D9C0 100%)`,
            }}
          >
            <Icon
              name="eco"
              size={96}
              color={COLORS.primaryContainer}
              style={{ opacity: 0.35 }}
            />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${COLORS.background} 0%, transparent 55%)`,
          }}
        />
      </section>

      {/* Names */}
      <div className="text-center px-6 -mt-12 relative z-10">
        <Eyebrow text="Той шақыруы" color={COLORS.primaryContainer} />
        <h1
          className="text-5xl font-light italic leading-tight"
          style={{ fontFamily: HEADLINE, color: COLORS.primary }}
        >
          {wedding.male_name}
        </h1>
        <div className="flex items-center justify-center gap-3 my-3">
          <div
            className="h-px w-12"
            style={{
              background: `linear-gradient(to right, transparent, ${COLORS.primaryContainer})`,
            }}
          />
          <Icon name="favorite" size={22} filled color={COLORS.secondary} />
          <div
            className="h-px w-12"
            style={{
              background: `linear-gradient(to left, transparent, ${COLORS.primaryContainer})`,
            }}
          />
        </div>
        <h1
          className="text-5xl font-light italic leading-tight"
          style={{ fontFamily: HEADLINE, color: COLORS.primary }}
        >
          {wedding.female_name}
        </h1>
      </div>

      {/* Invitation greeting — quote-style card, between names and parents */}
      <QuoteSection text={invitationText} />

      <section id="section-story">
        {wedding.organizer && (
          <div className="mx-5 mt-7 text-center">
            <Eyebrow text="Той иелері" color={COLORS.primaryContainer} />
            <div
              className="rounded-2xl px-6 py-6"
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1px solid ${COLORS.outlineVariant}`,
                boxShadow: "0 10px 30px -10px rgba(61,107,69,0.12)",
              }}
            >
              <p
                className="text-base leading-relaxed mt-2"
                style={{ fontFamily: BODY, color: COLORS.onSurfaceVariant }}
              >
                {wedding.organizer}
              </p>
            </div>
          </div>
        )}

        {wedding.description2 && (
          <div className="mx-5 mt-7">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.5)",
                borderLeft: `4px solid ${COLORS.primaryContainer}`,
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: BODY, color: COLORS.onSurfaceVariant }}
              >
                {wedding.description2}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Merged Gallery */}
      <GallerySection
        galleryUrls={wedding.gallery_urls}
        photo3Url={wedding.photo3_url}
        photo4Url={wedding.photo4_url}
      />

      {/* Instagram links */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-7 flex flex-col gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-xs tracking-widest uppercase transition-colors"
              style={{
                fontFamily: BODY,
                border: `1px solid ${COLORS.primaryContainer}`,
                color: COLORS.secondary,
                fontWeight: 600,
              }}
            >
              <Icon name="photo_camera" size={16} /> Instagram →
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-xs tracking-widest uppercase transition-opacity hover:opacity-90"
              style={{
                fontFamily: BODY,
                background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primaryContainer})`,
                fontWeight: 600,
              }}
            >
              <Icon name="photo_camera" size={16} color="#fff" /> Instagram →
            </a>
          )}
        </div>
      )}

      {/* Join Us / Save the Date / Venue */}
      <section id="section-details" className="mx-5 mt-10 mb-2 text-center">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="h-px flex-1"
            style={{ background: `${COLORS.outlineVariant}80` }}
          />
          <Icon name="eco" size={20} color={COLORS.primaryContainer} />
          <div
            className="h-px flex-1"
            style={{ background: `${COLORS.outlineVariant}80` }}
          />
        </div>

        <div
          className="inline-block p-4 border rounded-full mb-6 relative"
          style={{ borderColor: `${COLORS.primary}33` }}
        >
          <div
            className="absolute -top-2 -right-2 text-white w-8 h-8 rounded-full flex items-center justify-center text-[16px]"
            style={{ background: COLORS.secondary }}
          >
            🌾
          </div>
          <Icon name="calendar_today" size={40} color={COLORS.primary} />
        </div>

        <h3
          className="text-2xl mb-2"
          style={{
            fontFamily: HEADLINE,
            fontWeight: 400,
            color: COLORS.primary,
          }}
        >
          Бізбен бірге болыңыз
        </h3>
        <p
          className="text-sm mb-6 px-4"
          style={{ fontFamily: BODY, color: COLORS.onSurfaceVariant }}
        >
          Өміріміздің ең қымбат сәтіне куә болуға шақырамыз.
        </p>

        <div
          className="rounded-3xl p-6 space-y-5 max-w-md mx-auto"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${COLORS.outlineVariant}`,
          }}
        >
          {(date || time) && (
            <div className="flex items-center justify-center gap-6 py-4">
              {date && weddingDateObj && (
                <>
                  <div className="text-center">
                    <span
                      className="block text-[10px] uppercase tracking-[0.2em] mb-1"
                      style={{
                        fontFamily: BODY,
                        color: COLORS.secondary,
                        fontWeight: 600,
                      }}
                    >
                      Ай
                    </span>
                    <span
                      className="block text-xl"
                      style={{ fontFamily: HEADLINE, color: COLORS.primary }}
                    >
                      {getWeddingMonthName(weddingDateObj)}
                    </span>
                  </div>
                  <div
                    className="h-10 w-px"
                    style={{ background: COLORS.outlineVariant }}
                  />
                  <div className="text-center">
                    <span
                      className="block text-[10px] uppercase tracking-[0.2em] mb-1"
                      style={{
                        fontFamily: BODY,
                        color: COLORS.secondary,
                        fontWeight: 600,
                      }}
                    >
                      Күн
                    </span>
                    <span
                      className="block text-2xl"
                      style={{ fontFamily: HEADLINE, color: COLORS.primary }}
                    >
                      {getWeddingDay(weddingDateObj)}
                    </span>
                  </div>
                </>
              )}
              {time && (
                <>
                  <div
                    className="h-10 w-px"
                    style={{ background: COLORS.outlineVariant }}
                  />
                  <div className="text-center">
                    <span
                      className="block text-[10px] uppercase tracking-[0.2em] mb-1"
                      style={{
                        fontFamily: BODY,
                        color: COLORS.secondary,
                        fontWeight: 600,
                      }}
                    >
                      Уақыт
                    </span>
                    <span
                      className="block text-xl"
                      style={{ fontFamily: HEADLINE, color: COLORS.primary }}
                    >
                      {time}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {extras.length > 0 && (
            <div
              className="pt-4 space-y-2 text-left"
              style={{ borderTop: `1px solid ${COLORS.outlineVariant}80` }}
            >
              {extras.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Icon
                    name="spa"
                    size={13}
                    color={COLORS.primaryContainer}
                    style={{ marginTop: 2 }}
                  />
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: BODY, color: COLORS.secondary }}
                  >
                    {e}
                  </p>
                </div>
              ))}
            </div>
          )}

          {wedding.photo5_url && (
            <div
              className="pt-4"
              style={{ borderTop: `1px solid ${COLORS.outlineVariant}80` }}
            >
              <div
                className="overflow-hidden rounded-2xl"
                style={{ border: `1px solid ${COLORS.outlineVariant}` }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Қосымша сурет"
                  className="w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Venue map card (Google Maps embed) ── */}
        <VenueMapCard
          address={wedding.venue_address}
          venueName={wedding.venue_name}
          venueAddress={wedding.venue_address}
          latitude={(wedding as any).latitude}
          longitude={(wedding as any).longitude}
        />
      </section>

      {/* Love quote — moved to sit right above RSVP */}
      <QuoteSection text={quoteText} />

      {/* RSVP */}
      <section id="section-rsvp" className="mx-5 mt-10">
        <Eyebrow text="Қатысуыңызды растаңыз" color={COLORS.primaryContainer} />
        <div
          className="rounded-3xl p-6 mt-4"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${COLORS.outlineVariant}`,
          }}
        >
          <RSVPSection
            weddingId={wedding.id}
            accentColor={COLORS.primary}
            lightColor={COLORS.surfaceLow}
          />
        </div>
      </section>

      {/* Messages */}
      <section id="section-messages" className="mx-5 mt-10">
        <MessageSection
          weddingId={wedding.id}
          accentColor={COLORS.primary}
          lightColor={COLORS.surfaceLow}
          borderColor="border-green-100"
        />
      </section>

      {/* Footer */}
      <div className="text-center py-10 mt-4" style={{ paddingBottom: 100 }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="h-px w-10"
            style={{ background: `${COLORS.outlineVariant}80` }}
          />
          <Icon name="eco" size={16} color={COLORS.primaryContainer} />
          <div
            className="h-px w-10"
            style={{ background: `${COLORS.outlineVariant}80` }}
          />
        </div>
        <p
          className="text-xs tracking-widest uppercase"
          style={{
            fontFamily: BODY,
            color: COLORS.primaryContainer,
            fontWeight: 600,
          }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            className="text-xs mt-1"
            style={{ fontFamily: BODY, color: `${COLORS.primaryContainer}90` }}
          >
            {date}
          </p>
        )}
      </div>

      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(to right, ${COLORS.primaryContainer}, #a8c5a0, ${COLORS.primaryContainer})`,
        }}
      />

      <BottomNavBar />
    </div>
  );
}
