"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";
import MusicMan from "../MusicMan";

// ─── ICONS (react svg) ───
const IcCalendar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="#C4A0B0" stroke="none" />
    <circle cx="12" cy="15" r="1" fill="#C4A0B0" stroke="none" />
    <circle cx="16" cy="15" r="1" fill="#C4A0B0" stroke="none" />
  </svg>
);

const IcClock = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IcMapPin = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" fill="#C4A0B0" stroke="none" />
  </svg>
);

const IcMapPinTiny = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="2"
    strokeLinecap="round"
    style={{ marginTop: 2, flexShrink: 0 }}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" fill="#C4A0B0" stroke="none" />
  </svg>
);

const IcPhone = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.6 1.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IcUsers = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C4A0B0"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcInstagram = ({ color = "#9B6B7E" }: { color?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill={color} stroke="none" />
  </svg>
);

const IcHeart = () => (
  <svg width="30" height="26" viewBox="0 0 30 26" fill="none">
    <path
      d="M15 23 C15 23 2 15 2 8 C2 4.5 5 2 8.5 2 C11 2 13 3.2 15 5 C17 3.2 19 2 21.5 2 C25 2 28 4.5 28 8 C28 15 15 23 15 23Z"
      fill="#F9D5E5"
      stroke="#E8B4C8"
      strokeWidth="1"
    />
    <circle cx="6" cy="5" r="1.2" fill="#F2C8DC" opacity="0.6" />
    <circle cx="24" cy="5" r="1.2" fill="#F2C8DC" opacity="0.6" />
    <circle cx="15" cy="2" r="1" fill="#F2C8DC" opacity="0.5" />
  </svg>
);

const IcRing = () => (
  <svg width="42" height="42" viewBox="0 0 52 52" fill="none">
    <circle
      cx="18"
      cy="30"
      r="12"
      stroke="#C8A84B"
      strokeWidth="2.2"
      fill="none"
    />
    <circle
      cx="18"
      cy="30"
      r="8"
      stroke="#E8C96A"
      strokeWidth="1.2"
      fill="none"
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      return (
        <circle
          key={i}
          cx={18 + 10.5 * Math.cos(rad)}
          cy={30 + 10.5 * Math.sin(rad)}
          r="0.9"
          fill="#D4AF37"
          opacity="0.8"
        />
      );
    })}
    <circle
      cx="34"
      cy="22"
      r="12"
      stroke="#C8A84B"
      strokeWidth="2.2"
      fill="none"
    />
    <circle
      cx="34"
      cy="22"
      r="8"
      stroke="#E8C96A"
      strokeWidth="1.2"
      fill="none"
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      return (
        <circle
          key={i}
          cx={34 + 10.5 * Math.cos(rad)}
          cy={22 + 10.5 * Math.sin(rad)}
          r="0.9"
          fill="#D4AF37"
          opacity="0.8"
        />
      );
    })}
    <path
      d="M34 13 L35.2 9.5 L36.4 13 L40 14 L36.4 15 L35.2 18.5 L34 15 L30.5 14 Z"
      fill="#F5D878"
      opacity="0.9"
    />
    <circle cx="15" cy="21" r="1.1" fill="#F5D878" opacity="0.7" />
    <circle cx="41" cy="30" r="0.8" fill="#F5D878" opacity="0.6" />
  </svg>
);

