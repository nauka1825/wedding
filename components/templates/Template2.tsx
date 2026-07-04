"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
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
} from "react-icons/fa";
import { MdOutlineCalendarMonth, MdOutlineSchedule } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import Song from "../song";
import RSVPSection from "../RSVPSection";

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

/* ─── useInView (scroll-reveal, same behavior as HTML's IntersectionObserver .reveal) ─── */
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

/* ─── Reveal wrapper — mirrors HTML's .reveal / .reveal.active classes exactly ─── */
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

/* ─── OrnamentDivider — exact match of HTML's .ornament-line + heart icon divider ─── */
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

/* ─── GlassCard — exact match of HTML's .glass-card class ─── */
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

/* ─────────────────────────────────────────────────────────────
   HEADER — exact match of HTML's fixed top app bar:
   menu (left) | couple names (center, italic Playfair) | music (right)
   ───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   NAV DRAWER — replaces the always-visible footer nav.
   Hidden by default; slides up from the bottom when the header
   menu button is tapped. Tapping a link scrolls + closes it.
   ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "section-hero", icon: FaHeart, label: "Есімдер" },
  { id: "section-photos", icon: FaImages, label: "Фотолар" },
  { id: "section-details", icon: FaCalendarAlt, label: "Мәліметтер" },
  { id: "section-messages", icon: FaEnvelopeOpenText, label: "Тілектер" },
];

function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          }}
        >
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                flex: 1,
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

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — Hero (photo + names + invitation text)
   Matches HTML's Hero section + Names & Invitation section
   ───────────────────────────────────────────────────────────── */
// Hero background — the rings photo used in the original HTML reference design
const HERO_STOCK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn5oZgkek4iAV6h71GC-QhCepDCkhbQ93URmx38u8uY-Adz4ZhbQGYtmfV2PCvW0zgPtJATdCd7kQclvZNuBygcNXNJyATmH5522hwEh5aBuJy633v4qsZrupS6JFpkjqTuM8DKjdj9SPygqBIlgqsny3lL3Q6DYDNlkfmVopO8TBH9RIWjXi-Bcbds5HLC1btsg0Qu7ixUTtgA113YLN6PeIfabXS0_b3YTBAY5wUJtGJbCa4bvE";

function HeroSection({
  mainPhotoUrl,
  maleName,
  femaleName,
}: {
  mainPhotoUrl?: string | null;
  maleName: string;
  femaleName: string;
}) {
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
            Wedding Invitation
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
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 15,
              lineHeight: 1.7,
              fontStyle: "italic",
              color: C.onSurfaceVariant,
            }}
          >
            Құрметті ағайын-туыс, құда-жекжат, дос-жаран, әріптестер мен
            көршілер! Сіздерді ұлымыз {maleName} пен келініміз {femaleName}
            -ның үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі
            қонағы болуға шақырамыз!
          </p>
        </div>
        <BsStars size={26} style={{ color: C.gold, marginTop: 8 }} />
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION — Organizer / Той иелері
   Matches HTML's "Parents Section" — plain glass-card pill
   ───────────────────────────────────────────────────────────── */
