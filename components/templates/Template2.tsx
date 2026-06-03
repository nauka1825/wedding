"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate, Wedding } from "@/lib/supabase";
import MessageSection from "@/components/MessageSection";

// ─── GALLERY SWIPER ───
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
      <style>{`
        @keyframes gold-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
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
              width: "75vw",
              maxWidth: "320px",
              height: "220px",
              borderRadius: "2px",
              border:
                active === i
                  ? "1px solid rgba(201,168,76,0.6)"
                  : "1px solid rgba(201,168,76,0.2)",
              transition:
                "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
              transform: active === i ? "scale(1)" : "scale(0.92)",
              boxShadow:
                active === i
                  ? "0 8px 40px rgba(201,168,76,0.25), inset 0 0 0 1px rgba(201,168,76,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={url}
              alt={`зураг ${i + 1}`}
              className="w-full h-full object-cover"
              style={{
                opacity: active === i ? 0.85 : 0.55,
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
              className="transition-all duration-300 rounded-none overflow-hidden relative"
              style={{
                width: active === i ? 22 : 6,
                height: 2,
                background: "rgba(201,168,76,0.3)",
                opacity: active === i ? 1 : 0.4,
              }}
            >
              {active === i && (
                <span
                  className="absolute inset-0"
                  style={{
                    background: "#C9A84C",
                    animation: "gold-progress 5s linear forwards",
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

// ─── CORNER DECORATION ───
function Corners({
  size = 6,
  opacity = 0.5,
}: {
  size?: number;
  opacity?: number;
}) {
  const s = `${size * 4}px`;
  const style = { width: s, height: s, opacity };
  return (
    <>
      <div
        className="absolute top-0 left-0 border-t border-l border-amber-500"
        style={{ ...style, transform: "translate(-1px,-1px)" }}
      />
      <div
        className="absolute top-0 right-0 border-t border-r border-amber-500"
        style={{ ...style, transform: "translate(1px,-1px)" }}
      />
      <div
        className="absolute bottom-0 left-0 border-b border-l border-amber-500"
        style={{ ...style, transform: "translate(-1px,1px)" }}
      />
      <div
        className="absolute bottom-0 right-0 border-b border-r border-amber-500"
        style={{ ...style, transform: "translate(1px,1px)" }}
      />
    </>
  );
}

// ─── GOLD DIVIDER ───
function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.5))",
        }}
      />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 L13.8 9 L20 9.5 L15 14 L16.8 21 L12 17.5 L7.2 21 L9 14 L4 9.5 L10.2 9 Z"
          fill="rgba(201,168,76,0.7)"
        />
      </svg>
      <div
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(201,168,76,0.5))",
        }}
      />
    </div>
  );
}

// ─── LABEL ───
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-amber-600/55 text-[9px] tracking-[0.38em] uppercase font-[Josefin_Sans,sans-serif] mb-1.5">
      {children}
    </p>
  );
}

// ─── MAIN ───
export default function Template2({ wedding }: { wedding: Wedding }) {
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
      className="min-h-screen font-[Cormorant_Garamond,serif]"
      style={{
        background:
          "linear-gradient(160deg, #0A0A0A 0%, #141008 40%, #0D0B06 70%, #0A0A0A 100%)",
      }}
    >
      <style>{`
        @keyframes shimmer-gold {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #8B6914 20%, #F0D060 45%, #C9A84C 55%, #8B6914 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-gold 5s linear infinite;
        }
        .fade-up { animation: fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-1 { animation-delay: 0.1s; }
        .fade-2 { animation-delay: 0.25s; }
        .fade-3 { animation-delay: 0.4s; }
      `}</style>

      {/* Top decorative bar */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C80, #F0D06060, #C9A84C80, transparent)",
        }}
      />
      <div
        className="h-[2px] w-full mt-0.5"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C20, transparent)",
        }}
      />

      {/* ─── HERO ─── */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {wedding.main_photo_url ? (
          <img
            src={wedding.main_photo_url}
            alt="Гол зураг"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.65) saturate(0.9)" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at center, #1E1608 0%, #0A0A0A 70%)",
            }}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-24 h-24">
                <div
                  className="absolute inset-0 rounded-full border border-amber-700/20"
                  style={{ animation: "spin-slow 20s linear infinite" }}
                />
                <div className="absolute inset-2 rounded-full border border-amber-600/15" />
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      fill="rgba(201,168,76,0.3)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.4) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 30%)",
          }}
        />

        {/* Top label */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-center gap-3 px-8">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.4))",
            }}
          />
          <span className="text-amber-500/50 text-[9px] font-[Josefin_Sans,sans-serif] tracking-[0.5em] uppercase">
            Wedding Invitation
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.4))",
            }}
          />
        </div>

        {/* Corner decorations on hero */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-amber-500/30" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-amber-500/30" />
        <div className="absolute bottom-16 left-4 w-5 h-5 border-b border-l border-amber-500/20" />
        <div className="absolute bottom-16 right-4 w-5 h-5 border-b border-r border-amber-500/20" />
      </div>

      {/* ─── NAMES ─── */}
      <div className="text-center px-6 -mt-16 relative z-10">
        <h1
          className="fade-up fade-1 shimmer-gold font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}
        >
          {wedding.male_name}
        </h1>

        <div className="fade-up fade-2 flex items-center justify-center gap-4 my-4">
          <div
            className="h-px w-14"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.5))",
            }}
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L13.8 9 L20 9.5 L15 14 L16.8 21 L12 17.5 L7.2 21 L9 14 L4 9.5 L10.2 9 Z"
              fill="rgba(201,168,76,0.6)"
            />
          </svg>
          <div
            className="h-px w-14"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.5))",
            }}
          />
        </div>

        <h1
          className="fade-up fade-2 shimmer-gold font-light italic leading-tight"
          style={{ fontSize: "clamp(2.6rem, 11vw, 3.4rem)" }}
        >
          {wedding.female_name}
        </h1>

        {/* Date preview under names */}
        {date && (
          <p className="fade-up fade-3 mt-4 text-amber-600/45 text-[10px] tracking-[0.4em] uppercase font-[Josefin_Sans,sans-serif]">
            {date}
          </p>
        )}
      </div>

      {/* ─── DESCRIPTION 1 ─── */}
      {wedding.description1 && (
        <div className="mx-5 mt-10">
          <div
            className="relative px-7 py-6 text-center"
            style={{
              background: "rgba(201,168,76,0.03)",
              border: "1px solid rgba(201,168,76,0.12)",
            }}
          >
            <Corners size={5} opacity={0.35} />
            <span className="text-amber-700/40 text-5xl font-serif leading-none absolute top-2 left-4">
              "
            </span>
            <p className="text-amber-200/65 text-[17px] leading-[1.9] italic relative z-10 mt-2">
              {wedding.description1}
            </p>
            <span className="text-amber-700/40 text-5xl font-serif leading-none absolute bottom-0 right-4 rotate-180 block">
              "
            </span>
          </div>
        </div>
      )}

      {/* ─── ORGANIZER ─── */}
      {wedding.organizer && (
        <div className="mx-5 mt-8">
          <GoldDivider className="mb-6" />
          <div
            className="relative px-5 py-5 text-center"
            style={{
              border: "1px solid rgba(201,168,76,0.15)",
              background: "rgba(201,168,76,0.025)",
            }}
          >
            <Corners size={4} opacity={0.4} />
            <Label>Хурмын эзэд аав ээж</Label>
            <p
              className="text-amber-200/75 text-[17px] font-light leading-relaxed"
              style={{ wordBreak: "break-word" }}
            >
              {wedding.organizer}
            </p>
          </div>
        </div>
      )}

      {/* ─── GALLERY ─── */}
      {!!wedding.gallery_urls?.length && (
        <div className="mt-10">
          <div className="flex items-center gap-3 px-5 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,168,76,0.3))",
              }}
            />
            <p className="text-amber-600/50 text-[9px] tracking-[0.38em] uppercase font-[Josefin_Sans,sans-serif]">
              Зургийн цомог
            </p>
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(201,168,76,0.3))",
              }}
            />
          </div>
          <GallerySwiper urls={wedding.gallery_urls} />
        </div>
      )}

      {/* ─── DESCRIPTION 2 ─── */}
      {wedding.description2 && (
        <div className="mx-5 mt-8">
          <div className="border-l border-amber-700/35 pl-5 py-1">
            <p
              className="text-amber-200/55 text-sm leading-[1.9] font-[Josefin_Sans,sans-serif]"
              style={{ wordBreak: "break-word" }}
            >
              {wedding.description2}
            </p>
          </div>
        </div>
      )}

      {/* ─── COUPLE PHOTOS ─── */}
      {(wedding.photo3_url || wedding.photo4_url) && (
        <div className="mx-5 mt-8">
          <GoldDivider className="mb-5" />
          <div className="grid grid-cols-2 gap-3">
            {wedding.photo3_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <img
                  src={wedding.photo3_url}
                  alt="Эрэгтэй"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.75) saturate(0.85)" }}
                />
              </div>
            )}
            {wedding.photo4_url && (
              <div
                className="overflow-hidden aspect-[3/4]"
                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <img
                  src={wedding.photo4_url}
                  alt="Эмэгтэй"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.75) saturate(0.85)" }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── INSTAGRAM LINKS ─── */}
      {(wedding.link1 || wedding.link2) && (
        <div className="mx-5 mt-8 flex flex-col gap-3">
          {wedding.link1 && (
            <a
              href={wedding.link1}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 font-[Josefin_Sans,sans-serif] text-[10px] tracking-[0.35em] uppercase transition-all hover:opacity-80 relative"
              style={{
                border: "1px solid rgba(201,168,76,0.25)",
                color: "#B8963A",
              }}
            >
              <Corners size={3} opacity={0.35} />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              Instagram
            </a>
          )}
          {wedding.link2 && (
            <a
              href={wedding.link2}
              target="_blank"
              className="flex items-center justify-center gap-2.5 py-3.5 font-[Josefin_Sans,sans-serif] text-[10px] tracking-[0.35em] uppercase transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))",
                color: "#C9A84C",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              Instagram
            </a>
          )}
        </div>
      )}

      {/* ─── INFO CARD ─── */}
      <div className="mx-5 mt-10 mb-2">
        <GoldDivider className="mb-6" />

        <div
          className="relative p-6 space-y-5"
          style={{
            border: "1px solid rgba(201,168,76,0.2)",
            background:
              "linear-gradient(160deg, rgba(201,168,76,0.04) 0%, transparent 60%)",
          }}
        >
          <Corners size={5} opacity={0.45} />

          {/* Date & Time */}
          {(date || time) && (
            <div className="text-center">
              <Label>Огноо & Цаг</Label>
              {date && (
                <p className="text-amber-200/80 text-[22px] font-light italic">
                  {date}
                </p>
              )}
              {time && (
                <div
                  className="mt-2.5 inline-flex items-center gap-2"
                  style={{
                    border: "1px solid rgba(201,168,76,0.25)",
                    padding: "6px 16px",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <p className="text-amber-400 text-sm font-[Josefin_Sans,sans-serif] font-semibold tracking-[0.25em]">
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
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              <Label>Хурмын байр</Label>
              {wedding.venue_name && (
                <p
                  className="text-amber-200/80 text-[22px] font-light italic"
                  style={{ wordBreak: "break-word" }}
                >
                  {wedding.venue_name}
                </p>
              )}
              {wedding.venue_address && (
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B8963A"
                    strokeWidth="2"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <p
                    className="text-amber-600/60 text-xs font-[Josefin_Sans,sans-serif] tracking-wide"
                    style={{ wordBreak: "break-word" }}
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
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              <Label>Холбоо барих</Label>
              <a
                href={`tel:${wedding.phone}`}
                className="text-amber-300/75 text-lg font-light hover:text-amber-300 transition-colors"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  letterSpacing: "0.15em",
                }}
              >
                {wedding.phone}
              </a>
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div
              className="border-t pt-5 space-y-2.5"
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              {extras.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="rgba(201,168,76,0.5)"
                    className="flex-shrink-0 mt-1"
                  >
                    <path d="M12 2 L13.8 9 L20 9.5 L15 14 L16.8 21 L12 17.5 L7.2 21 L9 14 L4 9.5 L10.2 9 Z" />
                  </svg>
                  <p
                    className="text-amber-200/55 text-sm font-[Josefin_Sans,sans-serif] leading-relaxed"
                    style={{ wordBreak: "break-word" }}
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
              style={{ borderColor: "rgba(201,168,76,0.12)" }}
            >
              <div
                className="overflow-hidden"
                style={{ border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <img
                  src={wedding.photo5_url}
                  alt="Нэмэлт зураг"
                  className="w-full object-cover"
                  style={{ filter: "brightness(0.75) saturate(0.85)" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── MESSAGES ─── */}
      <MessageSection
        weddingId={wedding.id}
        accentColor="#C9A84C"
        lightColor="#1A1208"
        borderColor="border-amber-800"
      />

      {/* ─── FOOTER ─── */}
      <div className="text-center py-12 mt-4">
        <GoldDivider className="mb-6 mx-8" />
        <p className="shimmer-gold text-xs font-[Josefin_Sans,sans-serif] tracking-[0.4em] uppercase">
          {wedding.male_name} & {wedding.female_name}
        </p>
        {date && (
          <p className="text-amber-800/45 text-xs mt-2 font-[Josefin_Sans,sans-serif] tracking-widest">
            {date}
          </p>
        )}
      </div>

      {/* Bottom bars */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C20, transparent)",
        }}
      />
      <div
        className="h-px w-full mt-0.5"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C80, #F0D06060, #C9A84C80, transparent)",
        }}
      />
    </div>
  );
}