// ─── ORNAMENTS ───
const FloralDivider = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 280 32"
    fill="none"
    className={className}
    style={{ width: "100%", maxWidth: 280, height: 32 }}
  >
    <defs>
      <linearGradient id="vine-l" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#DDB4C8" stopOpacity="0" />
        <stop offset="100%" stopColor="#DDB4C8" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="vine-r" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#DDB4C8" stopOpacity="1" />
        <stop offset="100%" stopColor="#DDB4C8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 16 Q15 16 25 16"
      stroke="url(#vine-l)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M25 16 Q30 16 35 14 Q40 12 42 16 Q40 20 35 18 Q30 16 35 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M42 16 Q52 16 60 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M60 16 Q64 16 66 13 Q70 8 73 11 Q75 14 72 17 Q69 20 66 17 Q64 16 66 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="37" cy="10" r="1.2" fill="#E8C0D0" opacity="0.7" />
    <circle cx="69" cy="22" r="1" fill="#E8C0D0" opacity="0.6" />
    <path
      d="M73 16 Q88 16 96 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M96 16 Q100 16 102 14 Q105 10 108 13 Q110 16 107 19 Q104 21 101 18 Q100 16 102 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M108 16 Q118 16 124 16"
      stroke="#DDB4C8"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
    <g transform="translate(128,6)">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 + Math.cos(r) * 7}
            cy={10 + Math.sin(r) * 7}
            rx="3.5"
            ry="5"
            transform={`rotate(${deg + 90},${12 + Math.cos(r) * 7},${10 + Math.sin(r) * 7})`}
            fill="#F2C8DC"
            opacity="0.55"
          />
        );
      })}
      {[30, 90, 150, 210, 270, 330].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 + Math.cos(r) * 4}
            cy={10 + Math.sin(r) * 4}
            rx="2.2"
            ry="3.5"
            transform={`rotate(${deg + 90},${12 + Math.cos(r) * 4},${10 + Math.sin(r) * 4})`}
            fill="#E8A8C4"
            opacity="0.65"
          />
        );
      })}
      <circle cx="12" cy="10" r="3" fill="#D4809C" opacity="0.8" />
      <circle cx="12" cy="10" r="1.5" fill="#C06080" opacity="0.9" />
      <circle cx="4" cy="2" r="1" fill="#F2C8DC" opacity="0.5" />
      <circle cx="20" cy="2" r="0.8" fill="#F2C8DC" opacity="0.4" />
      <circle cx="4" cy="19" r="0.8" fill="#F2C8DC" opacity="0.4" />
      <circle cx="20" cy="19" r="1" fill="#F2C8DC" opacity="0.5" />
    </g>
    <path
      d="M156 16 Q162 16 172 16"
      stroke="#DDB4C8"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
    <path
      d="M172 16 Q176 16 178 18 Q181 22 184 19 Q186 16 183 13 Q180 10 177 14 Q176 16 178 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="180" cy="22" r="1" fill="#E8C0D0" opacity="0.6" />
    <path
      d="M184 16 Q192 16 207 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M207 16 Q211 16 213 14 Q216 10 219 13 Q221 16 218 19 Q215 21 212 18 Q211 16 213 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="211" cy="10" r="1.2" fill="#E8C0D0" opacity="0.7" />
    <path
      d="M219 16 Q227 16 238 16"
      stroke="#DDB4C8"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <path
      d="M238 16 Q243 16 245 14 Q248 9 251 12 Q253 16 250 18 Q247 21 244 17 Q243 16 245 16"
      stroke="#DDB4C8"
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="244" cy="22" r="1" fill="#E8C0D0" opacity="0.5" />
    <path
      d="M251 16 Q261 16 280 16"
      stroke="url(#vine-r)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