function OrganizerSection({
  organizer,
  maleParents,
  femaleParents,
}: {
  organizer: string;
  maleParents?: string | null;
  femaleParents?: string | null;
}) {
  const lines = organizer.split("\n").filter(Boolean);
  return (
    <Reveal
      className="text-center"
      style={{ background: C.surfaceContainerLow, padding: "4rem 5vw" }}
    >
      <h4 style={{ ...F_LABEL_CAPS, color: C.secondary, marginBottom: 16 }}>
        Той иелері: Ата-анасы
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
                  Күйеу жақ
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
                  Келін жақ
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

/* ─────────────────────────────────────────────────────────────
   SECTION 2 — Photos / gallery
   Matches HTML's horizontal snap-scroll gallery w/ prev-next arrows
   ───────────────────────────────────────────────────────────── */
function PhotosSection({
  photo3Url,
  galleryUrls,
}: {
  photo3Url: string | null;
  galleryUrls: string[] | null | undefined;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };
  const urls = galleryUrls?.length ? galleryUrls : photo3Url ? [photo3Url] : [];
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
              Our Story
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
              Wedding Memories
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

/* ─────────────────────────────────────────────────────────────
   SECTION 3 — Details (date / time / venue / extras)
   Matches HTML's Details Section grid + venue block exactly
   ───────────────────────────────────────────────────────────── */
function DetailsSection({
  date,
  time,
  venueName,
  venueAddress,
  extras,
  photo5Url,
}: {
  date: string | null;
  time: string | null;
  venueName: string | null;
  venueAddress: string | null;
  extras: (string | null | undefined)[];
  photo5Url: string | null;
}) {
  const timeSubtitle = (() => {
    if (!time) return null;
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    if (Number.isNaN(h)) return null;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `Sharp at ${h}:${mStr} ${ampm}`;
  })();

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
                Күні / Date
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
                Уақыты / Time
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
                Сағат {time}-де
              </p>
              {timeSubtitle && (
                <p
                  style={{
                    ...F_BODY_MD,
                    fontSize: 15,
                    fontStyle: "italic",
                    color: C.secondary,
                    margin: "4px 0 0",
                  }}
                >
                  {timeSubtitle}
                </p>
              )}
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
            Мекен-жайы / Venue
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
          <button
            style={{
              marginTop: 24,
              padding: "12px 32px",
              background: C.primary,
              color: C.secondaryFixed,
              border: `1px solid ${C.secondary}`,
              ...F_LABEL_CAPS,
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.onPrimaryFixedVariant)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
          >
            КАРТАДАН КӨРУ
          </button>
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

/* ─────────────────────────────────────────────────────────────
   SECTION 4 — RSVP + Wishes
   Matches HTML's glass-card RSVP form container
   ───────────────────────────────────────────────────────────── */
function MessagesSection({ weddingId }: { weddingId: string }) {
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
            RSVP
          </h3>
          <p
            style={{
              ...F_BODY_MD,
              fontStyle: "italic",
              color: C.onSurfaceVariant,
              marginBottom: 32,
            }}
          >
            Сіздің келуіңіз біз үшін үлкен мәртебе!
          </p>
          <div style={{ marginBottom: 40 }}>
            <RSVPSection
              weddingId={weddingId}
              accentColor={C.primary}
              lightColor="#f7f0dc"
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
            />
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER — exact match of HTML footer: poem + shimmer name
   ───────────────────────────────────────────────────────────── */
function FooterSection({
  maleName,
  femaleName,
}: {
  maleName: string;
  femaleName: string;
}) {
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
          {
            "Біз екеуміз тек екеуміз\nЖүректермен бір екенбіз\nМен сен үшін сен мен үшін\nЖаралған екенбіз"
          }
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
        {femaleName.toUpperCase()}. BUILT WITH LOVE.
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

/* ─── PaymentLockOverlay — brought over from Template1's design ─── */
function PaymentLockOverlay({ extra5 }: { extra5?: string | null }) {
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
          Төлем төленбеген
        </p>
        <div
          style={{
            color: "#ffffff",
            width: 32,
            height: 32,
            margin: "16px auto 0",
          }}
        >
          <Song extra5={extra5} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
   ───────────────────────────────────────────────────────────── */
export default function Template2({ wedding }: { wedding: Wedding }) {
  const [navOpen, setNavOpen] = useState(false);

  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
  ].filter(Boolean);

  const extra5 = wedding.extra5 ? wedding.extra5 : null;
  const isPaymentLocked = String((wedding as any).payment) === "2";

  if (isPaymentLocked) {
    return <PaymentLockOverlay extra5={extra5} />;
  }

  return (
    <>
      <GlobalStyles />
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
        />

        {wedding.organizer && (
          <OrganizerSection
            organizer={wedding.organizer}
            maleParents={(wedding as any).male_parents}
            femaleParents={(wedding as any).female_parents}
          />
        )}

        <DetailsSection
          date={date}
          time={time}
          venueName={wedding.venue_name}
          venueAddress={wedding.venue_address}
          extras={extras}
          photo5Url={wedding.photo5_url}
        />

        <PhotosSection
          photo3Url={wedding.photo3_url}
          galleryUrls={wedding.gallery_urls}
        />

        <MessagesSection weddingId={wedding.id} />

        <FooterSection
          maleName={wedding.male_name}
          femaleName={wedding.female_name}
        />
      </div>
    </>
  );
}
