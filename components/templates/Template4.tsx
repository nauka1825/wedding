"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicPlayer from "../MusicPlayer";

const DEFAULT_WEDDING: Wedding = {
  id: "preview",
  created_at: "2025-01-01T00:00:00.000Z",
  male_name: "",
  female_name: "Альбина",
  wedding_date: "2025-09-14T17:00",
  venue_name: "Sky Palace",
  venue_address: "Баян-Өлгий, Улаанбаатар",
  organizer: "Руслан мен Ләйлә",
  phone: "+7 701 234 5678",
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
};

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

function FadeIn({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
}) {
  const { ref, inView } = useInView();
  const translate =
    from === "bottom"
      ? "translateY(28px)"
      : from === "top"
        ? "translateY(-28px)"
        : from === "left"
          ? "translateX(-28px)"
          : "translateX(28px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0)" : translate,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function GallerySwiper({ urls }: { urls: string[] }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (child) {
      el.scrollTo({
        left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
    setActive(i);
  };

  useEffect(() => {
    if (urls.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % urls.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [urls.length]);

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

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
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
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onTouchStart={resetTimer}
        onMouseDown={resetTimer}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {urls.map((url, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 w-[78vw] max-w-[320px] h-56 overflow-hidden rounded-2xl"
            style={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: active === i ? "scale(1)" : "scale(0.93)",
              border: "1px solid rgba(168,216,240,0.4)",
              boxShadow:
                active === i
                  ? "0 12px 40px rgba(91,168,213,0.22), 0 2px 8px rgba(91,168,213,0.1)"
                  : "0 2px 8px rgba(91,168,213,0.06)",
            }}
          >
            <img
              src={url}
              alt={`зураг ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                scrollTo(i);
                resetTimer();
              }}
              className="transition-all duration-300 rounded-full overflow-hidden relative"
              style={{
                width: active === i ? 20 : 7,
                height: 7,
                background: "#B8D8EE",
                opacity: active === i ? 1 : 0.45,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#5BA8D5",
                    animation: "progress 5s linear forwards",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─── Icon Components ───
const IconDiamond = ({
  size = 14,
  color = "#A8D8F0",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L22 12L12 22L2 12Z" fill={color} />
  </svg>
);

const IconCalendar = ({
  size = 15,
  color = "#6BB8D8",
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
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconClock = ({
  size = 13,
  color = "#5BA8D5",
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
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconMapPin = ({
  size = 15,
  color = "#6BB8D8",
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
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" fill={color} stroke="none" />
  </svg>
);

const IconPhone = ({
  size = 15,
  color = "#6BB8D8",
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
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconUsers = ({
  size = 15,
  color = "#6BB8D8",
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
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCheck = ({
  size = 10,
  color = "#5BA8D5",
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
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Template4({ wedding: raw }: { wedding: Wedding }) {
  const wedding: Wedding = {
    ...DEFAULT_WEDDING,
    ...Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== null && v !== "" && v !== undefined,
      ),
    ),
  };

  const date = formatDate(wedding.wedding_date);
  const time = wedding.wedding_date?.includes("T")
    ? wedding.wedding_date.split("T")[1].slice(0, 5)
    : null;

  const extras = [
    wedding.extra1,
    wedding.extra2,
    wedding.extra3,
    wedding.extra4,
    wedding.extra5,
  ].filter(Boolean);

  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #EAF6FF 0%, #F5FBFF 30%, #EDF4FB 60%, #DDEEFA 100%)",
        fontFamily: "'Playfair Display', 'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-14px) scale(1.03); }
        }
        @keyframes drift {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(168,216,240,0.45); }
          70% { box-shadow: 0 0 0 10px rgba(168,216,240,0); }
          100% { box-shadow: 0 0 0 0 rgba(168,216,240,0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.12; transform: scale(0.8); }
          50% { opacity: 0.55; transform: scale(1.2); }
        }
        @keyframes hero-reveal {
          from { clip-path: inset(100% 0 0 0); opacity: 0; }
          to { clip-path: inset(0% 0 0 0); opacity: 1; }
        }
        .hero-img { animation: hero-reveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .float-orb { animation: float-slow 7s ease-in-out infinite; }
        .drift-orb { animation: drift 9s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #1a5070 30%, #7EC8F0 50%, #1a5070 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .twinkle { animation: twinkle 2.5s ease-in-out infinite; }
        .twinkle:nth-child(2) { animation-delay: 0.8s; }
        .twinkle:nth-child(3) { animation-delay: 1.6s; }

        .label-text {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          font-size: 10px;
          color: rgba(91, 168, 213, 0.65);
        }
        .body-text {
          font-family: 'Jost', sans-serif;
          font-weight: 300;
        }
        .display-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
        }
        .heading-text {
          font-family: 'Playfair Display', serif;
        }

        .glass-card {
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(168,216,240,0.35);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(91,168,213,0.08), 0 1px 0 rgba(255,255,255,0.9) inset;
        }
      `}</style>

      {/* Top bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(to right, #C8E9FA, #5BA8D5, #A8D8F0, #5BA8D5, #C8E9FA)",
        }}
      />

      {/* Floating orbs */}
      <div
        className="float-orb absolute top-24 right-4 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,216,240,0.18) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="drift-orb absolute top-60 left-2 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(100,180,230,0.12) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Twinkle stars */}
      <div
        className="absolute top-16 left-8 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="twinkle absolute"
            style={{ top: `${i * 22}px`, left: `${i * 18}px` }}
            width="7"
            height="7"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"
              fill="#A8D8F0"
            />
          </svg>
        ))}
      </div>

      {/* ─── HERO ─── */}
      <div className="relative w-full h-[65vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className={`hero-img w-full h-full object-cover transition-all duration-1000 ${heroLoaded ? "scale-100" : "scale-110"}`}
            style={{ filter: "brightness(0.88) saturate(1.08)" }}
            onLoad={() => setHeroLoaded(true)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-5"
            style={{
              background:
                "linear-gradient(160deg, #C8E9FA 0%, #E8F5FF 50%, #BEE3F8 100%)",
            }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="absolute w-28 h-28 rounded-full border border-sky-200/40"
                style={{ animation: "spin-slow 20s linear infinite" }}
              />
              <div
                className="absolute w-20 h-20 rounded-full border border-sky-200/30"
                style={{ animation: "spin-slow 15s linear infinite reverse" }}
              />
              <div
                className="w-14 h-14 rounded-full border-2 border-sky-200/60 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.3)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    fill="#A8D8F0"
                    opacity="0.65"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #EAF6FF 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Event badge */}
      <FadeIn delay={100} className="flex justify-center -mt-5 relative z-10">
        <div
          className="relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(168,216,240,0.45)",
            boxShadow:
              "0 4px 20px rgba(91,168,213,0.12), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(168,216,240,0.2) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          />
          <IconDiamond size={11} color="#6BB8D8" />
          <div className="flex items-center gap-2">
            <div
              className="w-px h-3 rounded-full"
              style={{ background: "rgba(168,216,240,0.55)" }}
            />
            <span
              className="label-text relative"
              style={{
                color: "#1D6B8E",
                letterSpacing: "0.42em",
                fontSize: "10px",
              }}
            >
              Қыз ұзату
            </span>
            <div
              className="w-px h-3 rounded-full"
              style={{ background: "rgba(168,216,240,0.55)" }}
            />
          </div>
          <IconDiamond size={11} color="#6BB8D8" />
        </div>
      </FadeIn>

      {/* ─── NAME ─── */}
      <div className="text-center px-8 mt-7 relative z-10">
        <FadeIn delay={150}>
          <p className="label-text mb-3">Арнайы шақыру</p>
          <h1
            className="shimmer-text heading-text italic font-normal leading-tight"
            style={{ fontSize: "52px", letterSpacing: "-0.01em" }}
          >
            {wedding.female_name}
          </h1>
        </FadeIn>

        <FadeIn delay={250}>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div
              className="h-px flex-1 max-w-[65px]"
              style={{
                background: "linear-gradient(to right, transparent, #A8D8F0)",
              }}
            />
            <IconDiamond size={18} color="#A8D8F0" />
            <div
              className="h-px flex-1 max-w-[65px]"
              style={{
                background: "linear-gradient(to left, transparent, #A8D8F0)",
              }}
            />
          </div>
        </FadeIn>
      </div>

      {/* ─── DESCRIPTION 1 ─── */}
      {wedding.description1 && (
        <FadeIn delay={100} className="mx-5 mt-8 relative z-10">
          <div
            className="glass-card relative px-7 py-7"
            style={{ borderRadius: "20px" }}
          >
            <span
              className="absolute -top-4 left-5 text-5xl leading-none"
              style={{
                color: "#A8D8F0",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
              }}
            >
              "
            </span>
            <p
              className="display-text italic leading-relaxed text-center mt-1"
              style={{ color: "#2F6E91", fontSize: "17px" }}
            >
              {wedding.description1}
            </p>
            <span
              className="absolute -bottom-5 right-5 text-5xl leading-none rotate-180 block"
              style={{
                color: "#A8D8F0",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
              }}
            >
              "
            </span>
          </div>
        </FadeIn>
      )}

      {/* ─── ORGANIZER ─── */}
      {wedding.organizer && (
        <FadeIn delay={100} className="mx-5 mt-10 relative z-10">
          <p className="label-text text-center mb-3">Той иелері</p>
          <div className="glass-card px-5 py-5 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <IconUsers size={16} color="#A8D8F0" />
              <p
                className="display-text font-light text-center"
                style={{ color: "#2F6E91", fontSize: "18px" }}
              >
                {wedding.organizer}
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ─── GALLERY ─── */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-10 relative z-10">
          <FadeIn>
            <p className="label-text text-center mb-4">Фотоальбом</p>
          </FadeIn>
          <GallerySwiper urls={wedding.gallery_urls} />
        </div>
      )}

      {/* ─── DIVIDER ─── */}
      <div className="mx-5 mt-10 mb-2 relative z-10">
        <FadeIn>
          <div className="flex items-center gap-3 mb-7">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, transparent, #A8D8F0)",
              }}
            />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                animation: "pulse-ring 2.5s ease-in-out infinite",
                background: "rgba(168,216,240,0.18)",
                border: "1px solid rgba(168,216,240,0.38)",
              }}
            >
              <IconDiamond size={14} color="#6BB8D8" />
            </div>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to left, transparent, #A8D8F0)",
              }}
            />
          </div>
        </FadeIn>

        {/* ─── INFO CARD ─── */}
        <FadeIn>
          <div className="glass-card p-6 space-y-5">
            {/* Date & Time */}
            {(date || time) && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <IconCalendar size={14} color="#6BB8D8" />
                  <p className="label-text">Күні & Уақыты</p>
                </div>
                {date && (
                  <p
                    className="display-text italic font-light text-center"
                    style={{ color: "#1D5F82", fontSize: "22px" }}
                  >
                    {date}
                  </p>
                )}
                {time && (
                  <div
                    className="mt-2.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                    style={{
                      background: "rgba(168,216,240,0.14)",
                      border: "1px solid rgba(168,216,240,0.28)",
                    }}
                  >
                    <IconClock size={12} color="#5BA8D5" />
                    <p
                      className="body-text font-medium tracking-widest"
                      style={{ color: "#1D6B8E", fontSize: "14px" }}
                    >
                      {time}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Venue */}
            {(wedding.venue_name || wedding.venue_address) && (
              <div
                className="text-center border-t pt-5"
                style={{ borderColor: "rgba(168,216,240,0.3)" }}
              >
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <IconMapPin size={14} color="#6BB8D8" />
                  <p className="label-text">Той орны мекенжайы</p>
                </div>
                {wedding.venue_name && (
                  <p
                    className="heading-text italic font-normal text-center"
                    style={{ color: "#1D5F82", fontSize: "20px" }}
                  >
                    {wedding.venue_name}
                  </p>
                )}
                {wedding.venue_address && (
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <IconMapPin size={12} color="#8BBDD4" />
                    <p
                      className="body-text text-center"
                      style={{
                        color: "#6AA8C4",
                        fontSize: "12px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {wedding.venue_address}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Phone */}
            {wedding.phone && (
              <div
                className="text-center border-t pt-5"
                style={{ borderColor: "rgba(168,216,240,0.3)" }}
              >
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <IconPhone size={14} color="#6BB8D8" />
                  <p className="label-text">Байланыс</p>
                </div>
                <a
                  href={`tel:${wedding.phone}`}
                  className="body-text font-light tracking-widest hover:underline text-center block"
                  style={{ color: "#2F6E91", fontSize: "17px" }}
                >
                  {wedding.phone}
                </a>
              </div>
            )}

            {/* Extras */}
            {extras.length > 0 && (
              <div
                className="border-t pt-5 space-y-3"
                style={{ borderColor: "rgba(168,216,240,0.3)" }}
              >
                {extras.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{
                        background: "rgba(168,216,240,0.18)",
                        border: "1px solid rgba(168,216,240,0.38)",
                      }}
                    >
                      <IconCheck size={9} color="#5BA8D5" />
                    </div>
                    <p
                      className="body-text leading-relaxed text-left"
                      style={{ color: "#2F6E91", fontSize: "14px" }}
                    >
                      {e}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Extra photo */}
            {wedding.photo5_url && (
              <div
                className="border-t pt-5"
                style={{ borderColor: "rgba(168,216,240,0.3)" }}
              >
                <div
                  className="overflow-hidden rounded-2xl border"
                  style={{ borderColor: "rgba(168,216,240,0.35)" }}
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
        </FadeIn>
      </div>

      {/* Messages */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#2C5F7A"
        lightColor="#EAF6FF"
        borderColor="border-sky-100"
      />

      {/* Footer */}
      <FadeIn className="text-center py-12 mt-4 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to right, transparent, #A8D8F0)",
            }}
          />
          <IconDiamond size={13} color="#A8D8F0" />
          <div
            className="h-px w-12"
            style={{
              background: "linear-gradient(to left, transparent, #A8D8F0)",
            }}
          />
        </div>
        <p
          className="heading-text italic font-normal"
          style={{ color: "#8BBDD4", fontSize: "18px" }}
        >
          {wedding.female_name}
        </p>
        {date && (
          <p
            className="label-text mt-1.5 text-center"
            style={{ color: "#A8D8F0" }}
          >
            {date}
          </p>
        )}
      </FadeIn>

      {/* Bottom bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(to right, #C8E9FA, #5BA8D5, #A8D8F0, #5BA8D5, #C8E9FA)",
        }}
      />
      <MusicPlayer />
    </div>
  );
}