const CardWaveDecor = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 360 28"
    fill="none"
    style={{
      width: "100%",
      height: 28,
      transform: flip ? "scaleY(-1)" : undefined,
    }}
  >
    <defs>
      <linearGradient id={`wave-grad-${flip}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#E8B4C8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M0 20 Q30 8 60 20 Q90 32 120 20 Q150 8 180 20 Q210 32 240 20 Q270 8 300 20 Q330 32 360 20"
      stroke={`url(#wave-grad-${flip})`}
      strokeWidth="0.9"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M0 24 Q30 12 60 24 Q90 36 120 24 Q150 12 180 24 Q210 36 240 24 Q270 12 300 24 Q330 36 360 24"
      stroke="#F2C8DC"
      strokeWidth="0.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.3"
    />
    {[60, 120, 180, 240, 300].map((x, i) => (
      <g key={i} transform={`translate(${x},20)`}>
        <path d="M0-3 L2 0 L0 3 L-2 0Z" fill="#DDA8C0" opacity="0.55" />
      </g>
    ))}
    <g transform="translate(180,14)">
      <path d="M0-5 L3 0 L0 5 L-3 0Z" fill="#CC8EAA" opacity="0.7" />
      <circle cx="0" cy="0" r="1.5" fill="#B87090" opacity="0.8" />
    </g>
  </svg>
);

const SmallDivider = () => (
  <svg viewBox="0 0 160 20" fill="none" style={{ width: 160, height: 20 }}>
    <defs>
      <linearGradient id="sdiv-l" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="sdiv-r" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8B4C8" stopOpacity="1" />
        <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 10 L55 10"
      stroke="url(#sdiv-l)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
    <circle cx="62" cy="10" r="2" fill="#F2C8DC" opacity="0.6" />
    {[0, 72, 144, 216, 288].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return (
        <ellipse
          key={i}
          cx={80 + Math.cos(r) * 4}
          cy={10 + Math.sin(r) * 4}
          rx="2"
          ry="3"
          transform={`rotate(${deg + 90},${80 + Math.cos(r) * 4},${10 + Math.sin(r) * 4})`}
          fill="#EEBAD0"
          opacity="0.5"
        />
      );
    })}
    <circle cx="80" cy="10" r="2.2" fill="#D4809C" opacity="0.8" />
    <circle cx="80" cy="10" r="1" fill="#C06080" opacity="0.9" />
    <circle cx="98" cy="10" r="2" fill="#F2C8DC" opacity="0.6" />
    <path
      d="M105 10 L160 10"
      stroke="url(#sdiv-r)"
      strokeWidth="0.7"
      strokeLinecap="round"
    />
  </svg>
);

// ─── GALLERY ───
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
            className="snap-center flex-shrink-0 overflow-hidden"
            style={{
              width: "72vw",
              maxWidth: 300,
              height: 220,
              borderRadius: 20,
              border: "1px solid rgba(232,180,200,0.35)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: active === i ? "scale(1)" : "scale(0.93)",
              boxShadow:
                active === i
                  ? "0 8px 32px rgba(196,160,176,0.32)"
                  : "0 2px 8px rgba(196,160,176,0.08)",
            }}
          >
            <img
              src={url}
              alt={`сурет ${i + 1}`}
              className="w-full h-full object-cover"
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
              className="transition-all duration-300 rounded-full overflow-hidden relative"
              style={{
                width: active === i ? 20 : 7,
                height: 7,
                background: "#E8B4C8",
                opacity: active === i ? 1 : 0.45,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#C4A0B0",
                    animation: "gallery-progress 5s linear forwards",
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

// ─── MAIN ───
export default function Template1({ wedding }: { wedding: Wedding }) {
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

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 40%, #F5F0FD 100%)",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      <MusicMan />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes gallery-progress { from { width:0% } to { width:100% } }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes petal-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        .fade-up { animation: fade-up 0.85s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1  { animation-delay: 0.1s; }
        .fade-2  { animation-delay: 0.28s; }
        .fade-3  { animation-delay: 0.46s; }
        .label-sm {
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-size: 9px;
          color: rgba(196,160,176,0.9);
        }
        .glass-card {
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(232,180,200,0.38);
          border-radius: 24px;
          box-shadow:
            0 8px 32px rgba(196,160,176,0.16),
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 rgba(232,180,200,0.12) inset;
        }
        .icon-box {
          width: 40px; height: 40px; border-radius: 16px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #F9D5E5 0%, #FDF0F5 100%);
          box-shadow: 0 2px 8px rgba(196,160,176,0.18);
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Басты сурет"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #F9D5E5 0%, #FDF6F0 50%, #E5D5F9 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="15" cy="15" r="1" fill="#C4A0B0" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
            <div className="relative flex items-center justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={{ animation: "petal-spin 30s linear infinite" }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                  (deg, i) => {
                    const r = (deg * Math.PI) / 180;
                    return (
                      <ellipse
                        key={i}
                        cx={60 + Math.cos(r) * 28}
                        cy={60 + Math.sin(r) * 28}
                        rx="9"
                        ry="14"
                        transform={`rotate(${deg + 90},${60 + Math.cos(r) * 28},${60 + Math.sin(r) * 28})`}
                        fill="#F2C8DC"
                        opacity="0.35"
                      />
                    );
                  },
                )}
              </svg>
              <div className="absolute">
                <IcRing />
              </div>
            </div>
          </div>
        )}
        {/* Gradient fade bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #FDF0F5 0%, transparent 55%)",
          }}
        />
        {/* Top label */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.5))",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Jost',sans-serif",
              fontSize: 9,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
            }}
          >
            Үйлену тойы
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(255,255,255,0.5))",
            }}
          />
        </div>
      </div>

      {/* ═══ NAMES ═══ */}
      <div className="text-center px-6 -mt-14 relative z-10">
        <div
          className="fade-up fade-1 inline-flex items-center justify-center mb-5 bg-white/70 backdrop-blur-sm p-3 rounded-full border border-yellow-200/50"
          style={{
            boxShadow:
              "0 2px 16px rgba(212,175,55,0.18), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          <IcRing />
        </div>

        <h1
          className="fade-up fade-1 font-light italic leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#7B3F5E",
            fontSize: "clamp(2.4rem,10vw,3.2rem)",
          }}
        >
          {wedding.male_name}
        </h1>

        <div className="fade-up fade-2 flex items-center justify-center gap-3 my-5">
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to right, transparent, #E8B4C8)",
            }}
          />
          <IcHeart />
          <div
            className="h-px w-10"
            style={{
              background: "linear-gradient(to left, transparent, #E8B4C8)",
            }}
          />
        </div>

        <h1
          className="fade-up fade-2 font-light italic leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#7B3F5E",
            fontSize: "clamp(2.4rem,10vw,3.2rem)",
          }}
        >
          {wedding.female_name}
        </h1>

        <div className="fade-up fade-3 flex justify-center mt-5">
          <FloralDivider />
        </div>
      </div>

      {/* ═══ DESCRIPTION + ORGANIZER CARD ═══ */}
      {(wedding.description1 || wedding.organizer) && (
        <div className="mx-5 mt-7">
          <div className="glass-card relative overflow-hidden">
            <div className="pt-2 px-2">
              <CardWaveDecor />
            </div>

            {wedding.description1 && (
              <div className="px-6 pt-3 pb-5 text-center relative">
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="mx-auto mb-2 opacity-30"
                >
                  <path
                    d="M0 20 C0 12 3 7 8 4.5 L10 0 C3 2.5 0 9 0 20Z"
                    fill="#C4A0B0"
                  />
                  <path
                    d="M16 20 C16 12 19 7 24 4.5 L26 0 C19 2.5 16 9 16 20Z"
                    fill="#C4A0B0"
                  />
                </svg>
                <p
                  className="text-[#9B6B7E] text-[16px] leading-[1.9] italic"
                  style={{ wordBreak: "break-word" }}
                >
                  {wedding.description1}
                </p>
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  className="mx-auto mt-2 opacity-30 rotate-180"
                >
                  <path
                    d="M0 20 C0 12 3 7 8 4.5 L10 0 C3 2.5 0 9 0 20Z"
                    fill="#C4A0B0"
                  />
                  <path
                    d="M16 20 C16 12 19 7 24 4.5 L26 0 C19 2.5 16 9 16 20Z"
                    fill="#C4A0B0"
                  />
                </svg>
              </div>
            )}

            {wedding.description1 && wedding.organizer && (
              <div className="px-5 py-1">
                <svg
                  viewBox="0 0 320 16"
                  fill="none"
                  style={{ width: "100%", height: 16 }}
                >
                  <defs>
                    <linearGradient id="sep-l" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0" />
                      <stop
                        offset="100%"
                        stopColor="#E8B4C8"
                        stopOpacity="0.7"
                      />
                    </linearGradient>
                    <linearGradient id="sep-r" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E8B4C8" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 8 L100 8"
                    stroke="url(#sep-l)"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="108"
                    cy="8"
                    r="1.8"
                    fill="#F2C8DC"
                    opacity="0.6"
                  />
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                    const r2 = (deg * Math.PI) / 180;
                    return (
                      <ellipse
                        key={i}
                        cx={160 + Math.cos(r2) * 5}
                        cy={8 + Math.sin(r2) * 5}
                        rx="2"
                        ry="3.5"
                        transform={`rotate(${deg + 90},${160 + Math.cos(r2) * 5},${8 + Math.sin(r2) * 5})`}
                        fill="#EEB8D0"
                        opacity="0.5"
                      />
                    );
                  })}
                  <circle
                    cx="160"
                    cy="8"
                    r="2.5"
                    fill="#D4809C"
                    opacity="0.8"
                  />
                  <circle
                    cx="212"
                    cy="8"
                    r="1.8"
                    fill="#F2C8DC"
                    opacity="0.6"
                  />
                  <path
                    d="M220 8 L320 8"
                    stroke="url(#sep-r)"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {wedding.organizer && (
              <div className="px-6 py-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div
                    className="h-px w-8"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, #E8B4C8)",
                    }}
                  />
                  <p className="label-sm">Той иелері</p>
                  <div
                    className="h-px w-8"
                    style={{
                      background:
                        "linear-gradient(to left, transparent, #E8B4C8)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2.5">
                  <div className="icon-box">
                    <IcUsers />
                  </div>
                  <p
                    className="text-[#9B6B7E] text-[16px] font-light text-center italic"
                    style={{ wordBreak: "break-word" }}
                  >
                    {wedding.organizer}
                  </p>
                </div>
              </div>
            )}

            <div className="pb-2 px-2">
              <CardWaveDecor flip />
            </div>
          </div>
        </div>
      )}

      {/* ═══ GALLERY ═══ */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-9">
          <div className="flex items-center gap-3 px-5 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, transparent, #E8B4C8)",
              }}
            />
            <p className="label-sm">Фотоальбом</p>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to left, transparent, #E8B4C8)",
              }}
            />
          </div>
          <GallerySwiper urls={wedding.gallery_urls} />
        </div>
      )}

      {/* ═══ DESCRIPTION 2 ═══ */}
      {wedding.description2 && (
        <div className="mx-5 mt-8">
          <div
            className="relative rounded-3xl p-5 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(232,180,200,0.25)",
              boxShadow: "0 4px 20px rgba(196,160,176,0.1)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
              style={{
                background:
                  "linear-gradient(to bottom, #F9D5E5, #E8B4C8, #F9D5E5)",
              }}
            />
            <p
              className="text-[#9B6B7E] text-[14px] leading-[1.85] pl-3"
              style={{ wordBreak: "break-word" }}
            >
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* ═══ COUPLE PHOTOS ═══ */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, transparent, #E8B4C8)",
              }}
            />
            <SmallDivider />
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to left, transparent, #E8B4C8)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                  boxShadow: "0 4px 20px rgba(196,160,176,0.15)",
                }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Жігіт"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 20,
                  aspectRatio: "3/4",
                  border: "1px solid rgba(232,180,200,0.3)",
                  boxShadow: "0 4px 20px rgba(196,160,176,0.15)",
                }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Қыз"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ INSTAGRAM ═══ */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-8 flex gap-4">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all hover:opacity-80"
              style={{
                border: "1px solid rgba(196,160,176,0.38)",
                color: "#9B6B7E",
                background: "rgba(255,255,255,0.5)",
                fontFamily: "'Jost',sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                boxShadow: "0 2px 12px rgba(196,160,176,0.1)",
              }}
            >
              <IcInstagram /> Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7B3F5E, #C4A0B0)",
                boxShadow: "0 4px 16px rgba(123,63,94,0.28)",
                fontFamily: "'Jost',sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              <IcInstagram color="white" /> Instagram
            </a>
          )}
        </div>
      )}

      {/* ═══ INFO CARD ═══ */}
      <div className="mx-5 mt-9 mb-2">
        <div className="glass-card relative overflow-hidden">
          <div
            className="h-[2px]"
            style={{
              background:
                "linear-gradient(to right, #F9D5E5, #C4A0B0, #D5D5F9, #C4A0B0, #F9D5E5)",
            }}
          />
          <div className="px-2 pt-1">
            <CardWaveDecor />
          </div>

          <div className="p-5 space-y-4">
            {/* Date & Time */}
            {(date || time) && (
              <div className="flex items-center gap-4">
                <div className="icon-box">
                  <IcCalendar />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm">Күні & Уақыты</p>
                  {date && (
                    <p
                      className="font-light italic mt-0.5 truncate"
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: "#7B3F5E",
                        fontSize: 16,
                      }}
                    >
                      {date}
                    </p>
                  )}
                  {time && (
                    <div
                      className="inline-flex items-center gap-1.5 mt-1 rounded-full px-3 py-1"
                      style={{
                        background: "rgba(249,213,229,0.4)",
                        border: "1px solid rgba(232,180,200,0.35)",
                      }}
                    >
                      <IcClock />
                      <p
                        style={{
                          color: "#9B6B7E",
                          fontSize: 12,
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 500,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {time}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Venue */}
            {(wedding.venue_name || wedding.venue_address) && (
              <div
                className="flex items-start gap-4 pt-3 border-t"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                <div className="icon-box mt-0.5">
                  <IcMapPin />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm">Той залы</p>
                  {wedding.venue_name && (
                    <p
                      className="font-light italic mt-0.5"
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: "#7B3F5E",
                        fontSize: 16,
                        wordBreak: "break-word",
                      }}
                    >
                      {wedding.venue_name}
                    </p>
                  )}
                  {wedding.venue_address && (
                    <div className="flex items-start gap-1 mt-1">
                      <IcMapPinTiny />
                      <p
                        style={{
                          color: "#C4A0B0",
                          fontSize: 12,
                          fontFamily: "'Jost',sans-serif",
                          lineHeight: 1.6,
                          wordBreak: "break-word",
                        }}
                      >
                        {wedding.venue_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Phone */}
            {wedding.phone && (
              <div
                className="flex items-center gap-4 pt-3 border-t"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                <div className="icon-box">
                  <IcPhone />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label-sm">Байланыс</p>
                  <a
                    href={`tel:${wedding.phone}`}
                    className="font-light italic mt-0.5 hover:underline block"
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      color: "#7B3F5E",
                      fontSize: 16,
                    }}
                  >
                    {wedding.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Extras */}
            {extras.length > 0 && (
              <div
                className="pt-3 border-t space-y-2.5"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                {extras.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: "rgba(249,213,229,0.5)",
                        border: "1px solid rgba(232,180,200,0.35)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#C4A0B0" }}
                      />
                    </div>
                    <p
                      style={{
                        color: "#9B6B7E",
                        fontSize: 13,
                        fontFamily: "'Jost',sans-serif",
                        lineHeight: 1.75,
                        wordBreak: "break-word",
                      }}
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
                className="pt-3 border-t"
                style={{ borderColor: "rgba(232,180,200,0.2)" }}
              >
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{ boxShadow: "0 4px 16px rgba(196,160,176,0.15)" }}
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

          <div className="px-2 pb-2">
            <CardWaveDecor flip />
          </div>
        </div>
      </div>

      {/* ═══ MESSAGES ═══ */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#7B3F5E"
        lightColor="#FDF0F5"
        borderColor="border-rose-100"
      />

      {/* ═══ FOOTER ═══ */}
      <div className="text-center py-12 mt-4">
        <div className="flex justify-center mb-5">
          <FloralDivider />
        </div>
        <p
          style={{
            color: "#C4A0B0",
            fontFamily: "'Jost',sans-serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p
            style={{
              color: "#DDB4C8",
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              marginTop: 6,
            }}
          >
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
